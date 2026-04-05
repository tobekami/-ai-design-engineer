import { converter } from "culori";
import { hexToOklch, oklchToHex, shiftLightness } from "./oklch";

const toRgb = converter("rgb");

function relativeLuminance(hex: string): number {
    const rgb = toRgb(hex);
    if (!rgb) return 0;

    const linearize = (v: number) =>
        v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);

    const r = linearize(rgb.r ?? 0);
    const g = linearize(rgb.g ?? 0);
    const b = linearize(rgb.b ?? 0);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hex1: string, hex2: string): number {
    const l1 = relativeLuminance(hex1);
    const l2 = relativeLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

export function passesWCAG(
    fg: string,
    bg: string,
    level: "AA" | "AAA" = "AA"
): boolean {
    const ratio = contrastRatio(fg, bg);
    return level === "AA" ? ratio >= 4.5 : ratio >= 7;
}

export function enforceMinContrast(
    fg: string,
    bg: string,
    minRatio: number = 4.5
): string {
    if (contrastRatio(fg, bg) >= minRatio) return fg;

    const bgLuminance = relativeLuminance(bg);
    // Decide direction: push fg toward dark if bg is light, toward light if bg is dark
    const direction = bgLuminance > 0.5 ? -1 : 1;

    let oklch = hexToOklch(fg);
    let adjusted = fg;

    for (let i = 0; i < 20; i++) {
        oklch = shiftLightness(oklch, direction * 0.05);
        adjusted = oklchToHex(oklch);
        if (contrastRatio(adjusted, bg) >= minRatio) break;
    }

    return adjusted;
}