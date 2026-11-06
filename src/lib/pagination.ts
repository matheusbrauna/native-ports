/** Port rows on each home page. Fixed so `?page=` is the same list on every screen. */
export const PAGE_SIZE = 36;

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

/** Page buttons, with an ellipsis wherever a run of numbers is skipped. */
export function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const wanted = new Set<number>([1, total]);
  for (let n = current - 1; n <= current + 1; n++) if (n >= 1 && n <= total) wanted.add(n);
  if (current <= 3) for (let n = 1; n <= Math.min(3, total); n++) wanted.add(n);
  if (current >= total - 2) for (let n = Math.max(1, total - 2); n <= total; n++) wanted.add(n);
  const sorted = [...wanted].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  for (const n of sorted) {
    const prev = out.at(-1);
    if (typeof prev === "number" && n - prev > 1) out.push("gap");
    out.push(n);
  }
  return out;
}
