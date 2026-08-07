import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import ContactCta from "@/components/landing/contact-cta";
import Faq from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Pricingplan from "@/components/landing/pricing";
import WhyAttorneys from "@/components/landing/why-attorneys";
import { Button } from "@/components/ui/button";
import { getScrollBehavior } from "@/lib/utils";
import { setMeta } from "@/lib/seo";

const Landing = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToHero = () => {
    const el = document.getElementById("hero");
    if (el) {
      el.scrollIntoView({ behavior: getScrollBehavior() });
    }
  };

  useEffect(() => {
    setMeta({
      title: "Judgment Interest Software for Attorneys | JudgmentCalc",
      description:
        "Simplify judgment enforcement with JudgmentCalc. Calculate judgment interest, track payments and costs, generate payoff demand letters, and manage judgment cases with confidence.",
    });

    if (window.location.hash) {
      window.setTimeout(() => {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
      }, 0);
    }

    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;

        setShowScrollButton(heroBottom < 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center bg-white">
      <section id="hero" className="w-full">
        <Hero />
      </section>
      <WhyAttorneys />
      <section id="features" className="w-full">
        <Features />
      </section>
      <HowItWorks />
      <section id="pricing" className="w-full">
        <Pricingplan />
      </section>
      <ContactCta />
      <section id="faq" className="w-full">
        <Faq />
      </section>

      {/* Arrow Up Button */}
      {showScrollButton && (
        <Button
          onClick={scrollToHero}
          className="fixed right-16 bottom-16 z-20 size-16 animate-bounce rounded-full bg-primary p-5 text-white shadow-lg transition-colors duration-900 hover:bg-primary/80"
        >
          <ArrowUp className="size-6" />
        </Button>
      )}
    </div>
  );
};

export default Landing;
