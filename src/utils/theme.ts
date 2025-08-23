export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "dark" || raw === "light" ? raw : null;
}

export function setStoredTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
    // Persist also as cookie for SSR alignment on next requests
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `theme=${theme}; path=/; max-age=${maxAge}`;
  } catch {}
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("theme-dark");
  else root.classList.remove("theme-dark");
}

