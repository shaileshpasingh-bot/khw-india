import { renderWithProviders } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../App";

// Seed a logged-in admin session so the content page renders without the login
// redirect.
const ADMIN_SESSION = {
  "khw.auth.session": JSON.stringify({
    email: "admin@nonprofit.org",
    name: "KHW-India Admin",
    role: "admin",
  }),
};

describe("Admin content — Pages tab", () => {
  it("edits page text and reflects it on the public Home page", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />, {
      route: "/admin/content",
      seed: ADMIN_SESSION,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /content/i }),
      ).toBeInTheDocument();
    });

    // Switch to the Pages tab.
    await user.click(screen.getByTestId("content.tab.pages"));

    // The hero headline page text is editable.
    await waitFor(() => {
      expect(screen.getByText(/hero headline/i)).toBeInTheDocument();
    });

    // Edit the English hero headline and save.
    const enInput = screen.getByTestId("pages.en_input.1");
    await user.clear(enInput);
    await user.type(enInput, "A brighter tomorrow for every child");
    await user.click(screen.getByTestId("pages.save_button.1"));

    // Navigate to the public Home page via the admin logo link.
    await user.click(screen.getByTestId("admin.logo"));

    // The edited hero headline now renders on the Home page, proving the
    // pageContent store update flows through to the public site.
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /a brighter tomorrow for every child/i,
        }),
      ).toBeInTheDocument();
    });
  });
});
