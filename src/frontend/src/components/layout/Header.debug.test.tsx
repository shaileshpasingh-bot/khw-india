import { renderWithProviders } from "@/test/render";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";

// Radix DropdownMenu opens on pointer events jsdom does not implement; swap in
// a mock that renders the menu items directly.
vi.mock(
  "@/components/ui/dropdown-menu",
  () => import("@/test/mocks/dropdown-menu"),
);

describe("Header language menu", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders both language options in the switcher", () => {
    renderWithProviders(<App />, { route: "/" });
    expect(screen.getByRole("menuitem", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /हिंदी/i })).toBeInTheDocument();
  });
});
