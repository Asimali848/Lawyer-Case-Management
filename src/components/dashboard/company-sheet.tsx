import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { caseSchema } from "@/lib/form-schemas";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

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
  const [isLoading] = useState(false);
  const [isLoadingUpdate] = useState(false);

  const form = useForm<z.infer<typeof caseSchema>>({
    resolver: zodResolver(caseSchema),
  });

  const onSubmit = async (data: z.infer<typeof caseSchema>) => {
    console.log(data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{company ? "Edit Case Details" : "Add Case Details"}</SheetTitle>
          <SheetDescription>{company ? "Update Case Details" : "Add a New Case"}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-5 overflow-auto px-4 pb-6">
            <FormField
              control={form.control}
              name="case_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Case Name<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="xyz" {...field} />
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
                  <FormLabel>
                    Court Name<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Corp" {...field} />
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
                  <FormLabel>
                    Court Case Number<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
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
                  <FormLabel>
                    Judegment Amount<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="100000" {...field} />
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
                  <FormLabel>
                    Judgement Date<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="2021-01-01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Payment Date</FormLabel>
                  <FormControl>
                    <Input placeholder="2021-01-01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_payment_to_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Payment to Date</FormLabel>
                  <FormControl>
                    <Input placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interest_to_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest to Date</FormLabel>
                  <FormControl>
                    <Input placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="today_payoff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Today Payoff<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading || isLoadingUpdate ? (
              <Button type="submit" variant="default" className="flex items-center justify-center">
                <Loader2 className="size-4 animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={isLoading || isLoadingUpdate} variant="default">
                {company ? "Update Case Details" : "Add Case Details"}
              </Button>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CaseSheet;
