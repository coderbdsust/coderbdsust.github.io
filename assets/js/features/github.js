/*
 * Live "Open source" list + sync status line, fed by the public GitHub API.
 * Settings come from the top-level "github" key in cv.json:
 *   { user, limit, rename: {repo: "Title"}, acronyms: ["API", ...], suffixes: ["ui", "api", ...],
 *     fallback: [ { title, url, year } ] }
 * If the API is unreachable (offline, rate-limited) the fallback list is shown instead.
 */
import { esc, link } from "../lib/dom.js";

const DEFAULTS = {
  limit: 5,
  rename: {},
  acronyms: ["UI", "API", "POS", "JS", "TS", "SQL", "AI", "ML", "PDF", "CRUD", "REST", "HR", "ERP"],
  suffixes: ["ui", "api", "app", "web", "backend", "frontend", "server", "client", "services?", "mobile", "admin", "core", "demo", "www", "site"],
  fallback: [],
};

/* ---------- name tidying ---------- */

const makePretty = (cfg) => (slug) => {
  if (cfg.rename[slug]) return cfg.rename[slug];
  return slug
    .replace(/[-_.]+/g, " ")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .map((w) => (cfg.acronyms.includes(w.toUpperCase()) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
};

/**
 * Groups repos that are the same project split in parts
 * (tallyapp + tallyapp-ui -> "TallyApp"). Exported for testing.
 */
export function mergeSimilar(repos, config = {}) {
  const cfg = { ...DEFAULTS, ...config };
  const suffix = new RegExp(`[-_.](${cfg.suffixes.join("|")}|v\\d+)$`, "i");
  const strip = (name) => {
    let k = name, prev;
    do { prev = k; k = k.replace(suffix, ""); } while (k !== prev);
    return k;
  };
  const pretty = makePretty(cfg);

  const groups = new Map();
  for (const r of repos) {
    const key = strip(r.name.toLowerCase()).replace(/[-_.\s]+/g, "") || r.name.toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  return [...groups.values()].map((g) => {
    g.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
    const rep = g[0];
    const renamed = g.map((r) => cfg.rename[r.name]).find(Boolean);
    return {
      title: renamed || pretty(strip(rep.name)),
      url: rep.html_url,
      count: g.length,
      hasDesc: g.some((r) => r.description),
      year: Math.max(...g.map((r) => new Date(r.pushed_at).getFullYear())),
      pushed: Math.max(...g.map((r) => +new Date(r.pushed_at))),
    };
  });
}

/* ---------- rendering ---------- */

const row = (x) => `
  <div class="oss-row">
    ${link(x.url, `${esc(x.title)}${x.count > 1 ? ` <span class="oss-n">×${x.count}</span>` : ""}`)}
    <time>${esc(x.year)}</time>
  </div>`;

/* ---------- main ---------- */

export async function syncGithub(config, { listEl, statusEl }) {
  const cfg = { ...DEFAULTS, ...config };
  if (!cfg.user) return;
  const api = `https://api.github.com/users/${encodeURIComponent(cfg.user)}`;
  try {
    const [user, repos] = await Promise.all([
      fetch(api).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
      fetch(`${api}/repos?per_page=100&sort=pushed`).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
    ]);
    const mine = repos.filter((r) => !r.fork);
    const latest = mine[0]
      ? new Date(mine[0].pushed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—";
    if (statusEl) statusEl.textContent = `${user.public_repos} public repositories · last push ${latest}`;

    const groups = mergeSimilar(mine, cfg).sort((a, b) => b.pushed - a.pushed);
    const described = groups.filter((g) => g.hasDesc);
    const use = (described.length ? described : groups).slice(0, cfg.limit);
    if (listEl) listEl.innerHTML = use.map(row).join("");
  } catch {
    if (statusEl) statusEl.textContent = `github.com/${cfg.user}`;
    if (listEl) listEl.innerHTML = cfg.fallback.map((f) => row({ ...f, count: 1 })).join("");
  }
}
