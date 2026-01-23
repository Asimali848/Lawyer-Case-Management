import { useEffect, useState } from "react";

import logo from "@/assets/img/logo.png";

const sections = ["features", "pricing", "faq", "contact"];

const Footer = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom >= 80) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="w-full bg-white px-4 py-10 text-gray-800 sm:px-8 md:px-16 lg:px-20">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-10 text-left sm:grid-cols-2 md:grid-cols-3">
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Logo" className="w-40 pb-3" />
          <p className="max-w-md text-sm text-gray-700 sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            pharetra condimentum.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-3 text-lg font-bold text-primary sm:text-xl">
            QUICK LINKS
          </h4>
          <ul className="flex flex-col gap-2 font-semibold sm:gap-3">
            {sections.map((section) => (
              <li key={section}>
                <button
                  className={`transition-colors hover:text-primary ${
                    activeSection === section ? "" : ""
                  }`}
                  onClick={() => scrollToSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Plans */}
        <div>
          <h4 className="mb-3 text-lg font-bold text-primary sm:text-xl">
            PRICING PLANS
          </h4>
          <ul className="flex flex-col gap-2 font-semibold sm:gap-3">
            <li>
              <button
                className="transition-colors hover:text-primary"
                onClick={() => scrollToSection("pricing")}
              >
                Free
              </button>
            </li>
            <li>
              <button
                className="transition-colors hover:text-primary"
                onClick={() => scrollToSection("pricing")}
              >
                Paid
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 border-t border-primary pt-4 text-center text-xs text-gray-600 sm:text-sm">
        © {new Date().getFullYear()} Judgmentcalc. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
