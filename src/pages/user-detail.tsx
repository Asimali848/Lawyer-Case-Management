import { CreditCard, FileText, Pencil, Printer, Receipt, Trash } from "lucide-react";
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
import { mockCase, mockPayments } from "@/lib/constants";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [edit, setEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [transactionOpen, setTransactionOpen] = useState<boolean>(false);
  const [payoffDemandOpen, setPayoffDemandOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Payment | null>(null);
  const [transactions, setTransactions] = useState<Payment[]>(mockPayments);
  const [warningModalOpen, setWarningModalOpen] = useState<boolean>(false);

  const handleEditTransaction = (transaction: Payment) => {
    setSelectedTransaction(transaction);
    setTransactionOpen(true);
  };

  const handleDeleteTransaction = (transaction: Payment) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransaction) {
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
      setSelectedTransaction(null);
    }
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setTransactionOpen(true);
  };

  const columns = useTransactionColumns({
    onEdit: handleEditTransaction,
    onDelete: handleDeleteTransaction,
  });

  return (
    <>
      <div className="flex h-full w-full flex-col gap-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-primary text-xl sm:text-2xl md:text-3xl">
            {mockCase?.case_name ?? "Case Not Found"}
          </Label>
          <div className="hidden flex-col gap-2.5 md:flex md:flex-row">
            <Button variant="default" size="sm" type="button" onClick={() => setEdit(true)}>
              Edit Case
              <Pencil className="ml-1 size-4" />
            </Button>
            <Button variant="destructive" size="sm" type="button" onClick={() => setWarningModalOpen(true)}>
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
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Case Name</p>
              <p className="text-muted-foreground text-sm">{mockCase?.court_name || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Court Name</p>
              <p className="text-muted-foreground text-sm">{mockCase?.court_case_number || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Judgement Amount</p>
              <p className="text-muted-foreground text-sm">{mockCase?.judegment_amount || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Judgement Date</p>
              <a
                href={mockCase?.judgement_date || "N/A"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm underline"
              >
                {mockCase?.last_payment_date || "N/A"}
              </a>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Last Payment Date</p>
              <p className="text-muted-foreground text-sm">{mockCase?.total_payment_to_date || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Total Payment to Date</p>
              <p className="text-muted-foreground text-sm">{mockCase?.interest_to_date || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Interest to Date</p>
              <p className="text-muted-foreground text-sm">{mockCase?.today_payoff || "N/A"}</p>
            </div>
            <div className="col-span-1 flex flex-col rounded-lg border p-4 shadow sm:col-span-2 lg:col-span-4">
              <p className="font-semibold text-base sm:text-lg">Today Payoff</p>
              <p className="w-full text-muted-foreground text-sm">{mockCase?.today_payoff || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex h-full flex-col gap-5 lg:grid lg:grid-cols-4">
          <div className="order-1 w-full lg:order-2">
            <Card className="h-full w-full shadow-none">
              <CardContent className="flex h-full w-full flex-col gap-3 p-4">
                <Button variant="default" className="w-full justify-start" onClick={handleAddTransaction}>
                  <Receipt className="mr-2 size-4" />
                  Transaction
                </Button>
                <Button variant="default" className="w-full justify-start" onClick={() => setPayoffDemandOpen(true)}>
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
          <div className="order-1 flex h-full flex-col gap-5 rounded-xl border p-4 sm:p-6 md:h-full lg:order-2 lg:col-span-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-primary text-xl sm:text-2xl md:text-[28px]">Transactions History</span>
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
                  search ? payment.payment_date.toLowerCase().includes(search.toLowerCase()) : true,
                ) ?? []
              }
            />
          </div>
        </div>
      </div>
      <CompanySheet company={mockCase} open={edit} setOpen={setEdit} />
      <TransactionSheet
        open={transactionOpen}
        setOpen={(value) => {
          setTransactionOpen(value);
          if (!value) {
            setSelectedTransaction(null);
          }
        }}
        caseId={id}
        caseName={mockCase?.case_name}
        transaction={selectedTransaction || undefined}
      />
      <PayoffDemandModal
        open={payoffDemandOpen}
        setOpen={setPayoffDemandOpen}
        caseId={id}
        caseName={mockCase?.case_name}
        principalBalance={mockCase?.today_payoff || "0"}
        accruedInterest={mockCase?.interest_to_date || "0"}
        caseData={mockCase}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        itemName={selectedTransaction ? `Transaction dated ${selectedTransaction.payment_date}` : undefined}
      />
      <WarningModal
        open={warningModalOpen}
        setOpen={setWarningModalOpen}
        title="Are you sure?"
        text="You'll be deleted this Case and all associated transactions."
        cta={() => {
          setWarningModalOpen(false);
          setDeleteModalOpen(true);
        }}
      />
    </>
  );
};

export default UserDetail;
