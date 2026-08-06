import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Crown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Free Trial", price: "$0", period: "for 30 days", action: "Start Free Trial", description: "Explore the essential judgment tools with no credit card required." },
  { name: "Professional", price: "$12.50", period: "/ month", action: "Choose Professional", description: "A complete, unlimited workflow for active judgment-enforcement practices.", featured: true },
  { name: "Enterprise", price: "$20", period: "/ month", action: "Contact Our Team", description: "Advanced support, onboarding, and consultation for larger legal teams." },
];

const planHighlights = [
  ["30-day free trial", "No credit card required", "Judgment interest calculator", "Up to 5 judgment cases", "Unlimited transactions", "Payment & cost tracking", "Payoff demand letters", "Client share feature", "Secure cloud platform", "Automatic balance updates", "Regular software updates"],
  ["Judgment interest calculator", "Unlimited judgment cases", "Unlimited transactions", "Payment & cost tracking", "Payoff demand letters", "Client share feature", "Secure cloud platform", "Automatic balance updates", "Regular software updates", "Priority email support"],
  ["Everything in Professional", "Phone support", "Priority feature requests", "Dedicated account manager", "Personalized onboarding", "Recorded training session", "Custom workflow consultation","Legal Assistant with AI"],
];

const Pricingplan = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [selectedPlan, setSelectedPlan] = useState(1);

  const handlePlanAction = (planIndex: number) => {
    if (planIndex === 2) {
      navigate("/contact-us");
      return;
    }
    navigate("/signup");
  };

  return (
    <div className="relative w-full overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="absolute -left-36 top-40 size-96 rounded-full bg-emerald-50 blur-3xl" />
      <div className="absolute -right-32 bottom-24 size-96 rounded-full bg-amber-50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-primary" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">Simple, transparent options</p>
            <span className="h-px w-10 bg-primary" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-slate-950">
            Pricing <span className="text-primary">Plan</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Compare every capability and choose the level of support that fits your judgment-enforcement practice.
          </p>
        </motion.div>

        <div className="sticky top-20 z-20 mt-10 grid grid-cols-3 rounded-2xl border border-slate-200/90 bg-slate-100/90 p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
          {plans.map((plan, index) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => setSelectedPlan(index)}
              className={`relative min-h-12 rounded-xl px-2 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                selectedPlan === index ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
              aria-pressed={selectedPlan === index}
            >
              {plan.name}
              {plan.featured && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-amber-400" aria-hidden="true" />}
            </button>
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 grid gap-5 md:mt-12 md:grid-cols-3 lg:mt-16"
        >
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              whileHover={reduceMotion ? undefined : { y: -7 }}
              className={`relative min-h-[540px] flex-col overflow-hidden rounded-3xl border p-6 transition-[border-color,box-shadow] duration-300 md:flex lg:p-7 ${selectedPlan === index ? "flex" : "hidden"} ${
                plan.featured
                  ? "border-emerald-400 bg-gradient-to-b from-emerald-50/80 to-white shadow-[0_28px_75px_rgba(5,150,105,0.16)]"
                  : "border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] hover:border-emerald-200 hover:shadow-[0_26px_70px_rgba(15,23,42,0.11)]"
              }`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${plan.featured ? "bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-300" : "bg-gradient-to-r from-slate-200 via-emerald-200 to-transparent"}`} />
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-bold text-slate-950">{plan.name}</p>
                {plan.featured && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-white shadow-md shadow-emerald-900/15 min-[390px]:px-3 min-[390px]:text-[10px] min-[390px]:tracking-[0.08em]">
                    <Crown className="size-3" /> Most popular
                  </span>
                )}
              </div>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-[-0.055em] text-slate-950">{plan.price}</span>
                <span className="pb-1.5 text-sm text-slate-500">{plan.period}</span>
              </div>
              <p className="mt-5 min-h-20 text-sm leading-7 text-slate-600 lg:text-base">{plan.description}</p>

              <Button
                type="button"
                variant={plan.featured ? "default" : "outline"}
                onClick={() => handlePlanAction(index)}
                className={`mt-5 h-12 w-full rounded-xl text-sm font-bold ${plan.featured ? "text-white shadow-lg shadow-emerald-900/15" : "border-slate-300 bg-white text-slate-800"}`}
              >
                {plan.action} <ArrowRight className="size-4" />
              </Button>

              <div className="my-7 h-px bg-slate-200" />
              <p className="text-sm font-bold text-slate-900">{index === 0 ? "Trial includes:" : index === 1 ? "Everything you need:" : "Advanced support includes:"}</p>
              <ul className="mt-5 space-y-3.5">
                {planHighlights[index].map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                    <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${plan.featured ? "bg-primary text-white" : "bg-emerald-50 text-emerald-700"}`}>
                      <Check className="size-3" strokeWidth={2.7} />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default Pricingplan;
