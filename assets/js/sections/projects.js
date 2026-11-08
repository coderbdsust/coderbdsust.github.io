import { esc, link, join } from "../lib/dom.js";

/** { type: "projects", items: [ { name, url?, year?, description, stack?: [] } ] } */
export function render(section) {
  return join(section.items, (it) => {
    const name = it.url ? link(it.url, esc(it.name)) : esc(it.name);
    const stack = it.stack?.length ? `<p class="proj-stack">${esc(it.stack.join(" · "))}</p>` : "";
    return `
    <div class="proj">
      <div class="proj-top">
        <h4 class="proj-name">${name}</h4>
        <span class="proj-year">${esc(it.year ?? "")}</span>
      </div>
      <p class="proj-desc">${esc(it.description)}</p>
      ${stack}
    </div>`;
  });
}
