import { useMemo } from "react";

export function useColorName(hex: string): string {
    return useMemo(() => {
        if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return "";

        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        const d = max - min;
        const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

        if (s < 0.08) {
            if (l > 0.92) return "White";
            if (l > 0.72) return "Light Gray";
            if (l > 0.42) return "Gray";
            if (l > 0.18) return "Dark Gray";
            return "Black";
        }

        let h = 0;
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
        const hDeg = h * 360;

        const li = l > 0.72 ? "Light " : l < 0.32 ? "Deep " : "";
        const sa = s > 0.72 ? "Vivid " : s < 0.32 ? "Muted " : "";

        if (hDeg < 15 || hDeg >= 345) return `${li}${sa}Red`;
        if (hDeg < 40) return `${li}${sa}Orange`;
        if (hDeg < 65) return `${li}${sa}Yellow`;
        if (hDeg < 150) return `${li}${sa}Green`;
        if (hDeg < 175) return `${li}${sa}Teal`;
        if (hDeg < 195) return `${li}${sa}Cyan`;
        if (hDeg < 255) return `${li}${sa}Blue`;
        if (hDeg < 285) return `${li}${sa}Violet`;
        if (hDeg < 315) return `${li}${sa}Purple`;
        return `${li}${sa}Pink`;
    }, [hex]);
}