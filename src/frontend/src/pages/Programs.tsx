import { LazyImage } from "@/components/shared/LazyImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import { TestimonialsCarousel } from "@/components/shared/TestimonialsCarousel";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronDown,
  Heart,
  HeartPulse,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

/** Map program icon names to lucide components. */
const ICONS: Record<string, typeof BookOpen> = {
  BookOpen,
  HeartPulse,
  ShieldCheck,
  Sprout,
};

/** Per-program "how to support" copy, keyed by program id. */
const SUPPORT_COPY: Record<string, { en: string; hi: string }> = {
  education: {
    en: "Sponsor a child's school year, fund learning materials, or volunteer as an after-school tutor.",
    hi: "किसी बच्चे के स्कूल वर्ष को प्रायोजित करें, सीखने की सामग्री के लिए धन दें, या स्कूल के बाद के ट्यूटर के रूप में स्वयंसेवा करें।",
  },
  health: {
    en: "Fund a health camp, provide nutritious meals, or support immunization drives in rural communities.",
    hi: "स्वास्थ्य शिविर के लिए धन दें, पौष्टिक भोजन उपलब्ध कराएँ, या ग्रामीण समुदायों में टीकाकरण अभियानों का समर्थन करें।",
  },
  protection: {
    en: "Support safe spaces and counselling, or volunteer as a youth mentor for children in need.",
    hi: "सुरक्षित स्थानों और परामर्श का समर्थन करें, या ज़रूरतमंद बच्चों के लिए युवा मेंटर के रूप में स्वयंसेवा करें।",
  },
  livelihood: {
    en: "Fund skills training and micro-grants that help families build stable, lasting incomes.",
    hi: "कौशल प्रशिक्षण और लघु अनुदान के लिए धन दें जो परिवारों को स्थिर, स्थायी आय बनाने में मदद करते हैं।",
  },
};

export default function ProgramsPage() {
  const { data } = useData();
  const { t, lang } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(null);

  const programs = data.programs;

  const toggle = (id: string) =>
    setOpenId((current) => (current === id ? null : id));

  return (
    <div className="bg-background">
      <Seo
        title="Our Programs | KHW-India"
        description="Education, health & nutrition, child protection, and family livelihoods — our programs work together to keep children safe and thriving."
      />

      {/* Hero */}
      <section className="bg-gradient-subtle">
        <div className="container py-16 sm:py-20">
          <SectionHeading
            eyebrow={t("nav.programs")}
            title="Programs that change lives"
            description="Education, health, child protection, and family livelihoods — our programs work together to keep children safe and thriving. Explore how each one makes a difference and how you can help."
          />
        </div>
      </section>

      {/* Program grid */}
      <section className="container py-16 sm:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {programs.map((program, index) => {
            const Icon = ICONS[program.icon] ?? BookOpen;
            const isOpen = openId === program.id;
            const title = lang === "hi" ? program.titleHi : program.title;
            const description =
              lang === "hi" ? program.descriptionHi : program.description;
            const support =
              SUPPORT_COPY[program.id]?.[lang === "hi" ? "hi" : "en"] ??
              SUPPORT_COPY[program.id]?.en ??
              "";

            return (
              <article
                key={program.id}
                data-ocid={`program.card.${index}`}
                className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-shadow hover:shadow-elevated"
              >
                <LazyImage
                  icon={Icon}
                  label={title}
                  className="aspect-[16/9] w-full"
                />

                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl font-semibold text-balance">
                        {title}
                      </h2>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary">
                        <Users className="size-4" aria-hidden="true" />
                        {program.impact}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{description}</p>

                  {/* Expandable detail */}
                  <div className="mt-auto">
                    <button
                      type="button"
                      data-ocid={`program.toggle.${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`program-detail-${program.id}`}
                      onClick={() => toggle(program.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border bg-secondary/60 px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <span>
                        {isOpen
                          ? lang === "hi"
                            ? "विवरण छिपाएँ"
                            : "Hide details"
                          : lang === "hi"
                            ? "विवरण देखें"
                            : "View details"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 text-accent transition-transform duration-300",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      id={`program-detail-${program.id}`}
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isOpen
                          ? "mt-4 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="rounded-xl bg-muted/60 p-5">
                          <h3 className="mb-2 font-display text-lg font-semibold">
                            {lang === "hi" ? "हम क्या करते हैं" : "What we do"}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {lang === "hi"
                              ? `${program.descriptionHi} हमारी टीम स्थानीय समुदायों के साथ मिलकर काम करती है ताकि हर कार्यक्रम का स्थायी प्रभाव हो।`
                              : `${program.description} Our team works alongside local communities to ensure every program has a lasting, measurable impact.`}
                          </p>
                          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary">
                            <Users className="size-4" aria-hidden="true" />
                            {program.beneficiaries.toLocaleString("en-IN")}{" "}
                            {lang === "hi"
                              ? "लाभार्थी"
                              : "beneficiaries reached"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* How to support */}
                    <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-5">
                      <h3 className="mb-1 flex items-center gap-2 font-display text-base font-semibold">
                        <Heart
                          className="size-4 text-accent"
                          aria-hidden="true"
                        />
                        {lang === "hi" ? "कैसे सहायता करें" : "How to support"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{support}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button asChild size="sm" className="rounded-full">
                          <Link
                            to="/donate"
                            data-ocid={`program.donate.${index}`}
                          >
                            <Heart className="size-4" aria-hidden="true" />
                            {t("common.donate")}
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                        >
                          <Link
                            to="/get-involved"
                            data-ocid={`program.get_involved.${index}`}
                          >
                            {lang === "hi" ? "शामिल हों" : "Get involved"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-subtle py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            eyebrow={lang === "hi" ? "प्रशंसापत्र" : "Testimonials"}
            title={
              lang === "hi" ? "हमारे समुदाय की आवाज़ें" : "Voices from our community"
            }
            description={
              lang === "hi"
                ? "जिन परिवारों और साझेदारों के जीवन को हमारे कार्यक्रमों ने छुआ है, उनकी कहानियाँ।"
                : "Stories from the families, volunteers, and partners whose lives our programs touch."
            }
          />
          <div className="mt-10">
            <TestimonialsCarousel />
          </div>
        </div>
      </section>
    </div>
  );
}
