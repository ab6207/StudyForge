// In local dev, Vite's proxy (see vite.config.js) forwards /api/* to the
// backend on :5050, so an empty base works fine.
//
// Once frontend and backend are deployed as two separate apps (e.g. two
// separate Vercel projects), there's no shared origin to proxy through,
// so set VITE_API_URL to the backend's full URL at build time.
export const API_BASE = import.meta.env.VITE_API_URL || "";

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
