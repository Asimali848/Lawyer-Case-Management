import type { Column, Row } from "@tanstack/react-table";
import { ArrowDownAZ, FilePenLine, FileText, MoreHorizontal, Upload } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import EmployeeSheet from "@/components/company-detail/employee-add-sheet";
import EmployeeDetailSheet from "@/components/company-detail/employee-detail-sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RootState } from "@/types/global";
import UploadModal from "../file-uploader";
import { Badge } from "../ui/badge";

const ActionsCell = ({ row }: { row: Row<EmployeeResponse> }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const { mode } = useSelector((state: RootState) => state.global);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" type="button">
            <MoreHorizontal className="rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <FilePenLine />
            Edit {mode === "employees" ? "Employee" : "Candidate"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDetailOpen(true)}>
            <FileText />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUploadOpen(true)}>
            <Upload />
            Upload File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EmployeeSheet
        open={open}
        setOpen={setOpen}
        id={row.original.id}
        companyId={row.original.company_id}
        employee={row.original}
      />
      <EmployeeDetailSheet id={row.original.id} open={detailOpen} setOpen={setDetailOpen} employee={row.original} />
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={() => setUploadOpen(false)}
        employeeId={row.original.id}
        companyId={row.original.company_id}
      />
    </>
  );
};

export const useEmployeeColumns = () => {
  return [
    {
      accessorKey: "name",
      header: ({ column }: { column: Column<EmployeeResponse> }) => (
        <Button variant="ghost" type="button" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowDownAZ className="ml-2" />
        </Button>
      ),
      cell: ({ row }: { row: Row<EmployeeResponse> }) => (
        <span className="ml-3 font-medium capitalize">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: { row: Row<EmployeeResponse> }) => (
        <span className="font-semibold text-[#71717A] text-sm">{row.getValue("email")}</span>
      ),
    },
    {
      accessorKey: "user_designation",
      header: "Status",
      cell: ({ row }: { row: Row<EmployeeResponse> }) => (
        <span className="font-semibold text-[#71717A] text-sm capitalize">
          {row.original.is_candidate ? "Candidate" : "Employee"}
        </span>
      ),
    },
    {
      accessorKey: "is_role_model",
      header: "Role Model",
      cell: ({ row }: { row: Row<EmployeeResponse> }) => {
        const isRoleModel = row.getValue("is_role_model");
        return (
          <Badge variant="outline" className="w-1/2 px-3">
            {isRoleModel ? "Yes" : "- -"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<EmployeeResponse> }) => <ActionsCell row={row} />,
    },
  ];
};
