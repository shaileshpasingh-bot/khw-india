import { DonateButton } from "@/components/shared/DonateButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Language, useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { Heart, Languages, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, NavLink } from "react-router-dom";
import { MobileNav } from "./MobileNav";

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
  { code: "en", label: "EN" },
  { code: "hi", label: "हिंदी" },
];

export function Header() {
  const { t, lang, setLang } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 shadow-subtle backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="header.logo"
          className="flex items-center gap-2.5"
          aria-label="KHW-India home"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-warm text-white">
            <Heart className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold leading-tight">
            KHW-India
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-ocid={`header.nav.${item.to === "/" ? "home" : item.to.slice(1)}`}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-ocid="header.language_toggle"
                aria-label={t("common.language")}
              >
                <Languages className="size-5" aria-hidden="true" />
                <span className="sr-only">{t("common.language")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  data-ocid={`header.language.${language.code}`}
                  onClick={() => setLang(language.code)}
                  className={cn(
                    "cursor-pointer",
                    lang === language.code && "bg-accent/10 text-accent",
                  )}
                >
                  {language.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            data-ocid="header.theme_toggle"
            aria-label={t("common.theme")}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="size-5" aria-hidden="true" />
            ) : (
              <Moon className="size-5" aria-hidden="true" />
            )}
            <span className="sr-only">{t("common.theme")}</span>
          </Button>

          {/* Donate (desktop) */}
          <div className="hidden sm:block">
            <DonateButton />
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
