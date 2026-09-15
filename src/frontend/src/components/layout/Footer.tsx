import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { type FormEvent, useState } from "react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { Link } from "react-router-dom";

const QUICK_LINKS: { to: string; labelKey: string }[] = [
  { to: "/about", labelKey: "nav.about" },
  { to: "/programs", labelKey: "nav.programs" },
  { to: "/stories", labelKey: "nav.stories" },
  { to: "/get-involved", labelKey: "nav.getInvolved" },
  { to: "/transparency", labelKey: "nav.transparency" },
  { to: "/contact", labelKey: "nav.contact" },
];

const SOCIALS = [
  { label: "Facebook", icon: SiFacebook, href: "https://facebook.com" },
  { label: "Instagram", icon: SiInstagram, href: "https://instagram.com" },
  { label: "X", icon: SiX, href: "https://x.com" },
  { label: "YouTube", icon: SiYoutube, href: "https://youtube.com" },
];

export function Footer() {
  const { t } = useTranslation();
  const { addNewsletterSubscriber, addNotification } = useData();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    const added = addNewsletterSubscriber({
      id: `sub-${Date.now().toString(36)}`,
      email: trimmed,
      date: new Date().toISOString().slice(0, 10),
      active: true,
    });
    if (added) {
      setSubscribed(true);
      setEmail("");
      addNotification(`New newsletter subscriber: ${trimmed}.`, "info");
    } else {
      addNotification("That email is already subscribed.", "warning");
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand + contact */}
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            data-ocid="footer.logo"
            className="flex items-center gap-2.5"
            aria-label="KHW-India home"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-warm text-white">
              <Heart className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold">
              KHW-India
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("common.footerTagline")}
          </p>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin
                className="size-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span>B-42, Community Centre, New Delhi 110001</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone
                className="size-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <a href="tel:+911123456789" data-ocid="footer.phone">
                +91 11 2345 6789
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail
                className="size-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <a href="mailto:hello@khwindia.org" data-ocid="footer.email">
                hello@khwindia.org
              </a>
            </li>
          </ul>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-base font-semibold">
            {t("common.quickLinks")}
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  data-ocid={`footer.link.${link.to.slice(1) || "home"}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-base font-semibold">
            {t("common.followUs")}
          </h3>
          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                data-ocid={`footer.social.${social.label.toLowerCase()}`}
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <social.icon className="size-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-base font-semibold">
            {t("footer.newsletterTitle")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("footer.newsletterDesc")}
          </p>
          {subscribed ? (
            <p
              data-ocid="footer.newsletter_success"
              className="rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
            >
              {t("footer.newsletterSuccess")}
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("footer.newsletterPlaceholder")}
                data-ocid="footer.newsletter_input"
                aria-label={t("common.email")}
                className="flex-1"
              />
              <Button
                type="submit"
                data-ocid="footer.newsletter_submit"
                className="rounded-full"
              >
                {t("common.subscribe")}
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-center text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} KHW-India. {t("common.rights")}
          </p>
          <p>
            {t("common.builtWith")}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground hover:text-accent"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
