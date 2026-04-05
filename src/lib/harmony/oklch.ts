import { converter, formatHex, parse } from "culori";

const toOklch = converter("oklch");
const toRgb = converter("rgb");

export interface OklchColor {
    l: number; // 0–1
    c: number; // 0–0.4 approx
    h: number; // 0–360
}

export function hexToOklch(hex: string): OklchColor {
    const color = toOklch(hex);
    if (!color) throw new Error(`Invalid hex color: ${hex}`);
    return {
        l: color.l ?? 0,
        c: color.c ?? 0,
        h: color.h ?? 0,
    };
}

export function oklchToHex(oklch: OklchColor): string {
    const hex = formatHex({ mode: "oklch", ...oklch });
    return hex ?? "#000000";
}

export function oklchToCss(oklch: OklchColor): string {
    return `oklch(${(oklch.l * 100).toFixed(1)}% ${oklch.c.toFixed(4)} ${(oklch.h ?? 0).toFixed(1)})`;
}

export function hexToHsl(hex: string): string {
    const color = parse(hex);
    if (!color) return "0 0% 0%";
    const rgb = toRgb(color);
    if (!rgb) return "0 0% 0%";

    const r = (rgb.r ?? 0);
    const g = (rgb.g ?? 0);
    const b = (rgb.b ?? 0);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function shiftHue(oklch: OklchColor, degrees: number): OklchColor {
    return {
        ...oklch,
        h: ((oklch.h ?? 0) + degrees + 360) % 360,
    };
}

export function shiftLightness(oklch: OklchColor, amount: number): OklchColor {
    return {
        ...oklch,
        l: Math.max(0, Math.min(1, oklch.l + amount)),
    };
}

export function shiftChroma(oklch: OklchColor, amount: number): OklchColor {
    return {
        ...oklch,
        c: Math.max(0, oklch.c + amount),
    };
}

export function hexToOklchCss(hex: string): string {
    const oklch = hexToOklch(hex);
    return `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${(oklch.h ?? 0).toFixed(2)})`;
}