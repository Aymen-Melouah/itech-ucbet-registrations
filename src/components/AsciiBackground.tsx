"use client";

import { useFrames } from "@/hooks/useFrames";
import { CHIP_FRAMES, GLOBE_FRAMES, LOGO_FRAMES, RINGS_FRAMES, ROBOT_FRAMES } from "@/data/ascii";
import { TERMINAL_FRAMES } from "@/data/terminal";

const BASE =
  "absolute m-0 select-none whitespace-pre font-mono text-[length:var(--art)] leading-[1.02] text-white opacity-[.17] max-[760px]:opacity-[.12]";

function Figure({ frames, ms, startAt = 0, className }: { frames: string[]; ms: number; startAt?: number; className: string }) {
  const frame = useFrames(frames, ms, startAt);
  return <pre className={`${BASE} ${className}`}>{frame}</pre>;
}

/** Each figure runs its own loop; all of them hold still under reduced motion. */
export default function AsciiBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Figure frames={LOGO_FRAMES} ms={90} className="-left-[1vw] top-[1vh]" />
      <Figure frames={GLOBE_FRAMES} ms={180} className="right-0 top-[3vh]" />
      <Figure
        frames={TERMINAL_FRAMES}
        ms={75}
        startAt={TERMINAL_FRAMES.length - 1}
        className="left-[1vw] top-[50vh] max-[760px]:hidden"
      />
      <Figure frames={RINGS_FRAMES} ms={650} className="right-[1vw] top-[44vh] max-[760px]:hidden" />
      <Figure frames={CHIP_FRAMES} ms={220} className="bottom-[2vh] left-[2vw]" />
      <Figure frames={ROBOT_FRAMES} ms={300} className="bottom-[2vh] right-[3vw]" />
    </div>
  );
}
