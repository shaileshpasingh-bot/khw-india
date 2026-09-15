import { useSeo } from "@/lib/useSeo";

interface SeoProps {
  title: string;
  description?: string;
}

/**
 * Seo — declarative per-page SEO. Sets document.title and the meta description.
 * Place at the top of any page component.
 */
export function Seo({ title, description }: SeoProps) {
  useSeo(title, description);
  return null;
}
