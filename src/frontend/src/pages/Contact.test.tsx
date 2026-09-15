import { renderWithProviders } from "@/test/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("Contact form", () => {
  it("submits a message and stores it for the admin dashboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/contact" });

    // Scope queries to the contact form so the footer's newsletter email
    // input (also labelled "Email") does not collide.
    const form = within(screen.getByTestId("contact.form"));

    await user.type(form.getByLabelText(/name/i), "Test Donor");
    await user.type(form.getByLabelText(/email/i), "test@example.com");
    await user.type(form.getByLabelText(/subject/i), "Partnership");
    await user.type(
      form.getByLabelText(/message/i),
      "We would like to partner with KHW-India.",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Success state appears.
    await waitFor(() => {
      expect(screen.getByText(/thank you, test donor!/i)).toBeInTheDocument();
    });

    // The submission is persisted to localStorage for the admin dashboard.
    const stored = JSON.parse(
      window.localStorage.getItem("khw.data.v1") ?? "{}",
    );
    expect(stored.contactSubmissions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Test Donor",
          email: "test@example.com",
          subject: "Partnership",
        }),
      ]),
    );
  });
});
