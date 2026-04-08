export interface FontPair {
    id: string;
    display: {
        name: string;
        googleFamily: string;
        weights: number[];
    };
    body: {
        name: string;
        googleFamily: string;
        weights: number[];
    };
    mono: {
        name: string;
        googleFamily: string;
    };
    industryTags: string[];
    moodTags: string[];
    characterContrast: number; // 0-1, how different display vs body feel
}

export const FONT_PAIRS: FontPair[] = [
    // ── Tech / SaaS ──────────────────────────────────────────────
    {
        id: "dm-sans-inter",
        display: { name: "DM Sans", googleFamily: "DM+Sans", weights: [400, 500, 600, 700] },
        body: { name: "DM Sans", googleFamily: "DM+Sans", weights: [400, 500] },
        mono: { name: "JetBrains Mono", googleFamily: "JetBrains+Mono" },
        industryTags: ["tech", "saas", "startup"],
        moodTags: ["modern", "clean", "friendly"],
        characterContrast: 0.2,
    },
    {
        id: "outfit-sora",
        display: { name: "Outfit", googleFamily: "Outfit", weights: [500, 600, 700, 800] },
        body: { name: "Sora", googleFamily: "Sora", weights: [400, 500] },
        mono: { name: "Fira Code", googleFamily: "Fira+Code" },
        industryTags: ["tech", "saas", "startup"],
        moodTags: ["geometric", "modern", "precise"],
        characterContrast: 0.4,
    },
    {
        id: "space-grotesk-inter",
        display: { name: "Space Grotesk", googleFamily: "Space+Grotesk", weights: [500, 600, 700] },
        body: { name: "Inter", googleFamily: "Inter", weights: [400, 500] },
        mono: { name: "Space Mono", googleFamily: "Space+Mono" },
        industryTags: ["tech", "saas", "creative"],
        moodTags: ["technical", "distinctive", "sharp"],
        characterContrast: 0.5,
    },

    // ── Editorial / Luxury ───────────────────────────────────────
    {
        id: "playfair-jost",
        display: { name: "Playfair Display", googleFamily: "Playfair+Display", weights: [400, 600, 700] },
        body: { name: "Jost", googleFamily: "Jost", weights: [300, 400, 500] },
        mono: { name: "Courier Prime", googleFamily: "Courier+Prime" },
        industryTags: ["editorial", "luxury", "fashion"],
        moodTags: ["elegant", "refined", "classic"],
        characterContrast: 0.9,
    },
    {
        id: "cormorant-lato",
        display: { name: "Cormorant Garamond", googleFamily: "Cormorant+Garamond", weights: [400, 500, 600] },
        body: { name: "Lato", googleFamily: "Lato", weights: [300, 400, 700] },
        mono: { name: "Courier Prime", googleFamily: "Courier+Prime" },
        industryTags: ["editorial", "luxury", "legal"],
        moodTags: ["sophisticated", "timeless", "premium"],
        characterContrast: 0.95,
    },

    // ── Startup / Consumer ───────────────────────────────────────
    {
        id: "plus-jakarta-nunito",
        display: { name: "Plus Jakarta Sans", googleFamily: "Plus+Jakarta+Sans", weights: [500, 600, 700, 800] },
        body: { name: "Nunito", googleFamily: "Nunito", weights: [400, 500, 600] },
        mono: { name: "JetBrains Mono", googleFamily: "JetBrains+Mono" },
        industryTags: ["startup", "consumer", "wellness"],
        moodTags: ["friendly", "approachable", "energetic"],
        characterContrast: 0.3,
    },
    {
        id: "cabinet-satoshi",
        display: { name: "Cabinet Grotesk", googleFamily: "Cabinet+Grotesk", weights: [500, 700, 800] },
        body: { name: "Satoshi", googleFamily: "Satoshi", weights: [400, 500] },
        mono: { name: "Fira Code", googleFamily: "Fira+Code" },
        industryTags: ["startup", "creative", "agency"],
        moodTags: ["bold", "confident", "modern"],
        characterContrast: 0.5,
    },

    // ── Creative / Agency ────────────────────────────────────────
    {
        id: "syne-inter",
        display: { name: "Syne", googleFamily: "Syne", weights: [600, 700, 800] },
        body: { name: "Inter", googleFamily: "Inter", weights: [400, 500] },
        mono: { name: "Space Mono", googleFamily: "Space+Mono" },
        industryTags: ["creative", "agency", "portfolio"],
        moodTags: ["expressive", "distinctive", "avant-garde"],
        characterContrast: 0.85,
    },
    {
        id: "bebas-dm",
        display: { name: "Bebas Neue", googleFamily: "Bebas+Neue", weights: [400] },
        body: { name: "DM Sans", googleFamily: "DM+Sans", weights: [400, 500] },
        mono: { name: "Fira Code", googleFamily: "Fira+Code" },
        industryTags: ["creative", "agency", "fashion"],
        moodTags: ["bold", "impactful", "editorial"],
        characterContrast: 1.0,
    },

    // ── Wellness / Lifestyle ─────────────────────────────────────
    {
        id: "quicksand-karla",
        display: { name: "Quicksand", googleFamily: "Quicksand", weights: [500, 600, 700] },
        body: { name: "Karla", googleFamily: "Karla", weights: [400, 500] },
        mono: { name: "JetBrains Mono", googleFamily: "JetBrains+Mono" },
        industryTags: ["wellness", "lifestyle", "consumer"],
        moodTags: ["soft", "approachable", "calm"],
        characterContrast: 0.2,
    },

    // ── Food / Hospitality ───────────────────────────────────────
    {
        id: "zilla-source",
        display: { name: "Zilla Slab", googleFamily: "Zilla+Slab", weights: [400, 500, 600] },
        body: { name: "Source Sans 3", googleFamily: "Source+Sans+3", weights: [400, 600] },
        mono: { name: "Courier Prime", googleFamily: "Courier+Prime" },
        industryTags: ["food", "hospitality", "lifestyle"],
        moodTags: ["warm", "trustworthy", "grounded"],
        characterContrast: 0.7,
    },

    // ── Sci-Fi / Terminal ────────────────────────────────────────
    {
        id: "share-tech-mono",
        display: { name: "Share Tech Mono", googleFamily: "Share+Tech+Mono", weights: [400] },
        body: { name: "Share Tech Mono", googleFamily: "Share+Tech+Mono", weights: [400] },
        mono: { name: "Share Tech Mono", googleFamily: "Share+Tech+Mono" },
        industryTags: ["tech", "creative"],
        moodTags: ["terminal", "technical", "precise"],
        characterContrast: 0.0,
    },
];

export const INDUSTRY_TAGS = [
    { id: "tech", label: "Tech / SaaS" },
    { id: "saas", label: "SaaS" },
    { id: "startup", label: "Startup / Consumer" },
    { id: "editorial", label: "Editorial / Luxury" },
    { id: "luxury", label: "Luxury" },
    { id: "creative", label: "Creative / Agency" },
    { id: "agency", label: "Agency" },
    { id: "wellness", label: "Wellness / Lifestyle" },
    { id: "food", label: "Food / Hospitality" },
    { id: "fashion", label: "Fashion" },
    { id: "legal", label: "Legal / Finance" },
    { id: "portfolio", label: "Portfolio" },
];