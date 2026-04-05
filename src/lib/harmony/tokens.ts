import { enforceMinContrast } from "./wcag";
import { hexToOklch, oklchToHex, shiftLightness, shiftChroma, hexToOklchCss } from "./oklch";
import type { HarmonyPalette } from "./engine";
import type { ShadcnTokenSet } from "../schema/theme-config.schema";

function deriveForeground(backgroundHex: string): string {
    const oklch = hexToOklch(backgroundHex);
    const fgOklch = oklch.l > 0.5
        ? { l: 0.13, c: 0.01, h: oklch.h }
        : { l: 0.98, c: 0.01, h: oklch.h };
    const fg = oklchToHex(fgOklch);
    return enforceMinContrast(fg, backgroundHex, 4.5);
}

function deriveDarkBackground(hex: string): string {
    const oklch = hexToOklch(hex);
    return oklchToHex({ l: 0.13, c: Math.min(oklch.c * 0.15, 0.015), h: oklch.h });
}

export function paletteToShadcnTokens(
    palette: HarmonyPalette,
    radiusPx: number = 8
): ShadcnTokenSet {

    // ── Light mode ──────────────────────────────────────────────

    // Background: very light, low chroma tint of primary hue
    const primaryOklch = hexToOklch(palette.primary);
    const backgroundHex = oklchToHex({ l: 0.98, c: 0.008, h: primaryOklch.h });
    const foregroundHex = enforceMinContrast(
        oklchToHex({ l: 0.12, c: 0.01, h: primaryOklch.h }),
        backgroundHex, 4.5
    );

    // Card: slightly off-white with hint of hue
    const cardHex = oklchToHex({ l: 1.0, c: 0.004, h: primaryOklch.h });
    const cardForegroundHex = foregroundHex;

    // Popover same as card
    const popoverHex = cardHex;
    const popoverForegroundHex = foregroundHex;

    // Primary: full brand color
    const primaryHex = palette.primary;
    const primaryForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.99, c: 0.005, h: primaryOklch.h }),
        primaryHex, 4.5
    );

    // Secondary: very light version of secondary hue — visible but subtle
    const secondaryOklch = hexToOklch(palette.secondary);
    const secondaryHex = oklchToHex({ l: 0.92, c: 0.06, h: secondaryOklch.h });
    const secondaryForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.25, c: 0.08, h: secondaryOklch.h }),
        secondaryHex, 4.5
    );

    // Muted: very desaturated background-adjacent
    const mutedHex = oklchToHex({ l: 0.94, c: 0.012, h: primaryOklch.h });
    const mutedForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.45, c: 0.02, h: primaryOklch.h }),
        mutedHex, 4.5
    );

    // Accent: light version of accent hue — distinct from secondary
    const accentOklch = hexToOklch(palette.accent);
    const accentHex = oklchToHex({ l: 0.90, c: 0.07, h: accentOklch.h });
    const accentForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.22, c: 0.08, h: accentOklch.h }),
        accentHex, 4.5
    );

    // Destructive: always red-range
    const destructiveHex = oklchToHex({ l: 0.55, c: 0.22, h: 25 });
    const destructiveForegroundHex = enforceMinContrast("#ffffff", destructiveHex, 4.5);

    // Border/Input: subtle, slightly darker than background
    const borderHex = oklchToHex({ l: 0.88, c: 0.012, h: primaryOklch.h });
    const inputHex = oklchToHex({ l: 0.91, c: 0.008, h: primaryOklch.h });
    const ringHex = palette.primary;

    // ── Dark mode ────────────────────────────────────────────────

    const darkBgHex = deriveDarkBackground(palette.primary);
    const darkBgOklch = hexToOklch(darkBgHex);

    const darkForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.95, c: 0.01, h: primaryOklch.h }),
        darkBgHex, 4.5
    );

    const darkCardHex = oklchToHex({ ...darkBgOklch, l: darkBgOklch.l + 0.06 });
    const darkCardForegroundHex = darkForegroundHex;
    const darkPopoverHex = darkCardHex;
    const darkPopoverForegroundHex = darkForegroundHex;

    const darkPrimaryHex = oklchToHex({
        l: Math.min(primaryOklch.l + 0.08, 0.82),
        c: Math.min(primaryOklch.c + 0.02, 0.33),
        h: primaryOklch.h,
    });
    const darkPrimaryForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.1, c: 0.01, h: primaryOklch.h }),
        darkPrimaryHex, 4.5
    );

    const darkSecondaryHex = oklchToHex({ l: 0.22, c: 0.04, h: secondaryOklch.h });
    const darkSecondaryForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.85, c: 0.03, h: secondaryOklch.h }),
        darkSecondaryHex, 4.5
    );

    const darkMutedHex = oklchToHex({ l: 0.20, c: 0.01, h: primaryOklch.h });
    const darkMutedForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.65, c: 0.02, h: primaryOklch.h }),
        darkMutedHex, 4.5
    );

    const darkAccentHex = oklchToHex({ l: 0.24, c: 0.05, h: accentOklch.h });
    const darkAccentForegroundHex = enforceMinContrast(
        oklchToHex({ l: 0.88, c: 0.03, h: accentOklch.h }),
        darkAccentHex, 4.5
    );

    const darkDestructiveHex = oklchToHex({ l: 0.50, c: 0.22, h: 25 });
    const darkDestructiveForegroundHex = enforceMinContrast("#ffffff", darkDestructiveHex, 4.5);

    const darkBorderHex = oklchToHex({ l: darkBgOklch.l + 0.14, c: 0.015, h: primaryOklch.h });
    const darkInputHex = oklchToHex({ l: darkBgOklch.l + 0.10, c: 0.01, h: primaryOklch.h });
    const darkRingHex = darkPrimaryHex;

    const radius = `${radiusPx}px`;

    return {
        background: hexToOklchCss(backgroundHex),
        foreground: hexToOklchCss(foregroundHex),
        card: hexToOklchCss(cardHex),
        cardForeground: hexToOklchCss(cardForegroundHex),
        popover: hexToOklchCss(popoverHex),
        popoverForeground: hexToOklchCss(popoverForegroundHex),
        primary: hexToOklchCss(primaryHex),
        primaryForeground: hexToOklchCss(primaryForegroundHex),
        secondary: hexToOklchCss(secondaryHex),
        secondaryForeground: hexToOklchCss(secondaryForegroundHex),
        muted: hexToOklchCss(mutedHex),
        mutedForeground: hexToOklchCss(mutedForegroundHex),
        accent: hexToOklchCss(accentHex),
        accentForeground: hexToOklchCss(accentForegroundHex),
        destructive: hexToOklchCss(destructiveHex),
        destructiveForeground: hexToOklchCss(destructiveForegroundHex),
        border: hexToOklchCss(borderHex),
        input: hexToOklchCss(inputHex),
        ring: hexToOklchCss(ringHex),
        radius,
        darkBackground: hexToOklchCss(darkBgHex),
        darkForeground: hexToOklchCss(darkForegroundHex),
        darkCard: hexToOklchCss(darkCardHex),
        darkCardForeground: hexToOklchCss(darkCardForegroundHex),
        darkPopover: hexToOklchCss(darkPopoverHex),
        darkPopoverForeground: hexToOklchCss(darkPopoverForegroundHex),
        darkPrimary: hexToOklchCss(darkPrimaryHex),
        darkPrimaryForeground: hexToOklchCss(darkPrimaryForegroundHex),
        darkSecondary: hexToOklchCss(darkSecondaryHex),
        darkSecondaryForeground: hexToOklchCss(darkSecondaryForegroundHex),
        darkMuted: hexToOklchCss(darkMutedHex),
        darkMutedForeground: hexToOklchCss(darkMutedForegroundHex),
        darkAccent: hexToOklchCss(darkAccentHex),
        darkAccentForeground: hexToOklchCss(darkAccentForegroundHex),
        darkDestructive: hexToOklchCss(darkDestructiveHex),
        darkDestructiveForeground: hexToOklchCss(darkDestructiveForegroundHex),
        darkBorder: hexToOklchCss(darkBorderHex),
        darkInput: hexToOklchCss(darkInputHex),
        darkRing: hexToOklchCss(darkRingHex),
    };
}