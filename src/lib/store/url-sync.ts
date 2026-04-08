import type { ThemeConfig } from "../schema/theme-config.schema";

export function serializeTheme(config: ThemeConfig): string {
    try {
        const json = JSON.stringify({
            primaryHex: config.primaryHex,
            harmonyType: config.harmonyType,
            ideologyId: config.ideologyId,
            ideologyTension: config.ideologyTension,
            fontPairId: config.fontPairId,
            industryTag: config.industryTag,
            radiusOverride: config.radiusOverride,
            locks: config.locks,
        });
        return btoa(encodeURIComponent(json));
    } catch {
        return "";
    }
}

export function deserializeTheme(param: string): Partial<ThemeConfig> | null {
    try {
        const json = decodeURIComponent(atob(param));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function pushThemeToUrl(config: ThemeConfig): void {
    if (typeof window === "undefined") return;
    const encoded = serializeTheme(config);
    const url = new URL(window.location.href);
    url.searchParams.set("theme", encoded);
    window.history.replaceState(null, "", url.toString());
}

export function readThemeFromUrl(): Partial<ThemeConfig> | null {
    if (typeof window === "undefined") return null;
    const param = new URLSearchParams(window.location.search).get("theme");
    if (!param) return null;
    return deserializeTheme(param);
}