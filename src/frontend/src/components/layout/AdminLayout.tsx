import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";

const ADMIN_NAV: { to: string; label: string; icon: typeof LayoutDashboard }[] =
  [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/content", label: "Content", icon: Settings },
  ];

/**
 * AdminLayout — protected shell for the admin area. Redirects unauthenticated
 * users to /admin/login. Renders a sidebar nav and the routed page content.
 */
export function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <Link
          to="/"
          data-ocid="admin.logo"
          className="flex items-center gap-2.5 border-b px-6 py-5"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-warm text-white">
            <Heart className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold">KHW-India</span>
        </Link>

        <nav className="flex flex-col gap-1 p-3" aria-label="Admin">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-ocid={`admin.nav.${item.to.split("/").pop()}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user?.name.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            data-ocid="admin.logout_button"
            onClick={logout}
          >
            <LogOut className="size-4" aria-hidden="true" />
            {t("common.logout")}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              data-ocid="admin.mobile_nav_toggle"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-warm text-white">
                <Heart className="size-4" aria-hidden="true" />
              </span>
              <span className="font-display font-semibold">KHW-India</span>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="admin.logout_button"
            onClick={logout}
          >
            <LogOut className="size-4" aria-hidden="true" />
            {t("common.logout")}
          </Button>
        </header>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            className="border-b bg-card px-3 py-2 md:hidden"
            aria-label="Admin"
          >
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                data-ocid={`admin.nav.${item.to.split("/").pop()}`}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
