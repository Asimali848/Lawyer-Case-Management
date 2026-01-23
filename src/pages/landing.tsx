import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import Faq from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";
import Pricingplan from "@/components/landing/pricing";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToHero = () => {
    const el = document.getElementById("hero");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
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
      <Navbar />
      <section id="hero" className="w-full">
        <Hero />
      </section>
      <section id="features" className="w-full">
        <Features />
      </section>
      <section id="pricing" className="w-full">
        <Pricingplan />
      </section>
      <section id="faq" className="w-full">
        <Faq />
      </section>
      <Footer />

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
