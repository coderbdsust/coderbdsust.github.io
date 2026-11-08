/* Loads the CV content. Everything shown on the page lives in data/cv.json. */

export const DATA_URL = "data/cv.json";

export async function loadCV(url = DATA_URL) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Could not load ${url} (HTTP ${res.status})`);
  let cv;
  try {
    cv = await res.json();
  } catch (e) {
    throw new Error(`${url} is not valid JSON: ${e.message}`);
  }
  return normalise(cv);
}

/** Minimal checks + defaults so a missing optional key never breaks the page. */
export function normalise(cv) {
  if (!cv || typeof cv !== "object") throw new Error("cv.json must be an object");
  if (!cv.profile?.name) throw new Error('cv.json: "profile.name" is required');
  if (!Array.isArray(cv.sections)) throw new Error('cv.json: "sections" must be an array');

  const ids = new Set();
  for (const s of cv.sections) {
    if (!s.id || !s.type) throw new Error('cv.json: every section needs an "id" and a "type"');
    if (ids.has(s.id)) throw new Error(`cv.json: duplicate section id "${s.id}"`);
    ids.add(s.id);
  }
  cv.layout = {
    sidebar: cv.layout?.sidebar ?? cv.sections.filter((s) => s.column === "sidebar").map((s) => s.id),
    main: cv.layout?.main ?? cv.sections.filter((s) => s.column !== "sidebar").map((s) => s.id),
  };
  cv.theme = { default: "light", ...(cv.theme ?? {}) };
  cv.footer = cv.footer ?? {};
  return cv;
}
