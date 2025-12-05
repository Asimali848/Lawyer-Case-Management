import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetCalculationsQuery } from "@/store/services/calculations";
import { getCurrentDate } from "@/lib/utils";
import CaseListWithDetails from "@/components/dashboard/case-list-with-details";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const batchSize = useState<number>(50)[0];
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [allCases, setAllCases] = useState<CaseGet[]>([]);
  const [totalCases, setTotalCases] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const hasInitialized = useRef(false);
  const hasMoreData = useRef(true);

  const { data, isLoading, error, isFetching } = useGetCalculationsQuery(
    {
      limit: batchSize,
      offset: currentOffset,
      current_date: getCurrentDate(),
    },
    {
      skip: !hasMoreData.current && currentOffset > 0,
    }
  );

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

      setAllCases((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const uniqueNewCases = newBatch.filter((c) => !existingIds.has(c.id));
        const updated = [...prev, ...uniqueNewCases];

        setTotalCases(updated.length);

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

  useEffect(() => {
    if (
      !hasInitialized.current &&
      data?.calculations &&
      data.calculations.length > 0
    ) {
      hasInitialized.current = true;

      if (data.calculations.length === batchSize && currentOffset === 0) {
        setTimeout(() => {
          setIsLoadingMore(true);
          setCurrentOffset(batchSize);
        }, 100);
      }
    }
  }, [data, batchSize, currentOffset]);

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
      const timer = setTimeout(() => {
        setCurrentOffset((prev) => prev + batchSize);
      }, 150);

      return () => clearTimeout(timer);
    } else if (data?.calculations && data.calculations.length < batchSize) {
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


  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-hidden p-5">
      <div className="flex w-full items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <Button
          variant="default"
          size="sm"
          type="button"
          onClick={() => navigate("/add-case")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="size-4 mr-1" />
          Add New Case
        </Button>
      </div>
      <CaseListWithDetails
        cases={allCases}
        isLoading={isLoading && currentOffset === 0}
        error={error}
        isLoadingMore={isLoadingMore}
        totalCases={totalCases}
      />
    </div>
  );
};

export default Dashboard;
