import { esc, link, join } from "../lib/dom.js";
import { icon } from "../lib/icons.js";

const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

/** contact: { type: email|phone|github|linkedin|location|link, label, url? } */
function contact(c) {
  const inner = `${icon(c.type)}${esc(c.label)}`;
  return `<li>${c.url ? link(c.url, inner) : `<span>${inner}</span>`}</li>`;
}

export function renderHeader(profile, github) {
  const photo = profile.photo
    ? `<img src="${esc(profile.photo)}" alt="${esc(profile.name)}">`
    : "";
  return `
  <header class="cv-head">
    <div class="avatar${profile.photo ? "" : " no-photo"}" id="avatar">
      ${photo}
      <span class="mono">${esc(profile.initials ?? initials(profile.name))}</span>
    </div>
    <div>
      <h1 class="name">${esc(profile.name)}</h1>
      <p class="subtitle">${esc(profile.subtitle ?? "")}</p>
      <ul class="contact">${join(profile.contacts, contact)}</ul>
      ${github?.user ? `<p class="sync mono"><span class="dot"></span><span data-github-status>Syncing with GitHub…</span></p>` : ""}
    </div>
  </header>`;
}
