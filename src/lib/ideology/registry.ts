export interface TokenShift {
    // Lightness: absolute clamp or relative delta
    l_clamp?: number;      // force lightness to exactly this value
    l_delta?: number;      // shift lightness by this amount (+/-)
    // Chroma: absolute clamp or relative multiplier
    c_clamp?: number;      // force chroma to exactly this value
    c_multiply?: number;   // multiply chroma by this factor
    // Hue: relative shift in degrees
    h_delta?: number;      // shift hue by this many degrees
}

export interface IdeologyTokenShifts {
    background?: TokenShift;
    foreground?: TokenShift;
    card?: TokenShift;
    cardForeground?: TokenShift;
    primary?: TokenShift;
    primaryForeground?: TokenShift;
    secondary?: TokenShift;
    secondaryForeground?: TokenShift;
    muted?: TokenShift;
    mutedForeground?: TokenShift;
    accent?: TokenShift;
    accentForeground?: TokenShift;
    border?: TokenShift;
    input?: TokenShift;
    ring?: TokenShift;
    // Dark mode mirrors
    darkBackground?: TokenShift;
    darkForeground?: TokenShift;
    darkCard?: TokenShift;
    darkPrimary?: TokenShift;
    darkBorder?: TokenShift;
}

export interface IdeologyConfig {
    id: string;
    label: string;
    description: string;
    constraints: {
        radiusPx: number;
        borderWidth: string;
        shadowStyle: string;
        backgroundOpacity: number;
        fontWeightDisplay: number;
        letterSpacingDisplay: string;
        surfaceStyle: "solid" | "glass" | "flat";
    };
    cssOverrides: Record<string, string>;
    tokenShifts: IdeologyTokenShifts;
}

