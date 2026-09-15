import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App shell and navigation", () => {
  it("loads the home page without a blank screen on the default route", async () => {
    renderWithProviders(<App />, { route: "/" });

    // Hero content from the seed data / translations.
    expect(
      screen.getByRole("heading", { name: /every child deserves/i }),
    ).toBeInTheDocument();
    // The org name appears in the hero badge and the intro paragraph.
    expect(
      screen.getAllByText(/Kinderhilfswerk Society/i).length,
    ).toBeGreaterThan(0);
    // Header + footer are present.
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the floating donate button on public pages", () => {
    renderWithProviders(<App />, { route: "/" });
    expect(screen.getByTestId("donate.floating_button")).toBeInTheDocument();
  });

  it("navigates to the About page via the header nav", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/" });

    await user.click(screen.getByTestId("header.nav.about"));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /^vision$/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders the donate page with suggested amounts", async () => {
    renderWithProviders(<App />, { route: "/donate" });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /your gift changes a child/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getAllByText(/₹500/).length).toBeGreaterThan(0);
  });
});
