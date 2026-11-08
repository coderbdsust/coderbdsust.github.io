import { esc, link } from "../lib/dom.js";
import { icon } from "../lib/icons.js";
import { THEMES } from "./theme.js";

export function renderTopbar(profile) {
  const brandName = esc(profile.name).replace(/ /g, "&nbsp;");
  const swatches = THEMES.map(
    (t) => `<button class="sw sw--${t.id}" data-theme-btn="${t.id}" aria-label="${esc(t.label)}"></button>`
  ).join("");
  const cv = profile.downloadCv;
  const download = cv?.url ? link(cv.url, `${icon("download")} ${esc(cv.label ?? "Download CV")}`, "act act--solid") : "";
  return `
  <div class="topbar">
    <div class="topbar-in">
      <a class="brand" href="#top"><b>${brandName}</b> <span>/ curriculum vitae</span></a>
      <div class="tb-tools">
        <div class="theme" role="group" aria-label="Colour theme">${swatches}</div>
        ${download}
      </div>
    </div>
  </div>`;
}
