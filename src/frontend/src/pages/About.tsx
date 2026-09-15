import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import {
  BookOpen,
  Compass,
  Eye,
  HeartHandshake,
  History,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const focusAreas = [
  {
    icon: ShieldCheck,
    title: "Safeguarding children",
    description:
      "Protecting children from harm and ensuring their safety and wellbeing in every setting.",
  },
  {
    icon: BookOpen,
    title: "Quality education, training & healthcare",
    description:
      "Improving access to quality education, training, and healthcare, especially for vulnerable and at-risk children, including children with special needs.",
  },
  {
    icon: HeartHandshake,
    title: "Support for the Differently Abled",
    description:
      "Early detection, correction, rehabilitation, training and employment for the Differently Abled, especially from the remote mountain villages of Uttarakhand and other vulnerable communities.",
  },
  {
    icon: Leaf,
    title: "Inclusive Disaster Mitigation",
    description:
      "Inclusive Disaster Mitigation, Relief & Rehabilitation for communities affected by natural and manmade disasters.",
  },
];

const values = [
  {
    icon: Compass,
    title: "Equality & Justice",
    description:
      "KHW-India believes in non-partisan, non-discriminatory, non-political social action based on the principles of equality and justice.",
  },
  {
    icon: HeartHandshake,
    title: "Gender Equality",
    description:
      "KHW-India believes in Gender Equality in all its work and relationships.",
  },
  {
    icon: Sparkles,
    title: "Community Wisdom",
    description:
      "KHW-India respects community wisdom, participation and ownership in the development process.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Stewardship",
    description:
      "KHW-India believes in integrity, transparency, stewardship and humility in all its actions.",
  },
  {
    icon: Leaf,
    title: "Collaboration & Synergy",
    description:
      "KHW-India believes in collaboration and synergy to add value and optimise impact.",
  },
];

const historyAreas = [
  "Training and income generation for poor women",
  "Livelihood development (dairy, miniature bulb units, etc.)",
  "Shelter",
  "Curative health",
  "Nutrition and education support to poor children",
  "Debt relief for the poor",
];

const purposePoints = [
  "Striving to be sensitive to the voice, wisdom and participation of the community in the development process.",
  "Striving for Universal, Inclusive, Quality – Education, Healthcare & Training for all children.",
  "Striving towards mainstreaming, inclusion and a life of dignity and purpose for differently abled.",
  "Striving to build disaster-resilient communities and to provide timely, appropriate relief and rehabilitation to victims of natural & manmade disasters and human conflict.",
  "Striving towards Synergistic Partnerships with like-minded organisations and individuals.",
  "Striving for inclusion of the differently abled in all programs of KHW-India.",
];

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const { t, lang } = useTranslation();
  const { data } = useData();

  // Admin-editable mission text (from the pageContent store), falling back to
  // the default copy when no custom content has been saved.
  const mission = data.pageContent.find((pc) => pc.key === "about.mission");
  const missionValue = mission
    ? mission[lang === "hi" ? "valueHi" : "valueEn"]
    : null;

  return (
    <div className="bg-background">
      <Seo
        title="About Us | KHW-India"
        description="Learn about Kinderhilfswerk Society (KHW-India) — our history, vision, values, and purpose & mission as the Indian affiliate of Kinderhilfswerk Global Care, Germany."
      />

      {/* Hero */}
      <section className="bg-gradient-subtle">
        <div className="container py-20 sm:py-28">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-semibold tracking-wide text-accent uppercase shadow-subtle">
              <HeartHandshake className="size-4" aria-hidden="true" />
              {t("nav.about")}
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold text-balance sm:text-5xl md:text-6xl">
              About <span className="text-gradient-warm">KHW-India</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Kinderhilfswerk Society (KHW-India) is an Indian childcare and
              development organisation — part of an international concern for
              children at risk, committed to working towards a better world for
              children and their communities.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* About */}
      <section className="container py-20 sm:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow="About Us"
            title="An international concern for children at risk"
            description="All activities of KHW-India are directed towards ensuring a better world for all children."
          />
        </FadeIn>

        <div className="mx-auto mt-10 max-w-3xl space-y-4 text-muted-foreground">
          <p>
            Kinderhilfswerk Society (KHW-India) is an Indian childcare and
            development organisation. It is a part of an international concern
            for children at risk and is committed to working towards a better
            world for children and their communities.
          </p>
          <p>
            All activities of KHW-India are directed towards ensuring a better
            world for all children. We believe that all developmental activity
            has to be sensitive to, and must address the needs of all children.
          </p>
          <p>
            KHW-India is the Indian affiliate of Kinderhilfswerk Global Care,
            Germany, which presently serves in over twenty countries worldwide.
          </p>
        </div>

        {/* Focus areas */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {focusAreas.map((area, i) => (
            <FadeIn key={area.title} delay={0.05 * i}>
              <Card className="h-full shadow-card transition-shadow hover:shadow-elevated">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <area.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">
                    {area.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="bg-gradient-subtle">
        <div className="container py-20 sm:py-24">
          <FadeIn>
            <SectionHeading
              eyebrow="History"
              title="Our story, from 1975 to today"
              description="How a single visit to North India grew into a global movement for children."
            />
          </FadeIn>

          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              Kinderhilfswerk Society (KHW-India) was formed as a consequence of
              the visit in 1975 of one Germany national, Hans Juergen Pechmann,
              to Rajpur, Dehradun, North India. He came to visit a Tibetan boy
              he supported through a German agency. His visit had a tremendous
              impact on him. On returning to Germany, he got a group of his
              friends and people together and challenged them to start an agency
              to support children. Thus, Kinderhilfswerk Bergen was established
              in 1976 in Germany. Today the agency is called Kinderhilfswerk
              Global-Care, and it has affiliates and partners in over 20
              countries across 4 continents.
            </p>
            <p>
              At the same time, through Hans Juergen Pechmann's inspiration, a
              group of people got together informally in Dehradun, North India,
              setting up what was first known as the Child Care Training Centre
              (CCTC) and later formally incorporated as Kinderhilfswerk Society
              in the year 1982.
            </p>
            <p>
              In the beginning, KHW-India's work focused on the following areas:
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            {historyAreas.map((area, i) => (
              <FadeIn key={area} delay={0.05 * i}>
                <div className="flex h-full items-start gap-3 rounded-2xl border bg-card p-4 shadow-card">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <History className="size-3.5" aria-hidden="true" />
                  </span>
                  <p className="text-sm text-foreground">{area}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              Later, two small kindergartens were started. One in Rajpur to
              cater to the children from the slums along the Rispana River and
              another one in village Kandoli, which was then a relatively
              underdeveloped, poor area with a significant population.
            </p>
            <p>
              In its formative years, the work of KHW-India was headed by Mrs
              Chamzes Wangmo, who selflessly and tirelessly served the
              organisation until 2000. Hans Juergen Pechmann also took a very
              active and keen interest in developing the work until his
              retirement in 1987.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="container py-20 sm:py-24">
        <FadeIn>
          <Card className="border-0 bg-gradient-primary text-primary-foreground shadow-elevated">
            <CardContent className="flex flex-col items-center gap-5 p-10 text-center sm:p-14">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white/15">
                <Eye className="size-6" aria-hidden="true" />
              </span>
              <h2 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
                VISION
              </h2>
              <p className="max-w-2xl text-lg text-primary-foreground/90">
                A poverty-free and just world where all children and their
                communities have equal opportunity and access to develop their
                full potential.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Values */}
      <section className="bg-gradient-subtle">
        <div className="container py-20 sm:py-24">
          <FadeIn>
            <SectionHeading
              eyebrow="Values"
              title="The principles that guide our action"
              description="The values that shape how KHW-India works with children, families, and communities."
            />
          </FadeIn>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => (
              <FadeIn key={value.title} delay={0.05 * i}>
                <Card className="h-full shadow-card transition-shadow hover:shadow-elevated">
                  <CardContent className="flex h-full flex-col gap-3 p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <value.icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-semibold">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose & Mission */}
      <section className="container py-20 sm:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow="Purpose & Mission"
            title="Purpose & Mission"
            description="The purpose of KHW-India is to engage in Appropriate, Sustainable, Child-Sensitive Social Action to empower children and their communities towards developing their full potential."
          />
        </FadeIn>

        <FadeIn delay={0.05}>
          <Card className="mt-10 border-0 bg-gradient-warm text-white shadow-elevated">
            <CardContent className="flex flex-col gap-4 p-8 sm:p-10">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white/15">
                <Target className="size-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-2xl font-semibold">
                Our Mission
              </h3>
              <p className="text-white/90">
                {missionValue ??
                  "The purpose of KHW-India is to engage in Appropriate, Sustainable, Child-Sensitive Social Action to empower children and their communities towards developing their full potential."}
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {purposePoints.map((point, i) => (
            <FadeIn key={point} delay={0.03 * i}>
              <div className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-card">
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Target className="size-3.5" aria-hidden="true" />
                </span>
                <p className="text-sm text-foreground">{point}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
