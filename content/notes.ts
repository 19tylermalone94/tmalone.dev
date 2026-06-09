export interface Note {
  slug: string;
  date: string; // ISO YYYY-MM-DD
  title: string;
  description: string;
  status?: string;
  /** Body paragraphs, rendered in order. */
  content: string[];
}

export const notes: Note[] = [
  {
    slug: "persistent-semantic-state-vector",
    date: "2026-06-08",
    title: "On Persistent Semantic State Vectors in Agent Memory",
    description:
      "What if an AI agent kept a single vector that accumulated its entire experiential history — and used it to bias what it remembers?",
    status: "rough draft",
    content: [
      "Most agent memory systems treat retrieval as a stateless lookup: embed the current query, search a vector store, splice the top-k results into context, and move on. The agent's accumulated experience lives entirely in the store, and the only thing carried between steps is whatever survives in the prompt. But biological memory doesn't work like that. We carry a persistent internal state — a mood, a posture, a set of priors — that colors what we notice and what we recall before any explicit retrieval happens. I want to explore the agent analogue: a single, slowly-updated semantic state vector that accumulates the agent's entire experiential history and biases retrieval rather than replacing it.",
      "Concretely, imagine a vector that lives outside any single turn. After each interaction the agent folds the turn's embedding into this state with a decay factor — an exponential moving average over everything it has done, but in semantic space rather than scalar reward space. When the agent goes to retrieve, the query embedding isn't used raw; it's nudged toward the persistent state before the nearest-neighbor search. The effect is a kind of learned attention: an agent that has spent the last hundred turns deep in database internals will, all else equal, surface database-flavored memories for an ambiguous query, the same way a person primed by a conversation hears ambiguous words in that context.",
      "The obvious failure mode is collapse — a state vector that drifts toward a single attractor and makes the agent monomaniacal, retrieving the same cluster regardless of the actual query. So the interesting design questions are all about counter-pressure: how aggressively to decay, whether to maintain several orthogonal state vectors for different contexts, and how to let a sufficiently surprising query overpower the prior instead of being bent toward it. I don't have answers yet. This is a rough draft of an intuition: that the missing primitive in agent memory isn't a better index, it's a persistent point of view.",
    ],
  },
];

export function getAllNotes(): Note[] {
  return [...notes].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRecentNotes(limit: number): Note[] {
  return getAllNotes().slice(0, limit);
}

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
