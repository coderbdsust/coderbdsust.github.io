/* Tiny HTML helpers. Everything that comes from cv.json goes through esc() / safeUrl(). */

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape text for use in HTML content or attribute values. */
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ENTITIES[c]);

/** Allow only http(s), mailto, tel and relative URLs. Anything else (e.g. javascript:) becomes "#". */
export function safeUrl(url) {
  const u = String(url ?? "").trim();
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return "#";
  return u; // relative path / #anchor
}

/** <a> that opens in a new tab when it points to another site. */
export function link(url, innerHtml, className = "") {
  const href = safeUrl(url);
  const external = /^https?:/i.test(href);
  const cls = className ? ` class="${esc(className)}"` : "";
  const rel = external ? ' target="_blank" rel="noopener"' : "";
  return `<a${cls} href="${esc(href)}"${rel}>${innerHtml}</a>`;
}

/** Join an array of HTML strings. */
export const join = (items, fn) => (items ?? []).map(fn).join("");
