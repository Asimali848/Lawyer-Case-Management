import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGetCalculationsQuery } from "@/store/services/calculations";
import { useGetSubscriptionStatusQuery } from "@/store/services/subscription";
import { getCurrentDate } from "@/lib/utils";
import CaseListWithDetails from "@/components/dashboard/case-list-with-details";
import Loader from "@/components/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();

  // Get subscription status
  const { data: subscription } = useGetSubscriptionStatusQuery();
  const isFreeUser = subscription?.subscription_type === "free";

  const batchSize = useState<number>(50)[0];
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [allCases, setAllCases] = useState<CaseGet[]>([]);
  const [totalCases, setTotalCases] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const hasInitialized = useRef(false);
  const hasMoreData = useRef(true);
  // Store created_at dates for FIFO sorting
  const caseCreatedDates = useRef<Map<string, string>>(new Map());

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
      const newBatch: (CaseGet & { _created_at?: string })[] = data.calculations.map((calc: any) => ({
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
        // Store created_at for FIFO sorting (oldest first)
        _created_at: calc.created_at || calc.judgment_date || "",
      }));

      setAllCases((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const uniqueNewCases = newBatch.filter((c) => !existingIds.has(c.id));
        
        // Store created_at dates for new cases
        uniqueNewCases.forEach((c) => {
          if (c.id && (c as any)._created_at) {
            caseCreatedDates.current.set(c.id, (c as any)._created_at);
          }
        });
        
        // Combine previous cases with new cases
        let updated = [...prev, ...uniqueNewCases];

        // For free users, limit to maximum 3 cases
        if (isFreeUser && updated.length > 3) {
          updated = updated.slice(0, 3);
          hasMoreData.current = false;
        }

        // Apply FIFO (First In First Out) - sort by created_at ascending (oldest first)
        updated = updated.sort((a, b) => {
          const dateA = (a.id ? caseCreatedDates.current.get(a.id) : null) || a.judgement_date || "";
          const dateB = (b.id ? caseCreatedDates.current.get(b.id) : null) || b.judgement_date || "";
          // Sort ascending (oldest first) for FIFO
          return dateA.localeCompare(dateB);
        });

        setTotalCases(updated.length);

        if (
          newBatch.length < batchSize ||
          (isFreeUser && updated.length >= 3)
        ) {
          hasMoreData.current = false;
          setIsLoadingMore(false);
        }

        return updated;
      });

      if (newBatch.length < batchSize) {
        setIsLoadingMore(false);
      }
    }
  }, [data, currentOffset, batchSize, isFreeUser]);

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

    if (!isLoading && currentOffset === 0 && !allCases.length) {
      return (
      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black/50 z-10">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">No Cases Available</CardTitle>
          <CardDescription className="text-base mt-2">
            Please enter the case to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            type="button"
            onClick={() => {
              navigate("/add-case");
            }}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="size-5 mr-2" />
            Add New Case
          </Button>
        </CardContent>
      </Card>
    </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-3 sm:gap-4 md:gap-5 overflow-hidden md:p-4 lg:p-5">
      <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">
          Dashboard
        </h1>
        <Button
          variant="default"
          size="sm"
          type="button"
          onClick={() => {
            // Check if free user can create more cases
            if (isFreeUser && allCases.length >= 3) {
              toast.error(
                "Free tier limit reached. You can only create 3 cases. Please upgrade to Premium.",
                {
                  duration: 5000,
                  action: {
                    label: "Upgrade",
                    onClick: () => navigate("/billing"),
                  },
                }
              );
              return;
            }
            navigate("/add-case");
          }}
          className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
        >
          <Plus className="size-4 mr-1" />
          Add New Case
        </Button>
      </div>

      {/* Free User Warning */}
      {isFreeUser && allCases.length > 0 && (
        <div className="flex flex-col gap-4 items-center justify-center py-5 h-full w-full">
          <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Free Tier - Limited to 3 Cases
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            You're viewing {allCases.length} of your{" "}
            {allCases.length >= 3 ? "maximum 3" : allCases.length} cases.
            {allCases.length >= 3 && " To create more cases, "}
            <Button
              variant="link"
              className="p-0 h-auto text-amber-800 dark:text-amber-200 underline font-semibold"
              onClick={() => navigate("/billing")}
            >
              upgrade to Premium
            </Button>
            {allCases.length >= 3 ? " for unlimited cases." : "."}
          </AlertDescription>
        </Alert>
        </div>
      )}

      <div className="h-full w-full overflow-hidden">
        {isLoading && currentOffset === 0 && (
          <div className="flex items-center justify-center py-8 h-full w-full">
            <Loader />
          </div>
        )}
        {allCases.length > 0 && (
          <div className="h-full w-full overflow-hidden">
            <CaseListWithDetails
              cases={allCases}
              isLoading={isLoading && currentOffset === 0}
              error={error}
              isLoadingMore={isLoadingMore}
              totalCases={totalCases}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
