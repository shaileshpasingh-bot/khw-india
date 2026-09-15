import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { ArrowRight, Handshake, HeartHandshake } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type PartnerCategory =
  | "Foundations"
  | "Corporate"
  | "Healthcare"
  | "Education"
  | "Community";

interface CategoryInfo {
  label: string;
  description: string;
}

const CATEGORIES: Record<PartnerCategory, CategoryInfo> = {
  Foundations: {
    label: "Foundations",
    description:
      "Philanthropic trusts and foundations that provide sustained, multi-year funding for our core programs.",
  },
  Corporate: {
    label: "Corporate",
    description:
      "Businesses that support our work through CSR partnerships, sponsorships, and employee giving.",
  },
  Healthcare: {
    label: "Healthcare",
    description:
      "Hospitals, clinics, and medical partners who keep children healthy and ready to learn.",
  },
  Education: {
    label: "Education",
    description:
      "Publishers, schools, and learning partners who put books and opportunities in children's hands.",
  },
  Community: {
    label: "Community",
    description:
      "Local groups and institutions that ground our work in the communities we serve.",
  },
};

// Map each seed partner to a category based on its focus area.
const PARTNER_CATEGORY: Record<string, PartnerCategory> = {
  p1: "Foundations",
  p2: "Foundations",
  p3: "Healthcare",
  p4: "Education",
};

const CATEGORY_ORDER: PartnerCategory[] = [
  "Foundations",
  "Corporate",
  "Healthcare",
  "Education",
  "Community",
];

export default function PartnersPage() {
  const { t } = useTranslation();
  const { data } = useData();
  const [activeCategory, setActiveCategory] = useState<PartnerCategory | "All">(
    "All",
  );

  const partners = useMemo(() => data.partners, [data.partners]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return partners;
    return partners.filter(
      (partner) => PARTNER_CATEGORY[partner.id] === activeCategory,
    );
  }, [partners, activeCategory]);

  const grouped = useMemo(() => {
    if (activeCategory !== "All") return null;
    return CATEGORY_ORDER.map((category) => ({
      category,
      partners: partners.filter(
        (partner) => PARTNER_CATEGORY[partner.id] === category,
      ),
    })).filter((group) => group.partners.length > 0);
  }, [partners, activeCategory]);

  return (
    <>
      <Seo
        title="Partners & Supporters | KHW-India"
        description="Meet the foundations, businesses, and institutions that partner with KHW-India to protect children and build brighter futures across India."
      />

      {/* Page hero */}
      <section className="bg-gradient-subtle">
        <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-accent">
              <Handshake className="size-4" aria-hidden="true" />
              {t("nav.partners")}
            </span>
            <h1 className="font-display text-4xl font-semibold text-balance sm:text-5xl md:text-6xl">
              Partners in{" "}
              <span className="text-gradient-warm">lasting change</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              We work alongside foundations, businesses, and institutions that
              share our commitment to children. Together we turn generosity into
              education, health, and protection for the children who need it
              most.
            </p>
          </div>
        </div>
      </section>

      {/* Partner wall */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Our Supporters"
            title="The partners behind our work"
            description="Every partnership strengthens our ability to reach more children. Explore the organisations that make our programs possible."
          />

          {/* Category filter */}
          <fieldset className="mt-10">
            <legend className="sr-only">Filter partners by category</legend>
            <div className="flex flex-wrap justify-center gap-2">
              {(["All", ...CATEGORY_ORDER] as const).map((category) => (
                <button
                  key={category}
                  type="button"
                  data-ocid={`partners.filter.${category.toLowerCase()}`}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-subtle"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {category === "All" ? t("common.all") : category}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Filtered grid */}
          {activeCategory !== "All" ? (
            <div className="mt-12">
              <div className="mb-8 max-w-2xl">
                <h3 className="font-display text-2xl font-semibold">
                  {activeCategory}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {CATEGORIES[activeCategory].description}
                </p>
              </div>
              <PartnerGrid partners={filtered} />
            </div>
          ) : (
            /* Grouped sections */
            <div className="mt-12 flex flex-col gap-14">
              {grouped?.map(({ category, partners: groupPartners }) => (
                <div key={category}>
                  <div className="mb-6 flex flex-col gap-1">
                    <h3 className="font-display text-2xl font-semibold">
                      {category}
                    </h3>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                      {CATEGORIES[category].description}
                    </p>
                  </div>
                  <PartnerGrid partners={groupPartners} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="bg-gradient-primary py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/15 text-primary-foreground">
              <HeartHandshake className="size-7" aria-hidden="true" />
            </span>
            <h2 className="font-display text-3xl font-semibold text-balance text-primary-foreground sm:text-4xl">
              Become a partner in change
            </h2>
            <p className="max-w-2xl text-lg text-primary-foreground/85">
              Whether you are a foundation, a business, or a community
              institution, there are many ways to stand with children. Let's
              explore how your organisation can make a lasting impact.
            </p>
            <Button
              asChild
              size="lg"
              data-ocid="partners.become_partner_button"
              className="rounded-full bg-white text-primary shadow-elevated hover:bg-white/90"
            >
              <Link to="/contact">
                Become a Partner
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function PartnerGrid({
  partners,
}: { partners: ReturnType<typeof useData>["data"]["partners"] }) {
  if (partners.length === 0) {
    return (
      <div
        data-ocid="partners.empty_state"
        className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center"
      >
        <Handshake
          className="size-10 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="font-display text-xl font-semibold">
          No partners in this category yet
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          We're always growing our network. Reach out to become one of the first
          supporters in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner, index) => (
        <Card
          key={partner.id}
          data-ocid={`partners.item.${index + 1}`}
          className="group overflow-hidden border-border bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elevated"
        >
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-subtle p-4">
              <span className="flex size-12 items-center justify-center rounded-full bg-gradient-warm font-display text-lg font-semibold text-white shadow-subtle">
                {initials(partner.name)}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-display text-lg font-semibold">
                  {partner.name}
                </h4>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                  {partner.tier}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {partner.description}
              </p>
            </div>
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`partners.website.${index + 1}`}
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-smooth hover:text-accent"
            >
              Visit website
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
