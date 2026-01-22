import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PostData = {
  State: string;
  PostJudgmentInterestRate: string;
  Cite: string;
  Link?: string | null;
  Compounding?: string | null;
};

interface DataTableProps {
  columns: ColumnDef<PostData>[];
  data: PostData[];
}

export function DataTable({ columns, data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="w-full overflow-x-auto rounded-2xl shadow-xl bg-white border-muted-foreground">
      <CardContent className="p-4 text-black">
        <Table className="min-w-full table-fixed border-collapse text-sm">
          {/* Table Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={`text-base font-semibold text-primary whitespace-normal ${index === 0 ? "w-[150px]" : ""} ${index === 1 ? "w-[450px]" : ""} ${index === 2 ? "w-[200px]" : ""} ${index === 3 ? "w-[100px]" : ""} ${index === 4 ? "w-[150px]" : ""} `}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`px-3 py-2 align-top text-wrap whitespace-normal ${index === 0 ? "w-[150px] font-medium" : ""} ${index === 1 ? "w-[450px]" : ""} ${index === 2 ? "w-[200px]" : ""} ${index === 3 ? "w-[100px] text-blue-600 underline" : ""} ${index === 4 ? "w-[150px]" : ""} `}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
