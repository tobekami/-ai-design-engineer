# AI Design Engineer

A web-based design system studio that generates complete, mathematically harmonious design systems from a single color. Paste a hex, upload a logo, or drop in a URL — and get a full shadcn/ui-compatible theme with live preview across real components.

![AI Design Engineer Preview](https://via.placeholder.com/1200x630/6d28d9/ffffff?text=AI+Design+Engineer)

---

## What it does

Most developers shipping with shadcn/ui use the default gray theme — not because they don't care about design, but because producing a correct, accessible, coherent custom theme from scratch requires deep knowledge of color theory, WCAG contrast ratios, typographic pairing, and shadcn's 22-token variable system.

AI Design Engineer does all of it in under a second.

- **Color engine** — OKLCH-native math generates perceptually correct palettes across 6 harmony types
- **22-token generation** — all shadcn CSS variables for both light and dark mode, WCAG-enforced
- **10 design ideologies** — Glassmorphism, Neo-Brutalism, Minimal/Swiss, Claymorphism, and more, each with OKLCH token shifts that modify the output mathematically
- **Typography system** — 12 font pairs scored against your industry tag and ideology using a 4-axis personality vector
- **Live preview** — Hero, Dashboard, Forms, Mail, Tasks, and Typography views re-skin in real time
- **Export** — CSS variables, theme.json, Tailwind config, and AI-generated design guide
- **Brand extraction** — upload a logo for dominant color extraction, or paste a URL to pull `meta[name=theme-color]`
- **URL sharing** — full theme state encoded in the URL, no backend required

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router + TypeScript |
| UI Components | shadcn/ui (base-nova) + Tailwind CSS v4 |
| Color math | culori (OKLCH-native) |
| Schema / validation | Zod v4 |
| State management | Zustand + Immer |
| AI guide generation | Google Gemini (default), Anthropic, OpenAI, Mistral, OpenRouter |

---

## Getting started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/ai-design-engineer.git
cd ai-design-engineer

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required to run the app. API keys for AI guide generation are entered directly in the UI and stored in your browser's localStorage — they never touch a server.

---

## Project structure

```
src/
├── app/
│   ├── api/
│   │   └── extract-url/        # Server-side URL fetch proxy (avoids CORS)
│   ├── globals.css              # Tailwind v4 + shadcn CSS variable baseline
│   ├── layout.tsx
│   └── page.tsx                 # Main studio layout
│
├── components/
│   ├── preview/
│   │   ├── PreviewCanvas.tsx    # 6-tab live preview (Hero, Dashboard, Mail, etc.)
│   │   └── ThemeProvider.tsx    # Injects CSS vars into :root on every state change
│   └── studio/
│       ├── ColorInput.tsx       # Hex input + color picker + preset swatches
│       ├── HarmonyPicker.tsx    # 6 harmony types with lock
│       ├── IdeologyPicker.tsx   # 10 ideologies + tension slider
│       ├── TypographyPicker.tsx # Industry tags + font pair recommendations
│       ├── RadiusSlider.tsx     # Border radius with ideology reset
│       ├── LogoUpload.tsx       # Canvas API dominant color extraction
│       ├── UrlExtract.tsx       # meta[theme-color] + manifest.json extraction
│       ├── FavouritesPanel.tsx  # localStorage favourites
│       ├── TokenDisplay.tsx     # Live generated token values
│       └── ExportPanel.tsx      # CSS / JSON / Tailwind / AI guide export
│
├── hooks/
│   ├── useApiKey.ts             # Multi-provider API key management
│   ├── useColorName.ts          # HSL-based human color naming
│   └── useKeyboardShortcuts.ts  # Cmd+Z, Cmd+Shift+Z, Cmd+Enter
│
├── lib/
│   ├── export/
│   │   ├── css.ts               # :root + .dark CSS variable export
│   │   ├── json.ts              # Full ThemeConfig as JSON
│   │   ├── tailwind.ts          # tailwind.config.ts snippet
│   │   └── markdown.ts          # AI design guide generation (multi-provider)
│   ├── extract/
│   │   └── url.ts               # URL color extraction strategies
│   ├── harmony/
│   │   ├── engine.ts            # generateHarmony() — 8-color palette from hex + type
│   │   ├── tokens.ts            # paletteToShadcnTokens() — all 22 CSS vars
│   │   ├── wcag.ts              # enforceMinContrast() — auto-corrects failing pairs
│   │   └── oklch.ts             # Hex ↔ OKLCH conversion utilities
│   ├── ideology/
│   │   ├── registry.ts          # 10 ideology configs with OKLCH token shifts
│   │   └── blend.ts             # applyIdeology() — shifts tokens by tension
│   ├── typography/
│   │   ├── registry.ts          # 12 font pairs with personality axes
│   │   ├── scorer.ts            # 4-axis vector scoring (formality/energy/techiness/expressiveness)
│   │   └── loader.ts            # Dynamic Google Fonts injection + CSS var application
│   ├── schema/
│   │   └── theme-config.schema.ts  # Zod schema — single source of truth
│   └── store/
│       ├── theme.store.ts       # Zustand store with full undo/redo history
│       └── url-sync.ts          # Base64 ThemeConfig ↔ URL query param
```

---

## How the color engine works

All color math runs in [OKLCH](https://oklch.com/) — a perceptually uniform color space where equal numeric distances correspond to equal perceived differences. This prevents the common HSL failure where two colors at the same "lightness" look wildly different in brightness.

### Pipeline

```
primaryHex
  → hexToOklch()
  → generateHarmony(harmonyType)     # hue angle relationships on the color wheel
  → HarmonyPalette                   # primary, secondary, accent, complement, background, surface, muted, destructive
  → paletteToShadcnTokens(radiusPx)  # maps palette to all 22 shadcn CSS vars, light + dark
  → applyIdeology(ideologyId, tension) # shifts token L/C/H values per ideology constraints
  → ShadcnTokenSet                   # final token values as oklch() CSS strings
  → ThemeProvider                    # injects into :root via style.setProperty()
```

### Harmony types

| Type | Hue relationship | Character |
|------|-----------------|-----------|
| Analogous | ±30° adjacent | Calm, natural, brand-safe |
| Complementary | 180° opposite | High contrast, vibrant |
| Split-complementary | 150° / 210° | Sophisticated |
| Triadic | 120° / 240° | Balanced vibrancy |
| Tetradic | 90° / 180° / 270° | Bold, complex |
| Monochromatic | Same hue, varied L+C | Refined, minimal |

### WCAG enforcement

After every generation, `enforceMinContrast()` checks every foreground/background pair against the 4.5:1 ratio. If a pair fails, it shifts the Lightness value by ±5% (toward dark or light depending on the background) up to 20 iterations, stopping at the closest passing value.

---

## Design ideologies

Each ideology is defined as a constraint matrix with two layers:

**Shape constraints** — border radius, border width, shadow style, surface treatment

**OKLCH token shifts** — mathematical instructions applied to the harmony engine output:
- `l_clamp` — force lightness to exactly this value
- `l_delta` — shift lightness relatively
- `c_clamp` — force chroma to this value
- `c_multiply` — scale chroma by this factor
- `h_delta` — shift hue by degrees

The `tension` slider (0–100%) controls how strongly shifts are applied — 0% uses pure harmony output, 100% applies full ideology character. All shifts lerp between the harmony value and the ideology target, so the transition is always smooth and mathematically correct.

| Ideology | Signature |
|----------|-----------|
| Default | Clean modern SaaS |
| Glassmorphism | Frosted glass via `backdrop-filter` + `color-mix` |
| Neo-Brutalism | Black borders, white background, max primary chroma |
| Minimal/Swiss | Full desaturation of surfaces, single color anchor |
| Color Blocking | 3× chroma on secondary/accent, bold zone contrast |
| Bento Grid | Tinted background, white cards, visible secondary zones |
| Soft/Pastel | 0.65× chroma across all tokens, high lightness |
| Dark Editorial | Forces dark background in light mode, brightens primary |
| Sci-Fi/Terminal | Near-black background, max primary chroma, glow ring |
| Claymorphism | Double layer shadow, high chroma surfaces, max radius |

---

## Typography scoring

Font pairs are scored using a 4-axis personality vector system:

```
Font personality axes:
  formality       0 = casual       → 1 = formal
  energy          0 = calm         → 1 = energetic
  techiness       0 = humanist     → 1 = technical
  expressiveness  0 = neutral      → 1 = expressive

Score = 1 - normalized_vector_distance(font_personality, adjusted_target)
```

The `adjusted_target` is derived by taking the industry's personality target and applying ideology shifts to it. So Sci-Fi ideology shifts `techiness +0.5` on top of any industry — naturally surfacing Share Tech Mono regardless of what industry you select.

No hardcoded exclusion lists. Adding a new font just requires a personality vector. Adding a new industry just requires a target vector. They interact correctly automatically.

---

## AI design guide

The Export panel can generate a full markdown design system document (like the one in this repo's `/examples` folder) using any of the supported AI providers.

Supported providers:
- **Google Gemini** (default) — Gemini 2.0 Flash, 1.5 Pro, 1.5 Flash, Gemma 3 27B
- **Anthropic** — Claude Sonnet, Haiku, Opus
- **OpenAI** — GPT-4o, GPT-4o Mini
- **Mistral** — Mistral Large, Small
- **OpenRouter** — DeepSeek R1, Qwen 2.5 72B, Llama 3.3 70B, and 200+ others

API keys are entered in the UI and stored in `localStorage`. They are never sent to any server other than the AI provider's own API. The request goes directly from your browser to the provider.

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + Enter` | Randomize unlocked dimensions |

---

## Exporting your theme

### CSS Variables
```css
@layer base {
  :root {
    --background: oklch(0.9801 0.0080 293.54);
    --foreground: oklch(0.1200 0.0100 293.54);
    --primary: oklch(0.5739 0.2318 293.54);
    /* ... all 22 tokens */
  }
  .dark {
    --background: oklch(0.1000 0.0150 293.54);
    /* ... dark mode tokens */
  }
}
```

### Tailwind Config
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        // ... all tokens mapped to CSS vars
      },
    },
  },
};
```

### Theme JSON
Full `ThemeConfig` object including all decisions (harmony type, ideology, font pair, locks) and all derived token values.

---

## URL sharing

The complete theme state is serialized as a base64-encoded JSON object and appended to the URL as a query parameter:

```
https://your-deployment.vercel.app?theme=eyJwcmltYXJ5SGV4IjoiIzZkMjhkOSIs...
```

Anyone opening this URL will see exactly your theme. No database, no authentication, no backend.

---

## Roadmap

- [ ] Responsive layout (mobile drawer for studio panel)
- [ ] Per-token manual override — click any swatch to edit independently
- [ ] Ideology composability — blend slider between two ideologies simultaneously
- [ ] Snapshot comparison — side-by-side two favourites with CSS scope isolation
- [ ] Playwright headless scraper for accurate URL brand extraction
- [ ] Animation/motion tokens per ideology
- [ ] Figma Token Studio JSON import
- [ ] Controlled dissonance pool — curated rule-breaking combinations

---

## Contributing

Contributions are welcome. The codebase is structured so that:

- Adding a new **harmony type** → edit `lib/harmony/engine.ts` + `lib/schema/theme-config.schema.ts`
- Adding a new **ideology** → add an entry to `lib/ideology/registry.ts`
- Adding a new **font pair** → add an entry to `lib/typography/registry.ts` with personality axes
- Adding a new **AI provider** → add to `hooks/useApiKey.ts` and implement a call function in `lib/export/markdown.ts`
- Adding a new **preview tab** → add a view component and tab in `components/preview/PreviewCanvas.tsx`

### Development setup

```bash
npm install
npm run dev       # development server with Turbopack
npm run build     # production build
npm run lint      # ESLint
```

---

## License

MIT — do whatever you want with it. If you build something cool, consider opening a PR or dropping a star.

---

## Acknowledgements

- [culori](https://github.com/Evercoder/culori) — the OKLCH color library that makes the math correct
- [shadcn/ui](https://ui.shadcn.com/) — the component system this tool is built for
- [Zustand](https://github.com/pmndrs/zustand) — state management that stays out of the way
- [OKLCH Color Picker](https://oklch.com/) — for understanding perceptual color spaces