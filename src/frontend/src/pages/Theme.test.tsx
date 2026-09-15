import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderWithProviders } from "@/test/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

/**
 * Characterization of the theme system that a color-palette change must
 * preserve. The requirement changes the *values* of the palette (to orange,
 * white, and green), so these tests deliberately assert the *structure* of the
 * theme system rather than any specific color: the gradient utility classes
 * stay wired to themed elements, and the CSS custom properties stay defined for
 * both light and dark modes.
 */

const INDEX_CSS = readFileSync(join(process.cwd(), "src", "index.css"), "utf8");

describe("theme system structure", () => {
  it("applies the gradient utility classes to themed elements on the home page", () => {
    renderWithProviders(<App />, { route: "/" });

    // The logo badge in the header uses the warm gradient.
    const logoBadge = screen
      .getByTestId("header.logo")
      .querySelector(".bg-gradient-warm");
    expect(logoBadge).not.toBeNull();

    // The hero section uses the subtle gradient surface.
    expect(screen.getByTestId("home.hero").className).toContain(
      "bg-gradient-subtle",
    );

    // The hero title accent uses the warm text gradient.
    expect(document.querySelector(".text-gradient-warm")).not.toBeNull();

    // The floating donate button uses the warm gradient.
    expect(screen.getByTestId("donate.floating_button").className).toContain(
      "bg-gradient-warm",
    );
  });

  it("defines the theme custom properties for both light and dark modes", () => {
    // The palette is driven by CSS custom properties consumed by the Tailwind
    // config. A palette change must keep every variable defined in both the
    // light (:root) and dark (.dark) blocks, or the theme breaks.
    const requiredVars = [
      "--background",
      "--foreground",
      "--primary",
      "--primary-foreground",
      "--accent",
      "--accent-foreground",
      "--card",
      "--card-foreground",
      "--muted",
      "--muted-foreground",
      "--border",
      "--ring",
      "--gradient-primary",
      "--gradient-warm",
      "--gradient-subtle",
    ];

    const rootBlock = INDEX_CSS.slice(
      INDEX_CSS.indexOf(":root"),
      INDEX_CSS.indexOf(".dark"),
    );
    const darkBlock = INDEX_CSS.slice(INDEX_CSS.indexOf(".dark"));

    for (const variable of requiredVars) {
      expect(
        rootBlock,
        `expected ${variable} in the :root theme block`,
      ).toContain(variable);
      expect(
        darkBlock,
        `expected ${variable} in the .dark theme block`,
      ).toContain(variable);
    }
  });

  it("defines the gradient utility classes that themed elements rely on", () => {
    // The gradient utilities are custom classes defined in index.css and used
    // across every page. A palette change must keep them defined.
    for (const utility of [
      ".bg-gradient-primary",
      ".bg-gradient-warm",
      ".bg-gradient-subtle",
      ".text-gradient-warm",
    ]) {
      expect(INDEX_CSS).toContain(utility);
    }
  });

  it("uses an orange, white, and green palette for primary, accent, and background", () => {
    // The accepted requirement changes the palette to orange, white, and green.
    // The palette is expressed as OKLCH triples (lightness chroma hue) in the
    // CSS custom properties. Assert the hue of each role lands in the expected
    // color family in both light and dark blocks.
    const rootBlock = INDEX_CSS.slice(
      INDEX_CSS.indexOf(":root"),
      INDEX_CSS.indexOf(".dark"),
    );
    const darkBlock = INDEX_CSS.slice(INDEX_CSS.indexOf(".dark"));

    // Green primary: hue ~150 (green sits around 130-160 in OKLCH).
    expect(rootBlock).toMatch(/--primary:\s*0\.5 0\.13 150/);
    expect(darkBlock).toMatch(/--primary:\s*0\.7 0\.15 150/);

    // Orange accent: hue ~55 (orange sits around 50-70 in OKLCH).
    expect(rootBlock).toMatch(/--accent:\s*0\.65 0\.16 55/);
    expect(darkBlock).toMatch(/--accent:\s*0\.7 0\.17 55/);

    // White background: very high lightness with near-zero chroma.
    expect(rootBlock).toMatch(/--background:\s*0\.99 0\.005 90/);

    // The warm gradient (used for highlights) is orange-family in both modes.
    expect(rootBlock).toMatch(/--gradient-warm:[\s\S]*oklch\(0\.65 0\.16 55\)/);
    expect(darkBlock).toMatch(/--gradient-warm:[\s\S]*oklch\(0\.7 0\.17 55\)/);
  });
});
