import { LazyImage } from "@/components/shared/LazyImage";
import { Seo } from "@/components/shared/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { ArrowLeft, CalendarDays, Quote, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function StoryDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data } = useData();

  const story = data.stories.find((item) => item.id === id);

  if (!story) {
    return (
      <div className="bg-background">
        <Seo
          title="Story not found | KHW-India"
          description="We couldn't find that impact story."
        />
        <div className="container mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted">
            <Quote
              className="size-8 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h1 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
            Story not found
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The story you're looking for may have been removed or the link may
            be incorrect. Explore more stories of hope and change.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link to="/stories" data-ocid="story_detail.back_button">
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t("common.back")} to stories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <Seo title={`${story.title} | KHW-India`} description={story.excerpt} />

      {/* Hero */}
      <section className="relative">
        <div className="aspect-[16/9] w-full sm:aspect-[21/9]">
          <LazyImage
            icon={Quote}
            label={story.category}
            className="h-full w-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </section>

      <div className="container mx-auto max-w-3xl px-4 pb-20">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="-mt-16 relative rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-10"
        >
          <Link
            to="/stories"
            data-ocid="story_detail.back_link"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-smooth hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("common.back")} to stories
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Badge>{story.category}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(story.date)}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold text-balance sm:text-4xl">
            {story.title}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4" aria-hidden="true" />
            <span>
              Story by{" "}
              <span className="font-medium text-foreground">{story.name}</span>
            </span>
          </div>

          <div className="my-8 h-px bg-border" />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="font-display text-xl leading-relaxed text-foreground">
              {story.excerpt}
            </p>
            <p className="mt-6 leading-relaxed text-foreground/90">
              {story.content}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-xl border border-border bg-gradient-subtle p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Inspired by {story.name}'s story?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your support helps write more stories like this one.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 rounded-full">
              <Link to="/donate" data-ocid="story_detail.donate_button">
                {t("common.donate")}
              </Link>
            </Button>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
