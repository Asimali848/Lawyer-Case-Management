import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { newCaseSchema } from "@/lib/form-schemas";

const NewCase = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof newCaseSchema>>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
      case_name: "",
      court_name: "",
      court_case_number: "",
      judegment_amount: "0",
      interest_rate: "10",
      judgement_date: "",
      firm_name: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      phone_number: "",
      email: "",
    },
  });

  // Set default date to today
  useEffect(() => {
    if (!form.getValues("judgement_date")) {
      const today = new Date().toISOString().split("T")[0];
      form.setValue("judgement_date", today);
    }
  }, [form]);

  // Watch form values for calculations
  const judgmentAmount = form.watch("judegment_amount");
  const interestRate = form.watch("interest_rate");
  const judgmentDate = form.watch("judgement_date");

  // Calculate results
  const results = useMemo(() => {
    const amount = parseFloat(judgmentAmount || "0") || 0;
    const rate = parseFloat(interestRate || "0") || 0;
    const dailyRate = rate / 100 / 365;

    let days = 0;
    if (judgmentDate) {
      try {
        const judgmentDateObj = new Date(judgmentDate);
        const today = new Date();
        const diffTime = today.getTime() - judgmentDateObj.getTime();
        days = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      } catch {
        days = 0;
      }
    }

    const dailyInterest = amount * dailyRate;
    const interestAccrued = amount * dailyRate * days;
    const interestToDate = interestAccrued;
    const totalInterest = interestAccrued;
    const principalReduction = 0; // This would be calculated from payments
    const principalBalance = amount - principalReduction;
    const costsAfterJudgment = 0; // This would come from costs
    const grandTotal = principalBalance + totalInterest + costsAfterJudgment;

    return {
      judgmentAmount: amount,
      principalReduction,
      principalBalance,
      costsAfterJudgment,
      dailyInterest,
      interestAccrued,
      interestToDate,
      totalInterest,
      days,
      grandTotal,
    };
  }, [judgmentAmount, interestRate, judgmentDate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const onSubmit = async (data: z.infer<typeof newCaseSchema>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to dashboard or case detail
      navigate("/dashboard");
    } catch (_error) {
      toast.error("Failed to add case");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">New Case</h1>
          <p className="text-muted-foreground text-sm">Enter judgment information</p>
        </div>
        <Button variant="default" size="sm" type="button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="ml-1 size-4" /> Back
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Judgment Information Section */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="font-semibold text-green-600 text-lg">
                  Judgment Information <span className="text-destructive">(Required)</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <Input placeholder="e.g. Orange County Superior Court" {...field} />
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
                      <FormLabel>Court Case Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter court case number" {...field} />
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
                      <FormLabel>Judgment Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="0"
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
                  name="interest_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="10" {...field} />
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
                        <div className="relative">
                          <Input type="date" {...field} className="pr-10" />
                          <Calendar className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 size-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Debtor Contact Info Section */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="font-semibold text-green-600 text-lg">Debtor Contact Info</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firm_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firm Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter firm name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter zip code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="font-semibold text-lg">Results</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Left Column */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Judgment Amount</span>
                    <span className="font-medium">{formatCurrency(results.judgmentAmount)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Principal Reduction</span>
                    <span className="font-medium">{formatCurrency(results.principalReduction)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Principal Balance</span>
                    <span className="font-medium">{formatCurrency(results.principalBalance)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Costs After Judgment</span>
                    <span className="font-medium">{formatCurrency(results.costsAfterJudgment)}</span>
                  </div>
                </div>

                {/* Middle Column */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Daily Interest</span>
                    <span className="font-medium">{formatCurrency(results.dailyInterest)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Interest Accrued</span>
                    <span className="font-medium">{formatCurrency(results.interestAccrued)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Interest to Date</span>
                    <span className="font-medium">{formatCurrency(results.interestToDate)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Total Interest</span>
                    <span className="font-medium">{formatCurrency(results.totalInterest)}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">Days</span>
                    <span className="font-medium">{results.days}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-t pt-4">
                    <span className="font-bold text-base">GRAND TOTAL</span>
                    <span className="font-bold text-green-600 text-lg">{formatCurrency(results.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={isLoading}>
              Cancel
            </Button>
            {isLoading ? (
              <Button type="submit" variant="default" className="bg-green-600 hover:bg-green-700" disabled>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Adding...
              </Button>
            ) : (
              <Button type="submit" variant="default" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                Add Case
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewCase;
