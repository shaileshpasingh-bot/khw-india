import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../App";

vi.mock("@/components/ui/select", () => import("@/test/mocks/select"));

describe("Donate flow", () => {
  it("records a donation through the mock payment flow", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/donate" });

    // Step 1: amount (default ₹1,000 selected) → continue.
    await user.click(screen.getByTestId("donate.continue_button"));

    // Step 2: details.
    await user.type(screen.getByTestId("donate.name"), "Ada Lovelace");
    await user.type(screen.getByTestId("donate.email"), "ada@example.com");
    await user.click(screen.getByTestId("donate.continue_button"));

    // Step 3: payment → complete.
    await user.click(screen.getByTestId("donate.pay_button"));

    // The mock gateway simulates a ~1.2s processing delay before recording.
    await waitFor(
      () => {
        expect(
          screen.getByText(/thank you, ada lovelace!/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // The donation is persisted for the admin dashboard.
    const stored = JSON.parse(
      window.localStorage.getItem("khw.data.v1") ?? "{}",
    );
    expect(stored.donations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Ada Lovelace",
          email: "ada@example.com",
          amount: 1000,
          frequency: "one-time",
          status: "completed",
        }),
      ]),
    );
  });
});
