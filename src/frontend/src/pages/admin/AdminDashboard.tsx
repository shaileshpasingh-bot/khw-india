import { Seo } from "@/components/shared/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadCsv } from "@/lib/csv";
import type { VisitorSession } from "@/lib/data/mockData";
import { useData } from "@/lib/data/store";
import {
  Activity,
  Bell,
  Clock,
  Download,
  Heart,
  Mail,
  MousePointerClick,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

type RangeKey = "7d" | "30d" | "90d" | "all";

const RANGE_OPTIONS: { value: RangeKey; label: string; days: number | null }[] =
  [
    { value: "7d", label: "Last 7 days", days: 7 },
    { value: "30d", label: "Last 30 days", days: 30 },
    { value: "90d", label: "Last 90 days", days: 90 },
    { value: "all", label: "All time", days: null },
  ];

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export default function AdminDashboardPage() {
  const { data, addNotification } = useData();
  const [range, setRange] = useState<RangeKey>("30d");

  const rangeDays = RANGE_OPTIONS.find((r) => r.value === range)?.days ?? null;

  // Simulate an admin email notification the first time a long visit is seen.
  const notifiedLongVisits = useRef<Set<string>>(new Set());
  useEffect(() => {
    for (const session of data.sessions) {
      if (session.longVisit && !notifiedLongVisits.current.has(session.id)) {
        notifiedLongVisits.current.add(session.id);
        addNotification(
          `Long visit detected: a visitor spent ${formatDuration(
            session.durationSec,
          )} on the site.`,
          "warning",
        );
      }
    }
  }, [data.sessions, addNotification]);

  const filteredSessions = useMemo(() => {
    if (rangeDays === null) return data.sessions;
    const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
    return data.sessions.filter((s) => {
      const t = new Date(s.startTime).getTime();
      return !Number.isNaN(t) && t >= cutoff;
    });
  }, [data.sessions, rangeDays]);

  // ---- Overview metrics ----
  const totalVisitors = filteredSessions.length;
  const longVisits = filteredSessions.filter((s) => s.durationSec > 180).length;
  const avgSessionTime = totalVisitors
    ? filteredSessions.reduce((sum, s) => sum + s.durationSec, 0) /
      totalVisitors
    : 0;
  const bounceRate = totalVisitors
    ? (filteredSessions.filter((s) => s.pageViews <= 1).length /
        totalVisitors) *
      100
    : 0;

  // ---- Visitors over time (area) ----
  const visitorsOverTime = useMemo(() => {
    const byDate = new Map<string, number>();
    for (const s of filteredSessions) {
      const day = s.startTime.slice(0, 10);
      byDate.set(day, (byDate.get(day) ?? 0) + 1);
    }
    return [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, visitors]) => ({ date, visitors }));
  }, [filteredSessions]);

  // ---- Traffic sources (pie) ----
  const trafficSources = useMemo(() => {
    const bySource = new Map<string, number>();
    for (const s of filteredSessions) {
      const key = s.source || "Direct";
      bySource.set(key, (bySource.get(key) ?? 0) + 1);
    }
    return [...bySource.entries()].map(([name, value]) => ({ name, value }));
  }, [filteredSessions]);

  // ---- Top pages (bar) ----
  const topPages = useMemo(() => {
    const byPage = new Map<string, number>();
    for (const s of filteredSessions) {
      for (const page of s.pages) {
        byPage.set(page, (byPage.get(page) ?? 0) + 1);
      }
    }
    return [...byPage.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, visits]) => ({ name, visits }));
  }, [filteredSessions]);

  // ---- Device breakdown (pie) ----
  const deviceBreakdown = useMemo(() => {
    const byDevice = new Map<string, number>();
    for (const s of filteredSessions) {
      const key = s.device || "Unknown";
      byDevice.set(key, (byDevice.get(key) ?? 0) + 1);
    }
    return [...byDevice.entries()].map(([name, value]) => ({ name, value }));
  }, [filteredSessions]);

  // ---- CSV exports ----
  const exportVisitors = () =>
    downloadCsv(
      "visitors.csv",
      filteredSessions.map((s) => ({
        id: s.id,
        startTime: s.startTime,
        endTime: s.endTime,
        durationSec: s.durationSec,
        pageViews: s.pageViews,
        pages: s.pages.join(" | "),
        source: s.source,
        device: s.device,
        longVisit: s.longVisit ? "yes" : "no",
      })),
    );

  const exportDonors = () =>
    downloadCsv(
      "donors.csv",
      data.donations.map((d) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        amount: d.amount,
        frequency: d.frequency,
        programId: d.programId,
        message: d.message,
        date: d.date,
        status: d.status,
      })),
    );

  const exportVolunteers = () =>
    downloadCsv(
      "volunteers.csv",
      data.volunteerApplications.map((v) => ({
        id: v.id,
        roleId: v.roleId,
        name: v.name,
        email: v.email,
        phone: v.phone,
        message: v.message,
        status: v.status,
        date: v.date,
      })),
    );

  const exportRegistrations = () =>
    downloadCsv(
      "event-registrations.csv",
      data.eventRegistrations.map((r) => ({
        id: r.id,
        eventId: r.eventId,
        name: r.name,
        email: r.email,
        date: r.date,
      })),
    );

  const exportContacts = () =>
    downloadCsv(
      "contact-submissions.csv",
      data.contactSubmissions.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        subject: c.subject,
        message: c.message,
        date: c.date,
        status: c.status,
      })),
    );

  const exportNewsletterSubscribers = () =>
    downloadCsv(
      "newsletter-subscribers.csv",
      data.newsletterSubscribers.map((s) => ({
        id: s.id,
        email: s.email,
        date: s.date,
        active: s.active ? "yes" : "no",
      })),
    );

  const overviewCards = [
    {
      label: "Total visitors",
      value: totalVisitors.toLocaleString("en-IN"),
      hint: "Sessions in range",
      icon: Users,
    },
    {
      label: "Visitors > 3 min",
      value: longVisits.toLocaleString("en-IN"),
      hint: "High engagement",
      icon: Clock,
    },
    {
      label: "Average session time",
      value: formatDuration(Math.round(avgSessionTime)),
      hint: "Per visitor",
      icon: Activity,
    },
    {
      label: "Bounce rate",
      value: formatPercent(bounceRate),
      hint: "Single-page visits",
      icon: MousePointerClick,
    },
  ];

  const exportButtons = [
    { label: "Visitors", onClick: exportVisitors, icon: Users },
    { label: "Donors", onClick: exportDonors, icon: Heart },
    { label: "Volunteers", onClick: exportVolunteers, icon: Users },
    {
      label: "Event registrations",
      onClick: exportRegistrations,
      icon: Mail,
    },
    { label: "Contact submissions", onClick: exportContacts, icon: Mail },
    {
      label: "Newsletter subscribers",
      onClick: exportNewsletterSubscribers,
      icon: Mail,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Seo
        title="Dashboard | KHW-India Admin"
        description="Analytics overview for the KHW-India nonprofit site."
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visitor analytics and engagement for your nonprofit site.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Range</span>
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger
              className="w-44"
              data-ocid="admin.dashboard.range_select"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-accent" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-semibold">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visitors over time */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Visitors over time
          </CardTitle>
          <CardDescription>
            Daily visitor sessions in the selected range.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visitorsOverTime.length === 0 ? (
            <EmptyChart message="No visitor sessions in this range yet." />
          ) : (
            <ChartContainer
              config={{
                visitors: { label: "Visitors", color: "var(--color-chart-1)" },
              }}
              className="h-72"
            >
              <AreaChart
                data={visitorsOverTime}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="visitors"
                  type="monotone"
                  fill="var(--color-chart-1)"
                  fillOpacity={0.2}
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Traffic sources + device breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Traffic sources
            </CardTitle>
            <CardDescription>Where your visitors come from.</CardDescription>
          </CardHeader>
          <CardContent>
            {trafficSources.length === 0 ? (
              <EmptyChart message="No traffic data in this range yet." />
            ) : (
              <ChartContainer
                config={Object.fromEntries(
                  trafficSources.map((item, i) => [
                    item.name,
                    {
                      label: item.name,
                      color: CHART_COLORS[i % CHART_COLORS.length],
                    },
                  ]),
                )}
                className="h-64"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={trafficSources}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Device breakdown
            </CardTitle>
            <CardDescription>Devices used by your visitors.</CardDescription>
          </CardHeader>
          <CardContent>
            {deviceBreakdown.length === 0 ? (
              <EmptyChart message="No device data in this range yet." />
            ) : (
              <ChartContainer
                config={Object.fromEntries(
                  deviceBreakdown.map((item, i) => [
                    item.name,
                    {
                      label: item.name,
                      color: CHART_COLORS[i % CHART_COLORS.length],
                    },
                  ]),
                )}
                className="h-64"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={deviceBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top pages */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Top pages</CardTitle>
          <CardDescription>
            Most visited pages in the selected range.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topPages.length === 0 ? (
            <EmptyChart message="No page data in this range yet." />
          ) : (
            <ChartContainer
              config={{
                visits: { label: "Visits", color: "var(--color-chart-2)" },
              }}
              className="h-72"
            >
              <BarChart
                data={topPages}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="visits"
                  fill="var(--color-chart-2)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* CSV exports */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Export data</CardTitle>
          <CardDescription>
            Download records as CSV files for your records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {exportButtons.map((btn, index) => (
              <Button
                key={btn.label}
                type="button"
                variant="outline"
                data-ocid={`admin.dashboard.export_button.${index + 1}`}
                onClick={btn.onClick}
              >
                <Download className="size-4" aria-hidden="true" />
                {btn.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications log */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Admin notifications
          </CardTitle>
          <CardDescription>
            Alerts for long visits and high-intent form submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No notifications yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      notification.type === "success"
                        ? "bg-success"
                        : notification.type === "warning"
                          ? "bg-warning"
                          : "bg-primary"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">{notification.message}</span>
                  <Badge
                    variant={
                      notification.type === "success"
                        ? "default"
                        : notification.type === "warning"
                          ? "secondary"
                          : "outline"
                    }
                    className="shrink-0"
                  >
                    {notification.type}
                  </Badge>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {notification.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div
      data-ocid="admin.dashboard.chart_empty_state"
      className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center"
    >
      <Bell className="size-6 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
