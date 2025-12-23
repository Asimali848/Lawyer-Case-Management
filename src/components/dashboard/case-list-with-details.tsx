import {
  RefreshCw,
  MoreVertical,
  Printer,
  Plus,
  Pencil,
  Trash2,
  FileText,
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
import { useDeleteCalculationMutation } from "@/store/services/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useTransactionColumns } from "@/components/dashboard/transaction-columns";
import { DataTable } from "@/components/data-table";
import TransactionSheet from "@/components/dashboard/transaction-sheet";
import DeleteConfirmationModal from "@/components/dashboard/delete-confirmation-modal";
import { useDeleteTransactionMutation } from "@/store/services/calculations";
import EditCaseDialog from "@/components/dashboard/edit-case-dialog";
import WarningModal from "@/components/warning-modal";
import PayoffDemandModal from "@/components/dashboard/payoff-demand-modal";
import { toast } from "sonner";
import {
  generateTransactionPDF,
  createTransactionPDFData,
} from "@/lib/transaction-pdf-generator";

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
  const [payoffDemandOpen, setPayoffDemandOpen] = useState<boolean>(false);

  // Get selected case data from the cases array (already loaded from history)
  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [deleteCalculation, { isLoading: isDeletingCase }] =
    useDeleteCalculationMutation();

  // Auto-select first case if none selected
  useEffect(() => {
    if (!selectedCaseId && cases.length > 0) {
      setSelectedCaseId(cases[0].id || null);
    }
  }, [cases, selectedCaseId]);

  // Transform transactions to Payment format and apply LIFO (Last In First Out) ordering
  const transactions: Payment[] = ((selectedCase as any)?.transactions || [])
    .map((t: any) => {
      const timelineEntry = (selectedCase as any)?.timeline?.find(
        (entry: any) => {
          const entryDate = entry.event_date;
          const transDate = t.transaction_date;
          return (
            entryDate === transDate &&
            ((entry.event_type === "payment" && t.payment_amount > 0) ||
              (entry.event_type === "cost" && t.cost_amount > 0))
          );
        }
      );

      return {
        id: t.id,
        payment_date: t.transaction_date,
        transaction_type: (t.payment_amount > 0 ? "PAYMENT" : "COST") as
          | "PAYMENT"
          | "COST",
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
        // Keep original transaction data for sorting
        _transaction_date: t.transaction_date,
        _created_at: t.created_at,
      };
    })
    .sort((a: any, b: any) => {
      // Sort by transaction_date (descending - most recent first)
      const dateA = a._transaction_date || "";
      const dateB = b._transaction_date || "";
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      // If dates are the same, sort by created_at (descending - most recent first)
      const createdA = a._created_at || "";
      const createdB = b._created_at || "";
      return createdB.localeCompare(createdA);
    })
    .map(
      ({ _transaction_date, _created_at, ...transaction }: any) =>
        transaction as Payment
    );

  const handleCaseClick = (caseId: string | undefined) => {
    if (caseId) {
      setSelectedCaseId(caseId);
    }
  };

  const handleEditTransaction = (transaction: Payment) => {
    const trans = (selectedCase as any)?.transactions?.find(
      (t: any) => t.id === transaction.id
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

  const handlePrintCase = async () => {
    if (!selectedCase) {
      toast.error("No case selected to print"); 
      return;
    }

    if (transactions.length === 0) {
      toast.warning("No transactions to print for this case");
      return;
    }

    try {
      console.log("Using NEW Transaction PDF Generator v2.0");
      const pdfData = createTransactionPDFData(selectedCase, transactions);
      await generateTransactionPDF(pdfData);
      toast.success("Transaction summary PDF downloaded successfully!");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const transactionColumns = useTransactionColumns({
    onEdit: handleEditTransaction,
    onDelete: handleDeleteTransaction,
  });

  const lastTransaction = transactions[transactions.length - 1];
  const lastPaymentDate =
    lastTransaction?.payment_date || selectedCase?.judgement_date || "";

  const totalPayments = (selectedCase as any)?.principal_reduction || 0;
  const totalInterest = (selectedCase as any)?.total_interest_accrued || 0;
  const todayPayoff = (selectedCase as any)?.total_due || 0;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 h-full overflow-hidden">
        {/* Active Cases Section - Left */}
        <div className="lg:col-span-2 flex flex-col gap-3 overflow-hidden h-[570px]">
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
                      <span className="text-primary">
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
                      {/* <DropdownMenuItem onClick={handlePrintCase}>
                        <Printer className="mr-2 size-4" />
                        Print Case
                      </DropdownMenuItem> */}
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
                  <div className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4 break-words">
                    {selectedCase.case_name || "N/A"}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Court
                      </div>
                      <div className="font-medium text-sm sm:text-base break-words">
                        {selectedCase.court_name || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Case Number
                      </div>
                      <div className="font-medium text-sm sm:text-base break-words">
                        {selectedCase.court_case_number || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Judgment Date
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {formatDate(selectedCase.judgement_date || "")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Judgment Amount
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {formatCurrency(selectedCase.judegment_amount || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Daily Interest
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {(selectedCase as any).daily_interest
                          ? `$${Number(
                              (selectedCase as any).daily_interest
                            ).toFixed(4)}`
                          : "N/A"}
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
                        Interest Accrued
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {formatCurrency(
                          (selectedCase as any).interest_accrued || 0
                        )}
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
                      <div className="text-lg sm:text-xl font-semibold text-primary">
                        {formatCurrency(todayPayoff)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
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
              <div className="text-xs sm:text-sm text-primary font-medium mt-1 break-words">
                {selectedCase?.case_name || "N/A"}
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="default"
                size="sm"
                onClick={() => setPayoffDemandOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none"
              >
                <FileText className="size-4 mr-1" />
                Payoff Demand
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handlePrintCase}
                className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none"
              >
                <Printer className="size-4 mr-1" />
                Print
              </Button>
            </div>
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
              ? (selectedCase as any)?.transactions?.find(
                  (t: any) => t.id === selectedTransaction.id
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
          caseData={selectedCase as any}
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

      {/* Payoff Demand Modal */}
      {selectedCase && (
        <PayoffDemandModal
          open={payoffDemandOpen}
          setOpen={setPayoffDemandOpen}
          caseId={selectedCaseId || undefined}
          caseName={selectedCase.case_name}
          caseData={selectedCase as any}
        />
      )}
    </>
  );
};

export default CaseListWithDetails;
