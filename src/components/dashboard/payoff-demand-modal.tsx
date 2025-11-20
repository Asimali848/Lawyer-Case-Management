import { type Dispatch, type SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2 } from "lucide-react";

interface PayoffDemandModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  caseId?: string;
  caseName?: string;
}

const PayoffDemandModal = ({ open, setOpen, caseId, caseName }: PayoffDemandModalProps) => {
  const [date, setDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    setIsDownloading(true);
    try {
      // TODO: Implement API call to generate payoff demand document
      console.log("Generating payoff demand for date:", date, "Case ID:", caseId);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create a simple markdown content for the payoff demand
      const markdownContent = `# Payoff Demand Letter

**Case:** ${caseName || "N/A"}
**Date:** ${date}
**Case ID:** ${caseId || "N/A"}

## Payoff Demand

This letter serves as a formal demand for payoff of the outstanding judgment amount.

**Demand Date:** ${date}

Please contact us to arrange for the full payoff of the judgment.

---

*Generated on ${new Date().toLocaleDateString()}*
`;

      // Create a blob and download
      const blob = new Blob([markdownContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payoff-demand-${caseId || "case"}-${date}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setOpen(false);
      setDate("");
    } catch (error) {
      console.error("Error generating payoff demand:", error);
      alert("Error generating payoff demand. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payoff Demand</DialogTitle>
          <DialogDescription>
            Select a date and download the payoff demand document.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Demand Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDownloading}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading || !date}>
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 size-4" />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayoffDemandModal;

