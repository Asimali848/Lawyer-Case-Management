import { Pencil, Upload, UserPlus } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EmployeeSheet from "@/components/company-detail/employee-add-sheet";
import { useEmployeeColumns } from "@/components/company-detail/employee-column";
import CulturePolicies from "@/components/dashboard/company-policy";
import CompanySheet from "@/components/dashboard/company-sheet";
import { DataTable } from "@/components/data-table";
import UploadModal from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RootState } from "@/types/global";

// Mock data for UI demonstration
const mockCompany: CompanyInfo = {
  id: "1",
  company_name: "Tech Corp",
  company_email: "contact@techcorp.com",
  owner_name: "John Doe",
  owner_email: "john@techcorp.com",
  company_type: "Technology",
  company_website: "https://techcorp.com",
  phone_number: "+1 234-567-8900",
  company_address: "123 Tech Street, San Francisco, CA",
  company_description: "A leading technology company",
};

const mockEmployees: EmployeeResponse[] = [
  {
    id: "1",
    company_id: "1",
    user_id: "user1",
    name: "Alice Johnson",
    email: "alice@techcorp.com",
    password: null,
    date_of_birth: "1990-01-15",
    user_phone_number: "+1 234-567-8902",
    user_designation: "Senior Developer",
    department: "Engineering",
    salary: 120000,
    is_role_model: true,
    is_candidate: false,
    files: [],
  },
  {
    id: "2",
    company_id: "1",
    user_id: "user2",
    name: "Bob Williams",
    email: "bob@techcorp.com",
    password: null,
    date_of_birth: "1988-05-20",
    user_phone_number: "+1 234-567-8903",
    user_designation: "Product Manager",
    department: "Product",
    salary: 110000,
    is_role_model: false,
    is_candidate: false,
    files: [],
  },
];

const UserDetail = () => {
  const columns = useEmployeeColumns();
  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [edit, setEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const { mode } = useSelector((state: RootState) => state.global);

  const employees = mockEmployees;
  const company = mockCompany;

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;
    if (!id) return;
  };

  return (
    <>
      <div className="flex h-full w-full flex-col gap-5 overflow-auto">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-primary text-xl sm:text-2xl md:text-3xl">
            {company?.company_name ?? "Company Not Found"}
          </Label>
          <div className="hidden flex-col gap-2.5 md:flex md:flex-row">
            <Button variant="default" size="sm" type="button" onClick={() => setEdit(true)}>
              Edit Company
              <Pencil className="ml-1 size-4" />
            </Button>
            <Button variant="default" size="sm" type="button" onClick={() => setOpen(true)}>
              Add {mode === "employees" ? "Employee" : "Candidate"}
              <UserPlus className="ml-1 size-4" />
            </Button>
            <Button variant="default" size="sm" type="button" onClick={() => setUploadOpen(true)}>
              Upload Policy <Upload className="ml-1 size-4" />
            </Button>
          </div>
          <div className="flex gap-2.5 md:hidden">
            <Button variant="default" size="sm" type="button" onClick={() => setOpen(true)}>
              <UserPlus className="ml-1 size-4" />
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
              <p className="text-muted-foreground text-sm">{company?.company_email || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Owner Name</p>
              <p className="text-muted-foreground text-sm">{company?.owner_name || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Owner Email</p>
              <p className="text-muted-foreground text-sm">{company?.owner_email || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Website</p>
              <a
                href={company?.company_website || "N/A"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm underline"
              >
                {company?.company_website || "N/A"}
              </a>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Company Type</p>
              <p className="text-muted-foreground text-sm">{company?.company_type || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Phone</p>
              <p className="text-muted-foreground text-sm">{company?.phone_number || "N/A"}</p>
            </div>
            <div className="flex flex-col rounded-lg border p-4 shadow">
              <p className="font-semibold text-base sm:text-lg">Address</p>
              <p className="text-muted-foreground text-sm">{company?.company_address || "N/A"}</p>
            </div>
            <div className="col-span-1 flex flex-col rounded-lg border p-4 shadow sm:col-span-2 lg:col-span-4">
              <p className="font-semibold text-base sm:text-lg">Description</p>
              <p className="w-full text-muted-foreground text-sm">{company?.company_description || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex h-full flex-col gap-5 lg:grid lg:grid-cols-3">
          <div className="order-1 lg:order-2">
            <CulturePolicies />
          </div>
          <div className="order-1 flex h-full flex-col gap-5 rounded-xl border p-4 sm:p-6 md:h-full lg:order-2 lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-primary text-xl sm:text-2xl md:text-[28px]">
                Company {mode === "employees" ? "Employees" : "Candidates"}
              </span>
              <Input
                type="text"
                className="w-full sm:w-1/2 lg:w-1/3"
                placeholder={`Filter ${mode === "employees" ? "Employees" : "Candidates"} by Email...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <DataTable
              columns={columns}
              data={
                employees
                  ?.filter((employee) =>
                    mode === "employees" ? employee.is_candidate === false : employee.is_candidate === true,
                  )
                  .filter((employee) =>
                    search ? employee.email.toLowerCase().includes(search.toLowerCase()) : true,
                  ) ?? []
              }
            />
          </div>
        </div>
        <EmployeeSheet open={open} setOpen={setOpen} companyId={id ?? ""} />
        <UploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUpload={handleUpload}
          companyId={id ?? ""}
        />
      </div>
      <CompanySheet
        id={id}
        open={edit}
        setOpen={setEdit}
        company={
          company
            ? {
                company_name: company.company_name,
                company_email: company.company_email ?? "",
                owner_name: company.owner_name,
                owner_email: company.owner_email,
                company_type: company.company_type,
                company_website: company.company_website,
                phone_number: company.phone_number,
                company_address: company.company_address,
                company_description: company.company_description,
              }
            : undefined
        }
      />
    </>
  );
};

export default UserDetail;
