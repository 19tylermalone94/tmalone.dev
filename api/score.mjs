import { pipe } from "./_redis.mjs";

// ponytail: sanity caps only, not real anti-cheat. Client scores are forgeable;
// these just reject physically-impossible direct POSTs. MAXV in the game is
// 2100 px/s, so distance can't exceed 2100*time. Kills are gated by spawn rate.
export function sane(time, kills, distance) {
  if (!(time > 0) || time > 7200) return false;
  if (!(kills >= 0) || kills > time * 4 + 5) return false;
  if (!(distance >= 0) || distance > time * 2100 + 200) return false;
  return true;
}

// POST /api/score { name, time, kills, distance }
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const b = req.body || {};
    const time = Number(b.time), kills = Number(b.kills), distance = Number(b.distance);
    if ([time, kills, distance].some((n) => !Number.isFinite(n)) || !sane(time, kills, distance)) {
      return res.status(400).json({ error: "invalid score" });
    }
    const name = String(b.name || "???").replace(/[^\w \-]/g, "").slice(0, 12).trim() || "???";
    // Unique member per run so same-name runs don't overwrite each other.
    const member = name + "#" + Math.random().toString(36).slice(2, 9);
    // ZADD the run, then trim each board to its top 100 so storage stays bounded.
    await pipe([
      ["ZADD", "lb:time", time.toFixed(1), member],
      ["ZADD", "lb:kills", String(Math.round(kills)), member],
      ["ZADD", "lb:distance", String(Math.round(distance)), member],
      ["ZREMRANGEBYRANK", "lb:time", 0, -101],
      ["ZREMRANGEBYRANK", "lb:kills", 0, -101],
      ["ZREMRANGEBYRANK", "lb:distance", 0, -101],
    ]);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "could not save score" });
  }
}
