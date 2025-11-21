import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { caseSchema } from "@/lib/form-schemas";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";

interface CaseSheetProps {
  id?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  company?: {
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

const CaseSheet = ({ open, setOpen, company }: CaseSheetProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
    if (company && open) {
      // Format date for input (convert to YYYY-MM-DD if needed)
      let dateValue = company.judgement_date || "";
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
        case_name: company.case_name || "",
        court_name: company.court_name || "",
        court_case_number: company.court_case_number || "",
        judegment_amount: company.judegment_amount || "",
        judgement_date: dateValue,
      });
    } else if (!company && open) {
      form.reset({
        case_name: "",
        court_name: "",
        court_case_number: "",
        judegment_amount: "",
        judgement_date: "",
      });
    }
  }, [company, open, form]);

  const onSubmit = async (data: z.infer<typeof caseSchema>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOpen(false);
      form.reset();
    } catch (_error) {
      toast.error("Failed to update case");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{company ? `Edit Case - ${company.case_name || ""}` : "Add Case Details"}</SheetTitle>
          <SheetDescription>
            {company ? "Update the details of this case." : "Add a new case to the system."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col gap-6 overflow-auto px-4 pt-4 pb-6"
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
            <div className="mt-auto flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              {isLoading ? (
                <Button type="submit" variant="default" className="bg-green-600 hover:bg-green-700" disabled>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CaseSheet;
