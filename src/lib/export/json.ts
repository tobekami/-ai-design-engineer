import type { ThemeConfig } from "../schema/theme-config.schema";
import { downloadFile } from "./css";

export function exportAsJSON(config: ThemeConfig): string {
    const output = {
        id: config.id,
        createdAt: config.createdAt,
        primary: config.primaryHex,
        harmony: config.harmonyType,
        ideology: config.ideologyId,
        industryTag: config.industryTag,
        fontPairId: config.fontPairId,
        radius: config.tokens.radius,
        tokens: {
            light: {
                background: config.tokens.background,
                foreground: config.tokens.foreground,
                card: config.tokens.card,
                cardForeground: config.tokens.cardForeground,
                popover: config.tokens.popover,
                popoverForeground: config.tokens.popoverForeground,
                primary: config.tokens.primary,
                primaryForeground: config.tokens.primaryForeground,
                secondary: config.tokens.secondary,
                secondaryForeground: config.tokens.secondaryForeground,
                muted: config.tokens.muted,
                mutedForeground: config.tokens.mutedForeground,
                accent: config.tokens.accent,
                accentForeground: config.tokens.accentForeground,
                destructive: config.tokens.destructive,
                destructiveForeground: config.tokens.destructiveForeground,
                border: config.tokens.border,
                input: config.tokens.input,
                ring: config.tokens.ring,
            },
            dark: {
                background: config.tokens.darkBackground,
                foreground: config.tokens.darkForeground,
                card: config.tokens.darkCard,
                cardForeground: config.tokens.darkCardForeground,
                popover: config.tokens.darkPopover,
                popoverForeground: config.tokens.darkPopoverForeground,
                primary: config.tokens.darkPrimary,
                primaryForeground: config.tokens.darkPrimaryForeground,
                secondary: config.tokens.darkSecondary,
                secondaryForeground: config.tokens.darkSecondaryForeground,
                muted: config.tokens.darkMuted,
                mutedForeground: config.tokens.darkMutedForeground,
                accent: config.tokens.darkAccent,
                accentForeground: config.tokens.darkAccentForeground,
                destructive: config.tokens.darkDestructive,
                destructiveForeground: config.tokens.darkDestructiveForeground,
                border: config.tokens.darkBorder,
                input: config.tokens.darkInput,
                ring: config.tokens.darkRing,
            },
        },
    };

    return JSON.stringify(output, null, 2);
}

export function downloadJSON(config: ThemeConfig): void {
    const content = exportAsJSON(config);
    downloadFile(content, "theme.json", "application/json");
}