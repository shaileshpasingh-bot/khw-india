import { DonateButton } from "@/components/shared/DonateButton";
import { useAnalytics } from "@/lib/analytics";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

/**
 * PublicLayout — shared shell for all public pages: sticky header, main
 * content area, footer, and a floating Donate button. Also starts visitor
 * session analytics.
 */
export function PublicLayout() {
  useAnalytics();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <DonateButton floating />
    </div>
  );
}
