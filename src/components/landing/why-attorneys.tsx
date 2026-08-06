import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calculator, Check, ChevronDown, ChevronUp, FileCheck2, FolderClock } from "lucide-react";
import { useState } from "react";

const benefits = [
  {
    number: "01",
    icon: Calculator,
    title: "Accurate calculations",
    description: "Calculate accrued judgment interest using the case, payment, and cost information already recorded.",
    outcome: "Reduce manual calculation errors",
  },
  {
    number: "02",
    icon: FolderClock,
    title: "Organized records",
    description: "Keep judgment balances, transaction history, costs, and case activity together in one clear workspace.",
    outcome: "Keep every account easier to review",
  },
  {
    number: "03",
    icon: FileCheck2,
    title: "Reliable tracking",
    description: "Follow each judgment account confidently and prepare accurate payoff demand information when needed.",
    outcome: "Move from judgment entry to payoff",
  },
];

const WhyAttorneys = () => {
  const [activeBenefit, setActiveBenefit] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden border-y border-slate-200/80 bg-[#f8faf9] py-14 sm:py-16 lg:py-20">
      <div className="absolute -left-32 top-0 size-96 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-amber-100/45 blur-3xl" />
      <div className="absolute left-1/2 top-12 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-primary" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">Purpose-built for attorneys</p>
            <span className="h-px w-10 bg-primary" aria-hidden="true" />
          </div>

          <h2 className="text-3xl font-bold leading-[1.1] tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Why Attorneys Choose <span className="text-primary">JudgmentCalc</span>
          </h2>

          <motion.p
            layout
            className={`mx-auto mt-6 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 ${isDescriptionExpanded ? "line-clamp-none" : "line-clamp-4 sm:line-clamp-none"}`}
          >
            Managing post-judgment cases requires <strong className="font-semibold text-slate-800">accurate calculations</strong>, organized records, and reliable tracking. JudgmentCalc is a cloud-based judgment interest software designed for attorneys who handle judgment enforcement and post-judgment collection matters. From calculating accrued interest to tracking payments and generating payoff demand letters, our platform helps you manage every judgment account with confidence while reducing manual work and calculation errors.
          </motion.p>

          <button
            type="button"
            onClick={() => setIsDescriptionExpanded((current) => !current)}
            aria-expanded={isDescriptionExpanded}
            className="group mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 py-1.5 pl-4 pr-2 text-sm font-bold text-emerald-800 shadow-[0_8px_24px_rgba(15,23,42,0.07)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 sm:hidden"
          >
            {isDescriptionExpanded ? "Show less" : "Show more"}
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              {isDescriptionExpanded ? <ChevronUp className="size-4" aria-hidden="true" /> : <ChevronDown className="size-4" aria-hidden="true" />}
            </span>
          </button>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col gap-4 lg:mt-14 lg:flex-row"
          onMouseLeave={() => setActiveBenefit(null)}
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isActive = activeBenefit === index;
            const hasActiveBenefit = activeBenefit !== null;

            return (
              <motion.button
                key={benefit.title}
                type="button"
                onClick={() => setActiveBenefit(isActive ? null : index)}
                onMouseEnter={() => setActiveBenefit(index)}
                onFocus={() => setActiveBenefit(index)}
                onViewportEnter={() => {
                  if (window.matchMedia("(max-width: 1023px)").matches) setActiveBenefit(index);
                }}
                onViewportLeave={() => {
                  if (window.matchMedia("(max-width: 1023px)").matches) {
                    setActiveBenefit((current) => (current === index ? null : current));
                  }
                }}
                viewport={{ amount: 0.62, margin: "-6% 0px -6% 0px" }}
                whileInView={reduceMotion ? undefined : { y: -4 }}
                layout
                transition={{ layout: { type: "spring", stiffness: 260, damping: 30 }, y: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                className={`group relative min-h-60 overflow-hidden rounded-3xl border p-6 text-left transition-[background-color,border-color,box-shadow,flex] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-7 lg:min-h-72 ${
                  isActive
                    ? "border-emerald-300 bg-slate-950 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)] lg:flex-[1.35]"
                    : `border-slate-200 bg-white/85 text-slate-950 shadow-[0_14px_42px_rgba(15,23,42,0.06)] hover:border-emerald-200 hover:bg-white lg:flex-1 ${hasActiveBenefit ? "lg:opacity-80" : ""}`
                }`}
                aria-pressed={isActive}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${isActive ? "from-emerald-400 via-emerald-300 to-amber-300" : "from-emerald-500/70 via-emerald-200 to-transparent"}`} />
                <div className={`absolute -right-16 -top-16 size-44 rounded-full border transition-all duration-500 ${isActive ? "scale-110 border-emerald-400/20 bg-emerald-400/10" : "border-emerald-100 bg-emerald-50/60"}`} />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <span className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/20" : "bg-emerald-50 text-emerald-700"}`}>
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className={`text-xs font-bold tracking-[0.18em] ${isActive ? "text-emerald-300" : "text-slate-400"}`}>BENEFIT {benefit.number}</span>
                  </div>

                  <h3 className="mt-8 text-xl font-bold tracking-[-0.02em] sm:text-2xl">{benefit.title}</h3>
                  <p className={`mt-3 max-w-md text-sm leading-7 transition-colors sm:text-base ${isActive ? "text-slate-300" : "text-slate-600"}`}>
                    {benefit.description}
                  </p>

                  <div className="mt-auto pt-7">
                    <div className={`flex items-center justify-between gap-4 border-t pt-5 ${isActive ? "border-white/10" : "border-slate-200"}`}>
                      <span className={`flex items-center gap-2 text-xs font-bold sm:text-sm ${isActive ? "text-emerald-300" : "text-slate-700"}`}>
                        <span className={`flex size-6 items-center justify-center rounded-full ${isActive ? "bg-emerald-400 text-slate-950" : "bg-emerald-50 text-emerald-700"}`}>
                          <Check className="size-3.5" strokeWidth={2.5} />
                        </span>
                        {benefit.outcome}
                      </span>
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${isActive ? "rotate-45 bg-white/10 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-primary"}`}>
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <p className="mt-5 text-center text-xs font-medium text-slate-500 sm:text-sm">
          Hover or select a benefit to explore
        </p>
      </div>
    </section>
  );
};

export default WhyAttorneys;
