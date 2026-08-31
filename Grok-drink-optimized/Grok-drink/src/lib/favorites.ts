const FAVS_KEY = "yezhuo-favs";
const BAR_KEY = "yezhuo-bar";
const PREFERENCES_KEY = "yezhuo-prefs";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 隐私模式下 localStorage 会抛错，忽略即可 */
  }
}

export function readFavorites(): string[] {
  const parsed = readJson<unknown>(FAVS_KEY, []);
  return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
}

export function writeFavorites(ids: string[]) {
  writeJson(FAVS_KEY, ids);
}

/** 吧台库存：家里有的配料名（已归一的展示名）。 */
export function readBarStock(): string[] {
  const parsed = readJson<unknown>(BAR_KEY, []);
  return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
}

export function writeBarStock(items: string[]) {
  writeJson(BAR_KEY, items);
}

export type Preferences = {
  servings: number;
  measure: "metric" | "imperial";
};

export const DEFAULT_PREFERENCES: Preferences = {
  servings: 1,
  measure: "metric",
};

export function readPreferences(): Preferences {
  const parsed = readJson<Partial<Preferences>>(PREFERENCES_KEY, {});
  const servings = Number(parsed.servings);
  return {
    servings: Number.isFinite(servings) ? Math.min(6, Math.max(1, Math.round(servings))) : 1,
    measure: parsed.measure === "imperial" ? "imperial" : "metric",
  };
}

export function writePreferences(prefs: Preferences) {
  writeJson(PREFERENCES_KEY, prefs);
}
