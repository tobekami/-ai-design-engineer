import { hexToOklch, oklchToHex, shiftHue, shiftLightness, shiftChroma } from "./oklch";
import type { OklchColor } from "./oklch";
import type { HarmonyType } from "../schema/theme-config.schema";

export interface HarmonyPalette {
    primary: string;
    secondary: string;
    accent: string;
    complement: string;
    background: string;
    surface: string;
    muted: string;
    destructive: string;
}

function clampChroma(color: OklchColor): OklchColor {
    return { ...color, c: Math.min(color.c, 0.37) };
}

export function generateHarmony(
    primaryHex: string,
    harmonyType: HarmonyType
): HarmonyPalette {
    const primary = hexToOklch(primaryHex);

    let secondary: OklchColor;
    let accent: OklchColor;
    let complement: OklchColor;

    switch (harmonyType) {
        case "analogous":
            secondary = shiftHue(primary, 30);
            accent = shiftHue(primary, -30);
            complement = shiftHue(primary, 180);
            break;

        case "complementary":
            secondary = shiftHue(primary, 180);
            accent = shiftHue(primary, 90);
            complement = shiftHue(primary, 180);
            break;

        case "split-comp":
            secondary = shiftHue(primary, 150);
            accent = shiftHue(primary, 210);
            complement = shiftHue(primary, 180);
            break;

        case "triadic":
            secondary = shiftHue(primary, 120);
            accent = shiftHue(primary, 240);
            complement = shiftHue(primary, 180);
            break;

        case "tetradic":
            secondary = shiftHue(primary, 90);
            accent = shiftHue(primary, 180);
            complement = shiftHue(primary, 270);
            break;

        case "monochromatic":
            secondary = shiftLightness(shiftChroma(primary, -0.05), 0.15);
            accent = shiftLightness(shiftChroma(primary, 0.05), -0.1);
            complement = shiftLightness(primary, -0.2);
            break;

        default:
            secondary = shiftHue(primary, 30);
            accent = shiftHue(primary, -30);
            complement = shiftHue(primary, 180);
    }

    // Background: very low chroma, high lightness version of primary hue
    const background = clampChroma(
        shiftLightness(shiftChroma(primary, -primary.c + 0.02), 1 - primary.l - 0.05)
    );

    // Surface: slightly off-white with a hint of the primary hue
    const surface = clampChroma({
        ...primary,
        l: 0.97,
        c: 0.01,
    });

    // Muted: desaturated secondary
    const muted = clampChroma(
        shiftChroma(shiftLightness(secondary, 0.3 - secondary.l), -secondary.c + 0.03)
    );

    // Destructive: always a red-range hue
    const destructive: OklchColor = {
        l: 0.55,
        c: 0.22,
        h: 25,
    };

    return {
        primary: oklchToHex(clampChroma(primary)),
        secondary: oklchToHex(clampChroma(secondary)),
        accent: oklchToHex(clampChroma(accent)),
        complement: oklchToHex(clampChroma(complement)),
        background: oklchToHex(background),
        surface: oklchToHex(surface),
        muted: oklchToHex(muted),
        destructive: oklchToHex(destructive),
    };
}