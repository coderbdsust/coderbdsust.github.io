import { esc, join } from "../lib/dom.js";

/**
 * { type: "skillGroups", groups: [ { name: "Backend", items: ["Spring Boot", { label: "Java", primary: true }] } ] }
 * An item is a string, or an object when it needs to be highlighted.
 */
const chip = (item) => {
  const { label, primary } = typeof item === "string" ? { label: item, primary: false } : item;
  return `<span class="chip${primary ? " chip--pri" : ""}">${esc(label)}</span>`;
};

export function render(section) {
  return join(
    section.groups,
    (g) => `
    <div class="skill-group">
      <h4>${esc(g.name)}</h4>
      <div class="chips">${join(g.items, chip)}</div>
    </div>`
  );
}
