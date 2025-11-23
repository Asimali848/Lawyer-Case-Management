import { Building2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRowColumns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCalculationsQuery } from "@/store/services/calculations";

const Dashboard = () => {
  const navigate = useNavigate();
  const columns = useRowColumns();
  const [search, setSearch] = useState<string>("");

  // Fetch calculations from API with current client date
  const { data, isLoading, error } = useGetCalculationsQuery({});

  // Transform calculation data to match CaseGet format for the table
  const cases: CaseGet[] = (data?.calculations || []).map((calc: any) => {
    return {
      id: calc.id,
      case_name: calc.case_name || "N/A",
      court_name: calc.court_name || "N/A",
      court_case_number: calc.court_number || "N/A",
      judegment_amount: (calc.judgment_amount || 0).toFixed(2),
      judgement_date: calc.judgment_date,
      last_payment_date: calc.end_date || calc.judgment_date,
      total_payment_to_date: "0.00",
      interest_to_date: (
        calc.totalInterest ||
        calc.total_interest_accrued ||
        0
      ).toFixed(2),
      today_payoff: (calc.total_due || 0).toFixed(2),
    };
  });

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-start gap-5 md:overflow-hidden">
        <div className="flex w-full items-start justify-start gap-2.5">
          <span className="flex-1 text-left font-bold text-[32px] text-primary leading-[32px]">
            Clients
          </span>
          <div className="hidden flex-col gap-2.5 md:flex md:flex-row">
            <Button
              variant="default"
              size="sm"
              type="button"
              onClick={() => navigate("/add-case")}
            >
              Add Case &nbsp;
              <Building2 />
            </Button>
          </div>
          <div className="flex gap-2.5 md:hidden">
            <Button
              variant="default"
              size="icon"
              type="button"
              onClick={() => navigate("/add-case")}
            >
              <Building2 />
            </Button>
          </div>
        </div>
        <div className="flex h-[calc(100vh-156px)] w-full flex-col gap-3.5 overflow-hidden">
          <Input
            type="text"
            className="w-2/3 md:w-1/3"
            placeholder="Filter Clients by Client Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading cases...</p>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-destructive">
                Error loading cases. Please try again.
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={
                search
                  ? cases.filter((e) =>
                      e.case_name?.toLowerCase().includes(search.toLowerCase())
                    )
                  : cases
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
