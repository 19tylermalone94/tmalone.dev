// Runnable self-check for the score sanity gate: `node api/_check.mjs`.
// Underscore prefix keeps Vercel from routing this as an endpoint.
import { sane } from "./score.mjs";
import assert from "node:assert";

assert.equal(sane(30, 20, 40000), true, "a plausible run passes");
assert.equal(sane(0, 0, 0), false, "zero time rejected");
assert.equal(sane(-5, 1, 1), false, "negative time rejected");
assert.equal(sane(10, 999, 1000), false, "impossible kill count rejected");
assert.equal(sane(10, 5, 9_999_999), false, "impossible distance rejected");
assert.equal(sane(10, 40, 20000), true, "kills at the cap pass"); // 10*4+5=45 >= 40
console.log("sanity gate ok");
