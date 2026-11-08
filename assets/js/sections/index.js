/*
 * Section registry: maps a `type` in cv.json to the module that renders it.
 * To add a new kind of section, create sections/<name>.js exporting render(section, ctx)
 * and register it below.
 */
import { esc } from "../lib/dom.js";
import * as text from "./text.js";
import * as skillGroups from "./skillGroups.js";
import * as linkList from "./linkList.js";
import * as timeline from "./timeline.js";
import * as education from "./education.js";
import * as projects from "./projects.js";
import * as github from "./github.js";

export const RENDERERS = { text, skillGroups, linkList, timeline, education, projects, github };

/** Renders one section wrapped in the standard <section> + heading. `reveal` adds the scroll animation. */
export function renderSection(section, ctx, { reveal = false } = {}) {
  const renderer = RENDERERS[section.type];
  if (!renderer) {
    console.warn(`cv.json: unknown section type "${section.type}" (id "${section.id}") was skipped`);
    return "";
  }
  return `
  <section class="sec${reveal ? " rv" : ""}" id="sec-${esc(section.id)}">
    <h3 class="sec-h">${esc(section.title ?? section.id)}</h3>
    ${renderer.render(section, ctx)}
  </section>`;
}

/** Renders the sections listed in `ids`, in that order. Hidden or unknown ids are skipped. */
export function renderColumn(ids, sectionsById, ctx, options) {
  return ids
    .map((id) => sectionsById.get(id))
    .filter((s) => s && !s.hidden)
    .map((s) => renderSection(s, ctx, options))
    .join("");
}
