import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../../App";

// Seed a logged-in admin session so the dashboard renders without the login
// redirect, and seed a visitor session so the analytics cards have data.
const ADMIN_SESSION = {
  "khw.auth.session": JSON.stringify({
    email: "admin@nonprofit.org",
    name: "KHW-India Admin",
    role: "admin",
  }),
};

describe("Admin dashboard", () => {
  it("renders overview cards and the date range filter", async () => {
    renderWithProviders(<App />, {
      route: "/admin/dashboard",
      seed: ADMIN_SESSION,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /dashboard/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/total visitors/i)).toBeInTheDocument();
    expect(screen.getByText(/bounce rate/i)).toBeInTheDocument();
    expect(screen.getByText(/export data/i)).toBeInTheDocument();
    expect(
      screen.getByTestId("admin.dashboard.range_select"),
    ).toBeInTheDocument();
  });

  it("exports donors as CSV", async () => {
    const user = userEvent.setup();
    const createSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:mock");
    const revokeSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    renderWithProviders(<App />, {
      route: "/admin/dashboard",
      seed: ADMIN_SESSION,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /dashboard/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /donors/i }));

    // downloadCsv creates a link and clicks it.
    expect(createSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();

    createSpy.mockRestore();
    revokeSpy.mockRestore();
  });

  it("exports newsletter subscribers as CSV", async () => {
    const user = userEvent.setup();
    const createSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:mock");
    const revokeSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    renderWithProviders(<App />, {
      route: "/admin/dashboard",
      seed: ADMIN_SESSION,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /dashboard/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /newsletter subscribers/i }),
    );

    expect(createSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();

    createSpy.mockRestore();
    revokeSpy.mockRestore();
  });
});
