'use client';

import { useEffect, useState } from 'react';

const LINES = [
  'building agentic AI and RAG systems',
  'available for contract',
];

const LAST = LINES.length - 1;

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function TypingHero() {
  // Index of the line currently being typed, and how many chars are shown.
  const [lineIdx, setLineIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const isComplete = lineIdx === LAST && charCount === LINES[LAST].length;

  useEffect(() => {
    if (isComplete) return;

    // Respect reduced-motion: render everything at once, no animation.
    if (prefersReducedMotion()) {
      const t = setTimeout(() => {
        setLineIdx(LAST);
        setCharCount(LINES[LAST].length);
      }, 0);
      return () => clearTimeout(t);
    }

    const current = LINES[lineIdx];

    // Still typing the current line.
    if (charCount < current.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), 45);
      return () => clearTimeout(t);
    }

    // Current line finished — pause, then advance to the next one.
    const t = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setCharCount(0);
    }, 450);
    return () => clearTimeout(t);
  }, [lineIdx, charCount, isComplete]);

  return (
    <div className="hero__lines" aria-label={LINES.map((l) => `> ${l}`).join('\n')}>
      {LINES.map((line, i) => {
        if (i > lineIdx) return null;
        const text = i === lineIdx ? line.slice(0, charCount) : line;
        return (
          <p className="hero__line" key={i} aria-hidden="true">
            <span className="hero__prompt">&gt;</span>
            {text}
            {i === lineIdx && <span className="cursor" />}
          </p>
        );
      })}
    </div>
  );
}
