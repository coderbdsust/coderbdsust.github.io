/* Fade-in on scroll for elements with class "rv". */
export function initReveal(root = document) {
  const targets = root.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );
  targets.forEach((el) => io.observe(el));
}
