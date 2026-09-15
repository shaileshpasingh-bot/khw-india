import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";

interface PagePlaceholderProps {
  title: string;
  description: string;
  eyebrow?: string;
}

/**
 * PagePlaceholder — temporary shell for routes whose page bodies are built by
 * separate page tasks. Renders a proper hero so the route is reachable and the
 * app looks intentional while those pages are developed.
 */
export function PagePlaceholder({
  title,
  description,
  eyebrow,
}: PagePlaceholderProps) {
  return (
    <div className="container py-20">
      <Seo title={title} description={description} />
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border bg-card p-10 text-center shadow-card">
        <p className="text-muted-foreground">
          This page is being built. Please check back soon.
        </p>
      </div>
    </div>
  );
}
