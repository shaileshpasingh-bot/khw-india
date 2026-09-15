import { PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers an empty-state read instead of trapping", async () => {
  // The template actor exposes an authorization/OQL surface. A fresh canister
  // has no entities, so an empty query must resolve rather than trap.
  await expect(actor.schema()).resolves.toBeTypeOf("string");
});

it("reports the caller role without trapping", async () => {
  await expect(actor.getCallerUserRole()).resolves.toBeDefined();
});

it("reports whether the caller is an admin without trapping", async () => {
  await expect(actor.isCallerAdmin()).resolves.toBeTypeOf("boolean");
});

it("initializes access control without trapping", async () => {
  await expect(actor._initialize_access_control()).resolves.toBeNull();
});

it("executes an empty OQL query without trapping", async () => {
  const result = await actor.execute("");
  expect(result).toBeDefined();
  expect(result.hasMore).toBeTypeOf("boolean");
  expect(Array.isArray(result.rows)).toBe(true);
});
