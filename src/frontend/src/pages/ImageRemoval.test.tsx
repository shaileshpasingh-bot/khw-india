import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

// Seed a logged-in admin session so the dashboard renders without the login
// redirect.
const ADMIN_SESSION = {
  "khw.auth.session": JSON.stringify({
    email: "admin@nonprofit.org",
    name: "KHW-India Admin",
    role: "admin",
  }),
};

/**
 * Cover for the image-removal change: no <img> elements or image URL
 * background styles may render on any public page or the admin dashboard.
 * Photos were replaced with color blocks (LazyImage renders a role="img"
 * gradient block with an accessible label) and icon/typography treatments.
 */
describe("image removal contract", () => {
  it("renders the home hero as a color block, not an <img>", () => {
    renderWithProviders(<App />, { route: "/" });

    // The hero visual is an accessible color block (role="img") with a label,
    // not a real image element.
    expect(
      screen.getByRole("img", { name: /children in our programs/i }),
    ).toBeInTheDocument();

    // No <img> tags anywhere on the page.
    expect(document.querySelectorAll("img")).toHaveLength(0);

    // No element carries an inline background-image pointing at an image URL
    // (gradient color blocks are fine; photo URLs are not).
    const urlBackgrounds = Array.from(
      document.querySelectorAll<HTMLElement>("[style]"),
    ).filter((el) => /url\(/.test(el.style.backgroundImage));
    expect(urlBackgrounds).toHaveLength(0);
  });

  it("renders no <img> elements on any public page", () => {
    const publicRoutes = [
      "/",
      "/about",
      "/programs",
      "/stories",
      "/stories/asha",
      "/events",
      "/partners",
      "/transparency",
      "/get-involved",
      "/donate",
      "/contact",
    ];

    for (const route of publicRoutes) {
      const { unmount } = renderWithProviders(<App />, { route });
      expect(
        document.querySelectorAll("img"),
        `expected no <img> on ${route}`,
      ).toHaveLength(0);
      unmount();
    }
  });

  it("renders no <img> elements on the admin dashboard", async () => {
    renderWithProviders(<App />, {
      route: "/admin/dashboard",
      seed: ADMIN_SESSION,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /dashboard/i }),
      ).toBeInTheDocument();
    });

    expect(document.querySelectorAll("img")).toHaveLength(0);
  });
});
