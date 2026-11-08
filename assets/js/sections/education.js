import { esc, link, join } from "../lib/dom.js";
import { formatRange } from "../lib/dates.js";

/** { type: "education", items: [ { degree, kind?, school, schoolUrl?, start, end? } ] } */
export function render(section, { now }) {
  return join(section.items, (it) => {
    const kind = it.kind ? ` <span class="kind">(${esc(it.kind)})</span>` : "";
    const school = it.schoolUrl ? link(it.schoolUrl, esc(it.school)) : esc(it.school);
    return `
    <div class="edu">
      <div class="edu-deg">${esc(it.degree)}${kind}</div>
      <span class="edu-year">${esc(formatRange(it.start, it.end, now))}</span>
      <div class="edu-school">${school}</div>
    </div>`;
  });
}
