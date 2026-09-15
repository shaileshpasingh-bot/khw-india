import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

// Generated components use data-ocid attributes as their stable test hooks.
configure({ testIdAttribute: "data-ocid" });

// Ensure the DOM is reset between tests. The suite runs in a single fork, so
// without explicit cleanup a render from one test (or one file) leaks into the
// next, making otherwise-unambiguous queries report multiple matches.
afterEach(() => {
  cleanup();
});

// jsdom does not implement IntersectionObserver, which framer-motion (motion)
// uses for whileInView / useInView animations. Provide a no-op stub.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "0px";
  readonly thresholds: ReadonlyArray<number> = [0];

  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve(): void {}
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

// embla-carousel (used by the carousel components) relies on ResizeObserver,
// which jsdom does not implement. Provide a no-op stub.
class MockResizeObserver implements ResizeObserver {
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
}

globalThis.ResizeObserver =
  MockResizeObserver as unknown as typeof ResizeObserver;

// next-themes reads the system color scheme via matchMedia, which jsdom does
// not implement. Provide a stub that reports no preference.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom does not implement the Blob URL API used by the CSV export helper.
// Provide no-op stubs so downloadCsv can be exercised without a real browser.
if (typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = () => "blob:mock";
}
if (typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = () => {};
}

// Radix primitives (Select, DropdownMenu) call pointer-capture methods on
// elements during pointer interactions. jsdom does not implement them, which
// makes userEvent clicks hang or throw. Provide no-op stubs.
if (typeof Element.prototype.hasPointerCapture !== "function") {
  Element.prototype.hasPointerCapture = () => false;
}
if (typeof Element.prototype.setPointerCapture !== "function") {
  Element.prototype.setPointerCapture = () => {};
}
if (typeof Element.prototype.releasePointerCapture !== "function") {
  Element.prototype.releasePointerCapture = () => {};
}
