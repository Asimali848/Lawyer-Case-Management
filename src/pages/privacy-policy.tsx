import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { setMeta } from "@/lib/seo";

type Block =
  | { kind: "text"; text: string }
  | { kind: "list"; list: string[] }
  | { kind: "linkOut" }
  | { kind: "linksToOtherPages" }
  | { kind: "contactCard" };

type Section = {
  id: string;
  title: string;
  body: Block[];
};

const text = (value: string): Block => ({ kind: "text", text: value });
const list = (items: string[]): Block => ({ kind: "list", list: items });

const sections: Section[] = [
  {
    id: "information-we-collect",
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
    title: "Cookies and Analytics",
    body: [
      text("JudgmentCalc may use cookies and similar technologies to improve website performance, remember your preferences, understand how visitors use our website, and enhance your browsing experience."),
      text("You can choose to disable cookies through your browser settings; however, some features of the website may not function properly if cookies are disabled."),
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    body: [
      text("We may work with trusted third-party service providers to help operate our website and business. These providers may assist with services such as:"),
      list(["Website hosting", "Payment processing", "Website analytics", "Email communications", "Customer support"]),
      text("These service providers only receive the information necessary to perform their services and are expected to protect your information."),
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    body: [
      text("We use appropriate administrative, technical, and organizational security measures to help protect your personal information from unauthorized access, misuse, disclosure, or loss. While we work hard to safeguard your information, no online system can guarantee complete security."),
    ],
  },
  {
    id: "your-privacy-rights",
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
    title: "Links to Other Pages",
    body: [{ kind: "linksToOtherPages" }],
  },
  {
    id: "changes-to-this-privacy-policy",
    title: "Changes to This Privacy Policy",
    body: [
      text("We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices. Any updates will be published on this page along with the revised effective date. We encourage you to review this page periodically to stay informed."),
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    body: [{ kind: "contactCard" }],
  },
];

const PrivacyPolicy = () => {
  // const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setMeta({
      title: "Privacy Policy | JudgmentCalc",
      description:
        "Read the JudgmentCalc Privacy Policy to learn how we collect, use, store, and protect your personal information when using our website and services.",
    });

    const handleScroll = () => setShowBackToTop(window.scrollY > 900);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const linkClass = "text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-900";

  return (
    <main className="bg-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
        <h1 className="text-center text-3xl leading-tight text-slate-950 sm:text-4xl">
          <span className="font-normal">JudgmentCalc</span> <span className="font-bold">Privacy Policy</span>
        </h1>

        <div className="mt-10 border-t border-slate-200" />

        <div className="mt-10 space-y-8">
          <p className="text-base leading-8 text-slate-600">
            At JudgmentCalc, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and the steps we take to help keep your information secure when you visit our website or use our judgment interest software.
          </p>
          <p className="text-base leading-8 text-slate-600"></p>
            Whether you are exploring our services, starting a free trial, or contacting our team, we want you to understand how your information is handled. To learn more about our company and why JudgmentCalc was created, please visit our{" "}
              <Link to="/about-us" className={linkClass}>
                About Us
              </Link>{" "}

          {sections.map(({ id, title, body }, index) => (
            <motion.section key={id} id={id} {...reveal(Math.min(index * 0.02, 0.1))} className="scroll-mt-8">
              <h2 className="text-base font-bold uppercase tracking-wide text-slate-950">{title}</h2>

              <div className="mt-3 space-y-4">
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
                        <ul key={blockIndex} className="list-disc space-y-1.5 pl-5 text-base leading-7 text-slate-600">
                          {block.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      );

                    case "linkOut":
                      return (
                        <p key={blockIndex} className="text-base leading-8 text-slate-600">
                          If you wish to exercise any of these rights, please contact us through our{" "}
                          <Link to="/contact-us" className={linkClass}>
                            Contact Us
                          </Link>{" "}
                          page.
                        </p>
                      );

                    case "linksToOtherPages":
                      return (
                        <p key={blockIndex} className="text-base leading-8 text-slate-600">
                          Our website may contain links to other pages within JudgmentCalc to provide additional information and improve your experience. We encourage you to review our{" "}
                          <Link to="/terms-and-conditions" className={linkClass}>
                            Terms &amp; Conditions
                          </Link>{" "}
                          for information about using our website and our{" "}
                          <Link to="/about-us" className={linkClass}>
                            About Us
                          </Link>{" "}
                          page to learn more about our mission and experience.
                        </p>
                      );

                    case "contactCard":
                      return (
                        <p key={blockIndex} className="text-base leading-8 text-slate-600">
                          If you have any questions about this Privacy Policy, your personal information, or how we handle your data, please visit our{" "}
                          <Link to="/contact-us" className={linkClass}>
                            Contact Us
                          </Link>{" "}
                          page. Our team will be happy to assist you.
                        </p>
                      );

                    default:
                      return null;
                  }
                })}
              </div>
            </motion.section>
          ))}

          <p className="text-base leading-8 text-slate-600">
            Thank you for trusting JudgmentCalc. We are committed to protecting your privacy and providing attorneys and law firms with a secure, reliable platform for managing judgment interest calculations and post-judgment case information.
          </p>
        </div>
      </div>

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
