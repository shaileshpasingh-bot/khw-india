import { renderWithProviders } from "@/test/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("Home page", () => {
  it("renders the hero title from the pageContent store and both CTAs", () => {
    renderWithProviders(<App />, { route: "/" });

    // The hero headline comes from the pageContent store seed (hero.title).
    expect(
      screen.getByRole("heading", {
        name: /every child deserves a safe, bright future/i,
      }),
    ).toBeInTheDocument();

    // Both hero CTAs are present: the Donate button (header + hero) and the
    // Get Involved link.
    expect(screen.getAllByTestId("donate.button").length).toBeGreaterThan(0);
    expect(screen.getByTestId("home.hero.get_involved")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /get involved/i }).length,
    ).toBeGreaterThan(0);
  });
});
