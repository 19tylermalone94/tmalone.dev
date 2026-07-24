// Tiny Upstash Redis REST client. No dependency — Upstash speaks HTTP.
// Env vars are set automatically by the Vercel Upstash marketplace integration
// (KV_* is the name Vercel's KV/Upstash integration uses; UPSTASH_* is the
// direct-Upstash name). We accept either so it works however it's provisioned.
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Run an array of Redis commands as one pipeline. Returns [{result}|{error}, ...].
export async function pipe(commands) {
  if (!URL || !TOKEN) throw new Error("Redis env vars missing");
  const r = await fetch(URL + "/pipeline", {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error("Redis " + r.status);
  return r.json();
}

export const BOARDS = ["time", "kills", "distance"];
