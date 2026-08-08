import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import logo from "@/assets/img/logo.png";
import { getScrollBehavior } from "@/lib/utils";

const productLinks = [
  { label: "Features", section: "features" },
  { label: "How It Works", section: "how-it-works" },
  { label: "Pricing", section: "pricing" },
  { label: "FAQs", section: "faq" },
];

const companyLinks = [
  { label: "About Us", path: "/about-us" },
  { label: "Contact Us", path: "/contact-us" },
  { label: "Log in", path: "/login" },
];

const plans = ["Free 30-Day Trial", "Professional - $12.50/mo"];

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
      return;
    }
    navigate(`/#${id}`);
  };

  return (
    <footer className="relative w-full overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -left-40 top-12 size-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-80 rounded-full bg-amber-300/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 pb-7 pt-12 sm:px-8 sm:pt-14 lg:px-10 xl:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-white/10 pb-11 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr] lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 inline-block">
              <span className="inline-flex rounded-2xl bg-white px-3 py-2">
                <img src={logo} alt="JudgmentCalc home" className="h-14 w-auto object-contain" />
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              JudgmentCalc is a cloud-based judgment interest calculator and judgment enforcement software built for attorneys. Manage judgment cases, track payments, calculate accrued interest, and generate accurate payoff demand letters with confidence.
            </p>
          </div>

          <nav aria-label="Footer product navigation">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-300">Product</h3>
            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={`/#${link.section}`}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                    onClick={(e) => {
                      if (window.location.pathname === "/") {
                        e.preventDefault();
                        scrollToSection(link.section);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer company navigation">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-300">Company</h3>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-slate-300 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-300">Plans</h3>
            <ul className="mt-5 space-y-3">
              {plans.map((plan) => (
                <li key={plan}>
                  <a
                    href="#pricing"
                    className="flex items-start gap-2 text-left text-sm leading-5 text-slate-300 transition-colors hover:text-white"
                    onClick={(e) => {
                      if (window.location.pathname === "/") {
                        e.preventDefault();
                        scrollToSection("pricing");
                      }
                    }}
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" /> {plan}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} JudgmentCalc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy-policy" className="shrink-0 whitespace-nowrap transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="shrink-0 whitespace-nowrap transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
            <p>Built for attorneys managing post-judgment enforcement.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
