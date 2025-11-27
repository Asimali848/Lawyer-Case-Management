import { Building2, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRowColumns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCalculationsQuery } from "@/store/services/calculations";
import { getCurrentDate } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const columns = useRowColumns();
  const [search, setSearch] = useState<string>("");
  const [batchSize] = useState<number>(5); // Batch size for progressive loading (matches table default)
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [allCases, setAllCases] = useState<CaseGet[]>([]);
  const [totalCases, setTotalCases] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const hasInitialized = useRef(false);
  const hasMoreData = useRef(true);

  // Fetch calculations progressively with current client date (limitless)
  const { data, isLoading, error, isFetching } = useGetCalculationsQuery(
    {
      limit: batchSize,
      offset: currentOffset,
      current_date: getCurrentDate(), // Use client's current date for all calculations
    },
    {
      skip: !hasMoreData.current && currentOffset > 0,
    }
  );

  // Process batch data when it arrives
  useEffect(() => {
    if (data?.calculations) {
      const newBatch: CaseGet[] = data.calculations.map((calc: any) => ({
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
      }));

      // Add new batch to existing cases (avoid duplicates)
      setAllCases((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const uniqueNewCases = newBatch.filter((c) => !existingIds.has(c.id));
        const updated = [...prev, ...uniqueNewCases];

        // Update total count
        setTotalCases(updated.length);

        // Check if this is the last batch (less than batchSize means no more data)
        if (newBatch.length < batchSize) {
          hasMoreData.current = false;
          setIsLoadingMore(false);
        }

        return updated;
      });

      if (newBatch.length < batchSize) {
        setIsLoadingMore(false);
      }
    }
  }, [data, currentOffset, batchSize]);

  // Auto-load next batch after first batch loads
  useEffect(() => {
    if (
      !hasInitialized.current &&
      data?.calculations &&
      data.calculations.length > 0
    ) {
      hasInitialized.current = true;

      // If we got a full batch, there might be more - load next batch after short delay
      if (data.calculations.length === batchSize && currentOffset === 0) {
        setTimeout(() => {
          setIsLoadingMore(true);
          setCurrentOffset(batchSize);
        }, 100); // Small delay to show first batch immediately
      }
    }
  }, [data, batchSize, currentOffset]);

  // Continue loading subsequent batches automatically
  useEffect(() => {
    if (
      currentOffset > 0 &&
      !isLoading &&
      !isFetching &&
      !error &&
      data?.calculations &&
      data.calculations.length === batchSize &&
      isLoadingMore
    ) {
      // Load next batch after brief delay
      const timer = setTimeout(() => {
        setCurrentOffset((prev) => prev + batchSize);
      }, 150);

      return () => clearTimeout(timer);
    } else if (data?.calculations && data.calculations.length < batchSize) {
      // Last batch received (partial batch means no more data)
      setIsLoadingMore(false);
    }
  }, [
    currentOffset,
    isLoading,
    isFetching,
    error,
    data,
    batchSize,
    isLoadingMore,
  ]);

  const cases = allCases;

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-start gap-5 md:overflow-hidden">
        <div className="flex w-full items-start justify-start gap-2.5">
          <span className="flex-1 text-left font-bold text-[32px] text-primary leading-[32px]">
            Clients
          </span>
          {/* Sync loader indicator - visible on left side of Add Case button */}
          {(isLoadingMore || (isLoading && currentOffset === 0)) && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 border border-red-500/20">
              <RefreshCw className="size-4 animate-spin text-red-500" />
              <span className="text-red-500 text-xs font-medium">
                {totalCases} loaded
              </span>
            </div>
          )}
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
          {isLoading && currentOffset === 0 ? (
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
            <>
              <DataTable
                columns={columns}
                data={
                  search
                    ? cases.filter((e) =>
                        e.case_name
                          ?.toLowerCase()
                          .includes(search.toLowerCase())
                      )
                    : cases
                }
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
