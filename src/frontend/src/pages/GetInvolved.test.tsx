import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

// Radix Select uses pointer events jsdom does not implement; swap in a native
// <select> mock so the form can be driven with user-level events.
vi.mock("@/components/ui/select", () => import("@/test/mocks/select"));

describe("Volunteer application form", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("submits an application and stores it for the admin dashboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/get-involved" });

    await user.type(screen.getByTestId("get_involved.name_input"), "Priya");
    await user.type(
      screen.getByTestId("get_involved.email_input"),
      "priya@example.com",
    );

    // Choose a preferred role from the (mocked native) select. The role select
    // is the first of the two selects on the page (role, then availability).
    await user.selectOptions(screen.getAllByTestId("mock-select")[0], "tutor");

    await user.click(screen.getByTestId("get_involved.submit_button"));

    // Success state.
    await waitFor(() => {
      expect(screen.getByText(/application received!/i)).toBeInTheDocument();
    });

    // The application is persisted for the admin dashboard.
    const stored = JSON.parse(
      window.localStorage.getItem("khw.data.v1") ?? "{}",
    );
    expect(stored.volunteerApplications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Priya",
          email: "priya@example.com",
          roleId: "tutor",
          status: "pending",
        }),
      ]),
    );
  });
});
