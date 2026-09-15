import { LazyImage } from "@/components/shared/LazyImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  PenLine,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const STORY_CATEGORIES = ["Education", "Health", "Protection"] as const;

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function StoriesPage() {
  const { t } = useTranslation();
  const { data, addItem } = useData();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const fromData = Array.from(
      new Set(data.stories.map((story) => story.category)),
    );
    const merged = Array.from(new Set([...STORY_CATEGORIES, ...fromData]));
    return ["All", ...merged];
  }, [data.stories]);

  const filteredStories = useMemo(() => {
    if (activeCategory === "All") return data.stories;
    return data.stories.filter((story) => story.category === activeCategory);
  }, [data.stories, activeCategory]);

  // Submit-your-story form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [category, setCategory] = useState("");
  const [storyText, setStoryText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim() !== "" &&
    email.trim() !== "" &&
    storyTitle.trim() !== "" &&
    category !== "" &&
    storyText.trim() !== "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    const trimmedText = storyText.trim();
    const excerpt =
      trimmedText.length > 160
        ? `${trimmedText.slice(0, 160).trimEnd()}…`
        : trimmedText;

    setSubmitting(true);
    addItem("stories", {
      id: `story-${Date.now().toString(36)}`,
      name: name.trim(),
      title: storyTitle.trim(),
      excerpt,
      content: trimmedText,
      category,
      date: new Date().toISOString().slice(0, 10),
      featured: false,
    });

    // Clear the draft synchronously after capturing the values.
    setName("");
    setEmail("");
    setStoryTitle("");
    setCategory("");
    setStoryText("");
    setSubmitting(false);
    toast.success("Thank you! Your story has been submitted for review.");
  }

  return (
    <div className="bg-background">
      <Seo
        title="Impact Stories | KHW-India"
        description="Real children, real families, real transformation — meet the people behind our work and share your own story of impact."
      />

      {/* Page header */}
      <section className="bg-gradient-subtle border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading
            eyebrow="Impact Stories"
            title="Stories of hope and change"
            description="Real children, real families, real transformation — meet the people behind our work and share your own story of impact."
          />
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Category filter */}
        <div
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
          data-ocid="stories.filter"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                data-ocid={`stories.filter.${cat.toLowerCase()}`}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-smooth focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-subtle"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Stories grid */}
        {filteredStories.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story, index) => (
              <motion.article
                key={story.id}
                data-ocid={`stories.card.${index + 1}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elevated"
              >
                <Link
                  to={`/stories/${story.id}`}
                  className="flex flex-1 flex-col focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <LazyImage
                      icon={BookOpen}
                      label={story.category}
                      className="h-full w-full"
                    />
                    {story.featured ? (
                      <Badge className="absolute top-3 left-3 bg-gradient-warm text-white shadow-subtle">
                        Featured
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{story.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {formatDate(story.date)}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-balance text-foreground">
                      {story.title}
                    </h3>
                    <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {story.excerpt}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {t("common.readMore")}
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div
            data-ocid="stories.empty_state"
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"
          >
            <PenLine
              className="size-10 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="font-display text-xl font-semibold">
              No stories in this category yet
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Be the first to share a story of impact in the {activeCategory}{" "}
              category using the form below.
            </p>
          </div>
        )}

        {/* Submit your story */}
        <section
          id="submit-story"
          data-ocid="stories.submit_section"
          className="mt-20 scroll-mt-24"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <SectionHeading
                align="left"
                eyebrow="Share your story"
                title="Submit your story"
                description="Have you been touched by our work — as a family, volunteer, or partner? We'd love to hear your story. Submissions are reviewed by our team before being published."
              />
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-subtle">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-warm text-white">
                  <PenLine className="size-5" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Your story helps others see the real difference your support
                  makes.
                </p>
              </div>
            </div>

            <Card className="p-6 sm:p-8">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                data-ocid="stories.submit_form"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="story-name">{t("common.name")}</Label>
                    <Input
                      id="story-name"
                      data-ocid="stories.submit_form.name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="story-email">{t("common.email")}</Label>
                    <Input
                      id="story-email"
                      data-ocid="stories.submit_form.email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="story-title">Story title</Label>
                  <Input
                    id="story-title"
                    data-ocid="stories.submit_form.title"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="A short, hopeful title"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="story-category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger
                      id="story-category"
                      data-ocid="stories.submit_form.category"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {STORY_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="story-text">Your story</Label>
                  <Textarea
                    id="story-text"
                    data-ocid="stories.submit_form.text"
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder="Tell us what happened and how it changed a life…"
                    rows={6}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  data-ocid="stories.submit_button"
                  disabled={!canSubmit || submitting}
                  className="mt-1 w-full rounded-full sm:w-auto"
                >
                  <Send className="size-4" aria-hidden="true" />
                  {submitting ? t("common.loading") : t("common.submit")}
                </Button>
                <p className="text-xs text-muted-foreground">
                  We review every story before publishing. We'll never share
                  your contact details.
                </p>
              </form>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
