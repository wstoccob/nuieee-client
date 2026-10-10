import assert from "node:assert/strict";
import test from "node:test";
import {
  fromDatetimeLocal,
  toDatetimeLocal,
} from "./eventDateTime.ts";

process.env.TZ = "America/New_York";

test("formats an event's UTC start time for a datetime-local input", () => {
  assert.equal(
    toDatetimeLocal("2026-01-15T12:34:56.789Z"),
    "2026-01-15T07:34:56.789"
  );
});

test("converts a datetime-local value back to the same UTC instant", () => {
  const iso = "2026-07-15T12:34:56.789Z";

  assert.equal(fromDatetimeLocal(toDatetimeLocal(iso)), iso);
});
