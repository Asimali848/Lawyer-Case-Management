import { Info, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CaseListWithDetails from "@/components/dashboard/case-list-with-details";
import Loader from "@/components/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentDate } from "@/lib/utils";
import { useGetCalculationsQuery } from "@/store/services/calculations";
import { useGetSubscriptionStatusQuery } from "@/store/services/subscription";

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
    },
  );

  useEffect(() => {
    if (data?.calculations) {
      const newBatch: (CaseGet & { _created_at?: string })[] = data.calculations.map((calc: any) => ({
        id: calc.id,
        case_name: calc.case_name || "N/A",
        court_name: calc.court_name || "N/A",
        court_case_number: calc.court_number || "N/A",
        court_number: calc.court_number || "N/A",
        client_name: calc.client_name,
        judegment_amount: (calc.judgment_amount || 0).toFixed(2),
        judgment_amount: calc.judgment_amount || 0,
        judgement_date: calc.judgment_date,
        judgment_date: calc.judgment_date,
        annual_interest_rate: calc.annual_interest_rate || 10,
        last_payment_date: calc.end_date || calc.judgment_date,
        total_payment_to_date: (calc.principal_reduction || 0).toFixed(2),
        principal_reduction: calc.principal_reduction || 0,
        interest_to_date: (calc.totalInterest || calc.total_interest_accrued || 0).toFixed(2),
        total_interest_accrued: calc.total_interest_accrued || 0,
        today_payoff: (calc.total_due || 0).toFixed(2),
        total_due: calc.total_due || 0,
        daily_interest: calc.daily_interest || 0,
        interest_accrued: calc.interest_accrued || 0,
        transactions: calc.transactions || [],
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

        if (newBatch.length < batchSize || (isFreeUser && updated.length >= 3)) {
          hasMoreData.current = false;
          setIsLoadingMore(false);
        }

        return updated;
      });

      if (newBatch.length < batchSize) {
        setIsLoadingMore(false);
      }
    }
  }, [data, batchSize, isFreeUser]);

  useEffect(() => {
    if (!hasInitialized.current && data?.calculations && data.calculations.length > 0) {
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
  }, [currentOffset, isLoading, isFetching, error, data, batchSize, isLoadingMore]);

  if (!isLoading && currentOffset === 0 && !allCases.length) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
        <Card className="mx-4 w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No Cases Available</CardTitle>
            <CardDescription className="mt-2 text-base">Please enter the case to get started</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              variant="default"
              size="lg"
              type="button"
              onClick={() => {
                navigate("/add-case");
              }}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="mr-2 size-5" />
              Add New Case
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-hidden sm:gap-4 md:gap-5 md:p-4 lg:p-5">
      <div className="mb-2 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h1 className="font-bold text-primary text-xl sm:text-2xl">Dashboard</h1>
        <Button
          variant="default"
          size="sm"
          type="button"
          onClick={() => {
            // Check if free user can create more cases
            if (isFreeUser && allCases.length >= 3) {
              toast.error("Free tier limit reached. You can only create 3 cases. Please upgrade to Premium.", {
                duration: 5000,
                action: {
                  label: "Upgrade",
                  onClick: () => navigate("/billing"),
                },
              });
              return;
            }
            navigate("/add-case");
          }}
          className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto"
        >
          <Plus className="mr-1 size-4" />
          Add New Case
        </Button>
      </div>

      {/* Free User Warning */}
      {isFreeUser && allCases.length > 0 && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 py-5">
          <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">Free Tier - Limited to 3 Cases</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              You're viewing {allCases.length} of your {allCases.length >= 3 ? "maximum 3" : allCases.length} cases.
              {allCases.length >= 3 && " To create more cases, "}
              <Button
                variant="link"
                className="h-auto p-0 font-semibold text-amber-800 underline dark:text-amber-200"
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
          <div className="flex h-full w-full items-center justify-center py-8">
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
