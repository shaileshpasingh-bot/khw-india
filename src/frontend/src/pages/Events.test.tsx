import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("Event registration", () => {
  it("registers for an event and stores the registration", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/events" });

    // Open the registration dialog for the first upcoming event.
    await user.click(screen.getAllByRole("button", { name: /register/i })[0]);

    await user.type(
      screen.getByTestId("events.registration_name_input"),
      "Amit",
    );
    await user.type(
      screen.getByTestId("events.registration_email_input"),
      "amit@example.com",
    );
    await user.click(screen.getByTestId("events.registration_submit_button"));

    // Success state.
    await waitFor(() => {
      expect(screen.getByText(/you're registered!/i)).toBeInTheDocument();
    });

    // The registration is persisted for the admin dashboard.
    const stored = JSON.parse(
      window.localStorage.getItem("khw.data.v1") ?? "{}",
    );
    expect(stored.eventRegistrations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Amit",
          email: "amit@example.com",
        }),
      ]),
    );
  });
});
