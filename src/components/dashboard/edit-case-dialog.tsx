import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { caseSchema } from "@/lib/form-schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateCalculationMutation } from "@/store/services/calculations";

interface EditCaseDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  caseData: CalculationDetailResponse | null;
  onSuccess?: () => void;
}

const EditCaseDialog = ({
  open,
  setOpen,
  caseData,
  onSuccess,
}: EditCaseDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateCalculation] = useUpdateCalculationMutation();

  const form = useForm<z.infer<typeof caseSchema>>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      case_name: "",
      court_name: "",
      court_case_number: "",
      judegment_amount: "",
      judgement_date: "",
    },
  });

  useEffect(() => {
    if (caseData && open) {
      // Format date for input (convert to YYYY-MM-DD if needed)
      let dateValue = caseData.judgment_date || "";
      if (dateValue) {
        try {
          // Try parsing different date formats
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            dateValue = date.toISOString().split("T")[0];
          } else {
            // Try parsing M/D/YYYY format
            const parts = dateValue.split("/");
            if (parts.length === 3) {
              const month = parts[0].padStart(2, "0");
              const day = parts[1].padStart(2, "0");
              const year = parts[2];
              dateValue = `${year}-${month}-${day}`;
            }
          }
        } catch {
          // Keep original value if parsing fails
        }
      }

      form.reset({
        case_name: caseData.case_name || "",
        court_name: caseData.court_name || "",
        court_case_number: caseData.court_number || "",
        judegment_amount: String(caseData.judgment_amount || 0),
        judgement_date: dateValue,
      });
    }
  }, [caseData, open, form]);

  const onSubmit = async (data: z.infer<typeof caseSchema>) => {
    if (!caseData?.id) {
      toast.error("Case ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const calculationRequest: CalculationRequest = {
        case_name: data.case_name,
        court_name: data.court_name,
        court_number: data.court_case_number,
        judgment_amount: parseFloat(data.judegment_amount),
        judgment_date: data.judgement_date,
        end_date: caseData.end_date || new Date().toISOString().split("T")[0],
        annual_interest_rate: caseData.annual_interest_rate || 10,
        payments: [],
        costs: [],
      };

      await updateCalculation({
        id: caseData.id,
        data: calculationRequest,
      }).unwrap();

      toast.success("Case updated successfully");
      setOpen(false);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to update case");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {caseData ? `Edit Case - ${caseData.case_name || ""}` : "Edit Case"}
          </DialogTitle>
          <DialogDescription>
            Update the details of this case.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="case_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter case name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="court_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Court Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter court name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="court_case_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter case number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="judegment_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judgment Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0000000001"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="judgement_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judgment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              {isLoading ? (
                <Button
                  type="submit"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled
                >
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCaseDialog;

