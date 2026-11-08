/* Theme switcher. Colours live in assets/css/tokens.css; add a theme there, then list it here. */

export const THEMES = [
  { id: "light", label: "Light theme" },
  { id: "dark", label: "Green theme" },
  { id: "black", label: "Black theme" },
];

const STORAGE_KEY = "bd-cv-theme";

export function applyTheme(id) {
  const theme = THEMES.some((t) => t.id === id) ? id : THEMES[0].id;
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll("[data-theme-btn]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.themeBtn === theme))
  );
  return theme;
}

export function initTheme(defaultTheme = "light") {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* storage blocked */ }
  applyTheme(saved || defaultTheme);
  document.querySelectorAll("[data-theme-btn]").forEach((b) =>
    b.addEventListener("click", () => {
      const theme = applyTheme(b.dataset.themeBtn);
      try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
    })
  );
}
