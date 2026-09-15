import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { Heart, Lock } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = login(email, password);
    if (result.ok) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError(result.error ?? "Login failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle px-4 py-12">
      <Seo
        title="Admin login | KHW-India"
        description="Sign in to the KHW-India admin dashboard."
      />
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-gradient-warm text-white">
            <Heart className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold">
            KHW-India Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your nonprofit site.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border bg-card p-8 shadow-card"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t("common.email")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@nonprofit.org"
              data-ocid="admin.login_email"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t("common.password")}</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              data-ocid="admin.login_password"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p
              data-ocid="admin.login_error"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            data-ocid="admin.login_submit"
            className="mt-2 w-full rounded-full"
          >
            <Lock className="size-4" aria-hidden="true" />
            {t("common.login")}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Demo credentials: admin@nonprofit.org / admin123
          </p>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link
            to="/"
            data-ocid="admin.login_back"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
