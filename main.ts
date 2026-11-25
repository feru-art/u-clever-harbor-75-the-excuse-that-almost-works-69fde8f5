// The Excuse That Almost Works — make.fun entry (program/v1).
//
// Writes one excuse line to /output/entry.txt: the single line a gamer
// texts the boss to get out of work during GTA 6 launch week.
//
// Five candidates were drafted against the published judge brief, in
// criterion order: (1) on-subject excuse, one line, at most 20 words,
// (2) almost believable — a real, specific, boring detail, never a wild
// story, (3) funny from the excuse's own logic, no bolted-on joke,
// (4) reads like a hurried text — plain words, no setup, no explanation,
// no signature, (5) a fresh angle — no dead grandmother, flat tyre or
// sudden fever. No candidate names GTA 6, a game, a launch or a
// pre-order: naming the motive would confess it. Each candidate varies
// the kind of implicit evidence: a time, another person, an official
// appointment, a location, a physical consequence.
//
// Local head-to-head race (10 pairs, criteria applied in order):
//   V4 4-0, V2 3-1, V3 2-2, V5 1-3, V1 0-4.
// Winner: V4 — a plumber window nobody controls plus a leak over the
// fuse box: specific, boring, time-bound, and the writer must stay home.
// The laugh is the leak's own logic, not a punchline. No candidate
// copies a house text.
//
// Gate check (counted before submit, all ASCII so chars == bytes):
//   V1 84 chars / 16 words, V2 88 / 19, V3 90 / 17, V4 96 / 19,
//   V5 92 / 19 — every candidate passes 1-140 chars, one line,
//   at most 20 words.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const CANDIDATES: ReadonlyArray<{ id: string; line: string }> = [
  {
    id: "V1",
    line: "Sorry, my car keys are locked inside the car and the locksmith can't come until ten.",
  },
  {
    id: "V2",
    line: "Sorry, I have to drive my dad to his eye test this morning, it's the only slot they had.",
  },
  {
    id: "V3",
    line: "Sorry, the bank moved my ID verification to nine this morning and they won't do it online.",
  },
  {
    id: "V4",
    line: "Sorry, the plumber is only free between nine and twelve today and the leak is over the fuse box.",
  },
  {
    id: "V5",
    line: "Sorry, I pulled something in my neck reaching for a shelf and I can't turn my head to drive.",
  },
];

const WINNER_ID = "V4";
const OUT_PATH = "/output/entry.txt";

function charCount(text: string): number {
  return [...text].length;
}

function byteCount(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

function passesGate(text: string): boolean {
  const chars = charCount(text);
  if (chars < 1 || chars > 140) return false;
  if (text.trim().length === 0) return false;
  if (/[\r\n]/.test(text)) return false;
  if (wordCount(text) > 20) return false;
  return true;
}

function main(): void {
  for (const candidate of CANDIDATES) {
    const ok = passesGate(candidate.line);
    console.log(`${candidate.id}: ${charCount(candidate.line)} chars / ${byteCount(candidate.line)} bytes / ${wordCount(candidate.line)} words, gate ${ok ? "pass" : "FAIL"}`);
    if (!ok) throw new Error(`${candidate.id} fails the 1-140 char, single-line, max-20-words gate`);
  }

  const winner = CANDIDATES.find((c) => c.id === WINNER_ID);
  if (!winner) throw new Error(`winner ${WINNER_ID} not found among candidates`);

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, winner.line, "utf8");

  const back = readFileSync(OUT_PATH, "utf8");
  if (back !== winner.line) throw new Error("read-back mismatch on entry.txt");
  console.log(`wrote ${WINNER_ID} (${charCount(winner.line)} chars / ${byteCount(winner.line)} bytes) to ${OUT_PATH}`);
}

main();
