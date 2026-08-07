import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Calculator, Check, Cloud, FileSpreadsheet, Infinity, Lightbulb, ReceiptText, RefreshCcw, Scale, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { setMeta } from "@/lib/seo";

const storyChapters = [
  {
    icon: Scale,
    label: "The practice",
    title: "Three decades in judgment enforcement",
    description: "For more than three decades, Kyle has represented clients in business litigation, creditors' rights, and judgment enforcement matters. Throughout his career, he managed countless judgment cases that required accurate interest calculations, payment tracking, and detailed records.",
  },
  {
    icon: Calculator,
    label: "The limitation",
    title: "Simple calculations became complex workflows",
    description: "Like many attorneys in California, he initially relied on the court's free judgment interest calculator. While it worked for simple calculations, it became frustrating whenever a case involved recurring payments, additional costs, or long-term judgment enforcement.",
  },
  {
    icon: RefreshCcw,
    label: "The friction",
    title: "Every update meant starting over",
    description: "Each update required starting over from the beginning. There was no simple way to save a case, track payments over time, or maintain an accurate running balance.",
  },
  {
    icon: FileSpreadsheet,
    label: "The solution",
    title: "A practical system built for real casework",
    description: "To solve this problem, Kyle built his own spreadsheet that automatically calculated judgment interest while allowing him to save every case, record payments, and update balances whenever new activity occurred.",
  },
  {
    icon: Lightbulb,
    label: "The turning point",
    title: "A personal solution became essential",
    description: "What started as a personal solution quickly became an essential tool in his legal practice.",
  },
];

