import type { Row } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TransactionColumnsProps {
  onEdit: (transaction: Payment) => void;
  onDelete: (transaction: Payment) => void;
}

export const useTransactionColumns = ({ onEdit, onDelete }: TransactionColumnsProps) => {
  return [
    {
      accessorKey: "payment_date",
      header: "DATE",
      cell: ({ row }: { row: Row<Payment> }) => {
        const date = row.getValue("payment_date") as string;
        if (!date) return <span className="font-medium text-green-600">N/A</span>;
        try {
          const dateObj = new Date(date);
          const month = dateObj.getMonth() + 1;
          const day = dateObj.getDate();
          const year = dateObj.getFullYear();
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
        return <span>${parseFloat(amount).toFixed(2)}</span>;
      },
    },
    {
      accessorKey: "accrued_interest",
      header: "ACCRUED INTEREST",
      cell: ({ row }: { row: Row<Payment> }) => {
        const interest = row.getValue("accrued_interest") as string;
        return <span>${parseFloat(interest).toFixed(2)}</span>;
      },
    },
    {
      accessorKey: "principal_balance",
      header: "PRINCIPAL BALANCE",
      cell: ({ row }: { row: Row<Payment> }) => {
        const balance = row.getValue("principal_balance") as string;
        return <span className="font-bold">${parseFloat(balance).toFixed(2)}</span>;
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
    {
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
    },
  ];
};