export const IDEOLOGY_REGISTRY: Record<string, IdeologyConfig> = {
    default: {
        id: "default",
        label: "Default",
        description: "Clean modern SaaS",
        constraints: {
            radiusPx: 8,
            borderWidth: "1px",
            shadowStyle: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            backgroundOpacity: 1,
            fontWeightDisplay: 600,
            letterSpacingDisplay: "-0.02em",
            surfaceStyle: "solid",
        },
        cssOverrides: {},
        tokenShifts: {},
    },

    glassmorphism: {
        id: "glassmorphism",
        label: "Glassmorphism",
        description: "Frosted glass, blur, depth",
        constraints: {
            radiusPx: 16,
            borderWidth: "1px",
            shadowStyle: "0 8px 32px 0 rgb(0 0 0 / 0.12)",
            backgroundOpacity: 0.7,
            fontWeightDisplay: 500,
            letterSpacingDisplay: "-0.01em",
            surfaceStyle: "glass",
        },
        cssOverrides: {
            "--glass-blur": "blur(12px)",
            "--glass-border": "1px solid rgb(255 255 255 / 0.2)",
        },
        tokenShifts: {
            // Background stays light but gets a stronger hue tint
            background: { l_clamp: 0.96, c_multiply: 2.0 },
            // Card becomes slightly lighter and more transparent-feeling
            card: { l_clamp: 0.99, c_multiply: 1.5 },
            // Border very subtle — glass shouldn't have hard lines
            border: { l_delta: 0.05, c_clamp: 0.008 },
            // Primary stays vibrant
            primary: { c_multiply: 1.1 },
            // Muted gets a stronger tint to feel like frosted color
            muted: { l_clamp: 0.93, c_multiply: 2.5 },
            // Dark mode — deeper, more saturated backgrounds
            darkBackground: { l_clamp: 0.08, c_multiply: 2.0 },
            darkCard: { l_clamp: 0.13, c_multiply: 2.0 },
        },
    },

    neobrutalism: {
        id: "neobrutalism",
        label: "Neo-Brutalism",
        description: "Hard borders, raw energy",
        constraints: {
            radiusPx: 0,
            borderWidth: "3px",
            shadowStyle: "4px 4px 0px 0px #000000",
            backgroundOpacity: 1,
            fontWeightDisplay: 800,
            letterSpacingDisplay: "-0.03em",
            surfaceStyle: "flat",
        },
        cssOverrides: {
            "--brutal-border": "3px solid #000000",
            "--brutal-shadow": "4px 4px 0px 0px #000000",
        },
        tokenShifts: {
            // Background forced pure/near-white — brutalism needs stark contrast
            background: { l_clamp: 0.99, c_clamp: 0.005 },
            card: { l_clamp: 1.0, c_clamp: 0.0 },
            // Border forced near-black regardless of palette hue
            border: { l_clamp: 0.1, c_clamp: 0.01 },
            input: { l_clamp: 0.12, c_clamp: 0.01 },
            ring: { l_clamp: 0.08, c_clamp: 0.0 },
            // Primary stays fully saturated — the one pop of color
            primary: { c_multiply: 1.3 },
            // Secondary gets a strong saturated tint — color blocking energy
            secondary: { l_clamp: 0.88, c_multiply: 2.0 },
            secondaryForeground: { l_clamp: 0.1, c_multiply: 1.0 },
            // Dark mode — inverse: near-black bg, white borders
            darkBackground: { l_clamp: 0.06, c_clamp: 0.005 },
            darkBorder: { l_clamp: 0.92, c_clamp: 0.01 },
        },
    },

    minimal: {
        id: "minimal",
        label: "Minimal / Swiss",
        description: "Whitespace, precision, clarity",
        constraints: {
            radiusPx: 4,
            borderWidth: "1px",
            shadowStyle: "none",
            backgroundOpacity: 1,
            fontWeightDisplay: 400,
            letterSpacingDisplay: "0.01em",
            surfaceStyle: "flat",
        },
        cssOverrides: {},
        tokenShifts: {
            // Everything desaturated — let whitespace do the work
            background: { l_clamp: 0.99, c_clamp: 0.003 },
            card: { l_clamp: 1.0, c_clamp: 0.0 },
            secondary: { l_clamp: 0.96, c_clamp: 0.004 },
            muted: { l_clamp: 0.96, c_clamp: 0.003 },
            accent: { l_clamp: 0.95, c_clamp: 0.004 },
            border: { l_clamp: 0.88, c_clamp: 0.004 },
            // Primary stays — it's the only color anchor
            primary: { c_multiply: 0.9 },
            // Foreground pushed to near-black for max readability
            foreground: { l_clamp: 0.1, c_clamp: 0.005 },
            mutedForeground: { l_clamp: 0.5, c_clamp: 0.008 },
        },
    },

    colorblocking: {
        id: "colorblocking",
        label: "Color Blocking",
        description: "Bold zones, editorial energy",
        constraints: {
            radiusPx: 0,
            borderWidth: "2px",
            shadowStyle: "none",
            backgroundOpacity: 1,
            fontWeightDisplay: 900,
            letterSpacingDisplay: "-0.04em",
            surfaceStyle: "flat",
        },
        cssOverrides: {},
        tokenShifts: {
            // Background gets a strong saturated color — full bleed zones
            background: { l_clamp: 0.95, c_multiply: 3.0 },
            // Card uses the secondary hue at full chroma — different color zone
            card: { l_clamp: 0.92, c_multiply: 3.5 },
            // Secondary maxed out for maximum contrast between zones
            secondary: { l_clamp: 0.85, c_multiply: 3.0 },
            secondaryForeground: { l_clamp: 0.1, c_multiply: 0.5 },
            // Accent maxed — third color zone
            accent: { l_clamp: 0.88, c_multiply: 3.0 },
            accentForeground: { l_clamp: 0.1, c_multiply: 0.5 },
            // Primary fully saturated
            primary: { c_multiply: 1.4 },
            // Borders strong and dark
            border: { l_clamp: 0.15, c_clamp: 0.01 },
        },
    },

    bento: {
        id: "bento",
        label: "Bento Grid",
        description: "Asymmetric cards, tech energy",
        constraints: {
            radiusPx: 12,
            borderWidth: "1px",
            shadowStyle: "0 2px 8px 0 rgb(0 0 0 / 0.08)",
            backgroundOpacity: 1,
            fontWeightDisplay: 600,
            letterSpacingDisplay: "-0.02em",
            surfaceStyle: "solid",
        },
        cssOverrides: {},
        tokenShifts: {
            // Background slightly tinted — cards pop against it
            background: { l_clamp: 0.96, c_multiply: 1.5 },
            // Card whiter than background for contrast
            card: { l_clamp: 0.99, c_multiply: 0.5 },
            // Secondary and accent get visible tints for bento variety
            secondary: { l_clamp: 0.90, c_multiply: 2.0 },
            accent: { l_clamp: 0.88, c_multiply: 2.5 },
            // Subtle borders
            border: { l_clamp: 0.88, c_clamp: 0.01 },
            // Dark mode — dark bento with slightly lighter cards
            darkBackground: { l_clamp: 0.1, c_multiply: 1.5 },
            darkCard: { l_clamp: 0.16, c_multiply: 1.5 },
        },
    },

    softpastel: {
        id: "softpastel",
        label: "Soft / Pastel",
        description: "Gentle, rounded, warm",
        constraints: {
            radiusPx: 20,
            borderWidth: "1px",
            shadowStyle: "0 2px 12px 0 rgb(0 0 0 / 0.06)",
            backgroundOpacity: 1,
            fontWeightDisplay: 500,
            letterSpacingDisplay: "0em",
            surfaceStyle: "solid",
        },
        cssOverrides: {},
        tokenShifts: {
            // Everything pushed high lightness, low chroma — pastel palette
            background: { l_clamp: 0.97, c_multiply: 0.6 },
            card: { l_clamp: 0.99, c_multiply: 0.4 },
            secondary: { l_clamp: 0.93, c_multiply: 0.7 },
            muted: { l_clamp: 0.95, c_multiply: 0.5 },
            accent: { l_clamp: 0.92, c_multiply: 0.8 },
            // Primary reduced chroma — pastel version of brand color
            primary: { l_delta: 0.1, c_multiply: 0.65 },
            // Border very soft
            border: { l_clamp: 0.90, c_clamp: 0.01 },
            // Foreground softened slightly — not pure black
            foreground: { l_clamp: 0.2, c_multiply: 0.5 },
        },
    },

    darkeditorial: {
        id: "darkeditorial",
        label: "Dark Editorial",
        description: "High contrast, media-forward",
        constraints: {
            radiusPx: 2,
            borderWidth: "1px",
            shadowStyle: "none",
            backgroundOpacity: 1,
            fontWeightDisplay: 700,
            letterSpacingDisplay: "-0.02em",
            surfaceStyle: "flat",
        },
        cssOverrides: {},
        tokenShifts: {
            // Force dark background in light mode — editorial inverts the norm
            background: { l_clamp: 0.1, c_multiply: 1.5 },
            foreground: { l_clamp: 0.95, c_clamp: 0.01 },
            card: { l_clamp: 0.15, c_multiply: 1.5 },
            cardForeground: { l_clamp: 0.95, c_clamp: 0.01 },
            // Muted becomes dark surface
            muted: { l_clamp: 0.18, c_multiply: 1.2 },
            mutedForeground: { l_clamp: 0.65, c_clamp: 0.02 },
            // Primary brightened to pop against dark bg
            primary: { l_delta: 0.1, c_multiply: 1.2 },
            // Border subtle on dark
            border: { l_clamp: 0.38, c_clamp: 0.015 },
            input: { l_clamp: 0.32, c_clamp: 0.01 },
            // Secondary gets a strong accent role
            secondary: { l_clamp: 0.2, c_multiply: 2.0 },
            secondaryForeground: { l_clamp: 0.9, c_clamp: 0.01 },
        },
    },

    scifi: {
        id: "scifi",
        label: "Sci-Fi / Terminal",
        description: "Monospace, glow, precision",
        constraints: {
            radiusPx: 0,
            borderWidth: "1px",
            shadowStyle: "0 0 12px 0 var(--ring)",
            backgroundOpacity: 1,
            fontWeightDisplay: 400,
            letterSpacingDisplay: "0.05em",
            surfaceStyle: "flat",
        },
        cssOverrides: {
            "--glow": "0 0 8px 0 var(--primary)",
        },
        tokenShifts: {
            // Near-black background
            background: { l_clamp: 0.07, c_multiply: 2.0 },
            foreground: { l_clamp: 0.9, c_multiply: 2.0 },
            card: { l_clamp: 0.11, c_multiply: 2.0 },
            cardForeground: { l_clamp: 0.9, c_multiply: 1.5 },
            muted: { l_clamp: 0.13, c_multiply: 1.5 },
            mutedForeground: { l_clamp: 0.6, c_multiply: 2.0 },
            // Primary maxed chroma — the glow color
            primary: { l_clamp: 0.75, c_multiply: 1.5 },
            primaryForeground: { l_clamp: 0.08, c_clamp: 0.01 },
            // Border dim but present
            border: { l_clamp: 0.35, c_multiply: 2.5 },
            // Ring = glow effect
            ring: { l_clamp: 0.75, c_multiply: 1.5 },
            // Accent as secondary glow color
            accent: { l_clamp: 0.15, c_multiply: 2.5 },
            accentForeground: { l_clamp: 0.85, c_multiply: 2.0 },
        },
    },

    claymorphism: {
        id: "claymorphism",
        label: "Claymorphism",
        description: "Chunky, playful, dimensional",
        constraints: {
            radiusPx: 24,
            borderWidth: "0px",
            shadowStyle: "0 8px 0 0 rgb(0 0 0 / 0.15), 0 12px 24px 0 rgb(0 0 0 / 0.1)",
            backgroundOpacity: 1,
            fontWeightDisplay: 700,
            letterSpacingDisplay: "-0.01em",
            surfaceStyle: "solid",
        },
        cssOverrides: {},
        tokenShifts: {
            // Warm, slightly saturated background
            background: { l_clamp: 0.96, c_multiply: 1.8 },
            // Card brighter and more saturated — clay is chunky and colorful
            card: { l_clamp: 0.98, c_multiply: 2.0 },
            // Primary pushed brighter and more saturated
            primary: { l_delta: 0.05, c_multiply: 1.2 },
            // Secondary and accent get good chroma — playful palette
            secondary: { l_clamp: 0.90, c_multiply: 2.5 },
            accent: { l_clamp: 0.88, c_multiply: 2.8 },
            // Muted still visible with color
            muted: { l_clamp: 0.93, c_multiply: 1.5 },
            // No border — clay doesn't have hard lines
            border: { l_clamp: 0.92, c_clamp: 0.005 },
        },
    },
};

export const IDEOLOGY_LIST = Object.values(IDEOLOGY_REGISTRY);