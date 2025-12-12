import { useState, useEffect } from "react";
import { Check, Sparkles, Box, Rocket, Tag, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useGetSubscriptionStatusQuery,
  useGetAvailablePlansQuery,
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
} from "@/store/services/subscription";

type BillingInterval = "monthly" | "yearly";

const Billing = () => {
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("monthly");

  // Fetch subscription status
  const {
    data: subscriptionStatus,
    isLoading: isLoadingStatus,
    refetch,
  } = useGetSubscriptionStatusQuery();

  // Fetch available plans from Stripe
  const { data: plansData, isLoading: isLoadingPlans } =
    useGetAvailablePlansQuery();

  const [createCheckoutSession, { isLoading: isCreatingCheckout }] =
    useCreateCheckoutSessionMutation();
  const [createPortalSession, { isLoading: isCreatingPortal }] =
    useCreatePortalSessionMutation();

  // Check URL for session_id (after successful checkout)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
      toast.success("Payment successful! Your subscription has been upgraded.");
      // Remove session_id from URL
      window.history.replaceState({}, "", window.location.pathname);
      // Refetch subscription status
      refetch();
    }
  }, [refetch]);

  // Determine if user is on premium plan
  const isPremium = subscriptionStatus?.subscription_type === "premium";
  const isFree = subscriptionStatus?.subscription_type === "free";

  // Get pricing from Stripe plans
  const monthlyPlan = plansData?.plans?.monthly;
  const yearlyPlan = plansData?.plans?.yearly;

  // Calculate savings for yearly plan
  const yearlySavings =
    monthlyPlan && yearlyPlan
      ? Math.round(
          ((monthlyPlan.amount * 12 - yearlyPlan.amount) /
            (monthlyPlan.amount * 12)) *
            100
        )
      : 25;

  const plans = [
    {
      id: "starter",
      name: "Starter",
      subtitle: "For growing law firms",
      price: "Free",
      priceLabel: "",
      icon: Box,
      features: [
        "Basic Support",
        "No Usage Limit",
        "2 Week free trial",
        "No Credit Card Required",
      ],
      buttonText: isFree ? "Current Plan" : "Downgrade",
      buttonVariant: "default" as const,
      isPopular: false,
      isCurrent: isFree,
      bgColor: isFree ? "bg-primary" : "bg-sidebar",
      textColor: isFree ? "text-white" : "text-muted-foreground",
      borderColor: isFree ? "border-green-600" : "border",
      iconColor: isFree ? "text-white" : "text-green-600",
    },
    {
      id: "pro",
      name: "Pro",
      subtitle: "For Big Law Firms",
      price:
        billingInterval === "monthly"
          ? monthlyPlan
            ? `$${monthlyPlan.amount}`
            : "$20"
          : yearlyPlan
          ? `$${yearlyPlan.amount}`
          : "$180",
      priceLabel: billingInterval === "monthly" ? "/mo" : "/year",
      priceSubtext:
        billingInterval === "yearly"
          ? `Save ${yearlySavings}% with annual billing`
          : undefined,
      icon: Rocket,
      features: [
        "Unlimited Cases",
        billingInterval === "yearly"
          ? `$${
              yearlyPlan ? yearlyPlan.amount : 180
            } Per Year (save ${yearlySavings}%)`
          : `$${monthlyPlan ? monthlyPlan.amount : 20} Per Month`,
        "Priority Support",
      ],
      buttonText: isPremium ? "Manage Subscription" : "Upgrade to Pro",
      buttonVariant: "default" as const,
      isPopular: true,
      isCurrent: isPremium,
      bgColor: isPremium ? "bg-primary" : "bg-sidebar",
      textColor: isPremium ? "text-white" : "text-muted-foreground",
      borderColor: isPremium ? "border-green-600" : "border",
      iconColor: isPremium ? "text-white" : "text-green-600",
      priceId:
        billingInterval === "monthly"
          ? monthlyPlan?.price_id
          : yearlyPlan?.price_id,
    },
  ];

  const handleUpgradeToPro = async (priceId: string | null | undefined) => {
    if (!priceId) {
      toast.error("Price information not available. Please try again later.");
      return;
    }

    try {
      const currentUrl = window.location.origin + window.location.pathname;
      const checkoutData: any = {
        price_id: priceId,
        success_url: `${currentUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: currentUrl,
      };

      // Include coupon if available
      if (couponCode.trim()) {
        checkoutData.coupon_id = couponCode.trim();
      }

      const result = await createCheckoutSession(checkoutData).unwrap();

      // Redirect to Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      console.error("Failed to create checkout session:", error);
      toast.error(error?.data?.detail || "Failed to start checkout process");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const currentUrl = window.location.origin + window.location.pathname;
      const result = await createPortalSession({
        return_url: currentUrl,
      }).unwrap();

      // Redirect to Stripe Customer Portal
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      console.error("Failed to create portal session:", error);
      toast.error(error?.data?.detail || "Failed to open customer portal");
    }
  };

  const handlePlanAction = (plan: (typeof plans)[number]) => {
    if (plan.id === "pro") {
      if (isPremium) {
        // Manage subscription via Stripe Portal
        handleManageSubscription();
      } else {
        // Upgrade to premium
        handleUpgradeToPro(plan.priceId);
      }
    } else if (plan.id === "starter" && isPremium) {
      // Downgrade via Stripe Portal
      handleManageSubscription();
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.success("Coupon code saved! It will be applied at checkout.");
    } else {
      toast.error("Please enter a coupon code");
    }
  };

  if (isLoadingStatus || isLoadingPlans) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full w-full md:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Green Banner - Dismissible with Marquee */}
        {showBanner && !isPremium && (
          <div className="mb-8 flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-4 py-3 text-white sm:px-6">
            {/* <Sparkles className="size-5 shrink-0" /> */}
            <div className="flex-1 overflow-hidden">
              <div className="relative">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="text-sm font-medium sm:text-base flex items-center">
                    <Sparkles className="size-5 shrink-0 mr-2 text-chart-4 dark:text-chart-3" />{" "}
                    Good news! Your coupon is still active for 2 more weeks. To
                    keep adding cases without interruption, activate your paid
                    plan before it expires. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="ml-2 shrink-0 rounded p-1 hover:bg-primary/90 transition-colors z-10"
              aria-label="Dismiss banner"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-5 text-center">
          <h1 className="mb-2 text-3xl font-bold  sm:text-4xl lg:text-5xl">
            Choose Your Plan
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Select the perfect plan for your law firm. Upgrade or downgrade at
            any time.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-lg border border-border bg-sidebar p-1">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
                billingInterval === "monthly"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("yearly")}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
                billingInterval === "yearly"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              {yearlyPlan && (
                <span className="ml-2 text-xs">(Save {yearlySavings}%)</span>
              )}
            </button>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          {!showCouponInput ? (
            <Button
              variant="outline"
              onClick={() => setShowCouponInput(true)}
              className="w-full border-primary bg-primary text-white hover:bg-primary/90 sm:w-auto cursor-pointer"
            >
              <Tag className="mr-2 size-4" />
              Have a coupon code?
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleApplyCoupon}
                className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto"
              >
                Apply Coupon
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCouponInput(false);
                  setCouponCode("");
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col overflow-hidden border-2 transition-all hover:shadow-lg ${
                  plan.isCurrent
                    ? `${plan.bgColor} ${plan.borderColor}`
                    : `${plan.bgColor} ${plan.borderColor}`
                }`}
              >
                {/* Badges */}
                {plan.isPopular && (
                  <div className="absolute left-0 top-0 bg-primary px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                {plan.isCurrent && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                    Current Plan
                  </div>
                )}

                <CardHeader className="flex flex-col items-center pb-4 pt-8 text-center">
                  <div
                    className={`mb-4 flex size-16 items-center justify-center rounded-lg ${
                      plan.isCurrent ? "bg-primary" : "bg-green-50"
                    }`}
                  >
                    <Icon
                      className={`size-8 ${
                        plan.isCurrent ? "text-white" : "text-primary"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-bold ${plan.textColor} sm:text-3xl`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      plan.isCurrent ? "text-green-50" : "text-muted-foreground"
                    }`}
                  >
                    {plan.subtitle}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col px-6 pb-6">
                  {/* Pricing */}
                  <div className="mb-6 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span
                        className={`text-4xl font-bold ${plan.textColor} sm:text-5xl`}
                      >
                        {plan.price}
                      </span>
                      {plan.priceLabel && (
                        <span
                          className={`text-lg ${
                            plan.isCurrent
                              ? "text-green-50"
                              : "text-muted-foreground"
                          }`}
                        >
                          {plan.priceLabel}
                        </span>
                      )}
                    </div>
                    {plan.priceSubtext && (
                      <p
                        className={`mt-1 text-sm ${
                          plan.isCurrent
                            ? "text-green-50"
                            : "text-muted-foreground"
                        }`}
                      >
                        {plan.priceSubtext}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="mb-6 flex-1">
                    <h4
                      className={`mb-4 text-sm font-semibold ${
                        plan.isCurrent ? "text-white" : "text-muted-foreground"
                      }`}
                    >
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check
                            className={`mt-0.5 size-5 shrink-0 ${
                              plan.isCurrent ? "text-white" : "text-primary"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              plan.isCurrent
                                ? "text-white"
                                : "text-muted-foreground"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full ${
                      plan.isCurrent && plan.id === "starter"
                        ? "bg-white text-primary hover:bg-primary/90 cursor-pointer  border border-muted-foreground"
                        : plan.isCurrent && plan.id === "pro"
                        ? "bg-white text-primary hover:bg-white/90 cursor-pointer border border-white"
                        : "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                    }`}
                    disabled={
                      (plan.isCurrent && plan.id === "starter") ||
                      isCreatingCheckout ||
                      isCreatingPortal
                    }
                    onClick={() => handlePlanAction(plan)}
                  >
                    {isCreatingCheckout || isCreatingPortal ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Billing;
