import { columns } from "@/components/interest-rate/column";
import { DataTable } from "@/components/interest-rate/DataTable";
import { data } from "@/lib/constants";
import { setMeta } from "@/lib/seo";
import { useEffect } from "react";

export default function PostTablePage() {
  useEffect(() => {
    setMeta({
      title: "Post-Judgment Interest Rates | JudgmentCalc",
      description:
        "Review current and historical post-judgment interest rates for accurate judgment interest calculations and enforcement planning.",
      url: "https://judgmentcalc.com/interest-rate/",
    });
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-start justify-start bg-white p-6">
      <div className="w-full">
        <h1 className="mb-4 font-bold text-2xl text-primary">Post-Judgment Interest Rates</h1>
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
