import { columns } from "@/components/interest-rate/column";
import { DataTable } from "@/components/interest-rate/DataTable";
import { data } from "@/lib/constants";

export default function PostTablePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-start justify-start bg-white p-6">
      <div className="w-full">
        <h1 className="mb-4 font-bold text-2xl text-primary">Post-Judgment Interest Rates</h1>
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
