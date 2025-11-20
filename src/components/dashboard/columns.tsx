import type { Column, Row } from "@tanstack/react-table";
import { ArrowDownAZ } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSelectedCompany } from "@/store/slices/global";

export const useRowColumns = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRowClick = (caseId?: string, caseName?: string) => {
    dispatch(setSelectedCompany(caseName));

    if (caseId) {
      navigate(`/case-detail`);
    }
  };

  return [
    {
        accessorKey: "case_name",
      header: ({ column }: { column: Column<CaseGet> }) => (
        <Button
          variant="ghost"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Client Name
          <ArrowDownAZ className="ml-2" />
        </Button>
      ),
      cell: ({ row }: { row: Row<CaseGet> }) => (
        <span
          onClick={() => handleRowClick(row.original.id, row.original.case_name)}
          className="ml-3 w-full cursor-pointer font-medium hover:underline"
        >
          {row.getValue("case_name") || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "court_name",
      header: "Court Name",
      cell: ({ row }: { row: Row<CaseGet> }) => (
        <span
          onClick={() => handleRowClick(row.original.id, row.original.court_name)}
          className="w-full cursor-pointer font-semibold text-[#71717A] text-sm hover:underline"
        >
          {row.getValue("court_name") || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "court_case_number",
      header: "Court Case Number",
      cell: ({ row }: { row: Row<CaseGet> }) => (
        <span
          onClick={() => handleRowClick(row.original.id, row.original.court_case_number)}
          className="w-full cursor-pointer font-semibold text-[#71717A] text-sm hover:underline"
        >
          {row.getValue("court_case_number") || "N/A"}
        </span>
      ),
    },
    {
        accessorKey: "judegment_amount",
      header: "Judegment Amount",
      cell: ({ row }: { row: Row<CaseGet> }) => (
        <span
          onClick={() => handleRowClick(row.original.id, row.original.judegment_amount)}
          className="w-full cursor-pointer font-semibold text-[#71717A] text-sm hover:underline"
        >
          {row.getValue("judegment_amount") || "N/A"}
        </span>
      ),
    },
  ];
};
