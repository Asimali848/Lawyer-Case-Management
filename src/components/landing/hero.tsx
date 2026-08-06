import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

import heroImage from "@/assets/img/Depositphotos_221861706_XL.webp";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const reveal = (delay: number, distance = 24) => ({
    initial: reduceMotion ? false : { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const showDemo = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative isolate overflow-hidden bg-[#f8faf9]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_8%_16%,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_47%_88%,rgba(245,158,11,0.07),transparent_24%)]" />
      <div className="absolute left-[7%] top-[12%] -z-10 size-48 rounded-full border border-emerald-200/35 sm:size-80" />
      <div className="absolute left-[11%] top-[18%] -z-10 size-32 rounded-full border border-emerald-100/60 sm:size-56" />

      <div className="mx-auto grid w-full max-w-[1280px] md:min-h-[660px] lg:grid-cols-[0.75fr_1.25fr]">
        <div className="relative z-10 flex items-center px-5 py-9 sm:px-8 sm:py-14 lg:px-10 lg:py-16 xl:px-12">
          <div className="w-full max-w-[720px] text-center sm:text-left">
            <motion.div {...reveal(0)} className="mb-5 flex items-center justify-center gap-2.5 sm:mb-6 sm:justify-start sm:gap-3">
              <span className="h-px w-8 shrink-0 bg-emerald-600 sm:w-12" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-800 min-[380px]:text-[11px] sm:text-sm sm:tracking-[0.2em]">Legal finance, made precise</span>
              <span className="size-1.5 rotate-45 bg-amber-400" aria-hidden="true" />
            </motion.div>

            <motion.h1
              {...reveal(0.08, 30)}
              whileHover={reduceMotion ? undefined : { x: 4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group max-w-[760px] text-center text-slate-950 sm:text-left"
            >
              <span className="block whitespace-nowrap text-[clamp(1.75rem,8.2vw,2.2rem)] font-extrabold leading-[1.04] tracking-[-0.05em] text-slate-950 sm:whitespace-normal sm:text-[clamp(2.45rem,3.3vw,3.35rem)] sm:leading-[1.03] lg:whitespace-nowrap">
                Judgment Interest <span className="hidden font-serif font-normal italic text-emerald-600 sm:inline">&amp;</span>
              </span>
              <span className="my-1 block font-serif text-[2rem] font-normal italic leading-none text-emerald-600 sm:hidden" aria-hidden="true">&amp;</span>
              <span className="mt-1 block whitespace-nowrap text-[clamp(1.75rem,8.2vw,2.2rem)] font-extrabold leading-[1.04] tracking-[-0.05em] text-slate-950 sm:whitespace-normal sm:text-[clamp(2.45rem,3.3vw,3.35rem)] sm:leading-[1.03] lg:whitespace-nowrap">
                Collection Software
              </span>
              <span className="mx-auto mt-5 flex w-fit items-center justify-center gap-1.5 whitespace-nowrap border-x-2 border-emerald-500 bg-white/55 px-2.5 py-2 text-[clamp(1.25rem,6vw,1.55rem)] font-bold leading-tight tracking-[-0.035em] text-slate-800 backdrop-blur-sm transition-colors duration-300 group-hover:text-slate-950 sm:mx-0 sm:mt-7 sm:justify-start sm:gap-3 sm:border-x-0 sm:border-l-2 sm:bg-transparent sm:py-0 sm:pl-5 sm:pr-0 sm:text-[clamp(1.75rem,2.45vw,2.45rem)] sm:backdrop-blur-none">
                Built for
                <span className="relative inline-block font-extrabold text-emerald-700">
                  <span className="relative z-10">Attorneys.</span>
                  <motion.span
                    aria-hidden="true"
                    className="absolute -inset-x-1 bottom-0 h-[22%] origin-left -rotate-1 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-200/60 transition-transform duration-300 group-hover:scale-x-105"
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </span>
              <span className="mt-4 flex items-center justify-center gap-2 sm:mt-6 sm:justify-start" aria-hidden="true">
                <motion.span
                  className="h-0.5 w-16 origin-left rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-transparent transition-all duration-300 group-hover:w-28 sm:w-20"
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                />
                <span className="size-1.5 rounded-full bg-amber-400" />
              </span>
            </motion.h1>

            <motion.p
              {...reveal(0.18)}
              className="mx-auto mt-6 max-w-2xl text-center text-[0.95rem] leading-[1.7] text-slate-600 sm:mx-0 sm:mt-7 sm:text-left sm:text-lg sm:leading-8"
            >
              Track judgment balances, calculate accrued interest, record payments and costs, and generate accurate payoff letters, all from one secure, cloud-based platform. Built by an attorney with over 30 years of litigation and judgment enforcement experience.
            </motion.p>

            <motion.div {...reveal(0.28)} className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={() => navigate("/signup")}
                className="group h-12 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(5,150,105,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(5,150,105,0.32)] sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                Start Your Free 30-Day Trial
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={showDemo}
                className="group h-12 w-full rounded-xl border-slate-300 bg-white/80 px-5 text-sm font-bold text-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.07)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:text-primary sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-primary group-hover:text-white">
                  <Play className="ml-0.5 size-3.5 fill-current" />
                </span>
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(0 0 0 18%)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0 0%)" }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-white px-5 pb-10 pt-2 sm:px-8 sm:pb-12 md:absolute md:bottom-0 md:left-[18%] md:right-0 md:top-0 md:min-h-full md:w-auto md:bg-transparent md:p-0 lg:left-[32%]"
        >
          <div className="group relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/5 md:absolute md:inset-0 md:aspect-auto md:rounded-none md:shadow-none md:ring-0">
            <div className="absolute -left-20 -top-20 z-10 size-44 rounded-full bg-emerald-300/20 blur-3xl" aria-hidden="true" />
            <img
              src={heroImage}
              alt="A judge's gavel resting on a calculator"
              className="absolute inset-0 size-full object-fill object-center transition-transform duration-[1600ms] group-hover:scale-[1.01]"
              fetchPriority="high"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(248,250,249,0.92)_0%,rgba(248,250,249,0.48)_8%,transparent_24%),linear-gradient(to_bottom,rgba(15,23,42,0.08)_0%,transparent_22%,transparent_78%,rgba(15,23,42,0.14)_100%)] md:bg-[linear-gradient(to_right,rgba(248,250,249,0.99)_0%,rgba(248,250,249,0.86)_18%,rgba(248,250,249,0.38)_38%,transparent_58%),linear-gradient(to_bottom,rgba(15,23,42,0.07)_0%,transparent_18%,transparent_80%,rgba(15,23,42,0.13)_100%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-white/5 backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black,transparent)] md:w-[30%] md:backdrop-blur-[2px]"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40" aria-hidden="true" />
            <div className="absolute bottom-6 right-6 h-12 w-12 border-b-2 border-r-2 border-white/80 sm:h-16 sm:w-16" aria-hidden="true" />
            <div className="absolute right-6 top-6 h-12 w-12 border-r-2 border-t-2 border-white/80 sm:h-16 sm:w-16" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
