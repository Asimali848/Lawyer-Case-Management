import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { transactionSchema } from "@/lib/form-schemas";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface TransactionSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  caseId?: string;
  transaction?: {
    id?: string;
    payment_date: string;
    payment_amount: string;
    payment_method?: string;
    payment_status?: string;
    payment_notes?: string;
  };
}

const TransactionSheet = ({ open, setOpen, caseId, transaction }: TransactionSheetProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          payment_date: transaction.payment_date,
          payment_amount: transaction.payment_amount,
          payment_method: transaction.payment_method || "",
          payment_status: transaction.payment_status || "",
          payment_notes: transaction.payment_notes || "",
        }
      : {
          payment_date: "",
          payment_amount: "",
          payment_method: "",
          payment_status: "",
          payment_notes: "",
        },
  });

  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to create/update transaction
      console.log("Transaction data:", data, "Case ID:", caseId);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</SheetTitle>
          <SheetDescription>
            {transaction ? "Update transaction details" : "Add a new transaction"}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-5 overflow-auto px-4 pb-6">
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Date<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Amount<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input placeholder="Credit Card, Cash, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Paid, Pending, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <Button type="submit" variant="default" className="flex items-center justify-center" disabled>
                <Loader2 className="size-4 animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={isLoading} variant="default">
                {transaction ? "Update Transaction" : "Add Transaction"}
              </Button>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionSheet;

