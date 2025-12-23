import { Calendar, Download, Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetPayoffDemandMutation } from "@/store/services/calculations";
import { downloadPayoffStatementPDF } from "@/lib/api";
import { toast } from "sonner";

interface PayoffDemandModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  caseId?: string;
  caseName?: string;
  principalBalance?: string;
  accruedInterest?: string;
  caseData?: {
    id?: string;
    case_name: string;
    court_name: string;
    court_case_number: string;
    judegment_amount: string;
    judgement_date: string;
    last_payment_date: string;
    total_payment_to_date: string;
    interest_to_date: string;
    today_payoff: string;
  };
}

const PayoffDemandModal = ({
  open,
  setOpen,
  caseId,
  caseName,
}: PayoffDemandModalProps) => {
  const [date, setDate] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [payoffData, setPayoffData] = useState<PayoffDemandResponse | null>(
    null
  );

  const [getPayoffDemand] = useGetPayoffDemandMutation();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      // Set default date to today when modal opens
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      setPayoffData(null);
      setIsCalculating(false);
    } else {
      // Reset when modal closes
      setDate("");
      setPayoffData(null);
      setIsCalculating(false);
    }
  }, [open]);

  // Calculate payoff when date is selected
  const handleCalculatePayoff = async () => {
    if (!date || !caseId) {
      console.log("Missing date or caseId:", { date, caseId });
      return;
    }

    setIsCalculating(true);
    setPayoffData(null);

    try {
      console.log("Calling payoff demand API with:", {
        calculationId: caseId,
        payoff_date: date,
      });
      const result = await getPayoffDemand({
        calculationId: caseId,
        payoff_date: date,
      }).unwrap();

      console.log("Payoff demand result:", result);
      setPayoffData(result);
      toast.success("Payoff calculated successfully");
    } catch (error: any) {
      console.error("Error calculating payoff:", error);
      toast.error(
        error?.data?.detail || "Failed to calculate payoff. Please try again."
      );
      setPayoffData(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // Don't auto-calculate anymore - user will click OK button

  const handleDownload = async () => {
    if (!payoffData || !caseId) {
      toast.error("Please wait for payoff calculation to complete");
      return;
    }

    try {
      console.log("Downloading PDF with payoff data:", payoffData);
      toast.info("Generating PDF...");

      await downloadPayoffStatementPDF(caseId, payoffData.payoff_date);

      toast.success("Payoff statement downloaded successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating payoff statement PDF. Please try again.");
    }
  };

  // Calculate display values - convert strings to numbers
  const principalBalanceNum = Number(payoffData?.principal_balance) || 0;
  const accruedInterestNum = Number(payoffData?.accrued_interest) || 0;
  const totalPayoff = Number(payoffData?.total_payoff) || 0;
  const dailyInterestAmount = Number(payoffData?.daily_interest_amount) || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payoff Demand - {caseName || "Case"}</DialogTitle>
          <DialogDescription>
            Select a payoff date to calculate the exact amount due. The
            calculation will include all transactions up to and including the
            selected date.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="payoff-date" className="font-semibold">
              Payoff Date
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="payoff-date"
                  name="payoff-date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    console.log("Date changed to:", e.target.value);
                    setDate(e.target.value);
                  }}
                  required
                  className="w-full pr-10"
                  placeholder="Select date"
                />
                <Calendar className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 size-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleCalculatePayoff}
                disabled={isCalculating || !date}
                variant="outline"
                size="default"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Calc
                  </>
                ) : (
                  "Calculate"
                )}
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Interest will be calculated up to and including this date
            </p>
          </div>

          {isCalculating && (
            <div className="flex items-center justify-center gap-2 rounded-lg border p-4">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="text-muted-foreground">
                Calculating payoff amount...
              </span>
            </div>
          )}

          {payoffData && !isCalculating && (
            <div
              className="flex flex-col gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={handleDownload}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleDownload();
                }
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Payoff Summary</h3>
                <Download className="size-5 text-green-600" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payoff Date:</span>
                  <span className="font-medium">
                    {new Date(date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Principal Balance:
                  </span>
                  <span className="font-medium">
                    ${principalBalanceNum.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Accrued Interest:
                  </span>
                  <span className="font-medium">
                    ${accruedInterestNum.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="font-semibold">Total Payoff:</span>
                  <span className="font-semibold text-green-600 text-lg">
                    ${totalPayoff.toFixed(2)}
                  </span>
                </div>
                <div className="mt-3 rounded-md bg-blue-50 p-3">
                  <p className="text-blue-900 text-sm">
                    <strong>Daily Interest:</strong> $
                    {dailyInterestAmount.toFixed(4)} per day after{" "}
                    {new Date(date).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-blue-700 text-xs">
                    Interest will continue to accrue at this rate until paid in
                    full.
                  </p>
                </div>
                {payoffData.transactions_included &&
                  payoffData.transactions_included.length > 0 && (
                    <div className="mt-2 text-muted-foreground text-xs">
                      <p>
                        <strong>Transactions included:</strong>{" "}
                        {payoffData.transactions_included.length} transaction(s)
                        through {new Date(date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
              </div>
              <div className="mt-2 text-center text-green-600 text-sm font-medium">
                Click here to download PDF statement
              </div>
            </div>
          )}
        </div>
        {!payoffData && (
          <DialogFooter className="sm:justify-start">
            <Button
              onClick={handleCalculatePayoff}
              disabled={isCalculating || !date}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "OK - Calculate Payoff"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PayoffDemandModal;
