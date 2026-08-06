import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const contactChannels = [
  {
    icon: Mail,
    label: "Email",
    value: "support@judgmentcalc.com",
    description: "For general questions, technical support, billing inquiries, or account assistance, email our support team and we'll respond as soon as possible.",
    href: "mailto:support@judgmentcalc.com",
  },
];

const subjectOptions = ["Product question", "Technical support", "Subscription & billing", "Free trial guidance", "Book a consultation", "General inquiry"];

const reasons = [
  { icon: HelpCircle, title: "Product questions" },
  { icon: LifeBuoy, title: "Technical support" },
  { icon: Wallet, title: "Subscription and billing assistance" },
  { icon: Rocket, title: "Free trial guidance" },
  { icon: Calendar, title: "Book a consultation" },
  { icon: MessageSquareText, title: "General inquiries" },
];

const consultationPoints = ["Answer your questions", "Demonstrate key features", "Help you choose the right plan", "Explain how JudgmentCalc fits your workflow"];

const faqs = [
  {
    question: "How quickly will I receive a response?",
    answer: "We aim to respond to all inquiries as quickly as possible during normal business hours.",
  },
  {
    question: "Can I request a product demonstration?",
    answer: "Yes. You can book a consultation to receive a personalized walkthrough of JudgmentCalc and its features.",
  },
  {
    question: "Do you provide technical support?",
    answer: "Yes. Our support team is available to help with account questions, technical issues, and platform guidance.",
  },
  {
    question: "Can I contact you before subscribing?",
    answer: "Absolutely. We're happy to answer your questions about our features, pricing, free trial, or how JudgmentCalc can support your legal practice.",
  },
];

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  firmName: "",
  subject: "",
  message: "",
};

