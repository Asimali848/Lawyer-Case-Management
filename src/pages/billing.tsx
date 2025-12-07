import { useState } from "react";
import { Check, Sparkles, Box, Rocket, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Billing = () => {
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

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
      buttonText: "Upgrade",
      buttonVariant: "default" as const,
      isPopular: false,
      isCurrent: false,
      bgColor: "bg-white",
      textColor: "text-gray-900",
      borderColor: "border-gray-200",
      iconColor: "text-green-600",
    },
    {
      id: "pro",
      name: "Pro",
      subtitle: "For Big Law Firms",
      price: "$20",
      priceLabel: "/mo",
      priceSubtext: "$180 Per Year (save 25%)",
      icon: Rocket,
      features: [
        "Unlimited Cases",
        "$180 Per Year (save 25%)",
        "Priority Support",
      ],
      buttonText: "Current Plan",
      buttonVariant: "default" as const,
      isPopular: true,
      isCurrent: true,
      bgColor: "bg-primary",
      textColor: "text-white",
      borderColor: "border-green-600",
      iconColor: "text-white",
    },
  ];

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // Handle coupon application logic here
      console.log("Applying coupon:", couponCode);
    }
  };

  return (
    <div className="h-full w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Green Banner - Dismissible with Marquee */}
        {showBanner && (
          <div className="mb-8 flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-4 py-3 text-white sm:px-6">
            <Sparkles className="size-5 shrink-0" />
            <div className="flex-1 overflow-hidden">
              <div className="relative">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="inline-block text-sm font-medium sm:text-base">
                    Good news! Your coupon is still active for 2 more weeks. To keep
                    adding cases without interruption, activate your paid plan before it
                    expires. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Choose Your Plan
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            Select the perfect plan for your law firm. Upgrade or downgrade at
            any time.
          </p>
        </div>

        {/* Coupon Section */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          {!showCouponInput ? (
            <Button
              variant="outline"
              onClick={() => setShowCouponInput(true)}
              className="w-full border-primary bg-primary text-white hover:bg-primary/90 sm:w-auto"
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
                variant="ghost"
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
                      className={`size-8 ${plan.isCurrent ? "text-white" : "text-primary"}`}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-bold ${plan.textColor} sm:text-3xl`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      plan.isCurrent ? "text-green-50" : "text-gray-600"
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
                            plan.isCurrent ? "text-green-50" : "text-gray-600"
                          }`}
                        >
                          {plan.priceLabel}
                        </span>
                      )}
                    </div>
                    {plan.priceSubtext && (
                      <p
                        className={`mt-1 text-sm ${
                          plan.isCurrent ? "text-green-50" : "text-gray-600"
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
                        plan.isCurrent ? "text-white" : "text-gray-900"
                      }`}
                    >
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3"
                        >
                          <Check
                            className={`mt-0.5 size-5 shrink-0 ${
                              plan.isCurrent ? "text-white" : "text-green-600"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              plan.isCurrent ? "text-white" : "text-gray-700"
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
                      plan.isCurrent
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                    disabled={plan.isCurrent}
                  >
                    {plan.buttonText}
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
