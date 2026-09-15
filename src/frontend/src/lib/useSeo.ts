import { useEffect } from "react";

/**
 * useSeo — sets the document title and meta description for a page.
 * Call this in each page component (or use the <Seo /> component wrapper).
 */

export function useSeo(title: string, description?: string): void {
  useEffect(() => {
    document.title = title;

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]',
      );
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
}
