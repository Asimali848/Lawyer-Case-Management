import { DataTable } from "@/components/interest-rate/DataTable";
import { columns } from "@/components/interest-rate/column";
import { data } from "@/lib/constants";

export default function PostTablePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-start justify-start p-6 bg-white">
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-bold text-primary">
          Post-Judgment Interest Rates
        </h1>
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
