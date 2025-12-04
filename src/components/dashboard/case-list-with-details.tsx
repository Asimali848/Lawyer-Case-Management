import { RefreshCw, MoreVertical, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCalculationQuery } from "@/store/services/calculations";
import { getCurrentDate } from "@/lib/utils";
import { useTransactionColumns } from "@/components/dashboard/transaction-columns";
import { DataTable } from "@/components/data-table";
import TransactionSheet from "@/components/dashboard/transaction-sheet";
import DeleteConfirmationModal from "@/components/dashboard/delete-confirmation-modal";
import { useDeleteTransactionMutation } from "@/store/services/calculations";
import { toast } from "sonner";

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
  const [selectedTransaction, setSelectedTransaction] = useState<Payment | null>(null);

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
  const transactions: Payment[] = (selectedCase?.transactions || []).map((t) => {
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
      description: t.description || (t.payment_amount > 0 ? "Payment" : "Cost"),
    };
  });

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
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to delete transaction");
    }
  };

  const formatCurrency = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const [year, month, day] = dateString.split("-").map(Number);
      return `${month}/${day}/${year}`;
    } catch {
      return dateString;
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-full overflow-hidden">
        {/* Active Cases Section - Left */}
        <div className="lg:col-span-1 flex flex-col gap-3 overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold">
                Active Cases ({cases.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3">
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
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCaseId === caseItem.id
                        ? "bg-green-50 border-green-300"
                        : "bg-white border-gray-200 hover:border-green-200"
                    }`}
                  >
                    <div className="font-semibold text-lg text-gray-900 mb-1">
                      {caseItem.case_name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {caseItem.court_name} - {caseItem.court_case_number}
                    </div>
                    <div className="text-sm font-medium text-gray-700">
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
        <div className="lg:col-span-2 flex flex-col gap-5 overflow-hidden">
          {selectedCaseId && selectedCase ? (
            <>
              {/* Case Details Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg font-semibold">
                    Case Details
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-semibold text-green-600 mb-4">
                    {selectedCase.case_name || "N/A"}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Court/Case Number
                      </div>
                      <div className="font-medium">
                        {selectedCase.court_name || "N/A"} Case No.{" "}
                        {selectedCase.court_number || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Judgment Amount
                      </div>
                      <div className="font-medium">
                        {formatCurrency(selectedCase.judgment_amount || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Judgment Date
                      </div>
                      <div className="font-medium">
                        {formatDate(selectedCase.judgment_date || "")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Last Payment Date
                      </div>
                      <div className="font-medium">
                        {formatDate(lastPaymentDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Total Payments to Date
                      </div>
                      <div className="font-medium">
                        {formatCurrency(totalPayments)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        Interest to Date
                      </div>
                      <div className="font-medium">
                        {formatCurrency(totalInterest)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-600 mb-1">
                        Today's Payoff
                      </div>
                      <div className="text-xl font-semibold text-green-600">
                        {formatCurrency(todayPayoff)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions Section */}
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Recent Transactions
                    </CardTitle>
                    <div className="text-sm text-green-600 font-medium mt-1">
                      {selectedCase.case_name || "N/A"}
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Printer className="size-4 mr-1" />
                    Print
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  {transactions.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">
                        No transactions found
                      </p>
                    </div>
                  ) : (
                    <DataTable
                      columns={transactionColumns}
                      data={transactions}
                    />
                  )}
                </CardContent>
              </Card>
            </>
          ) : isLoadingCase ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading case details...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Select a case to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </>
  );
};

export default CaseListWithDetails;

