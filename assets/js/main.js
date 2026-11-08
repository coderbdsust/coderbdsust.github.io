/* Entry point: load cv.json -> render -> wire up behaviour. */
import { loadCV } from "./data.js";
import { renderPage } from "./page.js";
import { initTheme } from "./ui/theme.js";
import { initReveal } from "./ui/reveal.js";
import { initAvatar } from "./ui/avatar.js";
import { syncGithub } from "./features/github.js";
import { esc } from "./lib/dom.js";

async function boot() {
  const app = document.getElementById("app");
  try {
    const cv = await loadCV();
    document.title = cv.meta?.title ?? document.title;
    app.innerHTML = renderPage(cv);

    initTheme(cv.theme.default);
    initAvatar();
    initReveal(app);
    syncGithub(cv.github, {
      listEl: app.querySelector("[data-github-list]"),
      statusEl: app.querySelector("[data-github-status]"),
    });
  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="fatal"><strong>The CV could not be loaded.</strong><br>${esc(err.message)}<br>
      <small>If you opened index.html straight from disk, serve the folder instead (see README).</small></div>`;
  }
}

boot();
