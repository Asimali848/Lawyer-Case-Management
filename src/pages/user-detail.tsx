import { Pencil, CreditCard, Upload, Trash, Receipt, FileText, Printer } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeColumns } from "@/components/company-detail/employee-column";
import CompanySheet from "@/components/dashboard/company-sheet";
import TransactionSheet from "@/components/dashboard/transaction-sheet";
import PayoffDemandModal from "@/components/dashboard/payoff-demand-modal";
import { DataTable } from "@/components/data-table";
import UploadModal from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockCase: CaseGet = {
  id: "1",
  case_name: "Tech Corp",
  court_name: "Tech Corp",
  court_case_number: "1234567890",
  judegment_amount: "100000",
  judgement_date: "2021-01-01",
  last_payment_date: "2021-01-01",
  total_payment_to_date: "100000",
  interest_to_date: "100000",
  today_payoff: "100000",
};

const mockPayments: Payment[] = [
  {
    id: "1",
    payment_date: "2021-01-01",
    payment_amount: "100000",
  },
  {
    id: "2",
    payment_date: "2021-01-01",
    payment_amount: "100000",
    payment_method: "Credit Card",
    payment_status: "Paid",
    payment_notes: "Payment for Tech Corp",
  },
  {
    id: "3",
    payment_date: "2021-01-01",
    payment_amount: "100000",
    payment_method: "Credit Card",
    payment_status: "Paid",
    payment_notes: "Payment for Tech Corp",
  },
  {
    id: "4",
    payment_date: "2021-01-01",
    payment_amount: "100000",
    payment_method: "Credit Card",
    payment_status: "Paid",
    payment_notes: "Payment for Tech Corp",
  },
];
  
const UserDetail = () => {
  const columns = useEmployeeColumns();
  const { id } = useParams<{ id: string }>();
  const [edit, setEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState<boolean>(false);
  const [payoffDemandOpen, setPayoffDemandOpen] = useState<boolean>(false);

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;
    if (!id) return;
  };


  return (
    <>
      <div className="flex h-full w-full flex-col gap-5 overflow-auto">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-primary text-xl sm:text-2xl md:text-3xl">
            {mockCase?.case_name ?? "Case Not Found"}
          </Label>
          <div className="hidden flex-col gap-2.5 md:flex md:flex-row">
            <Button variant="default" size="sm" type="button" onClick={() => setEdit(true)}>
              Edit Case
              <Pencil className="ml-1 size-4" />
            </Button>
            <Button variant="destructive" size="sm" type="button">
             Delete Case <Trash className="ml-1 size-4" />
            </Button>
          </div>
          <div className="flex gap-2.5 md:hidden">
            <Button variant="default" size="sm" type="button" disabled>
              <CreditCard className="ml-1 size-4" />
            </Button>
            <Button variant="default" size="sm" type="button" onClick={() => setUploadOpen(true)}>
              <Upload className="ml-1 size-4" />
            </Button>
          </div>
        </div>
        <Card className="w-full rounded-xl shadow-none">
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Company Email</p>
              <p className="text-muted-foreground text-sm">{mockCase?.court_name || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Owner Name</p>
              <p className="text-muted-foreground text-sm">{mockCase?.court_case_number || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Owner Email</p>
              <p className="text-muted-foreground text-sm">{mockCase?.judegment_amount || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Website</p>
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
              <p className="font-semibold text-base sm:text-lg">Company Type</p>
              <p className="text-muted-foreground text-sm">{mockCase?.total_payment_to_date || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Phone</p>
              <p className="text-muted-foreground text-sm">{mockCase?.interest_to_date || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Address</p>
              <p className="text-muted-foreground text-sm">{mockCase?.today_payoff || "N/A"}</p>
            </div>
            <div className="col-span-1 flex flex-col rounded-lg border p-4 shadow sm:col-span-2 lg:col-span-4">
              <p className="font-semibold text-base sm:text-lg">Description</p>
              <p className="w-full text-muted-foreground text-sm">{mockCase?.today_payoff || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex h-full flex-col gap-5 lg:grid lg:grid-cols-4">
          <div className="order-1 lg:order-2 w-full">
            <Card className="w-full shadow-none h-full">
              <CardContent className="flex h-full w-full flex-col gap-3 p-4">
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => setTransactionOpen(true)}
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
                <Button
                  variant="default"
                  className="w-full justify-start"
                >
                  <Printer className="mr-2 size-4" />
                  Print
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 flex h-full flex-col gap-5 rounded-xl border p-4 sm:p-6 md:h-full lg:order-2 lg:col-span-3">
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
                mockPayments
                  ?.filter((payment) =>
                    search ? payment.payment_date.toLowerCase().includes(search.toLowerCase()) : true,
                  ) ?? []
              }
            />
          </div>
        </div>
        <UploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUpload={handleUpload}
        />
      </div>
      <CompanySheet
        company={mockCase}
        open={edit}
        setOpen={setEdit}
      />
      <TransactionSheet
        open={transactionOpen}
        setOpen={setTransactionOpen}
        caseId={id}
      />
      <PayoffDemandModal
        open={payoffDemandOpen}
        setOpen={setPayoffDemandOpen}
        caseId={id}
        caseName={mockCase?.case_name}
      />
    </>
  );
};

export default UserDetail;
