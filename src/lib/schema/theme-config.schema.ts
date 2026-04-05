import { z } from "zod";

export const HarmonyTypeSchema = z.enum([
    "analogous",
    "complementary",
    "split-comp",
    "triadic",
    "tetradic",
    "monochromatic",
]);

export const ShadcnTokenSetSchema = z.object({
    // Light mode
    background: z.string(),
    foreground: z.string(),
    card: z.string(),
    cardForeground: z.string(),
    popover: z.string(),
    popoverForeground: z.string(),
    primary: z.string(),
    primaryForeground: z.string(),
    secondary: z.string(),
    secondaryForeground: z.string(),
    muted: z.string(),
    mutedForeground: z.string(),
    accent: z.string(),
    accentForeground: z.string(),
    destructive: z.string(),
    destructiveForeground: z.string(),
    border: z.string(),
    input: z.string(),
    ring: z.string(),
    radius: z.string(),
    // Dark mode
    darkBackground: z.string(),
    darkForeground: z.string(),
    darkCard: z.string(),
    darkCardForeground: z.string(),
    darkPopover: z.string(),
    darkPopoverForeground: z.string(),
    darkPrimary: z.string(),
    darkPrimaryForeground: z.string(),
    darkSecondary: z.string(),
    darkSecondaryForeground: z.string(),
    darkMuted: z.string(),
    darkMutedForeground: z.string(),
    darkAccent: z.string(),
    darkAccentForeground: z.string(),
    darkDestructive: z.string(),
    darkDestructiveForeground: z.string(),
    darkBorder: z.string(),
    darkInput: z.string(),
    darkRing: z.string(),
});

export const LocksSchema = z.object({
    color: z.boolean(),
    harmony: z.boolean(),
    ideology: z.boolean(),
    fonts: z.boolean(),
    radius: z.boolean(),
});

export const ThemeConfigSchema = z.object({
    id: z.string(),
    primaryHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    harmonyType: HarmonyTypeSchema,
    ideologyId: z.string(),
    ideologyTension: z.number().min(0).max(1),
    fontPairId: z.string(),
    industryTag: z.string(),
    radiusOverride: z.number().min(0).max(100).nullable(),
    locks: LocksSchema,
    tokens: ShadcnTokenSetSchema,
    createdAt: z.string().datetime(),
});

export type HarmonyType = z.infer<typeof HarmonyTypeSchema>;
export type ShadcnTokenSet = z.infer<typeof ShadcnTokenSetSchema>;
export type Locks = z.infer<typeof LocksSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;