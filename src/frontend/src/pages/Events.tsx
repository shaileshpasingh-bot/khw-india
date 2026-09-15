import { LazyImage } from "@/components/shared/LazyImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EventItem } from "@/lib/data/mockData";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDate(dateStr).getTime() < today.getTime();
}

interface CalendarCell {
  key: string;
  day: number | null;
}

function buildCalendar(year: number, month: number): CalendarCell[] {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ key: `empty-${i}`, day: null });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({
      key: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(
        2,
        "0",
      )}`,
      day: d,
    });
  }
  return cells;
}

interface RegistrationDialogProps {
  event: EventItem | null;
  onOpenChange: (open: boolean) => void;
}

function RegistrationDialog({ event, onOpenChange }: RegistrationDialogProps) {
  const { t } = useTranslation();
  const { addEventRegistration } = useData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const open = event !== null;

  function handleOpenChange(next: boolean) {
    if (!next) {
      setName("");
      setEmail("");
      setPhone("");
      setSubmitted(false);
    }
    onOpenChange(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    addEventRegistration({
      id: `er-${Date.now().toString(36)}`,
      eventId: event.id,
      name: name.trim(),
      email: email.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    setSubmitted(true);
  }

  const canSubmit = name.trim() !== "" && email.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {submitted
              ? "You're registered!"
              : `Register for ${event?.title ?? ""}`}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? "We've saved your registration. We'll be in touch with the details."
              : event
                ? `${formatDate(event.date)} · ${event.time} · ${event.location}`
                : ""}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CalendarDays className="size-7" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">
              Thank you, {name.trim()}. We look forward to seeing you at{" "}
              <span className="font-medium text-foreground">
                {event?.title}
              </span>
              .
            </p>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              data-ocid="events.registration_close_button"
              onClick={() => handleOpenChange(false)}
            >
              {t("common.close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-name">{t("common.name")}</Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                data-ocid="events.registration_name_input"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-email">{t("common.email")}</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                data-ocid="events.registration_email_input"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-phone">{t("common.phone")}</Label>
              <Input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 00000 00000"
                autoComplete="tel"
                data-ocid="events.registration_phone_input"
              />
            </div>
            <Button
              type="submit"
              className="mt-1 w-full rounded-full"
              disabled={!canSubmit}
              data-ocid="events.registration_submit_button"
            >
              {t("common.submit")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EventCardProps {
  event: EventItem;
  onRegister: (event: EventItem) => void;
}

function EventCard({ event, onRegister }: EventCardProps) {
  const date = parseDate(event.date);

  return (
    <article
      id={event.id}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-shadow hover:shadow-elevated"
      data-ocid={`events.upcoming_card.${event.id}`}
    >
      <div className="relative">
        <LazyImage
          icon={CalendarDays}
          label={event.category}
          className="aspect-[16/9] w-full"
        />
        <div className="absolute top-4 left-4 flex flex-col items-center rounded-xl bg-background/95 px-3 py-2 text-center shadow-subtle backdrop-blur">
          <span className="font-display text-2xl leading-none font-semibold text-accent">
            {date.getDate()}
          </span>
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {date.toLocaleDateString("en-IN", { month: "short" })}
          </span>
        </div>
        <Badge className="absolute right-4 bottom-4" variant="secondary">
          {event.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl font-semibold text-balance">
          {event.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 text-accent" aria-hidden="true" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-accent" aria-hidden="true" />
            {event.time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-accent" aria-hidden="true" />
            {event.location}
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4 text-accent" aria-hidden="true" />
            {event.capacity} seats
          </span>
        </div>

        <Button
          type="button"
          className="mt-2 w-full rounded-full"
          data-ocid={`events.register_button.${event.id}`}
          onClick={() => onRegister(event)}
        >
          Register
        </Button>
      </div>
    </article>
  );
}

interface CalendarViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

function CalendarView({ events, onSelectEvent }: CalendarViewProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const event of events) {
      const key = event.date;
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const cells = useMemo(() => buildCalendar(year, month), [year, month]);

  function changeMonth(delta: number) {
    let nextMonth = month + delta;
    let nextYear = year;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    setMonth(nextMonth);
    setYear(nextYear);
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Previous month"
            data-ocid="events.calendar_prev_button"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Next month"
            data-ocid="events.calendar_next_button"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            {day}
          </div>
        ))}
        {cells.map((cell) => {
          if (cell.day === null) {
            return <div key={cell.key} className="aspect-square" />;
          }
          const day = cell.day;
          const dateStr = cell.key;
          const dayEvents = eventsByDate.get(dateStr) ?? [];
          const isToday = isCurrentMonth && day === now.getDate();
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={cell.key}
              type="button"
              disabled={!hasEvents}
              onClick={() => hasEvents && onSelectEvent(dayEvents[0])}
              aria-label={
                hasEvents
                  ? `${day} ${MONTHS[month]} — ${dayEvents
                      .map((e) => e.title)
                      .join(", ")}`
                  : `${day} ${MONTHS[month]}`
              }
              data-ocid={`events.calendar_day.${day}`}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors",
                hasEvents
                  ? "bg-accent/15 font-semibold text-accent hover:bg-accent/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  : "text-foreground/80 hover:bg-muted",
                isToday && "ring-2 ring-primary ring-offset-1 ring-offset-card",
              )}
            >
              <span>{day}</span>
              {hasEvents ? (
                <span className="mt-0.5 size-1.5 rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent" /> Event day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full ring-2 ring-primary" /> Today
        </span>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { data } = useData();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const upcoming = useMemo(
    () =>
      [...data.events]
        .filter((e) => !isPast(e.date))
        .sort(
          (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime(),
        ),
    [data.events],
  );

  const past = useMemo(
    () =>
      [...data.events]
        .filter((e) => isPast(e.date))
        .sort(
          (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime(),
        ),
    [data.events],
  );

  return (
    <>
      <Seo
        title="Events | KHW-India"
        description="Join KHW-India at our upcoming events — fundraising galas, community health camps, and volunteer opportunities across India."
      />

      {/* Page header */}
      <section className="bg-gradient-subtle border-b">
        <div className="container mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:py-20">
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            Events
          </span>
          <h1 className="font-display max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
            Join us at an event
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            From fundraising galas to community health camps, there's always a
            way to get involved, meet our team, and make a difference for
            children across India.
          </p>
        </div>
      </section>

      {/* Calendar + upcoming */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-6">
            <SectionHeading
              align="left"
              eyebrow="Upcoming"
              title="What's happening next"
              description="Browse our upcoming events and register to join us in person or online."
            />
            {upcoming.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {upcoming.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={setSelectedEvent}
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card p-10 text-center"
                data-ocid="events.upcoming_empty_state"
              >
                <CalendarDays
                  className="size-10 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="font-display text-lg font-semibold">
                  No upcoming events right now
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Check back soon — we're always planning new ways to get
                  involved.
                </p>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CalendarView
              events={data.events}
              onSelectEvent={setSelectedEvent}
            />
          </aside>
        </div>
      </section>

      {/* Past events */}
      {past.length > 0 ? (
        <section className="bg-gradient-subtle border-t">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <SectionHeading
              align="left"
              eyebrow="Past events"
              title="Moments we shared"
              description="A look back at the events that brought our community together."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <article
                  key={event.id}
                  className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-subtle"
                  data-ocid={`events.past_card.${event.id}`}
                >
                  <LazyImage
                    icon={CalendarDays}
                    label={event.category}
                    className="aspect-[16/9] w-full"
                  />
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{event.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <span className="mt-auto flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                      <MapPin
                        className="size-4 text-accent"
                        aria-hidden="true"
                      />
                      {event.location}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <RegistrationDialog
        event={selectedEvent}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      />
    </>
  );
}
