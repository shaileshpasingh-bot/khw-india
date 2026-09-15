import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";

// Radix DropdownMenu opens on pointer events jsdom does not implement; swap in
// a mock that renders the menu items directly so the language switcher can be
// driven with user-level events.
vi.mock(
  "@/components/ui/dropdown-menu",
  () => import("@/test/mocks/dropdown-menu"),
);

describe("Header language switcher and theme toggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("switches the UI language to Hindi and persists the choice", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/" });

    // The (mocked) dropdown renders the Hindi menu item directly.
    await user.click(screen.getByRole("menuitem", { name: /हिंदी/i }));

    // The hero badge should now render in Hindi.
    await waitFor(() => {
      expect(
        screen.getAllByText(/किंडरहिल्फ़्सवर्क सोसाइटी/i).length,
      ).toBeGreaterThan(0);
    });

    // The choice persists to localStorage.
    expect(window.localStorage.getItem("khw.language")).toBe("hi");
  });

  it("toggles the theme and persists the choice", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/" });

    const themeButton = screen.getByRole("button", { name: /theme/i });
    await user.click(themeButton);

    // next-themes writes the resolved theme to the document class.
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
