import {
  ArrowRight,
  Building2,
  CreditCard,
  Home,
  LayoutGrid,
  LogIn,
  Menu,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "@/assets/img/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getScrollBehavior } from "@/lib/utils";

const navigationItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Features", section: "features", icon: LayoutGrid },
  { label: "Pricing", section: "pricing", icon: CreditCard },
  { label: "About Us", path: "/about-us", icon: Building2 },
  { label: "Contact Us", path: "/contact-us", icon: MessagesSquare },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
      return;
    }
    navigate(`/#${id}`);
  };

  // const goTo = (path: string) => {
  //   setMobileMenuOpen(false);
  //   navigate(path);
  // };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-[76px] w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="JudgmentCalc home"
        >
          <img
            src={logo}
            alt="JudgmentCalc"
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:h-14"
          />
        </Link>

        <div className="hidden items-center gap-0.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1.5 shadow-inner lg:flex">
          {navigationItems.map(({ label, path, section, icon: Icon }) =>
            path ? (
              <Link
                key={path}
                to={path}
                className="group flex h-10 items-center gap-2 rounded-xl px-3 text-base font-semibold text-slate-600 transition-all hover:bg-white hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <Icon className="size-4 text-slate-400 transition-colors group-hover:text-primary" strokeWidth={1.8} />
                {label}
              </Link>
            ) : (
              <button
                key={section}
                type="button"
                onClick={() => scrollToSection(section!)}
                className="group flex h-10 items-center gap-2 rounded-xl px-3 text-base font-semibold text-slate-600 transition-all hover:bg-white hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <Icon className="size-4 text-slate-400 transition-colors group-hover:text-primary" strokeWidth={1.8} />
                {label}
              </button>
            ),
          )}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild className="h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(0,158,96,0.22)] transition-all hover:-translate-y-0.5 hover:from-emerald-500 hover:to-emerald-700 hover:shadow-[0_10px_24px_rgba(0,158,96,0.28)]">
            <Link to="/signup" className="inline-flex items-center gap-2">
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-11 rounded-xl px-4 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950">
            <Link to="/login" className="inline-flex items-center gap-2">
              <LogIn className="size-4" strokeWidth={1.8} />
              Log in
            </Link>
          </Button>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(88vw,360px)] border-slate-200 bg-white p-0">
            <SheetHeader className="border-b border-slate-100 px-6 py-5 text-left">
              <SheetTitle className="flex items-center justify-between">
                <img src={logo} alt="JudgmentCalc" className="h-12 w-auto" />
              </SheetTitle>
            </SheetHeader>

            <div className="flex h-[calc(100%-89px)] flex-col px-4 py-5">
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2.5 text-xs font-medium text-emerald-800">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                Accurate judgment tracking for legal professionals
              </div>

              <div className="flex flex-col gap-1">
                {navigationItems.map(({ label, path, section, icon: Icon }) =>
                  path ? (
                    <Link
                      key={path}
                      to={path}
                      className="flex h-12 items-center gap-3 rounded-xl px-3 text-left text-base font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <Icon className="size-4.5" strokeWidth={1.8} />
                      </span>
                      {label}
                    </Link>
                  ) : (
                    <button
                      key={section}
                      type="button"
                      onClick={() => scrollToSection(section!)}
                      className="flex h-12 items-center gap-3 rounded-xl px-3 text-left text-base font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-primary"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <Icon className="size-4.5" strokeWidth={1.8} />
                      </span>
                      {label}
                    </button>
                  ),
                )}
              </div>

              <div className="mt-auto grid gap-2 border-t border-slate-100 pt-5">
                <Button asChild className="h-11 rounded-xl font-semibold text-white shadow-lg shadow-emerald-900/10">
                  <Link to="/signup" className="inline-flex items-center gap-2">
                    Start free trial
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 font-semibold text-slate-700">
                  <Link to="/login" className="inline-flex items-center gap-2">
                    <LogIn className="size-4" />
                    Log in
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
