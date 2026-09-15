import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../../App";

describe("Footer newsletter signup", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("subscribes an email and stores it for the admin dashboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/" });

    await user.type(
      screen.getByTestId("footer.newsletter_input"),
      "new@example.com",
    );
    await user.click(screen.getByTestId("footer.newsletter_submit"));

    // Success state appears.
    await waitFor(() => {
      expect(
        screen.getByTestId("footer.newsletter_success"),
      ).toBeInTheDocument();
    });

    // The subscriber is persisted for the admin dashboard.
    const stored = JSON.parse(
      window.localStorage.getItem("khw.data.v1") ?? "{}",
    );
    expect(stored.newsletterSubscribers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: "new@example.com",
          active: true,
        }),
      ]),
    );
  });

  it("does not duplicate an already-subscribed email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/" });

    // The seed data already contains subscriber@example.com.
    await user.type(
      screen.getByTestId("footer.newsletter_input"),
      "subscriber@example.com",
    );
    await user.click(screen.getByTestId("footer.newsletter_submit"));

    // No success state appears for a duplicate.
    expect(
      screen.queryByTestId("footer.newsletter_success"),
    ).not.toBeInTheDocument();

    // The duplicate is not stored: the seed subscriber remains the only one.
    const stored = JSON.parse(
      window.localStorage.getItem("khw.data.v1") ?? "{}",
    );
    const matches = stored.newsletterSubscribers.filter(
      (s: { email: string }) =>
        s.email.toLowerCase() === "subscriber@example.com",
    );
    expect(matches).toHaveLength(1);
  });
});
