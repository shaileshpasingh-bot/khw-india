import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("returns an empty string for no rows", () => {
    expect(toCsv([])).toBe("");
  });

  it("writes headers and rows", () => {
    const csv = toCsv([
      { name: "Ada", amount: 1000 },
      { name: "Grace", amount: 2500 },
    ]);
    expect(csv).toBe("name,amount\nAda,1000\nGrace,2500");
  });

  it("escapes commas, quotes, and newlines", () => {
    const csv = toCsv([{ note: 'He said "hi", then\nleft' }]);
    expect(csv).toBe('note\n"He said ""hi"", then\nleft"');
  });
});
