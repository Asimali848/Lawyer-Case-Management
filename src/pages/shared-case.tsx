import { ArrowUpRight, Banknote, Calendar, Gavel, Loader2, Scale, ShieldAlert } from "lucide-react";
import { useParams } from "react-router-dom";
import Logo from "@/assets/img/logo.png";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPublicSharedCaseQuery } from "@/store/services/sharing";

/** Format a number as US currency */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

/** Parse YYYY-MM-DD into M/D/YYYY */
const fmtDate = (d: string) => {
  if (!d) return "N/A";
  try {
    const [y, m, day] = d.split("-").map(Number);
    return `${m}/${day}/${y}`;
  } catch {
    return d;
  }
};

const SharedCase = () => {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, error } = useGetPublicSharedCaseQuery(token || "", {
    skip: !token,
  });

  // ─── Loading ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading case details…</p>
        </div>
      </Shell>
    );
  }

  // ─── Error / invalid link ───────────────────────────────────────
  if (error || !data) {
    const errorDetail = (error as any)?.data?.detail || "This share link is invalid or has expired.";
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <ShieldAlert className="size-7 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold">Invalid Share Link</h2>
          <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">{errorDetail}</p>
        </div>
      </Shell>
    );
  }

  // ─── Case data ──────────────────────────────────────────────────
  const { case_name, court_name, total_due, judgment_amount, judgment_date, annual_interest_rate, end_date, total_interest_accrued, principal_reduction, transactions } = data;

  return (
    <Shell>
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">{case_name || "Shared Case"}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Scale className="size-3.5" />
            <span>{court_name || "N/A"}</span>
          </div>
          <span className="text-muted-foreground/40">•</span>
          <div className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            <span>As of {fmtDate(end_date)}</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <SummaryCard label="Judgment Amount" value={fmt(judgment_amount)} icon={<Gavel className="size-4 text-primary" />} />
        <SummaryCard label="Interest Rate" value={`${annual_interest_rate}%`} icon={<ArrowUpRight className="size-4 text-amber-500" />} />
        <SummaryCard label="Total Interest" value={fmt(total_interest_accrued)} icon={<Banknote className="size-4 text-orange-500" />} />
        <SummaryCard label="Total Payments" value={fmt(principal_reduction)} icon={<Banknote className="size-4 text-green-500" />} />
      </div>

      {/* Payoff highlight */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-1 py-5 sm:py-6">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">Today's Payoff</span>
          <span className="text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">{fmt(total_due)}</span>
          <span className="text-[11px] text-muted-foreground sm:text-xs">Judgment date: {fmtDate(judgment_date)}</span>
        </CardContent>
      </Card>

      {/* Transaction history */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground sm:text-lg">Transaction History</h2>

        {transactions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No transactions recorded.
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-lg border sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Accrued Interest</th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Principal Balance</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium text-green-600">{fmtDate(t.date)}</td>
                      <td className="px-4 py-2.5">
                        <Badge
                          variant="outline"
                          className={
                            t.type === "PAYMENT"
                              ? "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
                          }
                        >
                          {t.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-right">{fmt(t.amount)}</td>
                      <td className="px-4 py-2.5 text-right">{fmt(t.accrued_interest)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{fmt(t.principal_balance)}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{t.description || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 sm:hidden">
              {transactions.map((t, i) => (
                <Card key={i}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">{fmtDate(t.date)}</span>
                      <Badge
                        variant="outline"
                        className={
                          t.type === "PAYMENT"
                            ? "border-green-300 bg-green-50 text-[10px] text-green-700"
                            : "border-red-300 bg-red-50 text-[10px] text-red-700"
                        }
                      >
                        {t.type}
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-y-1.5 text-xs">
                      <div>
                        <span className="text-muted-foreground">Amount</span>
                        <p className="font-medium">{fmt(t.amount)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Accrued Int.</span>
                        <p className="font-medium">{fmt(t.accrued_interest)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Principal Bal.</span>
                        <p className="font-semibold">{fmt(t.principal_balance)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Description</span>
                        <p className="font-medium">{t.description || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
};

// ─── Reusable layout shell ──────────────────────────────────────────
const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[100dvh] bg-background">
    {/* Mini navbar */}
    <nav className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <img src={Logo} alt="JudgmentCalc" className="h-8 rounded dark:bg-white dark:px-1 sm:h-9" />
        <Badge variant="outline" className="text-[10px] sm:text-xs">
          Read-Only View
        </Badge>
      </div>
    </nav>
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-6">
      {children}
    </main>
  </div>
);

// ─── Summary stat card ──────────────────────────────────────────────
const SummaryCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <Card>
    <CardContent className="flex flex-col gap-1 p-3 sm:p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] sm:text-xs">{label}</span>
      </div>
      <span className="text-sm font-bold sm:text-base lg:text-lg">{value}</span>
    </CardContent>
  </Card>
);

export default SharedCase;
