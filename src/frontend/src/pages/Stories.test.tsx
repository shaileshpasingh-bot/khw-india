import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

// Radix Select uses pointer events jsdom does not implement; swap in a native
// <select> mock so the form can be driven with user-level events.
vi.mock("@/components/ui/select", () => import("@/test/mocks/select"));

describe("Impact story submission", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("submits a story and stores it for the admin dashboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, { route: "/stories" });

    await user.type(screen.getByTestId("stories.submit_form.name"), "Meera");
    await user.type(
      screen.getByTestId("stories.submit_form.email"),
      "meera@example.com",
    );
    await user.type(
      screen.getByTestId("stories.submit_form.title"),
      "A story of hope",
    );
    await user.selectOptions(screen.getByTestId("mock-select"), "Education");
    await user.type(
      screen.getByTestId("stories.submit_form.text"),
      "This is the full story text about a child whose life changed.",
    );

    await user.click(screen.getByTestId("stories.submit_button"));

    // The story is persisted for the admin dashboard.
    await waitFor(() => {
      const stored = JSON.parse(
        window.localStorage.getItem("khw.data.v1") ?? "{}",
      );
      expect(stored.stories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Meera",
            title: "A story of hope",
            category: "Education",
          }),
        ]),
      );
    });
  });
});
