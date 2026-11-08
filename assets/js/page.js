/* Builds the whole page from the CV data. Pure string rendering: no DOM access, so it can be unit-tested in Node. */
import { renderTopbar } from "./ui/topbar.js";
import { renderHeader } from "./ui/header.js";
import { renderFooter } from "./ui/footer.js";
import { renderColumn } from "./sections/index.js";

export function renderPage(cv, now = new Date()) {
  const ctx = { now, cv };
  const byId = new Map(cv.sections.map((s) => [s.id, s]));
  return `
  ${renderTopbar(cv.profile)}
  <main class="sheet-wrap" id="top">
    <article class="sheet" id="cv">
      ${renderHeader(cv.profile, cv.github)}
      <div class="cv-body">
        <aside class="col-side">${renderColumn(cv.layout.sidebar, byId, ctx)}</aside>
        <div class="col-main">${renderColumn(cv.layout.main, byId, ctx, { reveal: true })}</div>
      </div>
      ${renderFooter(cv.footer, cv.profile, now)}
    </article>
  </main>`;
}