const AboutUs = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  useEffect(() => {
    setMeta({
      title: "About Us | JudgmentCalc",
      description:
        "Learn the story behind JudgmentCalc, attorney-built judgment interest software designed to help attorneys calculate interest, manage judgment cases, and simplify judgment enforcement.",
    });
  }, []);

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-[#f8faf9]">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_15%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(245,158,11,0.1),transparent_24%)]" />
          <div className="absolute left-1/2 top-14 -z-10 size-[34rem] -translate-x-1/2 rounded-full border border-emerald-200/35" />
          <div className="absolute left-1/2 top-32 -z-10 size-[24rem] -translate-x-1/2 rounded-full border border-emerald-100/60" />

          <div className="mx-auto w-full max-w-[1280px] px-5 pb-14 pt-14 sm:px-8 sm:pb-18 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24 xl:px-12">
            <motion.div {...reveal()} className="mx-auto max-w-5xl text-center">
              <div className="mb-6 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-emerald-600" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800 sm:text-sm">About JudgmentCalc</p>
                <span className="size-1.5 rotate-45 bg-amber-400" aria-hidden="true" />
              </div>

              <h1 className="text-[clamp(2.6rem,6.4vw,5.8rem)] font-extrabold leading-[0.98] tracking-[-0.06em] text-slate-950">
                Built <span className="mr-1.5 sm:mr-2">by</span> an attorney. <span className="block text-emerald-700 mt-2">Built for attorneys.</span>
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                At JudgmentCalc, we believe legal professionals deserve software that understands the real challenges of judgment enforcement. That&apos;s why JudgmentCalc was created by an attorney—not a software company.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild className="group h-13 rounded-xl px-7 text-base font-bold text-white shadow-[0_14px_34px_rgba(5,150,105,0.24)]">
                  <Link to="/signup">
                    Start your free trial <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-13 rounded-xl border-slate-300 bg-white/80 px-7 text-base font-bold text-slate-800 shadow-sm backdrop-blur-sm">
                  <Link to="/contact-us">Talk to our team</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div {...reveal(0.1)} className="mx-auto mt-12 grid max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:grid-cols-3">
              {[
                ["Attorney-founded", "Built from real legal practice"],
                ["30+ years", "Business litigation experience"],
                ["One mission", "Clarity in judgment management"],
              ].map(([title, caption], index) => (
                <div key={title} className={`px-5 py-5 text-center ${index > 0 ? "border-t border-slate-200 sm:border-l sm:border-t-0" : ""}`}>
                  <p className="text-lg font-bold tracking-[-0.025em] text-slate-950">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{caption}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_92%_18%,rgba(251,191,36,0.08),transparent_24%)]" />
          <div className="relative mx-auto grid w-[calc(100%-2.5rem)] max-w-[1280px] grid-cols-1 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:w-[calc(100%-4rem)] lg:grid-cols-[0.72fr_1.28fr]">
            <motion.div {...reveal()} className="relative isolate min-w-0 w-full overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50/60 p-7 text-slate-950 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <div className="absolute -bottom-28 -right-24 -z-10 size-72 rounded-full border border-emerald-200/70" />
              <div className="absolute -bottom-16 -right-12 -z-10 size-48 rounded-full border border-emerald-200/70" />
              <div className="relative">
                <div className="relative flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Founder perspective</p>
                    <p className="mt-9 text-7xl font-extrabold leading-none tracking-[-0.07em] text-slate-950">30<span className="text-emerald-600">+</span></p>
                    <p className="mt-3 max-w-44 text-xs font-bold uppercase leading-5 tracking-[0.16em] text-slate-500">Years in legal practice</p>
                  </div>
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-700 shadow-[0_12px_30px_rgba(16,185,129,0.14)]">
                    <Scale className="size-6" strokeWidth={1.8} />
                  </span>
                </div>
                <blockquote className="mt-9 rounded-2xl border border-emerald-100 bg-white/80 p-5 text-base font-semibold leading-7 text-slate-700 shadow-sm backdrop-blur-sm">
                  &ldquo;The workflow was shaped in practice, before it ever became a product.&rdquo;
                </blockquote>
                <div className="relative mt-7 flex items-center gap-4 border-t border-emerald-100 pt-6">
                  <span className="flex size-11 items-center justify-center rounded-full bg-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10">K</span>
                  <div>
                    <p className="text-lg font-bold tracking-[-0.025em]">Kyle</p>
                    <p className="mt-0.5 text-sm text-slate-500">Founder &middot; Business litigation attorney</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal(0.08)} className="min-w-0 p-7 sm:p-10 lg:p-12 xl:px-14 xl:py-12">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 sm:text-sm">The founder story</p>
              </div>
              <h2 className="mt-6 max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[2.85rem]">Experience came first. <span className="text-emerald-700">The software followed.</span></h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-8">
                Founded by Kyle, a business litigation attorney with more than 30 years of legal experience, JudgmentCalc was built to simplify post-judgment collection, improve accuracy, and save valuable time for attorneys and law firms.
              </p>
              <div className="mt-9 border-t border-slate-200">
                {[
                  ["01", "Rooted in legal practice", "Built around the realities of post-judgment work."],
                  ["02", "Designed for accuracy", "Less manual effort, clearer balances, stronger confidence."],
                  ["03", "Focused on attorneys", "A purposeful workflow without unnecessary complexity."],
                ].map(([number, title, caption]) => (
                  <motion.div key={number} whileHover={{ x: 5, backgroundColor: "rgba(236, 253, 245, 0.65)" }} transition={{ duration: 0.2 }} className="group -mx-3 grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-xl border-b border-slate-200 px-3 py-4 last:border-b-0">
                    <span className="text-xs font-bold tracking-[0.16em] text-emerald-600">{number}</span>
                    <div className="min-w-0">
                      <p className="font-bold tracking-[-0.02em] text-slate-900 sm:text-lg">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{caption}</p>
                    </div>
                    <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white"><ArrowRight className="size-4" /></span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-slate-200/80 bg-white py-16 sm:py-20 lg:py-28">
          <div className="absolute -left-40 top-20 size-96 rounded-full bg-emerald-50 blur-3xl" />
          <div className="absolute -right-32 bottom-20 size-80 rounded-full bg-amber-50/80 blur-3xl" />
          <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
            <motion.div {...reveal()} className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 sm:text-sm">From practice to product</p>
                <span className="h-px w-10 bg-emerald-600" />
              </div>
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">The Story Behind <span className="text-emerald-700">JudgmentCalc</span></h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">A real legal workflow revealed a recurring problem and inspired a more dependable way to solve it.</p>
            </motion.div>

            <div className="relative mx-auto mt-12 max-w-5xl lg:mt-16">
              <div className="absolute bottom-10 left-2 top-10 z-0 w-0.5 origin-top rounded-full bg-gradient-to-b from-emerald-600 via-emerald-300 to-amber-300 shadow-[0_0_18px_rgba(16,185,129,0.28)] sm:left-3" aria-hidden="true" />
              <div className="space-y-6">
                {storyChapters.map(({ icon: Icon, label, title, description }, index) => (
                  <motion.article
                    key={title}
                    initial={reduceMotion ? false : { opacity: 0, x: index % 2 === 0 ? -90 : 90, y: 18 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.55, margin: "-8% 0px -12% 0px" }}
                    transition={{ duration: 0.95, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={reduceMotion ? undefined : { x: 6 }}
                    className="group relative z-10 ml-7 overflow-visible rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_38px_rgba(15,23,42,0.055)] transition-[border-color,box-shadow] duration-300 hover:border-emerald-300 hover:shadow-[0_20px_52px_rgba(15,23,42,0.09)] sm:ml-10 sm:rounded-3xl sm:p-7"
                  >
                    <span className="absolute -left-[1.65rem] top-8 z-20 flex size-4 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.13)] sm:-left-[2.35rem] sm:top-10" aria-hidden="true" />
                    <div className="flex items-start gap-4 sm:gap-5">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-all duration-300 group-hover:-rotate-3 group-hover:bg-emerald-600 group-hover:text-white sm:size-12 sm:rounded-2xl">
                        <Icon className="size-5" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{label}</p>
                          <span className="text-xs font-bold tracking-[0.16em] text-slate-300">0{index + 1}</span>
                        </div>
                        <h3 className="mt-3 text-xl font-bold leading-7 tracking-[-0.025em] text-slate-950 sm:text-2xl sm:leading-8">{title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{description}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-slate-200/80 bg-[#f8faf9] py-16 sm:py-20 lg:py-28">
          <div className="absolute left-1/2 top-0 size-[34rem] -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />
          <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
            <motion.div {...reveal()} className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 sm:text-sm">The evolution</p>
                <span className="h-px w-10 bg-emerald-600" />
              </div>
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                From One Attorney&apos;s Tool to a <span className="text-emerald-700">Complete Software Platform</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                After sharing the spreadsheet with another attorney, the response was immediate.
              </p>
            </motion.div>

            <motion.div {...reveal(0.1)} className="relative mx-auto mt-12 max-w-6xl lg:mt-16">
              <div className="relative grid gap-4 md:grid-cols-3 lg:gap-5">
                {[
                  { number: "01", label: "The origin", title: "A working spreadsheet", icon: FileSpreadsheet },
                  { number: "02", label: "The validation", title: "Proven in legal practice", icon: Check },
                  { number: "03", label: "The platform", title: "JudgmentCalc", icon: Sparkles },
                ].map(({ number, label, title, icon: Icon }, index) => (
                  <motion.div
                    key={number}
                    whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    className={`group relative flex cursor-default items-center gap-4 overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-300 hover:shadow-[0_22px_56px_rgba(15,23,42,0.11)] sm:p-6 md:min-h-56 md:flex-col md:justify-center md:text-center ${index === 2 ? "border-emerald-300" : "border-slate-200 hover:border-emerald-200"}`}
                  >
                    <span className="absolute right-4 top-3 text-5xl font-black tracking-[-0.08em] text-slate-100 transition-colors group-hover:text-emerald-50" aria-hidden="true">{number}</span>
                    <span className={`relative z-30 flex size-14 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105 ${index === 2 ? "border-emerald-600 bg-emerald-600 text-white shadow-emerald-900/15" : "border-emerald-100 bg-emerald-50 text-emerald-700 group-hover:border-emerald-300 group-hover:bg-white"}`}>
                      <Icon className="size-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700">{number} · {label}</p>
                      <p className="mt-1.5 text-lg font-bold tracking-[-0.025em] text-slate-950">{title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[1.08fr_0.92fr]">
                <div className="relative min-w-0 p-6 sm:p-8 lg:border-r lg:border-emerald-100 lg:p-10 xl:p-12">
                  <span className="absolute right-8 top-5 select-none font-serif text-8xl leading-none text-emerald-100/80" aria-hidden="true">&ldquo;</span>
                  <div className="relative flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Check className="size-4" strokeWidth={2.5} /></span>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Validated in practice</p>
                  </div>
                  <p className="relative mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-8">
                    The attorney found it invaluable for managing wage garnishments and ongoing judgment collections. That experience inspired Kyle to transform his spreadsheet into a professional cloud-based platform that could help attorneys everywhere.
                  </p>
                  <div className="relative mt-7 flex items-center gap-3 border-t border-slate-200 pt-5">
                    <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.10)]" />
                    <p className="text-sm font-semibold text-slate-700">Real workflow feedback became the catalyst.</p>
                  </div>
                </div>
                <div className="relative isolate min-w-0 overflow-hidden border-t border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50/60 p-6 sm:p-8 lg:border-t-0 lg:p-10 xl:p-12">
                  <div className="absolute -bottom-20 -right-16 -z-10 size-52 rounded-full border border-emerald-200/70" />
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/10"><Sparkles className="size-4" /></span>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">The result</p>
                  </div>
                  <p className="mt-5 text-2xl font-extrabold leading-tight tracking-[-0.035em] text-slate-950 sm:text-3xl">That platform became <span className="text-emerald-700">JudgmentCalc.</span></p>
                  <p className="mt-5 text-base leading-8 text-slate-600">Today, JudgmentCalc helps attorneys replace spreadsheets with an easy-to-use solution for managing judgment cases from beginning to end.</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {["Cloud based", "Case focused", "Built for attorneys"].map((item) => (
                      <span key={item} className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-slate-200/80 bg-white py-16 sm:py-20 lg:py-28">
          <div className="absolute -left-40 top-1/3 size-96 rounded-full bg-emerald-50 blur-3xl" />
          <div className="absolute -right-32 top-10 size-80 rounded-full bg-amber-50/80 blur-3xl" />

          <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
            <motion.div {...reveal()} className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 sm:text-sm">Purpose-built workflow</p>
                <span className="h-px w-10 bg-emerald-600" />
              </div>
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                Built Around <span className="text-emerald-700">Real Legal Workflows</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Every feature inside JudgmentCalc was created to solve a real problem experienced during legal practice.
              </p>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.article {...reveal(0.08)} className="relative isolate min-w-0 overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] sm:p-10 lg:p-12">
                <div className="absolute -bottom-32 -right-28 -z-10 size-80 rounded-full border border-emerald-200/70" />
                <div className="absolute -bottom-20 -right-16 -z-10 size-56 rounded-full border border-emerald-200/70" />
                <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[0_12px_30px_rgba(5,150,105,0.22)]">
                  <Scale className="size-6" strokeWidth={1.8} />
                </span>
                <p className="mt-8 text-xl font-bold leading-8 tracking-[-0.025em] text-slate-900 sm:text-2xl sm:leading-9">
                  Whether you&apos;re calculating judgment interest, recording payments, tracking enforcement costs, or generating payoff demand letters, the platform is designed to reduce manual work while improving accuracy.
                </p>
                <div className="mt-8 flex items-center gap-3 border-t border-emerald-100 pt-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100"><Check className="size-4" strokeWidth={2.5} /></span>
                  <p className="text-sm font-bold text-slate-700">One connected workflow from calculation to payoff.</p>
                </div>
              </motion.article>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Calculator, label: "Calculate", title: "Judgment interest", caption: "Keep balances accurate and current." },
                  { icon: RefreshCcw, label: "Record", title: "Payments & costs", caption: "Capture every case transaction." },
                  { icon: FileSpreadsheet, label: "Generate", title: "Payoff letters", caption: "Prepare reliable payoff information." },
                  { icon: ShieldCheck, label: "Manage", title: "Enforcement workflow", caption: "Stay organized from beginning to end." },
                ].map(({ icon: Icon, label, title, caption }, index) => (
                  <motion.article
                    key={title}
                    {...reveal(0.12 + index * 0.05)}
                    whileHover={reduceMotion ? undefined : { y: -7, scale: 1.015 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_38px_rgba(15,23,42,0.055)] transition-[border-color,box-shadow] duration-300 hover:border-emerald-300 hover:shadow-[0_22px_52px_rgba(15,23,42,0.10)]"
                  >
                    <span className="absolute right-4 top-3 text-4xl font-black tracking-[-0.08em] text-slate-100 transition-colors group-hover:text-emerald-50">0{index + 1}</span>
                    <span className="relative flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-all duration-300 group-hover:-rotate-3 group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <p className="relative mt-6 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-700">{label}</p>
                    <h3 className="relative mt-2 text-lg font-bold tracking-[-0.025em] text-slate-950">{title}</h3>
                    <p className="relative mt-3 text-sm leading-6 text-slate-500">{caption}</p>
                  </motion.article>
                ))}
              </div>
            </div>

          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#06131f] py-16 text-white sm:py-20 lg:py-28">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          <div className="absolute -left-40 -top-40 -z-10 size-[32rem] rounded-full bg-emerald-500/12 blur-3xl" />
          <div className="absolute -bottom-48 right-0 -z-10 size-[34rem] rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20 lg:px-10 xl:px-12">
            <motion.div {...reveal()} className="min-w-0">
              <span className="flex size-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 text-slate-950 shadow-[0_14px_36px_rgba(16,185,129,0.24)]">
                <Sparkles className="size-6" />
              </span>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">Our mission</p>
              <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Clearer work. <span className="text-emerald-400">More confident outcomes.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
                Reliable software shaped around the full life of every judgment case.
              </p>
            </motion.div>

            <div className="min-w-0 space-y-4">
              {[
                {
                  number: "01",
                  label: "What we deliver",
                  content: "Our mission is to provide attorneys and law firms with reliable judgment enforcement software that simplifies complex calculations, improves productivity, and helps maintain accurate judgment records throughout the life of every case.",
                },
                {
                  number: "02",
                  label: "How we improve",
                  content: "We continue improving JudgmentCalc by listening to legal professionals and building practical features that make judgment management easier, faster, and more accurate.",
                },
              ].map(({ number, label, content }, index) => (
                <motion.article
                  key={number}
                  {...reveal(0.08 + index * 0.08)}
                  whileHover={reduceMotion ? undefined : { x: 7 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.16)] backdrop-blur-md transition-colors duration-300 hover:border-emerald-400/35 hover:bg-white/[0.075] sm:p-8"
                >
                  <span className="absolute right-5 top-4 text-5xl font-black tracking-[-0.08em] text-white/[0.055] transition-colors group-hover:text-emerald-400/10">{number}</span>
                  <div className="relative flex items-center gap-3">
                    <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.10)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">{label}</p>
                  </div>
                  <p className="relative mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">{content}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-slate-200/80 bg-[#f8faf9] py-16 sm:py-20 lg:py-28">
          <div className="absolute -left-40 top-20 size-96 rounded-full bg-emerald-100/55 blur-3xl" />
          <div className="absolute -right-28 bottom-10 size-72 rounded-full bg-amber-100/45 blur-3xl" />

          <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
            <motion.div {...reveal()} className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 sm:text-sm">Why JudgmentCalc</p>
                <span className="h-px w-10 bg-emerald-600" />
              </div>
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                Why Attorneys Choose <span className="text-emerald-700">JudgmentCalc</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Purpose-built capabilities for accurate, efficient post-judgment work.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
              {[
                { icon: BriefcaseBusiness, text: "Built by an attorney with 30+ years of litigation experience" },
                { icon: Calculator, text: "Accurate judgment interest calculations" },
                { icon: Cloud, text: "Secure cloud-based platform" },
                { icon: RefreshCcw, text: "Easy payment and cost tracking" },
                { icon: ReceiptText, text: "Professional payoff demand letters" },
                { icon: Share2, text: "Client Share for real-time balance updates" },
                { icon: Infinity, text: "Unlimited judgment cases and transactions" },
                { icon: Scale, text: "Designed specifically for attorneys and law firms" },
              ].map(({ icon: Icon, text }, index) => (
                <motion.article
                  key={text}
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.62, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduceMotion ? undefined : { y: -7, scale: 1.015 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  className="group relative isolate min-h-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_42px_rgba(15,23,42,0.055)] transition-[border-color,box-shadow] duration-300 hover:border-emerald-300 hover:shadow-[0_24px_58px_rgba(15,23,42,0.11)]"
                >
                  <div className="absolute -right-14 -top-14 -z-10 size-36 rounded-full border border-emerald-100 bg-emerald-50/45 transition-transform duration-500 group-hover:scale-125" />
                  <span className="absolute right-5 top-4 text-xs font-bold tracking-[0.16em] text-slate-300">0{index + 1}</span>
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-all duration-300 group-hover:-rotate-3 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-900/10">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-8 text-lg font-bold leading-7 tracking-[-0.025em] text-slate-950">{text}</h3>
                  <div className="mt-5 h-0.5 w-10 bg-gradient-to-r from-emerald-600 to-emerald-200 transition-all duration-300 group-hover:w-20" />
                </motion.article>
              ))}
            </div>

            <motion.div {...reveal(0.12)} className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 text-center text-sm font-semibold text-slate-500">
              <ShieldCheck className="size-5 text-emerald-600" />
              Built for the way legal professionals manage judgments every day.
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-slate-200/80 bg-slate-50 py-20 sm:py-24 lg:py-28">
          <div className="absolute -left-44 bottom-0 size-96 rounded-full bg-emerald-100 opacity-70 blur-3xl" />
          <div className="absolute -right-44 top-0 size-96 rounded-full bg-slate-950/5 blur-3xl" />

          <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16 lg:px-10 xl:px-12">
            <motion.div {...reveal()} className="min-w-0 lg:sticky lg:top-28">
              <span className="flex size-14 items-center justify-center rounded-3xl bg-emerald-700 text-white shadow-[0_24px_60px_rgba(16,185,129,0.24)]">
                <ShieldCheck className="size-7" strokeWidth={1.8} />
              </span>
              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700 sm:text-sm">A dependable partnership</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-[1.04] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                Our <span className="text-emerald-700">Commitment</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-slate-600 sm:text-lg">
                We take a higher standard approach to judgment calculations, combining accuracy, insight, and exceptional support to help law firms deliver better outcomes.
              </p>
            </motion.div>

            <motion.div {...reveal(0.08)} className="min-w-0 overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-emerald-50/55 shadow-[0_36px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:rounded-[2rem]">
              <div className="p-5 sm:p-8 lg:p-10 xl:p-12">
                <div className="space-y-4 sm:space-y-5">
                  {[
                    {
                      number: "01",
                      icon: Check,
                      label: "Dependable by design",
                      content: "Our commitment is to provide dependable software, responsive support, and continuous improvements that help attorneys work more efficiently while reducing manual calculations and administrative work.",
                    },
                    {
                      number: "02",
                      icon: Infinity,
                      label: "Ready at every scale",
                      content: "Whether you're handling a single judgment or managing hundreds of active cases, JudgmentCalc is built to support your practice every step of the way.",
                    },
                  ].map(({ number, icon: Icon, label, content }) => (
                    <motion.article
                      key={number}
                      whileHover={reduceMotion ? undefined : { y: -4 }}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:rounded-[1.75rem] sm:p-6"
                    >
                      <span className="absolute right-5 top-4 text-3xl font-black tracking-[-0.08em] text-slate-100 opacity-80 transition-colors group-hover:text-emerald-100 sm:right-6 sm:top-5 sm:text-4xl">{number}</span>
                      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white sm:size-12 sm:rounded-3xl">
                          <Icon className="size-5" strokeWidth={2} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950 sm:text-2xl">{label}</h3>
                          <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">{content}</p>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                <div className="mt-7 border-t border-slate-200 pt-7 sm:mt-8 sm:pt-8">
                  <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                    To learn more about how we protect your information, please review our{" "}
                    <Link to="/privacy-policy" className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900">Privacy Policy</Link>.
                    {" "}Before using our platform, we also encourage you to read our{" "}
                    <Link to="/terms-and-conditions" className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900">Terms &amp; Conditions</Link>.
                    {" "}If you have any questions or would like to speak with our team, please visit our{" "}
                    <Link to="/contact-us" className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900">Contact Us</Link> page.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-emerald-100 bg-gradient-to-r from-emerald-600/10 via-white to-emerald-600/10 px-5 py-5 sm:px-8 lg:px-10">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]" />
                  Supporting your practice at every step
                </div>
                <button type="button" onClick={() => navigate("/contact-us")} className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-slate-900">
                  Talk to our team <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* <section className="border-b border-slate-200/80 bg-[#f8faf9] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
            <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 sm:text-sm">What guides the product</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">Built around the work that matters</h2>
            </motion.div>

            <div className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-14">
              {principles.map(({ icon: Icon, title, description }, index) => (
                <motion.article
                  key={title}
                  {...reveal(index * 0.07)}
                  whileHover={reduceMotion ? undefined : { y: -7 }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_42px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-300 hover:border-emerald-300 hover:shadow-[0_25px_65px_rgba(15,23,42,0.11)] sm:p-7"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-300 to-transparent" />
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-all duration-300 group-hover:-rotate-3 group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Principle 0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-bold tracking-[-0.025em] sm:text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section> */}

        {/* <section className="bg-white py-16 sm:py-20">
          <motion.div {...reveal()} className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 sm:text-sm">A clearer way forward</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl">See what an attorney-built judgment workflow can do for your practice.</h2>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => navigate("/signup")} className="group h-12 rounded-xl px-6 font-bold text-white">
                Start your free trial <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button onClick={() => navigate("/contact-us")} variant="outline" className="h-12 rounded-xl border-slate-300 px-6 font-bold text-slate-800">Contact our team</Button>
            </div>
          </motion.div>
        </section> */}
      </main>
  );
};

export default AboutUs;
