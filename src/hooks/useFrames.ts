"use client";

import { useEffect, useState } from "react";

/** Cycles through `frames` every `ms`. Stays on `startAt` when the visitor prefers reduced motion. */
export function useFrames(frames: string[], ms: number, startAt = 0): string {
  const [i, setI] = useState(startAt);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((p) => (p + 1) % frames.length), ms);
    return () => clearInterval(id);
  }, [frames, ms]);

  return frames[i];
}
