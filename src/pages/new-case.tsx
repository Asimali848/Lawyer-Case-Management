import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { newCaseSchema } from "@/lib/form-schemas";
import {
  useCreateCalculationMutation,
  useUpdateCalculationMutation,
} from "@/store/services/calculations";

const NewCase = () => {
  const navigate = useNavigate();
  const [createCalculation, { isLoading: isCreating }] =
    useCreateCalculationMutation();
  const [updateCalculation, { isLoading: isUpdating }] =
    useUpdateCalculationMutation();
  const [calculationResult, setCalculationResult] =
    useState<CalculationResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedCalculationId] = useState<string | null>(null);
  const [, setLastCalculationRequest] = useState<CalculationRequest | null>(
    null
  );

  const isLoading = isCreating || isUpdating;

  const form = useForm<z.infer<typeof newCaseSchema>>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
      case_name: "",
      client_name: "",
      court_name: "",
      court_number: "",
      judegment_amount: "0",
      interest_rate: "10",
      judgement_date: "",
      lawyer_name: "",
      firm_name: "",
      street_address: "",
      city: "",
      state: "",
      zipcode: "",
      lawyer_phone: "",
      lawyer_email: "",
    },
  });

  // Set default date to today
  useEffect(() => {
    if (!form.getValues("judgement_date")) {
      const today = new Date().toISOString().split("T")[0];
      form.setValue("judgement_date", today);
    }
  }, [form]);

  // Format currency with 4 decimal places (for daily interest - matches static files)
  const formatCurrency4Decimals = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "$0.0000";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(num);
  };

  // Format currency with 2 decimal places (for most amounts - matches static files)
  const formatCurrency2Decimals = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Calculate function - calls backend API and saves the case (matches static files behavior)
  const handleCalculate = async () => {
    const data = form.getValues();

    // Validate required fields
    if (!data.judegment_amount || parseFloat(data.judegment_amount) <= 0) {
      toast.error("Please enter a valid Judgment Amount");
      return;
    }

    if (!data.judgement_date) {
      toast.error("Please select a Judgment Date");
      return;
    }

    if (!data.case_name || data.case_name.trim().length < 2) {
      toast.error("Please enter a valid Case Name");
      return;
    }

    if (!data.court_name || data.court_name.trim().length < 2) {
      toast.error("Please enter a valid Court Name");
      return;
    }

    if (!data.court_number || data.court_number.trim().length < 2) {
      toast.error("Please enter a valid Court Number");
      return;
    }

    try {
      setIsCalculating(true);

      // Get today's date as end_date ONCE and store it (matches static version behavior)
      // This ensures the same end_date is used for both calculation and saving
      const today = new Date().toISOString().split("T")[0];
      console.log(today);
      console.log(new Date());

      // Prepare calculation request (matches static version exactly)
      // Store this exact request to ensure consistency
      const calculationRequest: CalculationRequest = {
        case_name: data.case_name,
        client_name: data.client_name || undefined,
        court_name: data.court_name,
        court_number: data.court_number,
        lawyer_name: data.lawyer_name || undefined,
        firm_name: data.firm_name || undefined,
        street_address: data.street_address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zipcode: data.zipcode || undefined,
        lawyer_phone: data.lawyer_phone || undefined,
        lawyer_email: data.lawyer_email || undefined,
        judgment_amount: parseFloat(data.judegment_amount),
        judgment_date: data.judgement_date,
        end_date: today, // Store this exact date
        annual_interest_rate: parseFloat(data.interest_rate),
        payments: [],
        costs: [],
      };

      // Store the calculation request for consistency
      setLastCalculationRequest(calculationRequest);

      // Use the mutation to calculate AND save in ONE call
      // This ensures the exact same calculation request is used for both calculation and saving
      // No timing differences, no double API calls - perfect sync!
      let result: CalculationResponse;

      if (savedCalculationId) {
        // Update existing calculation using the EXACT same request
        result = await updateCalculation({
          id: savedCalculationId,
          data: calculationRequest, // Use the EXACT same request
        }).unwrap();
        toast.success("Case recalculated and updated successfully!");
      } else {
        // Create new calculation using the EXACT same request
        result = await createCalculation(calculationRequest).unwrap();
        toast.success("Case calculated and saved successfully!");
        // Note: The calculation is automatically saved by the backend
      }

      // Set the result for display - this is the EXACT same result that was saved
      setCalculationResult(result);
    } catch (error: any) {
      console.error("Calculation error:", error);
      toast.error(error?.message || "Failed to calculate. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const onSubmit = async (_data: z.infer<typeof newCaseSchema>) => {
    // If calculation was already done, just navigate to dashboard
    // The case is already saved from the Calculate button
    if (calculationResult) {
      navigate("/dashboard");
      return;
    }

    // If no calculation was done, show error
    toast.error(
      "Please click 'Calculate' first to calculate and save the case."
    );
  };

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">New Case</h1>
          <p className="text-muted-foreground text-sm">
            Enter judgment information
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="ml-1 size-4" /> Back
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Judgment Information Section */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="font-semibold text-green-600 text-lg">
                  Judgment Information{" "}
                  <span className="text-destructive">(Required)</span>
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
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client name" {...field} />
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
                        <Input
                          placeholder="e.g. Orange County Superior Court"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="court_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter court number" {...field} />
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
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="10"
                          {...field}
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
                <h2 className="font-semibold text-green-600 text-lg">
                  Attorney Information (Optional)
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lawyer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lawyer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter lawyer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="zipcode"
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
                  name="lawyer_phone"
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
                  name="lawyer_email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          {...field}
                        />
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
              {calculationResult ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Left Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Judgment Amount
                      </span>
                      <span className="font-medium">
                        {formatCurrency2Decimals(
                          calculationResult.initial_principal
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Principal Reduction
                      </span>
                      <span className="font-medium">
                        {formatCurrency2Decimals(
                          calculationResult.principal_reduction
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Principal Balance
                      </span>
                      <span className="font-medium">
                        {formatCurrency2Decimals(
                          calculationResult.remaining_principal
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Costs After Judgment
                      </span>
                      <span className="font-medium">
                        {formatCurrency2Decimals(calculationResult.total_costs)}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Daily Interest
                      </span>
                      <span className="font-medium">
                        {formatCurrency4Decimals(
                          calculationResult.daily_interest
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Interest Accrued
                      </span>
                      <span className="font-medium">
                        {formatCurrency2Decimals(
                          calculationResult.interest_accrued
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Interest to Date
                      </span>
                      <span className="font-medium">
                        {formatCurrency2Decimals(
                          calculationResult.interest_to_date
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Total Interest
                      </span>
                      <span className="font-medium">
                        {formatCurrency2Decimals(
                          calculationResult.total_interest_accrued
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-sm">
                        Days
                      </span>
                      <span className="font-medium">
                        {calculationResult.days}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 border-t pt-4">
                      <span className="font-bold text-base">GRAND TOTAL</span>
                      <span className="font-bold text-green-600 text-lg">
                        {formatCurrency2Decimals(calculationResult.total_due)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  Click "Calculate" to see results
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading || isCalculating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleCalculate}
              disabled={isLoading || isCalculating}
            >
              {isCalculating || isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {savedCalculationId
                    ? "Updating..."
                    : "Calculating & Saving..."}
                </>
              ) : savedCalculationId ? (
                "Recalculate & Update"
              ) : (
                "Calculate & Save"
              )}
            </Button>
            {calculationResult && (
              <Button
                type="submit"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                disabled={isLoading || isCalculating}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewCase;
