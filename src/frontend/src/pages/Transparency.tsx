import { LazyImage } from "@/components/shared/LazyImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useData } from "@/lib/data/store";
import { cn } from "@/lib/utils";
import {
  ArrowDownToLine,
  BadgeCheck,
  BookOpen,
  Download,
  Eye,
  FileText,
  HeartPulse,
  Landmark,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

/** How every donated rupee is allocated across our programs. */
const ALLOCATION = [
  { key: "education", label: "Education", value: 42, icon: BookOpen },
  { key: "health", label: "Health & Nutrition", value: 28, icon: HeartPulse },
  {
    key: "protection",
    label: "Child Protection",
    value: 16,
    icon: ShieldCheck,
  },
  { key: "livelihood", label: "Family Livelihoods", value: 9, icon: Sprout },
  { key: "admin", label: "Admin & Operations", value: 5, icon: Landmark },
];

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const PIE_CONFIG = {
  education: { label: "Education", color: "var(--color-chart-1)" },
  health: { label: "Health & Nutrition", color: "var(--color-chart-2)" },
  protection: { label: "Child Protection", color: "var(--color-chart-3)" },
  livelihood: { label: "Family Livelihoods", color: "var(--color-chart-4)" },
  admin: { label: "Admin & Operations", color: "var(--color-chart-5)" },
} as const;

const BAR_CONFIG = {
  income: { label: "Income", color: "var(--color-chart-1)" },
  expense: { label: "Expense", color: "var(--color-chart-2)" },
} as const;

function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `₹${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(0)}L`;
  return `₹${value}`;
}

