import { esc, link, join } from "../lib/dom.js";

/** { type: "linkList", items: [ { title, url?, meta? } ] }  (certifications, awards, spoken languages ...) */
export function render(section) {
  const items = join(section.items, (it) => {
    const title = it.url ? link(it.url, esc(it.title)) : esc(it.title);
    const meta = it.meta ? `<span class="meta">${esc(it.meta)}</span>` : "";
    return `<li>${title}${meta}</li>`;
  });
  return `<ul class="list">${items}</ul>`;
}
