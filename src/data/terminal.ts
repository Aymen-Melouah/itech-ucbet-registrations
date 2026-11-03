const TOP =
  "+------------------------------------+\n| o o o              i-tech@ucbet    |\n+------------------------------------+\n";
const BOTTOM = "\n+------------------------------------+";
const SCRIPT = [
  "$ whoami",
  "> student, curious, builder",
  "$ ls ./projects",
  "> ai/  web/  robots/  games/",
  "$ ./join_club.sh",
  "> loading [##################] ok",
  "$ _",
];

const row = (s: string) => "| " + s.padEnd(34) + " |";
const draw = (shown: string[]) => {
  const rows: string[] = [];
  for (let i = 0; i < 7; i++) rows.push(row(shown[i] ?? ""));
  return TOP + rows.join("\n") + BOTTOM;
};

/** Types each command, prints the answer, holds the finished screen, then loops. */
export function buildTerminalFrames(): string[] {
  const frames: string[] = [];
  const done: string[] = [];
  SCRIPT.forEach((line, n) => {
    if (line[0] === "$") {
      const last = n === SCRIPT.length - 1;
      const cmd = line.slice(2);
      const typed = last ? 0 : cmd.length;
      for (let c = 0; c <= typed; c++) frames.push(draw([...done, "$ " + cmd.slice(0, c) + "_"]));
      done.push(last ? "$ _" : line);
    } else {
      done.push(line);
      frames.push(draw(done), draw(done));
    }
  });
  for (let h = 0; h < 36; h++) frames.push(draw(done));
  return frames;
}

export const TERMINAL_FRAMES = buildTerminalFrames();
