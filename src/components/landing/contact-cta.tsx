import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const ContactCta = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative isolate w-full overflow-hidden bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
      <div className="absolute -left-40 -top-40 -z-10 size-[32rem] rounded-full bg-emerald-500/12 blur-3xl" />
      <div className="absolute -bottom-48 right-0 -z-10 size-[34rem] rounded-full bg-cyan-500/8 blur-3xl" />
      <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
        <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 text-slate-950 shadow-[0_14px_36px_rgba(16,185,129,0.24)]">
            <MessageCircle className="size-6" />
          </span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">Still have questions?</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Not Sure Which Plan Fits <span className="text-emerald-400">Your Practice</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Tell us about your caseload and workflow, and our team will help you find the right plan, no pressure, no obligation.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => navigate("/contact-us")}
              className="group h-13 gap-2 rounded-xl bg-emerald-500 px-7 text-base font-bold text-white shadow-[0_14px_35px_rgba(16,185,129,0.25)] hover:bg-emerald-400"
            >
              Contact Our Team
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/signup")}
              variant="outline"
              className="h-13 rounded-xl border-white/20 bg-white/[0.06] px-7 text-base font-bold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              Start Free Trial
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCta;
