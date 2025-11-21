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
import { downloadPayoffStatementPDF } from "@/lib/pdf-download";

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
  caseName,
  principalBalance = "0",
  accruedInterest = "0",
  caseData,
}: PayoffDemandModalProps) => {
  const [date, setDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Set default date to today when modal opens
  useEffect(() => {
    if (open && !date) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [open, date]);

  // Calculate total payoff
  const principalBalanceNum = parseFloat(principalBalance || "0");
  const accruedInterestNum = parseFloat(accruedInterest || "0");
  const totalPayoff = principalBalanceNum + accruedInterestNum;

  const handleDownload = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    if (!caseData) {
      alert("Case data is required to generate the PDF");
      return;
    }

    setIsDownloading(true);
    try {
      await downloadPayoffStatementPDF(caseData, date, principalBalance, accruedInterest);
      setOpen(false);
      setDate("");
    } catch (_error) {
      alert("Error generating payoff statement PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payoff Demand - {caseName || "Case"}</DialogTitle>
          <DialogDescription>Enter the payoff date to generate the payoff statement.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="font-semibold">
              Payoff Date
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="pr-10"
              />
              <Calendar className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <h3 className="font-semibold text-base">Payoff Summary</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Principal Balance:</span>
                <span className="font-medium">${principalBalanceNum.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Accrued Interest:</span>
                <span className="font-medium">${accruedInterestNum.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-semibold">Total Payoff:</span>
                <span className="font-semibold text-green-600">${totalPayoff.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || !date}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 size-4" />
                Download Statement
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayoffDemandModal;
