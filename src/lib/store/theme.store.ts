import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";
import { generateHarmony } from "../harmony/engine";
import { paletteToShadcnTokens } from "../harmony/tokens";
import { applyIdeology, getIdeologyRadiusPx } from "../ideology/blend";
import { getTopPairs } from "../typography/scorer";
import { injectFontPair, applyFontPair } from "../typography/loader";
import { pushThemeToUrl, readThemeFromUrl } from "./url-sync";
import type { ThemeConfig, HarmonyType, ShadcnTokenSet } from "../schema/theme-config.schema";
import type { FontPair } from "../typography/registry";

const HARMONY_TYPES: HarmonyType[] = [
    "analogous", "complementary", "split-comp",
    "triadic", "tetradic", "monochromatic",
];

const IDEOLOGY_IDS = [
    "default", "glassmorphism", "neobrutalism", "minimal",
    "colorblocking", "bento", "softpastel", "darkeditorial",
    "scifi", "claymorphism",
];

function buildThemeConfig(
    primaryHex: string,
    harmonyType: HarmonyType,
    ideologyId: string,
    ideologyTension: number,
    fontPairId: string,
    industryTag: string,
    radiusOverride: number | null,
): ThemeConfig {
    const palette = generateHarmony(primaryHex, harmonyType);

    // Use ideology radius if no manual override
    const radiusPx = radiusOverride !== null
        ? radiusOverride
        : getIdeologyRadiusPx(ideologyId);

    const baseTokens = paletteToShadcnTokens(palette, radiusPx);
    const { tokens } = applyIdeology(baseTokens, ideologyId, ideologyTension);

    return {
        id: nanoid(),
        primaryHex,
        harmonyType,
        ideologyId,
        ideologyTension,
        fontPairId,
        industryTag,
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

export interface Favourite {
    id: string;
    config: ThemeConfig;
    label: string;
    savedAt: string;
}

interface ThemeStore {
    current: ThemeConfig;
    isDark: boolean;
    past: ThemeConfig[];
    future: ThemeConfig[];
    favourites: Favourite[];

    // Actions
    setPrimaryHex: (hex: string) => void;
    setHarmonyType: (type: HarmonyType) => void;
    setIdeologyId: (id: string) => void;
    setIdeologyTension: (tension: number) => void;
    setFontPairId: (id: string) => void;
    setIndustryTag: (tag: string) => void;
    setRadiusOverride: (value: number | null) => void;
    toggleDark: () => void;
    toggleLock: (dimension: keyof ThemeConfig["locks"]) => void;
    randomizeUnlocked: () => void;
    undo: () => void;
    redo: () => void;
    saveFavourite: (label?: string) => void;
    removeFavourite: (id: string) => void;
    restoreFavourite: (id: string) => void;
}

const SEED_COLOR = "#6d28d9";
const SEED_HARMONY: HarmonyType = "analogous";
const SEED_IDEOLOGY = "default";
const SEED_INDUSTRY = "tech";
const SEED_FONT = "dm-sans-inter";

function pushHistory(past: ThemeConfig[], current: ThemeConfig): ThemeConfig[] {
    const next = [...past, current];
    if (next.length > 50) next.shift();
    return next;
}

function loadFavourites(): Favourite[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem("aide-favourites") ?? "[]");
    } catch { return []; }
}

function saveFavouritesToStorage(favs: Favourite[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem("aide-favourites", JSON.stringify(favs));
    } catch { /* ignore */ }
}

