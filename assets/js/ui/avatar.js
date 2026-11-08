/* Falls back to the initials badge when the photo is missing. */
export function initAvatar() {
  const avatar = document.getElementById("avatar");
  const img = avatar?.querySelector("img");
  if (!img) return;
  const fallback = () => { avatar.classList.add("no-photo"); img.remove(); };
  if (img.complete && img.naturalWidth === 0) fallback();
  else img.addEventListener("error", fallback, { once: true });
}
