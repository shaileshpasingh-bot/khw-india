import { DonateButton } from "@/components/shared/DonateButton";
import { LazyImage } from "@/components/shared/LazyImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import { TestimonialsCarousel } from "@/components/shared/TestimonialsCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import {
  ArrowRight,
  BookOpen,
  HeartPulse,
  Quote,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Home — the KHW-India landing page.
 *
 * Sections: hero, animated impact stats, featured programs, testimonials,
 * latest impact story, newsletter signup, and partner logos.
 *
 * NOTE: Real integrations to add later —
 *  - Donate CTA: wire to Stripe / Razorpay checkout (see Donate page).
 *  - Newsletter: send to a real email provider (e.g. Mailchimp) in addition to
 *    the local data store.
 *  - Analytics: replace the local session store with a real analytics service.
 */

const PROGRAM_ICONS: Record<string, typeof BookOpen> = {
  BookOpen,
  HeartPulse,
  ShieldCheck,
  Sprout,
};

interface Stat {
  label: string;
  labelHi: string;
  value: number;
  suffix?: string;
  prefix?: string;
  format?: "number" | "compact";
}

const STATS: Stat[] = [
  {
    label: "Children supported",
    labelHi: "सहायता प्राप्त बच्चे",
    value: 15000,
    suffix: "+",
    format: "compact",
  },
  {
    label: "Active programs",
    labelHi: "सक्रिय कार्यक्रम",
    value: 24,
    suffix: "",
  },
  {
    label: "Volunteers",
    labelHi: "स्वयंसेवक",
    value: 1200,
    suffix: "+",
    format: "compact",
  },
  {
    label: "Funds raised",
    labelHi: "जुटाई गई धनराशि",
    value: 4200000,
    prefix: "₹",
    format: "compact",
  },
];

/** Count-up number that animates when scrolled into view. */
function CountUp({
  value,
  prefix = "",
  suffix = "",
  format = "number",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: "number" | "compact";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic for a natural settle.
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const formatted =
    format === "compact"
      ? new Intl.NumberFormat("en-IN", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(display)
      : display.toLocaleString("en-IN");

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const { t, lang } = useTranslation();
  const { data, addNewsletterSubscriber, addNotification } = useData();

  const featuredPrograms = data.programs.filter((p) => p.status === "active");
  const featuredStory = data.stories.find((s) => s.featured) ?? data.stories[0];
  const partners = data.partners;

  // Admin-editable page text (from the pageContent store), falling back to
  // translations when no custom content has been saved.
  const pageText = (key: string) =>
    data.pageContent.find((pc) => pc.key === key);
  const heroTitle = pageText("hero.title");
  const heroSubtitle = pageText("hero.subtitle");
  const heroTitleValue = heroTitle
    ? heroTitle[lang === "hi" ? "valueHi" : "valueEn"]
    : null;
  const heroSubtitleValue = heroSubtitle
    ? heroSubtitle[lang === "hi" ? "valueHi" : "valueEn"]
    : null;

  // Newsletter form state (local UI draft).
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    const added = addNewsletterSubscriber({
      id: `sub-${Date.now().toString(36)}`,
      email: trimmed,
      date: new Date().toISOString().slice(0, 10),
      active: true,
    });
    if (added) {
      setSubscribed(true);
      setEmail("");
      setError(null);
      addNotification(`New newsletter subscriber: ${trimmed}.`, "info");
    } else {
      setError(t("home.newsletterExists"));
    }
  };

  return (
    <>
      <Seo
        title="KHW-India | Every child deserves a safe, bright future"
        description="Kinderhilfswerk Society (KHW-India) protects children and strengthens communities through education, health, and child protection programs across India. Support a child today."
      />

      {/* ============ HERO ============ */}
      <section
        data-ocid="home.hero"
        className="relative overflow-hidden bg-gradient-subtle"
      >
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start gap-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-subtle">
              <HeartPulse className="size-4 text-accent" aria-hidden="true" />
              {t("hero.badge")}
            </span>
            <h1 className="font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
              {heroTitleValue ? (
                heroTitleValue
              ) : (
                <>
                  {t("hero.title")}{" "}
                  <span className="text-gradient-warm">
                    {t("hero.titleAccent")}
                  </span>
                </>
              )}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              {heroSubtitleValue ?? t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <DonateButton />
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link to="/get-involved" data-ocid="home.hero.get_involved">
                  {t("nav.getInvolved")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl shadow-elevated">
              <LazyImage
                icon={HeartPulse}
                label={
                  lang === "hi"
                    ? "हमारे कार्यक्रमों से जुड़े बच्चे"
                    : "Children in our programs"
                }
                className="aspect-[4/3] w-full"
              />
            </div>
            {/* Floating impact chip */}
            <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-elevated sm:left-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-gradient-warm text-white">
                <HeartPulse className="size-5" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-xl font-semibold text-gradient-warm">
                  15,000+
                </p>
                <p className="text-xs text-muted-foreground">
                  {lang === "hi" ? "बच्चों तक पहुँच" : "children reached"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ IMPACT STATS ============ */}
      <section
        data-ocid="home.impact"
        className="border-y bg-card/60"
        aria-label="Our impact at a glance"
      >
        <div className="container grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="font-display text-4xl font-semibold text-gradient-warm sm:text-5xl">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  format={stat.format}
                />
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {lang === "hi" ? stat.labelHi : stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PROGRAMS ============ */}
      <section data-ocid="home.programs" className="py-20">
        <div className="container">
          <SectionHeading
            eyebrow={lang === "hi" ? "हमारे कार्यक्रम" : "Our Programs"}
            title={
              lang === "hi"
                ? "जहाँ हम सबसे अधिक प्रभाव डालते हैं"
                : "Where we make the biggest impact"
            }
            description={
              lang === "hi"
                ? "हमारे केंद्रित कार्यक्रम बच्चों की सुरक्षा, स्वास्थ्य और शिक्षा सुनिश्चित करते हैं।"
                : "Our focused programs keep children safe, healthy, and learning — so they can build brighter futures."
            }
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPrograms.map((program, index) => {
              const Icon = PROGRAM_ICONS[program.icon] ?? BookOpen;
              return (
                <motion.article
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  data-ocid={`home.program_card.${index}`}
                  className="group flex flex-col gap-5 rounded-2xl border bg-card p-7 shadow-card transition-shadow hover:shadow-elevated"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="size-7" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl font-semibold">
                      {lang === "hi" ? program.titleHi : program.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {lang === "hi"
                        ? program.descriptionHi
                        : program.description}
                    </p>
                  </div>
                  <p className="mt-auto text-sm font-medium text-accent">
                    {program.impact}
                  </p>
                  <Link
                    to="/programs"
                    data-ocid={`home.program_link.${index}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                  >
                    {t("common.learnMore")}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section
        data-ocid="home.testimonials"
        className="border-y bg-gradient-subtle py-20"
      >
        <div className="container">
          <SectionHeading
            eyebrow={lang === "hi" ? "प्रशंसापत्र" : "Testimonials"}
            title={
              lang === "hi" ? "हमारे समुदाय की आवाज़ें" : "Voices from our community"
            }
            description={
              lang === "hi"
                ? "जिन परिवारों और साझेदारों के जीवन को हमने छुआ है, उनकी कहानियाँ।"
                : "Stories from the families, volunteers, and partners whose lives we touch."
            }
          />
          <div className="mt-12">
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* ============ LATEST IMPACT STORY ============ */}
      {featuredStory ? (
        <section data-ocid="home.story" className="py-20">
          <div className="container grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-3xl shadow-elevated"
            >
              <LazyImage
                icon={Quote}
                label={featuredStory.category}
                className="aspect-[4/3] w-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start gap-5"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                <Quote className="size-4" aria-hidden="true" />
                {lang === "hi" ? "प्रभाव की कहानी" : "Impact Story"}
              </span>
              <h2 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
                {featuredStory.title}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {featuredStory.excerpt}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {featuredStory.name} · {featuredStory.category}
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link
                  to={`/stories/${featuredStory.id}`}
                  data-ocid="home.story.read_more"
                >
                  {t("common.readMore")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* ============ NEWSLETTER ============ */}
      <section
        data-ocid="home.newsletter"
        className="border-y bg-gradient-primary py-16 text-primary-foreground"
      >
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
            {t("footer.newsletterTitle")}
          </h2>
          <p className="max-w-xl text-base text-primary-foreground/85">
            {t("footer.newsletterDesc")}
          </p>
          {subscribed ? (
            <p
              data-ocid="home.newsletter_success"
              className="rounded-full bg-white/15 px-6 py-3 text-sm font-medium"
            >
              {t("footer.newsletterSuccess")}
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                }}
                placeholder={t("footer.newsletterPlaceholder")}
                data-ocid="home.newsletter_input"
                aria-label={t("common.email")}
                className="flex-1 rounded-full border-transparent bg-white/15 text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:border-white focus-visible:ring-white/40"
              />
              <Button
                type="submit"
                data-ocid="home.newsletter_submit"
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {t("common.subscribe")}
              </Button>
            </form>
          )}
          {error ? (
            <p
              data-ocid="home.newsletter_error"
              className="text-sm font-medium text-accent-foreground"
            >
              {error}
            </p>
          ) : null}
        </div>
      </section>

      {/* ============ PARTNER LOGOS ============ */}
      <section data-ocid="home.partners" className="py-16">
        <div className="container">
          <p className="text-center text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {lang === "hi"
              ? "हमारे भरोसेमंद साझेदार"
              : "Trusted by partners who share our mission"}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                data-ocid={`home.partner.${index}`}
                className="flex items-center gap-2 rounded-full border bg-card px-6 py-3 shadow-subtle"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <HeartPulse className="size-4" aria-hidden="true" />
                </span>
                <span className="font-display text-base font-semibold text-muted-foreground">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
