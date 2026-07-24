import { pipe, BOARDS } from "./_redis.mjs";

// GET /api/leaderboard -> { time:[{name,score}], kills:[...], distance:[...] }
// Top 10 per board, highest first.
export default async function handler(req, res) {
  try {
    const results = await pipe(
      BOARDS.map((b) => ["ZRANGE", "lb:" + b, 0, 9, "REV", "WITHSCORES"])
    );
    const out = {};
    BOARDS.forEach((b, i) => {
      const flat = results[i].result || []; // [member, score, member, score, ...]
      const rows = [];
      for (let j = 0; j < flat.length; j += 2) {
        rows.push({ name: String(flat[j]).split("#")[0], score: Number(flat[j + 1]) });
      }
      out[b] = rows;
    });
    res.setHeader("Cache-Control", "public, s-maxage=10");
    res.status(200).json(out);
  } catch (e) {
    res.status(500).json({ error: "leaderboard unavailable" });
  }
}
