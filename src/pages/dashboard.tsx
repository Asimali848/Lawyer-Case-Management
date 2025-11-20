import { useState } from "react";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useRowColumns } from "@/components/dashboard/columns";
import CompanySheet from "@/components/dashboard/company-sheet";

// Mock data for UI demonstration
const mockClients: ClientInfo[] = [
  {
    id: "1",
    client_name: "Tech Corp",
    client_email: "contact@techcorp.com",
    client_website: "https://techcorp.com",
    client_type: "Technology",
    client_address: "123 Tech Street, San Francisco, CA",
    client_description: "A leading technology company",
  },
  {
    id: "2",
    client_name: "Design Studio",
    client_email: "hello@designstudio.com",
    client_website: "https://designstudio.com",
    client_type: "Design",
    client_address: "456 Design Avenue, New York, NY",
    client_description: "Creative design solutions",
  },
];

const Dashboard = () => {
  const columns = useRowColumns();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const clients = mockClients;
  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-start gap-5 md:overflow-hidden">
        <div className="flex w-full items-start justify-start gap-2.5">
          <span className="flex-1 text-left font-bold text-[32px] text-primary leading-[32px]">Clients</span>
          <div className="hidden flex-col gap-2.5 md:flex md:flex-row">
            <Button variant="default" size="sm" type="button" onClick={() => setOpen(true)}>
              Add Client &nbsp;
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
                ? (clients ?? []).filter((e) => e.client_name?.toLowerCase().includes(search.toLowerCase()))
                : (clients ?? [])
            }
          />
        </div>
        <CompanySheet open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default Dashboard;
