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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { transactionSchema } from "@/lib/form-schemas";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  useAddTransactionMutation,
  useUpdateTransactionMutation,
} from "@/store/services/calculations";

interface TransactionSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  caseId?: string;
  caseName?: string;
  transaction?: TransactionData;
}

const TransactionSheet = ({
  open,
  setOpen,
  caseId,
  caseName,
  transaction,
}: TransactionSheetProps) => {
  const [addTransaction] = useAddTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      payment_date: "",
      transaction_type: "PAYMENT",
      payment_amount: "0",
      description: "",
    },
  });

  useEffect(() => {
    if (transaction && open) {
      // Format date for input (YYYY-MM-DD)
      let dateValue = "";
      if (transaction.transaction_date) {
        try {
          const date = new Date(transaction.transaction_date);
          if (!isNaN(date.getTime())) {
            dateValue = date.toISOString().split("T")[0];
          }
        } catch {
          dateValue = "";
        }
      }

      // Determine transaction type from amounts
      const transType = transaction.payment_amount > 0 ? "PAYMENT" : "COST";
      const amount =
        transaction.payment_amount > 0
          ? transaction.payment_amount
          : transaction.cost_amount;

      form.reset({
        payment_date: dateValue,
        transaction_type: transType,
        payment_amount: String(amount || "0"),
        description: transaction.description || "",
      });
    } else if (!transaction && open) {
      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      form.reset({
        payment_date: today,
        transaction_type: "PAYMENT",
        payment_amount: "0",
        description: "",
      });
    }
  }, [transaction, open, form]);

  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    if (!caseId) {
      toast.error("Case ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const transactionRequest: TransactionRequest = {
        transaction_date: data.payment_date,
        transaction_type:
          data.transaction_type === "PAYMENT" ? "payment" : "cost",
        amount: parseFloat(data.payment_amount),
        description: data.description || undefined,
      };

      if (transaction?.id) {
        // Update existing transaction
        await updateTransaction({
          calculationId: caseId,
          transactionId: transaction.id,
          transaction: transactionRequest,
        }).unwrap();
        toast.success("Transaction updated successfully");
      } else {
        // Add new transaction
        await addTransaction({
          calculationId: caseId,
          transaction: transactionRequest,
        }).unwrap();
        toast.success("Transaction added successfully");
      }

      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Transaction error:", error);
      toast.error(error?.data?.detail || "Failed to save transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {transaction ? "Edit Transaction" : "Add New Transaction"}
          </SheetTitle>
          {caseName && caseId && (
            <SheetDescription className="font-medium text-base">
              {caseName} - {caseId}
            </SheetDescription>
          )}
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col gap-6 overflow-auto px-4 pt-4 pb-6"
          >
            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PAYMENT">Payment</SelectItem>
                      <SelectItem value="COST">Cost</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-auto flex gap-3 pt-4">
              {isLoading ? (
                <Button
                  type="submit"
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled
                >
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {transaction ? "Updating..." : "Adding..."}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                  variant="default"
                >
                  {transaction ? "Update Transaction" : "Add Transaction"}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionSheet;
