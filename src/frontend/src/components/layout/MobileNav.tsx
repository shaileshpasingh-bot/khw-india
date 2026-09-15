import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type Language, useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { Heart, Languages, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_ITEMS: { to: string; labelKey: string }[] = [
  { to: "/", labelKey: "nav.home" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/programs", labelKey: "nav.programs" },
  { to: "/stories", labelKey: "nav.stories" },
  { to: "/get-involved", labelKey: "nav.getInvolved" },
  { to: "/events", labelKey: "nav.events" },
  { to: "/partners", labelKey: "nav.partners" },
  { to: "/transparency", labelKey: "nav.transparency" },
  { to: "/contact", labelKey: "nav.contact" },
];

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
];

/**
 * MobileNav — accessible hamburger navigation rendered in a slide-in sheet.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-ocid="header.menu_button"
          aria-label={t("common.menu")}
        >
          <Menu className="size-5" aria-hidden="true" />
          <span className="sr-only">{t("common.menu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display">KHW-India</SheetTitle>
          <SheetDescription>{t("common.footerTagline")}</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={close}
              data-ocid={`mobile.nav.${item.to === "/" ? "home" : item.to.slice(1)}`}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-foreground hover:bg-muted",
                )
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4 px-4 pb-6">
          {/* Language switcher */}
          <div className="flex items-center gap-2">
            <Languages
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            {LANGUAGES.map((language) => (
              <Button
                key={language.code}
                type="button"
                variant={lang === language.code ? "secondary" : "ghost"}
                size="sm"
                data-ocid={`mobile.language.${language.code}`}
                onClick={() => setLang(language.code)}
              >
                {language.label}
              </Button>
            ))}
          </div>

          {/* Theme toggle */}
          <Button
            type="button"
            variant="outline"
            data-ocid="mobile.theme_toggle"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
            {isDark ? "Light mode" : "Dark mode"}
          </Button>

          <Button
            asChild
            size="lg"
            className="rounded-full bg-gradient-warm text-white"
          >
            <Link to="/donate" onClick={close} data-ocid="mobile.donate_button">
              <Heart className="size-4" aria-hidden="true" />
              {t("common.donate")}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
