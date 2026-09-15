import { seedData } from "@/lib/data/mockData";
import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";

/**
 * Cover for the About page after its content was replaced.
 *
 * The request replaced the About Us body copy with new About, History, VISION,
 * VALUES, and PURPOSE & MISSION sections and removed the old version. These
 * tests protect the behavior that must survive the change:
 *
 *   - the About page is reachable from the header navigation,
 *   - navigating to it lands on the /about route and renders the About page,
 *   - the page sets its own document title,
 *   - the new content sections render and the old version is removed,
 *   - the admin-editable about.mission entry matches the new mission text.
 *
 * The App.test.tsx "navigates to the About page via the header nav" test was
 * updated to assert on the new VISION heading instead of the removed
 * `mission, vision & values` heading.
 */
describe("About page navigation baseline", () => {
  it("navigates to the About page via the header nav and renders it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/" });

    await user.click(screen.getByTestId("header.nav.about"));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/about");
    });

    // The About page sets its own document title via <Seo />.
    await waitFor(() => {
      expect(document.title).toContain("About Us");
    });
  });

  it("renders the About page directly at the /about route", async () => {
    renderWithProviders(<App />, { route: "/about" });

    await waitFor(() => {
      expect(document.title).toContain("About Us");
    });
  });

  it("renders the new About, History, VISION, VALUES, and PURPOSE & MISSION sections", async () => {
    renderWithProviders(<App />, { route: "/about" });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /an international concern for children at risk/i,
        }),
      ).toBeInTheDocument();
    });

    // About
    expect(
      screen.getByRole("heading", {
        name: /an international concern for children at risk/i,
      }),
    ).toBeInTheDocument();
    // History
    expect(
      screen.getByRole("heading", { name: /our story, from 1975 to today/i }),
    ).toBeInTheDocument();
    // VISION
    expect(
      screen.getByRole("heading", { name: /^vision$/i }),
    ).toBeInTheDocument();
    // VALUES
    expect(
      screen.getByRole("heading", {
        name: /the principles that guide our action/i,
      }),
    ).toBeInTheDocument();
    // PURPOSE & MISSION
    expect(
      screen.getByRole("heading", { name: /purpose & mission/i }),
    ).toBeInTheDocument();
  });

  it("removes the old About Us version", async () => {
    renderWithProviders(<App />, { route: "/about" });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /^vision$/i }),
      ).toBeInTheDocument();
    });

    // The old 'mission, vision & values' heading is gone.
    expect(
      screen.queryByRole("heading", { name: /mission, vision & values/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps the admin-editable about.mission entry matching the new mission text", () => {
    const mission = seedData.pageContent.find(
      (pc) => pc.key === "about.mission",
    );
    expect(mission).toBeDefined();
    expect(mission?.valueEn).toBe(
      "The purpose of KHW-India is to engage in Appropriate, Sustainable, Child-Sensitive Social Action to empower children and their communities towards developing their full potential.",
    );
  });
});
