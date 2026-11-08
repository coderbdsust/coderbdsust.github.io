/**
 * { type: "github" } renders an empty container; features/github.js fills it from the GitHub API
 * (settings live under the top-level "github" key of cv.json).
 */
export function render() {
  return `<div data-github-list><p class="note">Loading…</p></div>`;
}
