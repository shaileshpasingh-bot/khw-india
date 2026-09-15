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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  Paperclip,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const AVAILABILITY_OPTIONS = [
  "Weekdays (mornings)",
  "Weekdays (evenings)",
  "Weekends",
  "Flexible / Remote",
] as const;

interface FormState {
  name: string;
  email: string;
  phone: string;
  roleId: string;
  availability: string;
  message: string;
  resumeName: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  roleId: "",
  availability: "",
  message: "",
  resumeName: "",
};

export default function GetInvolvedPage() {
  const { t } = useTranslation();
  const { data, addVolunteerApplication } = useData();
  const roles = data.volunteerRoles;
  const openRoles = useMemo(() => roles.filter((role) => role.open), [roles]);
  const opportunities = data.events.filter(
    (event) => event.category === "Volunteer" || event.category === "Health",
  );

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleResume = (file: File | undefined) => {
    setField("resumeName", file ? file.name : "");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.roleId) {
      setError(t("getInvolved.formError"));
      return;
    }

    const details = [
      `Availability: ${form.availability || "Not specified"}`,
      form.resumeName ? `Resume: ${form.resumeName}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    addVolunteerApplication({
      id: `va-${Date.now().toString(36)}`,
      roleId: form.roleId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim()
        ? `${form.message.trim()}\n\n${details}`
        : details,
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    });

    setForm(EMPTY_FORM);
    setSubmitted(true);
  };

  const scrollToForm = (roleId: string) => {
    setField("roleId", roleId);
    document
      .getElementById("volunteer-application")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-background">
      <Seo
        title="Get Involved · Volunteer with KHW-India"
        description="Volunteer your time with KHW-India. Explore open volunteer roles, apply to join our team, and discover upcoming opportunities to support children across India."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="container relative z-10 flex flex-col items-center gap-6 py-20 text-center sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full px-3 py-1 text-accent"
            >
              <HeartHandshake className="size-3.5" aria-hidden="true" />
              {t("getInvolved.heroBadge")}
            </Badge>
            <h1 className="font-display max-w-3xl text-4xl font-semibold text-balance text-foreground sm:text-5xl md:text-6xl">
              {t("getInvolved.heroTitle")}{" "}
              <span className="text-gradient-warm">
                {t("getInvolved.heroTitleAccent")}
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              {t("getInvolved.heroSubtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="w-full max-w-4xl"
          >
            <div className="overflow-hidden rounded-3xl shadow-elevated ring-1 ring-border">
              <LazyImage
                icon={Users}
                label="Volunteers in action"
                className="aspect-[16/9] w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Volunteer roles */}
      <section className="container py-16 sm:py-20">
        <SectionHeading
          eyebrow={t("getInvolved.rolesEyebrow")}
          title={t("getInvolved.rolesTitle")}
          description={t("getInvolved.rolesDescription")}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card
                data-ocid={`get_involved.role_card.${index}`}
                className="h-full shadow-card transition-shadow hover:shadow-elevated"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="font-display text-xl">
                      {role.title}
                    </CardTitle>
                    {role.open ? (
                      <Badge className="bg-success/15 text-success">Open</Badge>
                    ) : (
                      <Badge variant="secondary">On hold</Badge>
                    )}
                  </div>
                  <CardDescription className="leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Clock
                        className="size-4 text-accent"
                        aria-hidden="true"
                      />
                      {role.commitment}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin
                        className="size-4 text-accent"
                        aria-hidden="true"
                      />
                      {role.location}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant={role.open ? "default" : "outline"}
                    disabled={!role.open}
                    data-ocid={`get_involved.apply_button.${index}`}
                    className="mt-auto w-full rounded-full"
                    onClick={() => scrollToForm(role.id)}
                  >
                    {role.open ? t("getInvolved.apply") : t("getInvolved.soon")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section
        id="volunteer-application"
        className="bg-gradient-subtle py-16 sm:py-20"
      >
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <SectionHeading
                align="left"
                eyebrow={t("getInvolved.formEyebrow")}
                title={t("getInvolved.formTitle")}
                description={t("getInvolved.formDescription")}
              />
              <div className="mt-8 flex flex-col gap-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Sparkles
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <p>{t("getInvolved.formPoint1")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Users
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <p>{t("getInvolved.formPoint2")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <p>{t("getInvolved.formPoint3")}</p>
                </div>
              </div>
            </div>

            <Card className="shadow-elevated">
              {submitted ? (
                <div
                  data-ocid="get_involved.success_state"
                  className="flex flex-col items-center gap-4 px-6 py-16 text-center"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-success/15">
                    <CheckCircle2
                      className="size-9 text-success"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display text-2xl font-semibold">
                    {t("getInvolved.successTitle")}
                  </h3>
                  <p className="max-w-md text-muted-foreground">
                    {t("getInvolved.successDescription")}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="get_involved.submit_another_button"
                    className="mt-2 rounded-full"
                    onClick={() => setSubmitted(false)}
                  >
                    {t("getInvolved.submitAnother")}
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 p-6 sm:p-8"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">{t("common.name")} *</Label>
                      <Input
                        id="name"
                        data-ocid="get_involved.name_input"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder={t("getInvolved.namePlaceholder")}
                        autoComplete="name"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">{t("common.email")} *</Label>
                      <Input
                        id="email"
                        type="email"
                        data-ocid="get_involved.email_input"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">{t("common.phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        data-ocid="get_involved.phone_input"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder="+91 90000 00000"
                        autoComplete="tel"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="role">
                        {t("getInvolved.preferredRole")} *
                      </Label>
                      <Select
                        value={form.roleId}
                        onValueChange={(value) => setField("roleId", value)}
                      >
                        <SelectTrigger
                          id="role"
                          data-ocid="get_involved.role_select"
                          className="w-full"
                        >
                          <SelectValue
                            placeholder={t("getInvolved.rolePlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {openRoles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="availability">
                      {t("getInvolved.availability")}
                    </Label>
                    <Select
                      value={form.availability}
                      onValueChange={(value) => setField("availability", value)}
                    >
                      <SelectTrigger
                        id="availability"
                        data-ocid="get_involved.availability_select"
                        className="w-full"
                      >
                        <SelectValue
                          placeholder={t("getInvolved.availabilityPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABILITY_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message">{t("common.message")}</Label>
                    <Textarea
                      id="message"
                      data-ocid="get_involved.message_textarea"
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                      placeholder={t("getInvolved.messagePlaceholder")}
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="resume">{t("getInvolved.resume")}</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="resume"
                        type="file"
                        data-ocid="get_involved.resume_input"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleResume(e.target.files?.[0])}
                        className="cursor-pointer"
                      />
                      {form.resumeName ? (
                        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                          <Paperclip
                            className="size-4 text-accent"
                            aria-hidden="true"
                          />
                          <span className="max-w-[10rem] truncate">
                            {form.resumeName}
                          </span>
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("getInvolved.resumeHint")}
                    </p>
                  </div>

                  {error ? (
                    <p
                      data-ocid="get_involved.form_error"
                      className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    >
                      {error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    data-ocid="get_involved.submit_button"
                    className="w-full rounded-full"
                  >
                    <HeartHandshake className="size-4" aria-hidden="true" />
                    {t("getInvolved.submitApplication")}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming opportunities */}
      <section className="container py-16 sm:py-20">
        <SectionHeading
          eyebrow={t("getInvolved.opportunitiesEyebrow")}
          title={t("getInvolved.opportunitiesTitle")}
          description={t("getInvolved.opportunitiesDescription")}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card
                data-ocid={`get_involved.opportunity_card.${index}`}
                className="h-full shadow-card transition-shadow hover:shadow-elevated"
              >
                <CardHeader>
                  <Badge className="w-fit bg-accent/15 text-accent">
                    {event.category}
                  </Badge>
                  <CardTitle className="font-display text-xl">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays
                      className="size-4 text-accent"
                      aria-hidden="true"
                    />
                    {formatDate(event.date)} · {event.time}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-accent" aria-hidden="true" />
                    {event.location}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
