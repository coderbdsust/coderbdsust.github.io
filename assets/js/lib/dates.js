/*
 * Date points in cv.json are strings:
 *   "2025-07"  month precision   -> "Jul 2025"
 *   "2012"     year precision    -> "2012"
 *   "present"  (only as `end`)   -> "Present"
 * An item with a `start` and no `end` shows a single point (e.g. a graduation year).
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parsePoint(value, now = new Date()) {
  if (value === undefined || value === null || value === "") return null;
  if (/^(present|current|now)$/i.test(String(value))) {
    return { year: now.getFullYear(), month: now.getMonth(), precision: "month", present: true };
  }
  const m = /^(\d{4})(?:-(\d{2}))?$/.exec(String(value));
  if (!m) return null;
  return m[2]
    ? { year: +m[1], month: +m[2] - 1, precision: "month", present: false }
    : { year: +m[1], month: 0, precision: "year", present: false };
}

function formatPoint(p) {
  if (p.present) return "Present";
  return p.precision === "month" ? `${MONTHS[p.month]} ${p.year}` : String(p.year);
}

/** "Jul 2025 — Present", "2012 — 2016", "2011" */
export function formatRange(start, end, now = new Date()) {
  const s = parsePoint(start, now);
  if (!s) return "";
  const e = parsePoint(end, now);
  return e ? `${formatPoint(s)} — ${formatPoint(e)}` : formatPoint(s);
}

/** Inclusive duration like "1 yr 8 mos". Empty unless both ends have month precision. */
export function formatDuration(start, end, now = new Date()) {
  const s = parsePoint(start, now);
  const e = parsePoint(end, now);
  if (!s || !e || s.precision !== "month" || e.precision !== "month") return "";
  const total = (e.year - s.year) * 12 + (e.month - s.month) + 1;
  if (total <= 0) return "";
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ");
}