export default function TransparencyPage() {
  const { data } = useData();

  const reports = useMemo(
    () =>
      [...data.financialReports]
        .filter((r) => r.published)
        .sort((a, b) => b.year - a.year),
    [data.financialReports],
  );

  const latest = reports[0];

  const barData = useMemo(
    () =>
      [...reports]
        .sort((a, b) => a.year - b.year)
        .map((r) => ({
          year: String(r.year),
          income: r.totalIncome,
          expense: r.totalExpense,
        })),
    [reports],
  );

  const pieData = useMemo(
    () => ALLOCATION.map((a) => ({ name: a.key, value: a.value })),
    [],
  );

  const totalIncome = reports.reduce((sum, r) => sum + r.totalIncome, 0);
  const totalExpense = reports.reduce((sum, r) => sum + r.totalExpense, 0);
  const programShare =
    100 - (ALLOCATION.find((a) => a.key === "admin")?.value ?? 0);

  return (
    <div className="bg-background">
      <Seo
        title="Transparency & Financials | KHW-India"
        description="See exactly how every donation is used. Explore our fund allocation, downloadable annual reports, yearly summaries, and our transparency commitment."
      />

      {/* Page hero */}
      <section className="bg-gradient-subtle border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold tracking-wide text-accent uppercase">
                <Eye className="size-4" aria-hidden="true" />
                Transparency & Financials
              </span>
              <h1 className="font-display max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
                Open books, honest impact
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                We believe trust is earned with transparency. Here you can see
                exactly how every donation is used — from fund allocation to
                downloadable annual reports — so you can give with confidence.
              </p>
            </div>
            <LazyImage
              icon={Landmark}
              label="Transparently funded programs"
              className="aspect-[4/3] rounded-2xl shadow-elevated"
            />
          </div>
        </div>
      </section>

      {/* Key figures */}
      <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-1 p-6">
              <span className="text-sm text-muted-foreground">
                Total income (reported)
              </span>
              <span className="font-display text-3xl font-semibold text-foreground">
                {formatINR(totalIncome)}
              </span>
              <span className="text-sm text-muted-foreground">
                across {reports.length} published years
              </span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-1 p-6">
              <span className="text-sm text-muted-foreground">
                Total program spend
              </span>
              <span className="font-display text-3xl font-semibold text-foreground">
                {formatINR(totalExpense)}
              </span>
              <span className="text-sm text-muted-foreground">
                {programShare}% directly to programs
              </span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card shadow-card">
            <CardContent className="flex flex-col gap-1 p-6">
              <span className="text-sm text-muted-foreground">
                Latest report
              </span>
              <span className="font-display text-3xl font-semibold text-foreground">
                {latest ? latest.year : "—"}
              </span>
              <span className="text-sm text-muted-foreground">
                {latest ? latest.title : "No reports yet"}
              </span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fund usage breakdown */}
      <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="Where your money goes"
          title="How funds are used"
          description="A visual breakdown of how every donated rupee is allocated across our programs and operations."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Pie chart */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Allocation by program
              </CardTitle>
              <CardDescription>
                Share of every rupee, based on the latest annual report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={PIE_CONFIG}
                className="aspect-square max-h-[320px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value) => `${value}%`}
                      />
                    }
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="flex-wrap"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Allocation list */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Every rupee, accounted for
              </CardTitle>
              <CardDescription>
                Our commitment: at least 90% of donations go directly to
                programs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {ALLOCATION.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {item.value}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor:
                              CHART_COLORS[
                                ALLOCATION.findIndex((a) => a.key === item.key)
                              ],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Income vs expense bar chart */}
        <Card className="mt-6 border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Income vs. expense by year
            </CardTitle>
            <CardDescription>
              Reported income and program expenditure across published years.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={BAR_CONFIG} className="h-[300px] w-full">
              <BarChart data={barData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => formatCompact(v)}
                  width={56}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatINR(Number(value))}
                    />
                  }
                />
                <Bar dataKey="income" fill="var(--color-chart-1)" radius={4} />
                <Bar dataKey="expense" fill="var(--color-chart-2)" radius={4} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* Downloadable reports + yearly summary */}
      <section className="bg-gradient-subtle border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Reports & summaries"
            title="Download our annual reports"
            description="Every report is independently audited and published for public review. Download the full PDF or browse the yearly summary below."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Report cards */}
            <div className="flex flex-col gap-4">
              {reports.map((report, index) => (
                <Card
                  key={report.id}
                  className="border-border bg-card shadow-card"
                >
                  <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="size-7" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {report.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-accent/10 text-accent"
                        >
                          FY {report.year}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Income {formatINR(report.totalIncome)} · Expense{" "}
                        {formatINR(report.totalExpense)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled
                      data-ocid={`transparency.download.${index + 1}`}
                      className="shrink-0"
                    >
                      <Download className="size-4" aria-hidden="true" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {reports.length === 0 ? (
                <Card className="border-border bg-card shadow-card">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No published reports yet.
                  </CardContent>
                </Card>
              ) : null}
            </div>

            {/* Yearly summary table */}
            <Card className="border-border bg-card shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-xl">
                  Yearly summary
                </CardTitle>
                <CardDescription>
                  Income, expenditure, and surplus for each published year.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Year</th>
                        <th className="pb-3 pr-4 text-right font-medium">
                          Income
                        </th>
                        <th className="pb-3 pr-4 text-right font-medium">
                          Expense
                        </th>
                        <th className="pb-3 text-right font-medium">Surplus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...reports]
                        .sort((a, b) => b.year - a.year)
                        .map((report, index) => {
                          const surplus =
                            report.totalIncome - report.totalExpense;
                          return (
                            <tr
                              key={report.id}
                              data-ocid={`transparency.summary_row.${index + 1}`}
                              className="border-b border-border/60 last:border-0"
                            >
                              <td className="py-3 pr-4 font-medium text-foreground">
                                {report.year}
                              </td>
                              <td className="py-3 pr-4 text-right font-mono tabular-nums">
                                {formatINR(report.totalIncome)}
                              </td>
                              <td className="py-3 pr-4 text-right font-mono tabular-nums">
                                {formatINR(report.totalExpense)}
                              </td>
                              <td
                                className={cn(
                                  "py-3 text-right font-mono font-semibold tabular-nums",
                                  surplus >= 0
                                    ? "text-success"
                                    : "text-destructive",
                                )}
                              >
                                {surplus >= 0 ? "+" : ""}
                                {formatINR(surplus)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Transparency statement */}
      <section className="container mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionHeading
              align="left"
              eyebrow="Our commitment"
              title="The transparency statement"
            />
          </div>
          <div className="lg:col-span-2">
            <Card className="border-border bg-card shadow-card">
              <CardContent className="flex flex-col gap-6 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <BadgeCheck className="size-6" aria-hidden="true" />
                  </div>
                  <p className="text-lg leading-relaxed text-foreground">
                    Kinderhilfswerk Society (KHW-India) is committed to the
                    highest standards of financial transparency and
                    accountability. We publish audited annual reports, disclose
                    how every rupee is spent, and keep administrative costs lean
                    so that the vast majority of donations reach the children
                    and communities we serve.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      title: "90% to programs",
                      body: "At least 90% of every donation goes directly to education, health, protection, and livelihood programs.",
                    },
                    {
                      title: "Independently audited",
                      body: "Our accounts are reviewed by independent auditors and published for public scrutiny each year.",
                    },
                    {
                      title: "Open to questions",
                      body: "Have a question about our finances? Our team is happy to answer — reach out any time.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-border bg-background p-5"
                    >
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-start gap-3 rounded-xl bg-gradient-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <ArrowDownToLine
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-muted-foreground">
                      Want to dig deeper? Download the latest report above or
                      contact our finance team.
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    data-ocid="transparency.contact_button"
                  >
                    <a href="/contact">Contact us</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
