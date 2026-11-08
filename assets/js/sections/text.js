import { esc } from "../lib/dom.js";

/** { type: "text", text: "..." } */
export function render(section) {
  return `<p class="summary">${esc(section.text)}</p>`;
}
