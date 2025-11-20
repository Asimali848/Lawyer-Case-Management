import { useState } from "react";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useRowColumns } from "@/components/dashboard/columns";

// Mock data for UI demonstration
const mockCases: CaseGet[] = [
  {
    id: "1",
    case_name: "Tech Corp",
    court_name: "Tech Corp",
    court_case_number: "1234567890",  
    judegment_amount: "100000",
    judgement_date: "2021-01-01",
    last_payment_date: "2021-01-01",
    total_payment_to_date: "100000",
    interest_to_date: "100000",
    today_payoff: "100000",
  },
  {
    id: "2",
    case_name: "Design Studio",
    court_name: "Design Studio",
    court_case_number: "1234567890",
    judegment_amount: "100000",
    judgement_date: "2021-01-01",
    last_payment_date: "2021-01-01",
    total_payment_to_date: "100000",
    interest_to_date: "100000",
    today_payoff: "100000",
  }
];

const Dashboard = () => {
  const columns = useRowColumns();
  const [_open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const cases = mockCases;
  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-start gap-5 md:overflow-hidden">
        <div className="flex w-full items-start justify-start gap-2.5">
          <span className="flex-1 text-left font-bold text-[32px] text-primary leading-[32px]">Clients</span>
          <div className="hidden flex-col gap-2.5 md:flex md:flex-row">
            <Button variant="default" size="sm" type="button" onClick={() => setOpen(true)}>
              Add Case &nbsp;
              <Building2 />
            </Button>
          </div>
          <div className="flex gap-2.5 md:hidden">
            <Button variant="default" size="icon" type="button" onClick={() => setOpen(true)}>
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
          <DataTable
            columns={columns}
            data={
              search
                ? (cases ?? []).filter((e) => e.case_name?.toLowerCase().includes(search.toLowerCase()))
                : (cases ?? [])
            }
          />
        </div>
        {/* <CaseSheet open={open} setOpen={setOpen} /> */}
      </div>
    </>
  );
};

export default Dashboard;
