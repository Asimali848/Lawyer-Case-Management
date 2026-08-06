import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Check,
  Cookie,
  Handshake,
  Database,
  Link2,
  Lock,
  type LucideIcon,
  Mail,
  RefreshCcw,
  Settings2,
  Share2,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

type Block =
  | { kind: "text"; text: string }
  | { kind: "list"; list: string[] }
  | { kind: "linkOut" }
  | { kind: "linksToOtherPages" }
  | { kind: "contactCard" };

type Section = {
  id: string;
  icon: LucideIcon;
  title: string;
  body: Block[];
};

const text = (value: string): Block => ({ kind: "text", text: value });
const list = (items: string[]): Block => ({ kind: "list", list: items });

const sections: Section[] = [
  {
    id: "information-we-collect",
    icon: Database,
    title: "Information We Collect",
    body: [
      text("We may collect personal information that you voluntarily provide when you:"),
      list(["Create an account", "Start a free trial", "Contact our support team", "Book a consultation", "Subscribe to our services"]),
      text("The information we collect may include your name, email address, phone number, billing details, and any information you choose to provide through our contact forms."),
      text("We may also collect non-personal information such as your browser type, device information, IP address, pages visited, and general website usage data. This information helps us improve our website, maintain security, and provide a better user experience."),
    ],
  },
  {
    id: "how-we-use-your-information",
    icon: Settings2,
    title: "How We Use Your Information",
    body: [
      text("The information we collect may be used to:"),
      list([
        "Create and manage your account",
        "Provide access to JudgmentCalc and its features",
        "Process subscriptions and payments",
        "Respond to your questions and support requests",
        "Improve our website and software",
        "Maintain platform security",
        "Send important account and service updates",
        "Comply with applicable legal obligations",
      ]),
      text("We only use your information for legitimate business purposes and to provide you with the best possible experience."),
    ],
  },
  {
    id: "cookies-and-analytics",
    icon: Cookie,
    title: "Cookies and Analytics",
    body: [
      text("JudgmentCalc may use cookies and similar technologies to improve website performance, remember your preferences, understand how visitors use our website, and enhance your browsing experience."),
      text("You can choose to disable cookies through your browser settings; however, some features of the website may not function properly if cookies are disabled."),
    ],
  },
  {
    id: "third-party-services",
    icon: Share2,
    title: "Third-Party Services",
    body: [
      text("We may work with trusted third-party service providers to help operate our website and business. These providers may assist with services such as:"),
      list(["Website hosting", "Payment processing", "Website analytics", "Email communications", "Customer support"]),
      text("These service providers only receive the information necessary to perform their services and are expected to protect your information."),
    ],
  },
  {
    id: "data-security",
    icon: Lock,
    title: "Data Security",
    body: [
      text("We use appropriate administrative, technical, and organizational security measures to help protect your personal information from unauthorized access, misuse, disclosure, or loss. While we work hard to safeguard your information, no online system can guarantee complete security."),
    ],
  },
  {
    id: "your-privacy-rights",
    icon: UserCheck,
    title: "Your Privacy Rights",
    body: [
      text("Depending on your location and applicable laws, you may have the right to:"),
      list([
        "Request access to your personal information",
        "Correct inaccurate information",
        "Request deletion of your personal data",
        "Object to or restrict certain processing activities",
        "Request a copy of the information we hold about you",
      ]),
      { kind: "linkOut" },
    ],
  },
  {
    id: "links-to-other-pages",
    icon: Link2,
    title: "Links to Other Pages",
    body: [{ kind: "linksToOtherPages" }],
  },
  {
    id: "changes-to-this-privacy-policy",
    icon: RefreshCcw,
    title: "Changes to This Privacy Policy",
    body: [
      text("We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices. Any updates will be published on this page. We encourage you to review this page periodically to stay informed."),
    ],
  },
  {
    id: "contact-us",
    icon: Mail,
    title: "Contact Us",
    body: [{ kind: "contactCard" }],
  },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: contentRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 900);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-400"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-[#f8faf9]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_15%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(245,158,11,0.1),transparent_24%)]" />
        <div className="absolute left-1/2 top-14 -z-10 size-[34rem] -translate-x-1/2 rounded-full border border-emerald-200/35" />
        <div className="absolute left-1/2 top-32 -z-10 size-[24rem] -translate-x-1/2 rounded-full border border-emerald-100/60" />

        <div className="mx-auto w-full max-w-[1280px] px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-10 lg:pb-20 lg:pt-24 xl:px-12">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-emerald-600" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800 sm:text-sm">Legal</p>
              <span className="size-1.5 rotate-45 bg-amber-400" aria-hidden="true" />
            </div>

            <h1 className="text-[clamp(2.4rem,5.6vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.05em] text-slate-950">Privacy Policy</h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-8">
              At JudgmentCalc, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and the steps we take to help keep your information secure when you visit our website or use our judgment interest software.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-8">
              Whether you are exploring our services, starting a free trial, or contacting our team, we want you to understand how your information is handled. To learn more about our company and why JudgmentCalc was created, please visit our{" "}
              <button type="button" onClick={() => navigate("/about-us")} className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900">
                About Us
              </button>{" "}
              page.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute -left-40 top-1/4 -z-10 size-96 rounded-full bg-emerald-50/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-1/4 -z-10 size-80 rounded-full bg-amber-50/50 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 xl:px-12">
          {/* Jump-to-section nav */}
          <motion.nav aria-label="Privacy Policy sections" {...reveal()} className="mx-auto mb-10 flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:mb-14">
            {sections.map(({ id, title }, index) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                    isActive ? "border-emerald-600 bg-emerald-600 text-white shadow-[0_8px_20px_rgba(5,150,105,0.22)]" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                  }`}
                >
                  <span className={`flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold tabular-nums ${isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-400"}`}>{index + 1}</span>
                  {title}
                </button>
              );
            })}
          </motion.nav>

          {/* Sections */}
          <div className="mx-auto max-w-3xl">
            <div ref={contentRef} className="space-y-6 sm:space-y-8">
              {sections.map(({ id, icon: Icon, title, body }, index) => (
                <motion.article
                  key={id}
                  id={id}
                  ref={(el) => {
                    sectionRefs.current[id] = el;
                  }}
                  {...reveal(Math.min(index * 0.03, 0.12))}
                  className="relative scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] sm:p-8"
                >
                  <span className="pointer-events-none absolute -right-2 -top-4 select-none text-6xl font-black tracking-[-0.08em] text-slate-50 sm:text-7xl" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-600">Section {String(index + 1).padStart(2, "0")}</p>
                      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-slate-950 sm:text-2xl">{title}</h2>
                    </div>
                  </div>

                  <div className="relative mt-5 space-y-4 pl-0 sm:pl-[3.5rem]">
                    {body.map((block, blockIndex) => {
                      switch (block.kind) {
                        case "text":
                          return (
                            <p key={blockIndex} className="text-base leading-8 text-slate-600">
                              {block.text}
                            </p>
                          );

                        case "list":
                          return (
                            <ul key={blockIndex} className="grid gap-2.5 sm:grid-cols-2">
                              {block.list.map((item) => (
                                <li
                                  key={item}
                                  className="group/item flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium leading-6 text-slate-700 transition-colors duration-200 hover:border-emerald-200 hover:bg-emerald-50/60"
                                >
                                  <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors duration-200 group-hover/item:bg-emerald-600 group-hover/item:text-white">
                                    <Check className="size-2.5" strokeWidth={3} />
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          );

                        case "linkOut":
                          return (
                            <p key={blockIndex} className="text-base leading-8 text-slate-600">
                              If you wish to exercise any of these rights, please contact us through our{" "}
                              <button type="button" onClick={() => navigate("/contact-us")} className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900">
                                Contact Us
                              </button>{" "}
                              page.
                            </p>
                          );

                        case "linksToOtherPages":
                          return (
                            <p key={blockIndex} className="text-base leading-8 text-slate-600">
                              Our website may contain links to other pages within JudgmentCalc to provide additional information and improve your experience. We encourage you to review our{" "}
                              <button type="button" onClick={() => navigate("/terms-and-conditions")} className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900">
                                Terms &amp; Conditions
                              </button>{" "}
                              for information about using our website and our{" "}
                              <button type="button" onClick={() => navigate("/about-us")} className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900">
                                About Us
                              </button>{" "}
                              page to learn more about our mission and experience.
                            </p>
                          );

                        case "contactCard":
                          return (
                            <div key={blockIndex} className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50/50">
                              <div className="p-6 sm:p-7">
                                <p className="text-base leading-8 text-slate-600">
                                  If you have any questions about this Privacy Policy, your personal information, or how we handle your data, please visit our Contact Us page. Our team will be happy to assist you.
                                </p>
                                <Button onClick={() => navigate("/contact-us")} className="group mt-5 h-11 rounded-xl px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(5,150,105,0.22)]">
                                  Contact our team
                                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                              </div>
                            </div>
                          );

                        default:
                          return null;
                      }
                    })}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Closing note */}
          <motion.div {...reveal(0.1)} className="relative isolate mx-auto mt-16 max-w-3xl overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 p-7 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-9">
            <div className="pointer-events-none absolute -bottom-16 -right-12 -z-10 size-48 rounded-full border border-emerald-200/70" />
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[0_14px_34px_rgba(5,150,105,0.24)]">
              <Handshake className="size-5" strokeWidth={1.8} />
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Thank you for trusting JudgmentCalc. We are committed to protecting your privacy and providing attorneys and law firms with a secure, reliable platform for managing judgment interest calculations and post-judgment case information.
            </p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-5 z-40 flex size-12 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_14px_36px_rgba(15,23,42,0.28)] transition-colors hover:bg-slate-800 sm:bottom-8 sm:right-8"
            aria-label="Back to top"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};

export default PrivacyPolicy;
