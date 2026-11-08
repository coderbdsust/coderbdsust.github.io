import { esc } from "../lib/dom.js";
import { parsePoint } from "../lib/dates.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** footer: { text, updated?: "YYYY-MM" }  — without `updated` the current month is shown. */
export function renderFooter(footer, profile, now) {
  const p = parsePoint(footer.updated, now) ?? { year: now.getFullYear(), month: now.getMonth() };
  const text = footer.text ?? `${profile.name} — Curriculum Vitae`;
  return `
  <footer class="cv-foot">
    <span>${esc(text)} · updated ${MONTHS[p.month]} ${p.year}</span>
  </footer>`;
}