export const useThemeStore = create<ThemeStore>()(
    immer((set, get) => ({
        current: (() => {
            const fromUrl = readThemeFromUrl();
            if (fromUrl?.primaryHex) {
                return buildThemeConfig(
                    fromUrl.primaryHex,
                    (fromUrl.harmonyType as HarmonyType) ?? SEED_HARMONY,
                    fromUrl.ideologyId ?? SEED_IDEOLOGY,
                    fromUrl.ideologyTension ?? 1,
                    fromUrl.fontPairId ?? SEED_FONT,
                    fromUrl.industryTag ?? SEED_INDUSTRY,
                    fromUrl.radiusOverride ?? null,
                );
            }
            return buildThemeConfig(SEED_COLOR, SEED_HARMONY, SEED_IDEOLOGY, 1, SEED_FONT, SEED_INDUSTRY, null);
        })(),
        isDark: false,
        past: [],
        future: [],
        favourites: loadFavourites(),

        setPrimaryHex: (hex) => {
            if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
            set((state) => {
                state.past = pushHistory(state.past, state.current);
                state.future = [];
                const { harmonyType, ideologyId, ideologyTension, fontPairId, industryTag, radiusOverride } = state.current;
                state.current = buildThemeConfig(hex, harmonyType, ideologyId, ideologyTension, fontPairId, industryTag, radiusOverride);
                state.current.locks = get().current.locks;
                pushThemeToUrl(state.current);
            });
        },

        setHarmonyType: (type) => {
            set((state) => {
                state.past = pushHistory(state.past, state.current);
                state.future = [];
                const { primaryHex, ideologyId, ideologyTension, fontPairId, industryTag, radiusOverride } = state.current;
                state.current = buildThemeConfig(primaryHex, type, ideologyId, ideologyTension, fontPairId, industryTag, radiusOverride);
                state.current.locks = get().current.locks;
                pushThemeToUrl(state.current);
            });
        },

        setIdeologyId: (id) => {
            set((state) => {
                state.past = pushHistory(state.past, state.current);
                state.future = [];
                const { primaryHex, harmonyType, ideologyTension, fontPairId, industryTag, radiusOverride } = state.current;
                state.current = buildThemeConfig(primaryHex, harmonyType, id, ideologyTension, fontPairId, industryTag, radiusOverride);
                state.current.locks = get().current.locks;
                pushThemeToUrl(state.current);
            });
        },

        setIdeologyTension: (tension) => {
            set((state) => {
                const { primaryHex, harmonyType, ideologyId, fontPairId, industryTag, radiusOverride } = state.current;
                state.current = buildThemeConfig(primaryHex, harmonyType, ideologyId, tension, fontPairId, industryTag, radiusOverride);
                state.current.locks = get().current.locks;
                pushThemeToUrl(state.current);
            });
        },

        setFontPairId: (id) => {
            set((state) => {
                state.current.fontPairId = id;
                pushThemeToUrl(state.current);
            });
        },

        setIndustryTag: (tag) => {
            set((state) => {
                state.current.industryTag = tag;
                // Auto-select best font pair for new tag
                const top = getTopPairs(tag, state.current.ideologyId, 1);
                if (top[0]) state.current.fontPairId = top[0].id;
                pushThemeToUrl(state.current);
            });
        },

        setRadiusOverride: (value) => {
            set((state) => {
                state.past = pushHistory(state.past, state.current);
                state.future = [];
                const { primaryHex, harmonyType, ideologyId, ideologyTension, fontPairId, industryTag } = state.current;
                state.current = buildThemeConfig(primaryHex, harmonyType, ideologyId, ideologyTension, fontPairId, industryTag, value);
                state.current.locks = get().current.locks;
                pushThemeToUrl(state.current);
            });
        },

        toggleDark: () => {
            set((state) => { state.isDark = !state.isDark; });
        },

        toggleLock: (dimension) => {
            set((state) => {
                state.current.locks[dimension] = !state.current.locks[dimension];
                pushThemeToUrl(state.current);
            });
        },

        randomizeUnlocked: () => {
            set((state) => {
                const { locks, primaryHex, harmonyType, ideologyId, fontPairId, industryTag, radiusOverride, ideologyTension } = state.current;

                const newHex = locks.color ? primaryHex
                    : "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");

                const newHarmony = locks.harmony ? harmonyType
                    : HARMONY_TYPES[Math.floor(Math.random() * HARMONY_TYPES.length)];

                const newIdeology = locks.ideology ? ideologyId
                    : IDEOLOGY_IDS[Math.floor(Math.random() * IDEOLOGY_IDS.length)];

                const newRadius = locks.radius ? radiusOverride : null;

                const newFontId = locks.fonts ? fontPairId : (() => {
                    const top = getTopPairs(industryTag, newIdeology, 3);
                    return top[Math.floor(Math.random() * top.length)]?.id ?? fontPairId;
                })();

                state.past = pushHistory(state.past, state.current);
                state.future = [];
                state.current = buildThemeConfig(
                    newHex, newHarmony, newIdeology,
                    ideologyTension, newFontId, industryTag, newRadius
                );
                state.current.locks = locks;
                pushThemeToUrl(state.current);
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

        saveFavourite: (label) => {
            set((state) => {
                const fav: Favourite = {
                    id: nanoid(),
                    config: state.current,
                    label: label ?? `Theme ${state.favourites.length + 1}`,
                    savedAt: new Date().toISOString(),
                };
                state.favourites.push(fav);
                saveFavouritesToStorage(state.favourites);
            });
        },

        removeFavourite: (id) => {
            set((state) => {
                state.favourites = state.favourites.filter((f) => f.id !== id);
                saveFavouritesToStorage(state.favourites);
            });
        },

        restoreFavourite: (id) => {
            set((state) => {
                const fav = state.favourites.find((f) => f.id === id);
                if (!fav) return;
                state.past = pushHistory(state.past, state.current);
                state.future = [];
                state.current = fav.config;
            });
        },
    }))
);