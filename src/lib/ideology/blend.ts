import { IDEOLOGY_REGISTRY, type TokenShift } from "./registry";
import type { ShadcnTokenSet } from "../schema/theme-config.schema";

export interface AppliedIdeology {
    tokens: ShadcnTokenSet;
    css: Record<string, string>;
    radiusPx: number;
}

// Parse an oklch() CSS string into components
function parseOklch(value: string): { l: number; c: number; h: number } | null {
    if (!value.startsWith("oklch(")) return null;
    const inner = value.replace("oklch(", "").replace(")", "").trim();
    const parts = inner.split(/\s+/);
    if (parts.length < 3) return null;
    return {
        l: parseFloat(parts[0]),
        c: parseFloat(parts[1]),
        h: parseFloat(parts[2]) || 0,
    };
}

// Serialize back to oklch() CSS string
function serializeOklch(l: number, c: number, h: number): string {
    const lc = Math.max(0, Math.min(1, l));
    const cc = Math.max(0, Math.min(0.4, c));
    const hc = ((h % 360) + 360) % 360;
    return `oklch(${lc.toFixed(4)} ${cc.toFixed(4)} ${hc.toFixed(2)})`;
}

// Apply a TokenShift to an oklch() CSS string, blended by tension (0-1)
function applyShift(value: string, shift: TokenShift, tension: number): string {
    if (!value || tension === 0) return value;

    const parsed = parseOklch(value);
    if (!parsed) return value;

    let { l, c, h } = parsed;

    // Lightness
    if (shift.l_clamp !== undefined) {
        l = l + (shift.l_clamp - l) * tension;
    }
    if (shift.l_delta !== undefined) {
        l = l + shift.l_delta * tension;
    }

    // Chroma
    if (shift.c_clamp !== undefined) {
        c = c + (shift.c_clamp - c) * tension;
    }
    if (shift.c_multiply !== undefined) {
        const target = c * shift.c_multiply;
        c = c + (target - c) * tension;
    }

    // Hue
    if (shift.h_delta !== undefined) {
        h = h + shift.h_delta * tension;
    }

    return serializeOklch(l, c, h);
}

export function applyIdeology(
    tokens: ShadcnTokenSet,
    ideologyId: string,
    tension: number = 1
): AppliedIdeology {
    const ideology = IDEOLOGY_REGISTRY[ideologyId] ?? IDEOLOGY_REGISTRY.default;
    const shifts = ideology.tokenShifts;

    // Radius — lerp from current token radius to ideology radius
    // Radius is already set correctly by the store before this is called
    // Just preserve whatever the token already has
    const radiusPx = parseInt(tokens.radius) || 8;
    const radius = tokens.radius;

    // Apply token shifts
    const t = tokens;
    const appliedTokens: ShadcnTokenSet = {
        ...t,
        radius,
        background: shifts.background ? applyShift(t.background, shifts.background, tension) : t.background,
        foreground: shifts.foreground ? applyShift(t.foreground, shifts.foreground, tension) : t.foreground,
        card: shifts.card ? applyShift(t.card, shifts.card, tension) : t.card,
        cardForeground: shifts.cardForeground ? applyShift(t.cardForeground, shifts.cardForeground, tension) : t.cardForeground,
        primary: shifts.primary ? applyShift(t.primary, shifts.primary, tension) : t.primary,
        primaryForeground: shifts.primaryForeground ? applyShift(t.primaryForeground, shifts.primaryForeground, tension) : t.primaryForeground,
        secondary: shifts.secondary ? applyShift(t.secondary, shifts.secondary, tension) : t.secondary,
        secondaryForeground: shifts.secondaryForeground ? applyShift(t.secondaryForeground, shifts.secondaryForeground, tension) : t.secondaryForeground,
        muted: shifts.muted ? applyShift(t.muted, shifts.muted, tension) : t.muted,
        mutedForeground: shifts.mutedForeground ? applyShift(t.mutedForeground, shifts.mutedForeground, tension) : t.mutedForeground,
        accent: shifts.accent ? applyShift(t.accent, shifts.accent, tension) : t.accent,
        accentForeground: shifts.accentForeground ? applyShift(t.accentForeground, shifts.accentForeground, tension) : t.accentForeground,
        border: shifts.border ? applyShift(t.border, shifts.border, tension) : t.border,
        input: shifts.input ? applyShift(t.input, shifts.input, tension) : t.input,
        ring: shifts.ring ? applyShift(t.ring, shifts.ring, tension) : t.ring,
        // Dark mode
        darkBackground: shifts.darkBackground ? applyShift(t.darkBackground, shifts.darkBackground, tension) : t.darkBackground,
        darkForeground: shifts.darkForeground ? applyShift(t.darkForeground, shifts.darkForeground, tension) : t.darkForeground,
        darkCard: shifts.darkCard ? applyShift(t.darkCard, shifts.darkCard, tension) : t.darkCard,
        darkPrimary: shifts.darkPrimary ? applyShift(t.darkPrimary, shifts.darkPrimary, tension) : t.darkPrimary,
        darkBorder: shifts.darkBorder ? applyShift(t.darkBorder, shifts.darkBorder, tension) : t.darkBorder,
    };

    const css: Record<string, string> = {
        "--border-width": ideology.constraints.borderWidth,
        "--card-shadow": ideology.constraints.shadowStyle,
        ...ideology.cssOverrides,
    };

    return { tokens: appliedTokens, css, radiusPx };
}

export function getIdeologyRadiusPx(ideologyId: string): number {
    return IDEOLOGY_REGISTRY[ideologyId]?.constraints.radiusPx ?? 8;
}