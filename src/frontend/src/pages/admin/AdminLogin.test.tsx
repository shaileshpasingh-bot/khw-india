import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../App";

describe("Admin authentication", () => {
  it("redirects unauthenticated users away from the dashboard", async () => {
    renderWithProviders(<App />, { route: "/admin/dashboard" });

    // AdminLayout redirects to the login page.
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /khw-india admin/i }),
      ).toBeInTheDocument();
    });
  });

  it("logs in with valid credentials and reaches the dashboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/admin/login" });

    await user.type(
      screen.getByTestId("admin.login_email"),
      "admin@nonprofit.org",
    );
    await user.type(screen.getByTestId("admin.login_password"), "admin123");
    await user.click(screen.getByTestId("admin.login_submit"));

    // Redirected to the dashboard.
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /dashboard/i }),
      ).toBeInTheDocument();
    });
  });

  it("rejects invalid credentials with an error", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/admin/login" });

    await user.type(
      screen.getByTestId("admin.login_email"),
      "wrong@example.com",
    );
    await user.type(screen.getByTestId("admin.login_password"), "nope");
    await user.click(screen.getByTestId("admin.login_submit"));

    await waitFor(() => {
      expect(screen.getByTestId("admin.login_error")).toHaveTextContent(
        /invalid email or password/i,
      );
    });
  });
});
