import {
  RefreshCw,
  MoreVertical,
  Printer,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetCalculationQuery,
  useDeleteCalculationMutation,
} from "@/store/services/calculations";
import { formatCurrency, formatDate, getCurrentDate } from "@/lib/utils";
import { useTransactionColumns } from "@/components/dashboard/transaction-columns";
import { DataTable } from "@/components/data-table";
import TransactionSheet from "@/components/dashboard/transaction-sheet";
import DeleteConfirmationModal from "@/components/dashboard/delete-confirmation-modal";
import { useDeleteTransactionMutation } from "@/store/services/calculations";
import EditCaseDialog from "@/components/dashboard/edit-case-dialog";
import WarningModal from "@/components/warning-modal";
import { toast } from "sonner";
import { printCaseTransactions } from "@/lib/print-transactions";

interface CaseListWithDetailsProps {
  cases: CaseGet[];
  isLoading: boolean;
  error: any;
  isLoadingMore: boolean;
  totalCases: number;
}

const CaseListWithDetails = ({
  cases,
  isLoading,
  error,
  isLoadingMore,
  totalCases,
}: CaseListWithDetailsProps) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [transactionOpen, setTransactionOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Payment | null>(null);
  const [editCaseOpen, setEditCaseOpen] = useState<boolean>(false);
  const [deleteCaseOpen, setDeleteCaseOpen] = useState<boolean>(false);

  // Fetch selected case details
  const {
    data: selectedCase,
    isLoading: isLoadingCase,
    refetch: refetchCase,
  } = useGetCalculationQuery(
    { id: selectedCaseId || "", current_date: getCurrentDate() },
    { skip: !selectedCaseId }
  );

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [deleteCalculation, { isLoading: isDeletingCase }] =
    useDeleteCalculationMutation();

  // Auto-select first case if none selected
  useEffect(() => {
    if (!selectedCaseId && cases.length > 0) {
      setSelectedCaseId(cases[0].id || null);
    }
  }, [cases, selectedCaseId]);

  // Refetch case when transaction sheet closes (to get updated data)
  useEffect(() => {
    if (!transactionOpen && selectedCaseId) {
      refetchCase();
    }
  }, [transactionOpen, selectedCaseId, refetchCase]);

  // Transform transactions to Payment format
  const transactions: Payment[] = (selectedCase?.transactions || []).map(
    (t) => {
      const timelineEntry = selectedCase?.timeline?.find((entry: any) => {
        const entryDate = entry.event_date;
        const transDate = t.transaction_date;
        return (
          entryDate === transDate &&
          ((entry.event_type === "payment" && t.payment_amount > 0) ||
            (entry.event_type === "cost" && t.cost_amount > 0))
        );
      });

      return {
        id: t.id,
        payment_date: t.transaction_date,
        transaction_type: t.payment_amount > 0 ? "PAYMENT" : "COST",
        payment_amount: String(
          t.payment_amount > 0 ? t.payment_amount : t.cost_amount
        ),
        accrued_interest: timelineEntry
          ? String((timelineEntry.interest_accrued || 0).toFixed(2))
          : "0.00",
        principal_balance: timelineEntry
          ? String((timelineEntry.remaining_principal || 0).toFixed(2))
          : "0.00",
        description:
          t.description || (t.payment_amount > 0 ? "Payment" : "Cost"),
      };
    }
  );

  const handleCaseClick = (caseId: string | undefined) => {
    if (caseId) {
      setSelectedCaseId(caseId);
    }
  };

  const handleEditTransaction = (transaction: Payment) => {
    const trans = selectedCase?.transactions?.find(
      (t) => t.id === transaction.id
    );
    if (trans) {
      setSelectedTransaction(transaction);
      setTransactionOpen(true);
    }
  };

  const handleDeleteTransaction = (transaction: Payment) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCaseId || !selectedTransaction?.id) {
      toast.error("Invalid transaction or case ID");
      return;
    }

    try {
      await deleteTransaction({
        calculationId: selectedCaseId,
        transactionId: selectedTransaction.id,
      }).unwrap();
      toast.success("Transaction deleted successfully");
      setSelectedTransaction(null);
      setDeleteModalOpen(false);
      refetchCase();
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to delete transaction");
    }
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setTransactionOpen(true);
  };

  const handleEditCase = () => {
    setEditCaseOpen(true);
  };

  const handleDeleteCase = async () => {
    if (!selectedCaseId) {
      toast.error("Invalid case ID");
      return;
    }

    try {
      await deleteCalculation(selectedCaseId).unwrap();
      toast.success("Case deleted successfully!");
      setDeleteCaseOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to delete case");
    }
  };

  const handlePrintCase = () => {
    if (!selectedCase) {
      toast.error("No case selected to print");
      return;
    }

    if (transactions.length === 0) {
      toast.warning("No transactions to print for this case");
      return;
    }

    try {
      // Prepare case data for printing
      const printCaseData = {
        case_name: selectedCase.case_name || "N/A",
        court_name: selectedCase.court_name || "N/A",
        court_number: selectedCase.court_number || "N/A",
        judgment_amount: selectedCase.judgment_amount || 0,
        judgment_date: selectedCase.judgment_date || "",
        lastPaymentDate: lastPaymentDate,
        totalPayments: totalPayments,
        totalInterest: totalInterest,
        todayPayoff: todayPayoff,
      };

      // Call the print utility
      printCaseTransactions(printCaseData, transactions);
      toast.success("Opening print preview...");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to open print preview");
    }
  };

  const handleEditCaseSuccess = () => {
    refetchCase();
  };

  const transactionColumns = useTransactionColumns({
    onEdit: handleEditTransaction,
    onDelete: handleDeleteTransaction,
  });

  const lastTransaction = transactions[transactions.length - 1];
  const lastPaymentDate =
    lastTransaction?.payment_date || selectedCase?.judgment_date || "";

  const totalPayments = selectedCase?.principal_reduction || 0;
  const totalInterest = selectedCase?.total_interest_accrued || 0;
  const todayPayoff = selectedCase?.total_due || 0;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 h-full overflow-hidden">
        {/* Active Cases Section - Left */}
        <div className="lg:col-span-2 flex flex-col gap-3 overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg font-semibold">
                Active Cases ({cases.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 px-4 sm:px-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Loading cases...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-destructive">
                    Error loading cases. Please try again.
                  </p>
                </div>
              ) : cases.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No cases found</p>
                </div>
              ) : (
                cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    onClick={() => handleCaseClick(caseItem.id)}
                    className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCaseId === caseItem.id
                        ? "bg-primary/10 border-green-300"
                        : ""
                    }`}
                  >
                    <div className="font-semibold text-base sm:text-lg mb-1 break-words">
                      {caseItem.case_name}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">
                      {caseItem.court_name} - {caseItem.court_case_number}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Payoff Amount:{" "}
                      <span className="text-green-600">
                        {formatCurrency(caseItem.today_payoff)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {isLoadingMore && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <RefreshCw className="size-4 animate-spin text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {totalCases} loaded
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Case Details and Transactions - Right */}
        <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 md:gap-5 overflow-hidden h-full">
          {selectedCaseId && selectedCase ? (
            <>
              {/* Case Details Section */}
              <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg font-semibold">
                    Case Details
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleAddTransaction}>
                        <Plus className="mr-2 size-4" />
                        Add Transaction
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleEditCase}>
                        <Pencil className="mr-2 size-4" />
                        Edit Case
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handlePrintCase}>
                        <Printer className="mr-2 size-4" />
                        Print Case
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteCaseOpen(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete Case
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 h-full px-4 sm:px-6 overflow-y-auto">
                  <div className="text-xl sm:text-2xl font-semibold text-green-600 mb-3 sm:mb-4 break-words">
                    {selectedCase.case_name || "N/A"}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Court Number
                      </div>
                      <div className="font-medium text-sm sm:text-base break-words">
                        {selectedCase.court_number || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Court Name
                      </div>
                      <div className="font-medium text-sm sm:text-base break-words">
                        {selectedCase.court_name || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Judgment Amount
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {formatCurrency(selectedCase.judgment_amount || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Judgment Date
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {formatDate(selectedCase.judgment_date || "")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Last Transaction Date
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {formatDate(lastPaymentDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Total Payments to Date
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {formatCurrency(totalPayments)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Interest to Date
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {formatCurrency(totalInterest)}
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Today's Payoff
                      </div>
                      <div className="text-lg sm:text-xl font-semibold text-green-600">
                        {formatCurrency(todayPayoff)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : isLoadingCase ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Loading case details...
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Select a case to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Recent Transactions Section */}
        <Card
          className={`flex-1 flex flex-col overflow-hidden ${
            selectedCaseId ? "col-span-1 lg:col-span-4" : "hidden"
          } h-auto lg:h-[500px]`}
        >
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 px-4 sm:px-6">
            <div className="w-full sm:w-auto">
              <CardTitle className="text-base sm:text-lg font-semibold">
                Recent Transactions
              </CardTitle>
              <div className="text-xs sm:text-sm text-green-600 font-medium mt-1 break-words">
                {selectedCase?.case_name || "N/A"}
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handlePrintCase}
              className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
            >
              <Printer className="size-4 mr-1" />
              Print
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto px-4 sm:px-6">
            {transactions.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm sm:text-base text-muted-foreground">
                  No transactions found
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <DataTable columns={transactionColumns} data={transactions} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Sheet */}
      {selectedCaseId && (
        <TransactionSheet
          open={transactionOpen}
          setOpen={(value) => {
            setTransactionOpen(value);
            if (!value) {
              setSelectedTransaction(null);
            }
          }}
          caseId={selectedCaseId}
          caseName={selectedCase?.case_name}
          transaction={
            selectedTransaction
              ? selectedCase?.transactions?.find(
                  (t) => t.id === selectedTransaction.id
                )
              : undefined
          }
        />
      )}

      {/* Delete Confirmation Modal for Transaction */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />

      {/* Edit Case Dialog */}
      {selectedCase && (
        <EditCaseDialog
          open={editCaseOpen}
          setOpen={setEditCaseOpen}
          caseData={selectedCase}
          onSuccess={handleEditCaseSuccess}
        />
      )}

      {/* Delete Case Warning Modal */}
      <WarningModal
        open={deleteCaseOpen}
        setOpen={setDeleteCaseOpen}
        title="Are you sure?"
        text="You'll be deleting this Case and all associated transactions."
        cta={handleDeleteCase}
        isLoading={isDeletingCase}
      />
    </>
  );
};

export default CaseListWithDetails;