const ContactUs = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const handleChange = (field: keyof typeof initialFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const scrollToForm = (subject?: string) => {
    if (subject) handleChange("subject", subject);
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error("Please complete your name, email, and message before sending.");
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setFormData(initialFormState);
      toast.success("Message sent. Our team will be in touch shortly.");
    }, 900);
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-[#f8faf9]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_15%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(245,158,11,0.1),transparent_24%)]" />
        <div className="absolute left-1/2 top-14 -z-10 size-[34rem] -translate-x-1/2 rounded-full border border-emerald-200/35" />
        <div className="absolute left-1/2 top-32 -z-10 size-[24rem] -translate-x-1/2 rounded-full border border-emerald-100/60" />

        <div className="mx-auto w-full max-w-[1280px] px-5 pb-14 pt-14 sm:px-8 sm:pb-18 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24 xl:px-12">
          <motion.div {...reveal()} className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-emerald-600" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800 sm:text-sm">Contact Us</p>
              <span className="size-1.5 rotate-45 bg-amber-400" aria-hidden="true" />
            </div>

            <h1 className="text-[clamp(2.4rem,5.6vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.05em] text-slate-950">
              Get in Touch with <span className="text-emerald-700">JudgmentCalc</span>
            </h1>

            <motion.p
              layout
              className={`mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-8 ${isIntroExpanded ? "line-clamp-none" : "line-clamp-4 sm:line-clamp-none"}`}
            >
              Have questions about JudgmentCalc? Need help with your account, pricing, free trial, or technical support? Our team is here to help. Whether you&apos;re exploring our judgment interest software for the first time or you&apos;re already using the platform, we&apos;re committed to providing fast, friendly, and professional support for attorneys and law firms.
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

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => scrollToForm()} className="group h-13 rounded-xl px-7 text-base font-bold text-white shadow-[0_14px_34px_rgba(5,150,105,0.24)]">
                Send us a message <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button onClick={() => navigate("/signup")} variant="outline" className="h-13 rounded-xl border-slate-300 bg-white/80 px-7 text-base font-bold text-slate-800 shadow-sm backdrop-blur-sm">
                Start your free trial
              </Button>
            </div>
          </motion.div>

          <motion.div {...reveal(0.1)} className="mx-auto mt-12 max-w-xs">
            {contactChannels.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    <Icon className="size-4.5" strokeWidth={1.8} />
                  </span>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{label}</p>
                  <p className="mt-1 break-words text-sm font-bold tracking-[-0.01em] text-slate-950 sm:text-base">{value}</p>
                </>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  className="group block overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 px-5 py-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-colors hover:bg-emerald-50/60"
                >
                  {content}
                </a>
              ) : (
                <div key={label} className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 px-5 py-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  {content}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact information + form */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
        <div className="absolute -left-40 top-1/3 size-96 rounded-full bg-emerald-50 blur-3xl" />
        <div className="absolute -right-32 top-10 size-80 rounded-full bg-amber-50/80 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* Contact information */}
            <motion.div {...reveal()} className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 sm:text-sm">Contact information</p>
              </div>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-4xl">
                We&apos;re happy to answer your questions
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Reach out and we&apos;ll help you get the most from JudgmentCalc.
              </p>

              <div className="mt-8 space-y-4">
                {contactChannels.map(({ icon: Icon, label, value, description, href }) => {
                  const Wrapper = href ? "a" : "div";
                  return (
                    <Wrapper
                      key={label}
                      {...(href ? { href } : {})}
                      className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_38px_rgba(15,23,42,0.05)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_20px_52px_rgba(15,23,42,0.09)]"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-all duration-300 group-hover:-rotate-3 group-hover:bg-emerald-600 group-hover:text-white">
                        <Icon className="size-5" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{label}</p>
                        <p className="mt-1 break-words font-bold tracking-[-0.02em] text-slate-950 sm:text-lg">{value}</p>
                        <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div id="contact-form" {...reveal(0.1)} className="relative isolate min-w-0 scroll-mt-28 overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-amber-50/40 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="absolute -bottom-28 -right-24 -z-10 size-72 rounded-full border border-emerald-200/70" />
              <div className="absolute -bottom-16 -right-12 -z-10 size-48 rounded-full border border-emerald-200/70" />

              <div className="p-5 sm:p-9 lg:p-12">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-3.5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[0_12px_30px_rgba(5,150,105,0.22)]">
                    <MessageSquareText className="size-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Contact form</p>
                    <h2 className="text-xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-2xl lg:text-3xl">Send Us a Message</h2>
                  </div>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base">
                  Complete the form below and we&apos;ll get back to you as quickly as possible.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5 sm:mt-8">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" required value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Jane Attorney" className="h-11 rounded-xl bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="jane@lawfirm.com" className="h-11 rounded-xl bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="font-normal normal-case text-slate-400">(Optional)</span>
                      </Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="(555) 123-4567" className="h-11 rounded-xl bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firmName">
                        Law Firm Name <span className="font-normal normal-case text-slate-400">(Optional)</span>
                      </Label>
                      <Input id="firmName" value={formData.firmName} onChange={(e) => handleChange("firmName", e.target.value)} placeholder="Attorney & Associates" className="h-11 rounded-xl bg-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)}>
                      <SelectTrigger id="subject" className="h-11 w-full rounded-xl bg-white">
                        <SelectValue placeholder="What can we help with?" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Tell us a bit about what you need help with..."
                      className="min-h-36 rounded-xl bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-4 border-t border-emerald-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                      We typically respond within one business day.
                    </p>
                    <Button type="submit" disabled={isSubmitting} className="group h-12 w-full rounded-xl px-7 text-base font-bold text-white shadow-[0_14px_34px_rgba(5,150,105,0.24)] sm:w-auto">
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why contact us */}
      <section className="relative overflow-hidden border-y border-slate-200/80 bg-[#f8faf9] py-16 sm:py-20 lg:py-28">
        <div className="absolute -left-40 top-20 size-96 rounded-full bg-emerald-100/55 blur-3xl" />
        <div className="absolute -right-28 bottom-10 size-72 rounded-full bg-amber-100/45 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-emerald-600" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 sm:text-sm">Why Contact JudgmentCalc</p>
              <span className="h-px w-10 bg-emerald-600" />
            </div>
            <h2 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-5xl">
              How Can We <span className="text-emerald-700">Help</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Our goal is to help attorneys work more efficiently with accurate judgment interest calculations and reliable case management tools. You can contact us for:
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {reasons.map(({ icon: Icon, title }, index) => (
              <motion.article
                key={title}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.015 }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_38px_rgba(15,23,42,0.055)] transition-[border-color,box-shadow] duration-300 hover:border-emerald-300 hover:shadow-[0_22px_52px_rgba(15,23,42,0.10)]"
              >
                <span className="absolute right-4 top-3 text-3xl font-black tracking-[-0.08em] text-slate-100 transition-colors group-hover:text-emerald-50">0{index + 1}</span>
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-all duration-300 group-hover:-rotate-3 group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <p className="relative font-bold tracking-[-0.02em] text-slate-950">{title}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Book a consultation */}
      <section className="relative isolate overflow-hidden bg-[#06131f] py-16 text-white sm:py-20 lg:py-28">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        <div className="absolute -left-40 -top-40 -z-10 size-[32rem] rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute -bottom-48 right-0 -z-10 size-[34rem] rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:px-10 xl:px-12">
          <motion.div {...reveal()} className="min-w-0">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 text-slate-950 shadow-[0_14px_36px_rgba(16,185,129,0.24)]">
              <Calendar className="size-6" />
            </span>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300 sm:text-sm">Book a Consultation</p>
            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-[-0.05em] sm:text-5xl">
              See How JudgmentCalc Can <span className="text-emerald-400">Support Your Practice</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
              Every law firm has unique workflows. Schedule a consultation with our team to learn how JudgmentCalc can simplify judgment interest calculations, payment tracking, and post-judgment case management.
            </p>
            <Button
              type="button"
              onClick={() => scrollToForm("Book a consultation")}
              className="group mt-8 h-13 gap-2 rounded-xl bg-emerald-500 px-7 text-base font-bold text-white shadow-[0_14px_35px_rgba(16,185,129,0.25)] hover:bg-emerald-400"
            >
              Book a Consultation
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.div {...reveal(0.1)} className="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] shadow-[0_20px_55px_rgba(0,0,0,0.16)] backdrop-blur-md">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">During your consultation, we&apos;ll</p>
            </div>
            <div className="divide-y divide-white/10">
              {consultationPoints.map((point, index) => (
                <motion.div
                  key={point}
                  whileHover={reduceMotion ? undefined : { x: 6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 px-6 py-4 sm:px-8"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20">
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  <p className="text-base font-semibold leading-6 text-slate-200 sm:text-lg">{point}</p>
                  <span className="ml-auto text-xs font-bold tracking-[0.16em] text-white/15">0{index + 1}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/80 bg-white py-16 sm:py-20 lg:py-28">
        <div className="absolute -left-36 top-28 size-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -right-32 bottom-16 size-96 rounded-full bg-amber-100/40 blur-3xl" />

        <div className="relative mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10">
          <motion.div {...reveal()} className="mb-10 text-center sm:mb-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 sm:text-sm">Questions & Answers</p>
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[2.75rem]">Frequently Asked Questions</h2>
          </motion.div>

          <motion.div {...reveal(0.08)}>
            <Accordion type="single" collapsible defaultValue="contact-faq-0" className="space-y-3">
              {faqs.map(({ question, answer }, index) => (
                <AccordionItem
                  key={question}
                  value={`contact-faq-${index}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_10px_32px_rgba(15,23,42,0.05)] transition-all duration-300 data-[state=open]:border-emerald-200 data-[state=open]:shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:px-6"
                >
                  <AccordionTrigger className="py-5 text-base font-bold leading-6 text-slate-900 no-underline hover:text-primary hover:no-underline [&_svg]:size-5 [&_svg]:text-slate-400 group-data-[state=open]:[&_svg]:text-primary sm:text-lg">
                    <span className="flex items-start gap-3 text-left">
                      <span className="mt-0.5 text-xs font-black tracking-[0.08em] text-emerald-600 sm:text-sm">{String(index + 1).padStart(2, "0")}</span>
                      {question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-8 pr-7 text-sm leading-7 text-slate-600 sm:pl-10 sm:text-base sm:leading-8">{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative isolate overflow-hidden bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/15 blur-2xl" />
        <div className="absolute -left-24 bottom-0 size-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
        <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400 text-slate-950 shadow-[0_14px_36px_rgba(16,185,129,0.24)]">
              <Sparkles className="size-6" />
            </span>
            <h2 className="mt-6 text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-5xl">Ready to Simplify Judgment Enforcement?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Join attorneys and law firms who trust JudgmentCalc to calculate judgment interest, track payments, manage judgment balances, and generate accurate payoff demand letters from one secure, cloud-based platform.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Start your free 30-day trial today or contact our team to learn more about how JudgmentCalc can support your practice.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => navigate("/signup")}
                className="group h-13 gap-2 rounded-xl bg-emerald-500 px-7 text-base font-bold text-white shadow-[0_14px_35px_rgba(16,185,129,0.25)] hover:bg-emerald-400"
              >
                Start Your Free 30-Day Trial
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => scrollToForm()}
                className="h-13 rounded-xl border-white/20 bg-white/[0.06] px-7 text-base font-bold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                Contact Our Team
              </Button>
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-slate-400">
              To learn more about the story behind JudgmentCalc, visit our{" "}
              <button type="button" onClick={() => navigate("/about-us")} className="font-semibold text-emerald-400 underline decoration-emerald-500/50 underline-offset-4 transition-colors hover:text-emerald-300">
                About Us
              </button>{" "}
              page. To understand how we collect and protect your information, please review our{" "}
              <button type="button" onClick={() => navigate("/privacy-policy")} className="font-semibold text-emerald-400 underline decoration-emerald-500/50 underline-offset-4 transition-colors hover:text-emerald-300">
                Privacy Policy
              </button>
              . Before using our platform, we also encourage you to read our{" "}
              <button type="button" onClick={() => navigate("/terms-and-conditions")} className="font-semibold text-emerald-400 underline decoration-emerald-500/50 underline-offset-4 transition-colors hover:text-emerald-300">
                Terms &amp; Conditions
              </button>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
