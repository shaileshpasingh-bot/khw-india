import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface DonateButtonProps {
  /** When true, renders as a fixed floating button in the corner. */
  floating?: boolean;
  className?: string;
}

/**
 * DonateButton — the primary giving CTA. Used inline in the header/hero and
 * as a floating button that stays visible while scrolling public pages.
 */
export function DonateButton({
  floating = false,
  className,
}: DonateButtonProps) {
  const { t } = useTranslation();

  if (floating) {
    return (
      <Link
        to="/donate"
        data-ocid="donate.floating_button"
        aria-label={t("common.donate")}
        className={cn(
          "fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-warm px-5 py-3 text-sm font-semibold text-white shadow-elevated transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:right-6 sm:bottom-6",
          className,
        )}
      >
        <Heart className="size-4" aria-hidden="true" />
        {t("common.donate")}
      </Link>
    );
  }

  return (
    <Button asChild size="lg" className={cn("rounded-full", className)}>
      <Link to="/donate" data-ocid="donate.button">
        <Heart className="size-4" aria-hidden="true" />
        {t("common.donate")}
      </Link>
    </Button>
  );
}
