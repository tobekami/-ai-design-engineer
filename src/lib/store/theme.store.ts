import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";
import { generateHarmony } from "../harmony/engine";
import { paletteToShadcnTokens } from "../harmony/tokens";
import type { ThemeConfig, HarmonyType, ShadcnTokenSet } from "../schema/theme-config.schema";

const HARMONY_TYPES: HarmonyType[] = [
    "analogous",
    "complementary",
    "split-comp",
    "triadic",
    "tetradic",
    "monochromatic",
];

function buildThemeConfig(
    primaryHex: string,
    harmonyType: HarmonyType,
    radiusOverride: number | null = null
): ThemeConfig {
    const palette = generateHarmony(primaryHex, harmonyType);
    const radiusPx = radiusOverride !== null ? radiusOverride : 8;
    const tokens = paletteToShadcnTokens(palette, radiusPx);

    return {
        id: nanoid(),
        primaryHex,
        harmonyType,
        ideologyId: "default",
        ideologyTension: 0,
        fontPairId: "default",
        industryTag: "tech",
        radiusOverride,
        locks: {
            color: false,
            harmony: false,
            ideology: false,
            fonts: false,
            radius: false,
        },
        tokens,
        createdAt: new Date().toISOString(),
    };
}

interface ThemeStore {
    current: ThemeConfig;
    isDark: boolean;
    past: ThemeConfig[];
    future: ThemeConfig[];

    // Actions
    setPrimaryHex: (hex: string) => void;
    setHarmonyType: (type: HarmonyType) => void;
    setRadiusOverride: (value: number | null) => void;
    toggleDark: () => void;
    toggleLock: (dimension: keyof ThemeConfig["locks"]) => void;
    randomizeUnlocked: () => void;
    undo: () => void;
    redo: () => void;
}

const SEED_COLOR = "#6d28d9";
const SEED_HARMONY: HarmonyType = "analogous";

export const useThemeStore = create<ThemeStore>()(
    immer((set, get) => ({
        current: buildThemeConfig(SEED_COLOR, SEED_HARMONY),
        isDark: false,
        past: [],
        future: [],

        setPrimaryHex: (hex: string) => {
            if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
            set((state) => {
                state.past.push(state.current);
                if (state.past.length > 50) state.past.shift();
                state.future = [];
                state.current = buildThemeConfig(
                    hex,
                    state.current.harmonyType,
                    state.current.radiusOverride
                );
            });
        },

        setHarmonyType: (type: HarmonyType) => {
            set((state) => {
                state.past.push(state.current);
                if (state.past.length > 50) state.past.shift();
                state.future = [];
                state.current = buildThemeConfig(
                    state.current.primaryHex,
                    type,
                    state.current.radiusOverride
                );
                state.current.harmonyType = type;
            });
        },

        setRadiusOverride: (value: number | null) => {
            set((state) => {
                state.past.push(state.current);
                if (state.past.length > 50) state.past.shift();
                state.future = [];
                state.current = buildThemeConfig(
                    state.current.primaryHex,
                    state.current.harmonyType,
                    value
                );
                state.current.radiusOverride = value;
            });
        },

        toggleDark: () => {
            set((state) => {
                state.isDark = !state.isDark;
            });
        },

        toggleLock: (dimension) => {
            set((state) => {
                state.current.locks[dimension] = !state.current.locks[dimension];
            });
        },

        randomizeUnlocked: () => {
            set((state) => {
                const { locks, primaryHex, harmonyType, radiusOverride } = state.current;

                const newHex = locks.color
                    ? primaryHex
                    : "#" +
                    Math.floor(Math.random() * 0xffffff)
                        .toString(16)
                        .padStart(6, "0");

                const newHarmony = locks.harmony
                    ? harmonyType
                    : HARMONY_TYPES[Math.floor(Math.random() * HARMONY_TYPES.length)];

                const newRadius = locks.radius
                    ? radiusOverride
                    : Math.floor(Math.random() * 20);

                state.past.push(state.current);
                if (state.past.length > 50) state.past.shift();
                state.future = [];
                state.current = buildThemeConfig(newHex, newHarmony, newRadius);
                state.current.locks = locks; // preserve locks after randomize
            });
        },

        undo: () => {
            set((state) => {
                if (state.past.length === 0) return;
                state.future.unshift(state.current);
                state.current = state.past.pop()!;
            });
        },

        redo: () => {
            set((state) => {
                if (state.future.length === 0) return;
                state.past.push(state.current);
                state.current = state.future.shift()!;
            });
        },
    }))
);