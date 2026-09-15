import { AuthProvider } from "@/lib/auth";
import { DataProvider } from "@/lib/data/store";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import type { ReactElement, ReactNode } from "react";

/**
 * Renders a component inside the same provider stack the app uses in main.tsx.
 *
 * The app's own <App /> renders a <BrowserRouter>, so this helper does NOT add
 * another router (a nested <Router> throws). Instead the initial route is set
 * through window.history before render, and navigation happens through the
 * app's own router. localStorage is cleared before each render so tests start
 * from a deterministic seed state.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    route = "/",
    theme = "light",
    seed,
  }: {
    route?: string;
    theme?: string;
    seed?: Record<string, string>;
  } = {},
) {
  window.localStorage.clear();
  if (seed) {
    for (const [key, value] of Object.entries(seed)) {
      window.localStorage.setItem(key, value);
    }
  }
  window.history.pushState({}, "", route);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme={theme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <DataProvider>{children}</DataProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
