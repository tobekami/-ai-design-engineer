import { FONT_PAIRS, type FontPair } from "./registry";

interface ScoringContext {
    industryTag: string;
    ideologyId: string;
}

// Font personality axes — each pair is rated on these
// These are the dimensions that should drive matching
const FONT_PERSONALITY: Record<string, {
    formality: number;    // 0=casual, 1=formal
    energy: number;       // 0=calm, 1=energetic  
    techiness: number;    // 0=humanist, 1=technical
    expressiveness: number; // 0=neutral, 1=expressive
}> = {
    "dm-sans-inter": { formality: 0.5, energy: 0.4, techiness: 0.5, expressiveness: 0.2 },
    "outfit-sora": { formality: 0.5, energy: 0.5, techiness: 0.6, expressiveness: 0.3 },
    "space-grotesk-inter": { formality: 0.5, energy: 0.5, techiness: 0.7, expressiveness: 0.5 },
    "playfair-jost": { formality: 0.9, energy: 0.3, techiness: 0.1, expressiveness: 0.7 },
    "cormorant-lato": { formality: 1.0, energy: 0.2, techiness: 0.0, expressiveness: 0.8 },
    "plus-jakarta-nunito": { formality: 0.3, energy: 0.7, techiness: 0.3, expressiveness: 0.4 },
    "cabinet-satoshi": { formality: 0.4, energy: 0.6, techiness: 0.4, expressiveness: 0.6 },
    "syne-inter": { formality: 0.3, energy: 0.7, techiness: 0.4, expressiveness: 0.9 },
    "bebas-dm": { formality: 0.2, energy: 0.9, techiness: 0.3, expressiveness: 1.0 },
    "quicksand-karla": { formality: 0.3, energy: 0.4, techiness: 0.1, expressiveness: 0.3 },
    "zilla-source": { formality: 0.7, energy: 0.3, techiness: 0.1, expressiveness: 0.5 },
    "share-tech-mono": { formality: 0.4, energy: 0.3, techiness: 1.0, expressiveness: 0.2 },
};

// Industry personality targets — what axes matter for each industry
const INDUSTRY_PERSONALITY: Record<string, {
    formality: number;
    energy: number;
    techiness: number;
    expressiveness: number;
}> = {
    tech: { formality: 0.5, energy: 0.5, techiness: 0.8, expressiveness: 0.3 },
    saas: { formality: 0.6, energy: 0.4, techiness: 0.7, expressiveness: 0.3 },
    startup: { formality: 0.3, energy: 0.8, techiness: 0.4, expressiveness: 0.5 },
    editorial: { formality: 0.9, energy: 0.3, techiness: 0.0, expressiveness: 0.8 },
    luxury: { formality: 1.0, energy: 0.2, techiness: 0.0, expressiveness: 0.7 },
    creative: { formality: 0.2, energy: 0.8, techiness: 0.3, expressiveness: 1.0 },
    agency: { formality: 0.3, energy: 0.7, techiness: 0.3, expressiveness: 0.9 },
    wellness: { formality: 0.4, energy: 0.3, techiness: 0.1, expressiveness: 0.3 },
    food: { formality: 0.6, energy: 0.4, techiness: 0.1, expressiveness: 0.5 },
    fashion: { formality: 0.6, energy: 0.6, techiness: 0.1, expressiveness: 0.9 },
    legal: { formality: 1.0, energy: 0.1, techiness: 0.1, expressiveness: 0.2 },
    portfolio: { formality: 0.3, energy: 0.6, techiness: 0.3, expressiveness: 0.8 },
};

// Ideology shifts — how much each ideology nudges the target axes
const IDEOLOGY_SHIFTS: Record<string, {
    formality: number;
    energy: number;
    techiness: number;
    expressiveness: number;
}> = {
    glassmorphism: { formality: 0.0, energy: 0.0, techiness: 0.1, expressiveness: 0.0 },
    neobrutalism: { formality: -0.3, energy: 0.4, techiness: 0.0, expressiveness: 0.5 },
    minimal: { formality: 0.2, energy: -0.2, techiness: 0.0, expressiveness: -0.2 },
    colorblocking: { formality: -0.2, energy: 0.3, techiness: 0.0, expressiveness: 0.4 },
    bento: { formality: 0.0, energy: 0.1, techiness: 0.2, expressiveness: 0.1 },
    softpastel: { formality: -0.1, energy: -0.2, techiness: -0.2, expressiveness: -0.1 },
    darkeditorial: { formality: 0.1, energy: 0.2, techiness: 0.0, expressiveness: 0.3 },
    scifi: { formality: 0.0, energy: 0.0, techiness: 0.5, expressiveness: 0.0 },
    claymorphism: { formality: -0.3, energy: 0.3, techiness: -0.2, expressiveness: 0.2 },
    default: { formality: 0.0, energy: 0.0, techiness: 0.0, expressiveness: 0.0 },
};

function clamp(v: number): number {
    return Math.max(0, Math.min(1, v));
}

function vectorDistance(
    a: Record<string, number>,
    b: Record<string, number>
): number {
    const keys = Object.keys(a);
    const sumSq = keys.reduce((acc, k) => acc + Math.pow((a[k] ?? 0) - (b[k] ?? 0), 2), 0);
    return Math.sqrt(sumSq / keys.length); // normalized 0-1
}

export function scoreFontPair(pair: FontPair, ctx: ScoringContext): number {
    const personality = FONT_PERSONALITY[pair.id];
    if (!personality) return 0;

    const industryTarget = INDUSTRY_PERSONALITY[ctx.industryTag];
    if (!industryTarget) return 50; // unknown industry — neutral score

    const shifts = IDEOLOGY_SHIFTS[ctx.ideologyId] ?? IDEOLOGY_SHIFTS.default;

    // Apply ideology shifts to the industry target
    const adjustedTarget = {
        formality: clamp(industryTarget.formality + shifts.formality),
        energy: clamp(industryTarget.energy + shifts.energy),
        techiness: clamp(industryTarget.techiness + shifts.techiness),
        expressiveness: clamp(industryTarget.expressiveness + shifts.expressiveness),
    };

    // Distance from 0 (perfect) to ~1 (opposite)
    const distance = vectorDistance(personality, adjustedTarget);

    // Convert to 0-100 score — closer = higher score
    return Math.round((1 - distance) * 100);
}

export function getTopPairs(
    industryTag: string,
    ideologyId: string,
    count: number = 3
): FontPair[] {
    return [...FONT_PAIRS]
        .map((pair) => ({ pair, score: scoreFontPair(pair, { industryTag, ideologyId }) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map((r) => r.pair);
}