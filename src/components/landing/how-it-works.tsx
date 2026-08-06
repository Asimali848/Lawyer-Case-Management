import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Check, ChevronDown, ChevronUp, FileCheck2, ReceiptText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    label: "Step 1",
    icon: BriefcaseBusiness,
    title: "Create Your Judgment Case",
    description:
      "Start by entering your judgment details, including the principal amount, judgment date, interest rate, and other case information. JudgmentCalc securely stores your data and prepares your case for accurate tracking.",
  },
  {
    number: "02",
    label: "Step 2",
    icon: ReceiptText,
    title: "Record Payments & Costs",
    description:
      "Add payments, credits, enforcement costs, and other transactions as they occur. Every update automatically recalculates accrued interest and your judgment balance, ensuring your records stay current.",
  },
  {
    number: "03",
    label: "Step 3",
    icon: FileCheck2,
    title: "Generate Accurate Payoff Information",
    description:
      "View real-time balances, calculate accrued interest, and generate professional payoff demand letters whenever you need them. Share accurate payoff information with clients confidently.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);

  return (
    <section className="relative w-full overflow-hidden border-y border-slate-200/80 bg-[#f8faf9] py-14 sm:py-16 lg:py-20">
      <div className="absolute -left-32 top-16 size-96 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="absolute -right-32 bottom-16 size-96 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-primary" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">Three simple steps</p>
            <span className="h-px w-10 bg-primary" aria-hidden="true" />
          </div>
          <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-slate-950">
            How <span className="text-primary">JudgmentCalc</span> Works
          </h2>
          <motion.p
            layout
            className={`mx-auto mt-6 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 ${isIntroExpanded ? "line-clamp-none" : "line-clamp-4 sm:line-clamp-none"}`}
          >
            Getting started with JudgmentCalc is simple. Create your judgment case, record payments and costs, and let our judgment interest calculator automatically keep your balances accurate. Spend less time on manual calculations and more time serving your clients.
          </motion.p>
          <button
            type="button"
            onClick={() => setIsIntroExpanded((current) => !current)}
            aria-expanded={isIntroExpanded}
            className="group mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 py-1.5 pl-4 pr-2 text-sm font-bold text-emerald-800 shadow-[0_8px_24px_rgba(15,23,42,0.07)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 sm:hidden"
          >
            {isIntroExpanded ? "Show less" : "Show more"}
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              {isIntroExpanded ? <ChevronUp className="size-4" aria-hidden="true" /> : <ChevronDown className="size-4" aria-hidden="true" />}
            </span>
          </button>
        </motion.div>

        <div className="relative mt-12 lg:mt-16">
          <div className="mx-auto mb-10 hidden max-w-5xl px-8 lg:block" aria-label={`Workflow progress: step ${activeStep + 1} of 3`}>
            <div className="relative h-10">
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200/80 shadow-inner">
                <motion.div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-300 shadow-[0_0_16px_rgba(16,185,129,0.45)]"
                  animate={{ scaleX: activeStep / 2 }}
                  transition={{ type: "spring", stiffness: 180, damping: 26 }}
                />
              </div>

              {steps.map((step, index) => {
                const isComplete = index < activeStep;
                const isCurrent = index === activeStep;

                return (
                  <motion.button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4"
                    style={{ left: `${index * 50}%` }}
                    aria-label={`Go to ${step.label}: ${step.title}`}
                    whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                  >
                    {isCurrent && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-emerald-400/25"
                        animate={reduceMotion ? undefined : { scale: [1, 1.7, 1.7], opacity: [0.55, 0, 0] }}
                        transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                      />
                    )}
                    <span className={`relative flex size-9 items-center justify-center rounded-full border-4 border-[#f8faf9] text-[11px] font-black shadow-md transition-all duration-300 ${
                      isCurrent
                        ? "bg-primary text-white shadow-emerald-900/20"
                        : isComplete
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-white text-slate-400"
                    }`}>
                      {isComplete ? <Check className="size-4" strokeWidth={2.8} /> : index + 1}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              const isComplete = index < activeStep;

              return (
                <motion.button
                  key={step.title}
                  type="button"
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.62, margin: "-6% 0px -6% 0px" }}
                  transition={{ duration: 0.58, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduceMotion ? undefined : { y: -5 }}
                  onViewportEnter={() => {
                    if (window.matchMedia("(max-width: 1023px)").matches) setActiveStep(index);
                  }}
                  onClick={() => setActiveStep(index)}
                  onMouseEnter={() => setActiveStep(index)}
                  onFocus={() => setActiveStep(index)}
                  className={`group relative flex min-h-72 flex-col rounded-3xl border p-6 text-left transition-[background-color,border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-7 ${
                    isActive
                      ? "-translate-y-1 border-emerald-300 bg-white shadow-[0_26px_68px_rgba(15,23,42,0.13)] ring-1 ring-emerald-100"
                      : "border-slate-200 bg-white/70 shadow-[0_12px_38px_rgba(15,23,42,0.05)] hover:border-emerald-200 hover:bg-white"
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <span className={`flex size-16 items-center justify-center rounded-2xl border-4 border-[#f8faf9] transition-all duration-300 ${isActive ? "bg-primary text-white shadow-lg shadow-emerald-900/20" : isComplete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {isComplete ? <Check className="size-6" strokeWidth={2.5} /> : <Icon className="size-6" strokeWidth={1.8} />}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-[0.18em] ${isActive ? "text-emerald-700" : "text-slate-400"}`}>{step.label}</span>
                  </div>

                  <span className={`mt-7 text-5xl font-black tracking-[-0.06em] transition-colors ${isActive ? "text-emerald-100" : "text-slate-100"}`} aria-hidden="true">
                    {step.number}
                  </span>
                  <h3 className="mt-1 text-xl font-bold leading-7 tracking-[-0.025em] text-slate-950 sm:text-2xl sm:leading-8">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{step.description}</p>

                  <div className={`mt-auto flex items-center gap-2 border-t pt-5 text-xs font-bold uppercase tracking-[0.11em] transition-colors ${isActive ? "border-emerald-100 text-emerald-700" : "border-slate-200 text-slate-500"}`}>
                    <span className={`size-2 rounded-full ${isActive ? "bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]" : "bg-slate-300"}`} />
                    {isActive ? "Current step" : "Explore step"}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10 overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] sm:px-8 sm:py-8 lg:mt-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-10"
        >
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/15 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-sm">Ready to get started?</p>
            <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Ready to Simplify Judgment Management?</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Join attorneys who use JudgmentCalc to save time, improve accuracy, and manage post-judgment cases with confidence.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => navigate("/signup")}
            className="group relative mt-7 h-13 w-full gap-1.5 rounded-xl bg-emerald-500 px-3 text-[clamp(0.78rem,3.7vw,0.95rem)] font-bold text-white shadow-[0_14px_35px_rgba(16,185,129,0.25)] hover:bg-emerald-400 sm:gap-2 sm:px-7 sm:text-base lg:mt-0 lg:w-auto"
          >
            Start Your Free 30-Day Trial
            <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1 sm:size-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
