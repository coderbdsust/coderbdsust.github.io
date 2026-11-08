import { esc, link, join } from "../lib/dom.js";
import { formatRange, formatDuration } from "../lib/dates.js";

/**
 * { type: "timeline", items: [ {
 *     role, kind?, start, end?, org, orgUrl?, place?, note?, bullets?: [] } ] }
 * `end` may be "present". Dates: "YYYY-MM" or "YYYY" (see lib/dates.js).
 */
export function render(section, { now }) {
  return join(section.items, (it) => {
    const range = formatRange(it.start, it.end, now);
    const duration = formatDuration(it.start, it.end, now);
    const org = it.orgUrl ? link(it.orgUrl, esc(it.org)) : esc(it.org);
    const place = it.place ? `<span class="place">${esc(it.place)}</span>` : "";
    const kind = it.kind ? ` <span class="kind">(${esc(it.kind)})</span>` : "";
    const note = it.note ? `<p class="xp-note">${esc(it.note)}</p>` : "";
    const bullets = it.bullets?.length ? `<ul class="xp-list">${join(it.bullets, (b) => `<li>${esc(b)}</li>`)}</ul>` : "";
    return `
    <article class="xp">
      <div class="xp-top">
        <h4 class="xp-role">${esc(it.role)}${kind}</h4>
        <span class="xp-date">${esc(range)}${duration ? ` <span class="xp-span">${esc(duration)}</span>` : ""}</span>
      </div>
      <p class="xp-org">${org}${place}</p>
      ${note}${bullets}
    </article>`;
  });
}
