import { type Dispatch, type SetStateAction } from "react";
import { useSelector } from "react-redux";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { RootState } from "@/types/global";
import { Label } from "../ui/label";
import EmployeeFile from "./employee-file";

interface EmployeeDetailSheetProps {
  id?: string;
  open: boolean;
  employee?: EmployeeResponse;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const EmployeeDetailSheet = ({ open, setOpen, employee }: EmployeeDetailSheetProps) => {
  // Use employee data directly instead of API call
  const data = employee;
  const { mode } = useSelector((state: RootState) => state.global);

  if (!employee) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-auto md:w-full lg:min-w-md">
        <SheetHeader>
          <SheetTitle className="font-semibold text-lg">
            {mode === "employees" ? "Employee Details" : "Candidate Details"}
          </SheetTitle>
          <SheetDescription>
            View all information about this {mode === "employees" ? "employee" : "candidate"}
          </SheetDescription>
        </SheetHeader>
        {data ? (
          <div className="flex flex-col gap-3 p-3">
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Name:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm capitalize">{data.name}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Email:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm">{data.email}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Designation:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm capitalize">
                {data.user_designation ?? "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Department:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm capitalize">{data.department ?? "N/A"}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Phone:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm">{data.user_phone_number ?? "N/A"}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Date of Birth:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm">{data.date_of_birth ?? "N/A"}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Salary:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm">{data.salary ?? "N/A"}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Candidate:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm">{data.is_candidate ? "Yes" : "No"}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
              <Label className="text-muted-foreground text-sm">Role Model:</Label>
              <p className="col-span-2 font-medium text-foreground text-sm">{data.is_role_model ? "Yes" : "No"}</p>
            </div>
            <EmployeeFile name={data.name} id={employee?.id ?? ""} company_id={employee?.company_id} />
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground text-sm">No data found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeDetailSheet;
