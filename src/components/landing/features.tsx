import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers3,
  Link2,
  ReceiptText,
  Scale,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    number: "01",
    icon: Calculator,
    title: "Accurate Judgment Interest Calculations",
    description:
      "Calculate judgment interest automatically with accurate, up-to-date balances. Reduce manual calculations and keep every judgment account compliant and organized.",
  },
  {
    number: "02",
    icon: ReceiptText,
    title: "Track Payments & Costs",
    description:
      "Record payments, credits, enforcement costs, and other transactions in one place. Your judgment balance updates automatically after every entry.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Generate Payoff Demand Letters",
    description:
      "Create professional payoff demand letters using your latest case information. Provide accurate payoff amounts without manual calculations.",
  },
  {
    number: "04",
    icon: Link2,
    title: "Client Share with Real-Time Updates",
    description:
      "Give clients secure, read-only access to their judgment balance through a unique shareable link. They can view the latest payoff information anytime without requesting updates.",
  },
  {
    number: "05",
    icon: Layers3,
    title: "Unlimited Cases & Transactions",
    description:
      "Manage unlimited judgment cases and record as many transactions as needed. Keep all your case information securely stored and easily accessible.",
  },
  {
    number: "06",
    icon: Scale,
    title: "Built by an Attorney for Attorneys",
    description:
      "Developed by an attorney with over 30 years of litigation and judgment enforcement experience, JudgmentCalc is built around real legal workflows to help attorneys work faster and more accurately.",
    featured: true,
  },
];

const Features = () => {
  const reduceMotion = useReducedMotion();
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [focusedFeature, setFocusedFeature] = useState<number | null>(null);
  const glowX = useMotionValue(-500);
  const glowY = useMotionValue(-500);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}px ${glowY}px, rgba(16, 185, 129, 0.10), transparent 72%)`;

  return (
    <div className="relative w-full overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      <div className="absolute -right-32 top-24 size-96 rounded-full bg-emerald-50 blur-3xl" />
      <div className="absolute -left-40 bottom-12 size-96 rounded-full bg-amber-50/80 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="group/header relative flex flex-col overflow-hidden rounded-3xl px-1 py-2"
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            glowX.set(event.clientX - bounds.left);
            glowY.set(event.clientY - bounds.top);
          }}
          onMouseLeave={() => {
            glowX.set(-500);
            glowY.set(-500);
          }}
        >
          <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/header:opacity-100" style={{ background: glow }} />
          <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="relative flex flex-col items-center text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-primary transition-all duration-500 group-hover/header:w-16" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">A complete collection workspace</p>
            </div>
            <h2 className="max-w-4xl text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-slate-950">
              Features Built for <span className="relative text-primary after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-emerald-300 after:transition-transform after:duration-500 group-hover/header:after:scale-x-100">Judgment Enforcement</span>
            </h2>
          </motion.div>
          <motion.p
            layout
            className={`relative mx-auto mt-7 max-w-5xl text-center text-base leading-7 text-slate-600 transition-colors duration-300 group-hover/header:text-slate-700 sm:text-lg sm:leading-8 ${isIntroExpanded ? "line-clamp-none" : "line-clamp-4 sm:line-clamp-none"}`}
          >
            JudgmentCalc is trusted by attorneys who need an <span className="font-medium text-slate-700 transition-colors group-hover/header:text-emerald-700">accurate judgment interest calculator</span> and reliable judgment enforcement software. From calculating accrued interest to tracking payments and generating payoff demand letters, every feature is designed to simplify post-judgment collection while saving time and reducing manual errors.
          </motion.p>
          <button
            type="button"
            onClick={() => setIsIntroExpanded((current) => !current)}
            aria-expanded={isIntroExpanded}
            className="group/more relative mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 py-1.5 pl-4 pr-2 text-sm font-bold text-emerald-800 shadow-[0_8px_24px_rgba(15,23,42,0.07)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 sm:hidden"
          >
            {isIntroExpanded ? "Show less" : "Show more"}
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors group-hover/more:bg-emerald-600 group-hover/more:text-white">
              {isIntroExpanded ? <ChevronUp className="size-4" aria-hidden="true" /> : <ChevronDown className="size-4" aria-hidden="true" />}
            </span>
          </button>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isFocused = focusedFeature === index;

            return (
              <motion.article
                key={feature.title}
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.62, margin: "-6% 0px -6% 0px" }}
                transition={{ duration: 0.58, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                onFocus={() => setFocusedFeature(index)}
                onBlur={() => setFocusedFeature((current) => (current === index ? null : current))}
                onClick={() => setFocusedFeature((current) => (current === index ? null : index))}
                tabIndex={0}
                className={`group relative flex min-h-72 flex-col overflow-hidden rounded-3xl border p-6 transition-[border-color,box-shadow,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-7 ${
                  feature.featured
                    ? "border-emerald-700 bg-gradient-to-br from-emerald-700 via-emerald-700 to-emerald-800 text-white shadow-[0_24px_60px_rgba(5,150,105,0.2)]"
                    : isFocused
                      ? "-translate-y-1 border-emerald-300 bg-emerald-50/40 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                      : "border-slate-200/90 bg-white text-slate-950 shadow-[0_14px_42px_rgba(15,23,42,0.06)] hover:border-emerald-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
                }`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.featured ? "from-amber-300 via-emerald-200 to-transparent" : "from-emerald-500 via-emerald-300 to-transparent"}`} />
                <div className={`absolute -right-20 -top-20 size-52 rounded-full border transition-transform duration-500 group-hover:scale-110 ${feature.featured ? "border-white/10 bg-white/[0.04]" : "border-emerald-100 bg-emerald-50/60"}`} />

                <div className="relative flex items-start justify-between gap-4">
                  <span className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105 ${feature.featured ? "bg-white/15 text-emerald-100" : isFocused ? "-rotate-3 scale-105 bg-emerald-600 text-white shadow-lg shadow-emerald-900/15" : "bg-emerald-50 text-emerald-700"}`}>
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className={`text-xs font-bold tracking-[0.18em] ${feature.featured ? "text-emerald-200" : "text-slate-400"}`}>FEATURE {feature.number}</span>
                </div>

                <h3 className="relative mt-8 max-w-sm text-xl font-bold leading-7 tracking-[-0.025em] sm:text-2xl sm:leading-8">
                  {feature.title}
                </h3>
                <p className={`relative mt-4 text-sm leading-7 sm:text-base ${feature.featured ? "text-emerald-50/85" : "text-slate-600"}`}>
                  {feature.description}
                </p>

                <div className={`relative mt-auto flex items-center justify-start border-t pt-5 ${feature.featured ? "border-white/15" : "border-slate-200"}`}>
                  <span className={`text-xs font-bold uppercase tracking-[0.12em] ${feature.featured ? "text-emerald-200" : "text-emerald-700"}`}>
                    Built into your workflow
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
