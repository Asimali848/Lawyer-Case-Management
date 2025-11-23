import {
  CreditCard,
  FileText,
  Pencil,
  Printer,
  Receipt,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CompanySheet from "@/components/dashboard/company-sheet";
import DeleteConfirmationModal from "@/components/dashboard/delete-confirmation-modal";
import PayoffDemandModal from "@/components/dashboard/payoff-demand-modal";
import { useTransactionColumns } from "@/components/dashboard/transaction-columns";
import TransactionSheet from "@/components/dashboard/transaction-sheet";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WarningModal from "@/components/warning-modal";
import {
  useGetCalculationQuery,
  useDeleteCalculationMutation,
  useDeleteTransactionMutation,
} from "@/store/services/calculations";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [edit, setEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [transactionOpen, setTransactionOpen] = useState<boolean>(false);
  const [payoffDemandOpen, setPayoffDemandOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);
  const [warningModalOpen, setWarningModalOpen] = useState<boolean>(false);

  // Fetch calculation details with current client date
  const {
    data: calculation,
    isLoading,
    error,
    refetch,
  } = useGetCalculationQuery(
    { id: id || "", current_date: undefined },
    { skip: !id }
  );
  const [deleteCalculation] = useDeleteCalculationMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  // Transform transactions to Payment format for the table with timeline data
  const transactions: Payment[] = (calculation?.transactions || []).map((t) => {
    // Find the corresponding timeline entry for this transaction
    const timelineEntry = calculation?.timeline?.find((entry: any) => {
      const entryDate = entry.event_date;
      const transDate = t.transaction_date;
      // Match by date and event type (payment or cost)
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

  const handleEditTransaction = (transaction: Payment) => {
    // Convert back to TransactionData type
    const trans = calculation?.transactions?.find(
      (t) => t.id === transaction.id
    );
    if (trans) {
      setSelectedTransaction(trans);
      setTransactionOpen(true);
    }
  };

  const handleDeleteTransaction = (transaction: Payment) => {
    const trans = calculation?.transactions?.find(
      (t) => t.id === transaction.id
    );
    if (trans) {
      setSelectedTransaction(trans);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!id || !selectedTransaction?.id) {
      toast.error("Invalid transaction or case ID");
      return;
    }

    try {
      await deleteTransaction({
        calculationId: id,
        transactionId: selectedTransaction.id,
      }).unwrap();
      toast.success("Transaction deleted successfully");
      setSelectedTransaction(null);
      setDeleteModalOpen(false);
      refetch(); // Refresh the data
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to delete transaction");
    }
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setTransactionOpen(true);
  };

  const handleDeleteCase = async () => {
    if (!id) return;

    try {
      await deleteCalculation(id).unwrap();
      toast.success("Case deleted successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to delete case");
    }
  };

  const columns = useTransactionColumns({
    onEdit: handleEditTransaction,
    onDelete: handleDeleteTransaction,
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Loading case details...</p>
      </div>
    );
  }

  if (error || !calculation) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-destructive">
          Error loading case details. Please try again.
        </p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Use values from the API calculation response matching official calculator display
  const totalPayments = calculation.principal_reduction || 0;
  const totalCosts = calculation.total_costs || 0;

  // Total Interest for display
  const totalInterest = calculation.total_interest_accrued || 0;

  // Today's payoff is the total amount due
  const todayPayoff = calculation.total_due || 0;

  const lastTransaction = transactions[transactions.length - 1];
  const lastPaymentDate =
    lastTransaction?.payment_date || calculation.judgment_date;

  return (
    <>
      <div className="flex h-full w-full flex-col gap-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-primary text-xl sm:text-2xl md:text-3xl">
            {calculation?.case_name ?? "Case Not Found"}
          </Label>
          <div className="hidden flex-col gap-2.5 md:flex md:flex-row">
            <Button
              variant="default"
              size="sm"
              type="button"
              onClick={() => setEdit(true)}
            >
              Edit Case
              <Pencil className="ml-1 size-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              type="button"
              onClick={() => setWarningModalOpen(true)}
            >
              Delete Case <Trash className="ml-1 size-4" />
            </Button>
          </div>
          <div className="flex gap-2.5 md:hidden">
            <Button variant="default" size="sm" type="button" disabled>
              <CreditCard className="ml-1 size-4" />
            </Button>
          </div>
        </div>
        <Card className="w-full rounded-xl shadow-none">
          <CardContent className="space-y-6">
            {/* Case Information Section */}
            <div>
              <h3 className="mb-3 font-semibold text-lg text-primary">
                Case Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Case Name
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.case_name || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Client Name
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.client_name || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Court Name
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.court_name || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Court Number
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.court_number || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Lawyer/Firm Information Section */}
            <div>
              <h3 className="mb-3 font-semibold text-lg text-primary">
                Lawyer & Firm Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Lawyer Name
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.lawyer_name || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Firm Name
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.firm_name || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Lawyer Phone
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.lawyer_phone || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Lawyer Email
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.lawyer_email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            {(calculation?.street_address ||
              calculation?.city ||
              calculation?.state ||
              calculation?.zipcode) && (
              <div>
                <h3 className="mb-3 font-semibold text-lg text-primary">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col rounded-lg border p-4 shadow">
                    <p className="font-semibold text-base sm:text-lg">
                      Street Address
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {calculation?.street_address || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col rounded-lg border p-4 shadow">
                    <p className="font-semibold text-base sm:text-lg">City</p>
                    <p className="text-muted-foreground text-sm">
                      {calculation?.city || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col rounded-lg border p-4 shadow">
                    <p className="font-semibold text-base sm:text-lg">State</p>
                    <p className="text-muted-foreground text-sm">
                      {calculation?.state || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col rounded-lg border p-4 shadow">
                    <p className="font-semibold text-base sm:text-lg">
                      Zip Code
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {calculation?.zipcode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Information Section */}
            <div>
              <h3 className="mb-3 font-semibold text-lg text-primary">
                Financial Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Judgement Amount
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(calculation?.judgment_amount || 0)}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Interest Rate
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.annual_interest_rate || 10}%
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Judgement Date
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.judgment_date || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">End Date</p>
                  <p className="text-muted-foreground text-sm">
                    {calculation?.end_date || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary Section */}
            <div>
              <h3 className="mb-3 font-semibold text-lg text-primary">
                Payment Summary
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Last Payment Date
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {lastPaymentDate || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Total Payments
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(totalPayments)}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Total Costs
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(totalCosts)}
                  </p>
                </div>
                <div className="flex flex-col rounded-lg border p-4 shadow">
                  <p className="font-semibold text-base sm:text-lg">
                    Total Interest
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(totalInterest)}
                  </p>
                </div>
                <div className="col-span-1 flex flex-col rounded-lg border bg-primary/5 p-4 shadow sm:col-span-2 lg:col-span-4">
                  <p className="font-bold text-lg sm:text-xl text-primary">
                    Today Payoff
                  </p>
                  <p className="w-full font-semibold text-xl sm:text-2xl text-primary">
                    {formatCurrency(todayPayoff)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex h-full flex-col gap-5 lg:grid lg:grid-cols-4">
          <div className="order-1 w-full lg:order-2">
            <Card className="h-full w-full shadow-none">
              <CardContent className="flex h-full w-full flex-col gap-3 p-4">
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={handleAddTransaction}
                >
                  <Receipt className="mr-2 size-4" />
                  Transaction
                </Button>
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => setPayoffDemandOpen(true)}
                >
                  <FileText className="mr-2 size-4" />
                  Payoff Demand
                </Button>
                <Button variant="default" className="w-full justify-start">
                  <Printer className="mr-2 size-4" />
                  Print
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 flex h-[600px] flex-col gap-5 rounded-xl border p-4 sm:p-6 md:h-[600px] lg:order-2 lg:col-span-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-primary text-xl sm:text-2xl md:text-[28px]">
                Transactions History
              </span>
              <Input
                type="text"
                className="w-full sm:w-1/2 lg:w-1/3"
                placeholder={`Filter Transactions by Date...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <DataTable
              columns={columns}
              data={
                transactions?.filter((payment) =>
                  search
                    ? payment.payment_date
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    : true
                ) ?? []
              }
            />
          </div>
        </div>
      </div>
      <CompanySheet
        company={calculation as any}
        open={edit}
        setOpen={setEdit}
      />
      <TransactionSheet
        open={transactionOpen}
        setOpen={(value) => {
          setTransactionOpen(value);
          if (!value) {
            setSelectedTransaction(null);
          }
        }}
        caseId={id}
        caseName={calculation?.case_name}
        transaction={selectedTransaction || undefined}
      />
      <PayoffDemandModal
        open={payoffDemandOpen}
        setOpen={setPayoffDemandOpen}
        caseId={id}
        caseName={calculation?.case_name}
        principalBalance={todayPayoff.toFixed(2)}
        accruedInterest={totalInterest.toFixed(2)}
        caseData={calculation as any}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        itemName={
          selectedTransaction
            ? `Transaction dated ${selectedTransaction.transaction_date}`
            : undefined
        }
      />
      <WarningModal
        open={warningModalOpen}
        setOpen={setWarningModalOpen}
        title="Are you sure?"
        text="You'll be deleted this Case and all associated transactions."
        cta={handleDeleteCase}
      />
    </>
  );
};

export default UserDetail;
