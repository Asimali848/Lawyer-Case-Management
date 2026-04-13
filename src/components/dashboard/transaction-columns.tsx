import type { Row } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TransactionColumnsProps {
  onEdit: (transaction: Payment) => void;
  onDelete: (transaction: Payment) => void;
  readOnly?: boolean;
}

export const useTransactionColumns = ({ onEdit, onDelete, readOnly = false }: TransactionColumnsProps) => {
  const columns = [
    {
      accessorKey: "payment_date",
      header: "DATE",
      cell: ({ row }: { row: Row<Payment> }) => {
        const date = row.getValue("payment_date") as string;
        if (!date) return <span className="font-medium text-green-600">N/A</span>;
        try {
          // Parse date string directly to avoid timezone issues
          // Date format is YYYY-MM-DD
          const [year, month, day] = date.split("-").map(Number);
          const formattedDate = `${month}/${day}/${year}`;
          return <span className="font-medium text-green-600">{formattedDate}</span>;
        } catch {
          return <span className="font-medium text-green-600">{date}</span>;
        }
      },
    },
    {
      accessorKey: "transaction_type",
      header: "TRANSACTION TYPE",
      cell: ({ row }: { row: Row<Payment> }) => {
        const type = row.getValue("transaction_type") as string;
        return (
          <Badge
            variant="outline"
            className={
              type === "PAYMENT"
                ? "border-green-300 bg-green-100 text-green-700"
                : "border-red-300 bg-red-100 text-red-700"
            }
          >
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "payment_amount",
      header: "AMOUNT",
      cell: ({ row }: { row: Row<Payment> }) => {
        const amount = row.getValue("payment_amount") as string;
        const num = parseFloat(amount);
        return (
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(num)}
          </span>
        );
      },
    },
    {
      accessorKey: "accrued_interest",
      header: "Interest Accrued Since Last Payment",
      cell: ({ row }: { row: Row<Payment> }) => {
        const interest = row.getValue("accrued_interest") as string;
        const num = parseFloat(interest);
        return (
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(num)}
          </span>
        );
      },
    },
    {
      accessorKey: "principal_balance",
      header: "PRINCIPAL BALANCE",
      cell: ({ row }: { row: Row<Payment> }) => {
        const balance = row.getValue("principal_balance") as string;
        const num = parseFloat(balance);
        return (
          <span className="font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(num)}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: "DESCRIPTION",
      cell: ({ row }: { row: Row<Payment> }) => {
        const description = row.getValue("description") as string;
        return <span className="font-bold">{description || "N/A"}</span>;
      },
    },
  ];

  // Only show actions column for owners (not read-only)
  if (!readOnly) {
    columns.push({
      // @ts-ignore
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }: { row: Row<Payment> }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => onEdit(row.original)}
              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => onDelete(row.original)}
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash className="size-4" />
            </Button>
          </div>
        );
      },
    });
  }

  return columns;
};

