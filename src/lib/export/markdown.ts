import type { ThemeConfig } from "../schema/theme-config.schema";
import { IDEOLOGY_REGISTRY } from "../ideology/registry";
import { FONT_PAIRS } from "../typography/registry";
import { downloadFile } from "./css";
import type { AIModel } from "@/hooks/useApiKey";

const MAX_TOKENS = 32000;

function buildPrompt(config: ThemeConfig): string {
    const ideology = IDEOLOGY_REGISTRY[config.ideologyId];
    const fontPair = FONT_PAIRS.find((p) => p.id === config.fontPairId);
    const t = config.tokens;

    const lightTokens = [
        ["Background",            "--background",            t.background],
        ["Foreground",            "--foreground",            t.foreground],
        ["Primary",               "--primary",               t.primary],
        ["Primary Foreground",    "--primary-foreground",    t.primaryForeground],
        ["Secondary",             "--secondary",             t.secondary],
        ["Secondary Foreground",  "--secondary-foreground",  t.secondaryForeground],
        ["Muted",                 "--muted",                 t.muted],
        ["Muted Foreground",      "--muted-foreground",      t.mutedForeground],
        ["Accent",                "--accent",                t.accent],
        ["Accent Foreground",     "--accent-foreground",     t.accentForeground],
        ["Destructive",           "--destructive",           t.destructive],
        ["Destructive Foreground","--destructive-foreground",t.destructiveForeground],
        ["Border",                "--border",                t.border],
        ["Input",                 "--input",                 t.input],
        ["Ring",                  "--ring",                  t.ring],
        ["Card",                  "--card",                  t.card],
        ["Card Foreground",       "--card-foreground",       t.cardForeground],
    ] as const;

    const darkTokens = [
        ["Background", "--background", t.darkBackground],
        ["Foreground", "--foreground", t.darkForeground],
        ["Primary",    "--primary",    t.darkPrimary],
        ["Secondary",  "--secondary",  t.darkSecondary],
        ["Muted",      "--muted",      t.darkMuted],
        ["Accent",     "--accent",     t.darkAccent],
        ["Border",     "--border",     t.darkBorder],
    ] as const;

    const lightTable = lightTokens.map(([n, v, val]) => `| ${n} | ${v} | \`${val}\` |`).join("\n");
    const darkTable  = darkTokens.map( ([n, v, val]) => `| ${n} | ${v} | \`${val}\` |`).join("\n");

    const fontBlock = fontPair
        ? `- Display: ${fontPair.display.name} (weights: ${fontPair.display.weights.join(", ")})
- Body: ${fontPair.body.name} (weights: ${fontPair.body.weights.join(", ")})
- Mono: ${fontPair.mono.name}`
        : "- System fonts";

    return `You are a senior product designer. Fill in the skeleton below — every placeholder in <angle brackets> must be replaced with real content. Output ONLY the completed document. Do not add, remove, or rename any heading. Do not wrap the document in a code block.

RULES
- Every color reference must use the exact CSS variable (e.g. var(--primary)) OR the exact oklch() value from the token tables below.
- Never describe a color in plain language without its exact value.
- CSS code blocks must use plain ASCII spaces (U+0020) — no HTML entities.
- Be concise. Each section should be thorough but not padded.

---TOKEN DATA (use verbatim)---

### Light Mode
| Token | CSS Variable | Value |
|---|---|---|
${lightTable}

### Dark Mode
| Token | CSS Variable | Value |
|---|---|---|
${darkTable}

### Theme Configuration
- Primary hex: ${config.primaryHex}
- Harmony: ${config.harmonyType}
- Ideology: ${ideology?.label ?? config.ideologyId} — ${ideology?.description ?? ""}
- Industry: ${config.industryTag}
- Border radius: ${t.radius}
- Border width: ${ideology?.constraints.borderWidth ?? "1px"}
- Shadow style: ${ideology?.constraints.shadowStyle ?? "none"}
- Surface style: ${ideology?.constraints.surfaceStyle ?? "solid"}

### Typography
${fontBlock}

---DOCUMENT SKELETON (fill every placeholder, keep every heading exactly as written)---

# Design System — <Theme Name>

## 1. Overview & Creative North Star

**Personality:** <2–3 sentences describing the theme's character based on the ideology (${ideology?.label ?? config.ideologyId}) and primary color ${config.primaryHex}.>

**Best suited for:** <List 3–5 product types or industries this theme fits.>

---

## 2. Color System

### CSS Variables

\`\`\`css
:root {
  /* Light mode */
  --background: ${t.background};
  --foreground: ${t.foreground};
  --primary: ${t.primary};
  --primary-foreground: ${t.primaryForeground};
  --secondary: ${t.secondary};
  --secondary-foreground: ${t.secondaryForeground};
  --muted: ${t.muted};
  --muted-foreground: ${t.mutedForeground};
  --accent: ${t.accent};
  --accent-foreground: ${t.accentForeground};
  --destructive: ${t.destructive};
  --destructive-foreground: ${t.destructiveForeground};
  --border: ${t.border};
  --input: ${t.input};
  --ring: ${t.ring};
  --card: ${t.card};
  --card-foreground: ${t.cardForeground};
  --radius: ${t.radius};
}

.dark {
  --background: ${t.darkBackground};
  --foreground: ${t.darkForeground};
  --primary: ${t.darkPrimary};
  --secondary: ${t.darkSecondary};
  --muted: ${t.darkMuted};
  --accent: ${t.darkAccent};
  --border: ${t.darkBorder};
}
\`\`\`

### Token Usage Rules

<For each of the 17 light-mode tokens, one row: token name | CSS variable | exact value | usage rule. Format as a markdown table with columns: Token | Variable | Value | Usage.>

### No-Go Zones

<3–5 specific color-usage rules that are forbidden for this theme. Each must reference a specific token or value.>

---

## 3. Typography

**Rationale:** <1–2 sentences on why this font pairing suits the ${ideology?.label ?? config.ideologyId} ideology.>

### Scale

| Role | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Display | <font name> | <size> | <weight> | <lh> |
| H1 | <font name> | <size> | <weight> | <lh> |
| H2 | <font name> | <size> | <weight> | <lh> |
| H3 | <font name> | <size> | <weight> | <lh> |
| Body | <font name> | <size> | <weight> | <lh> |
| Small | <font name> | <size> | <weight> | <lh> |
| Mono | <font name> | <size> | <weight> | <lh> |

**Weight rules:** <Specific weight constraints for this ideology.>

---

## 4. Elevation & Depth

**Model:** <Describe the depth model in one sentence (flat / layered / neumorphic / etc.) based on shadow style "${ideology?.constraints.shadowStyle ?? "none"}" and border width "${ideology?.constraints.borderWidth ?? "1px"}".>

| Layer | Shadow | Border | Background |
|---|---|---|---|
| Base | <value> | <value> | <value> |
| Raised | <value> | <value> | <value> |
| Overlay | <value> | <value> | <value> |
| Modal | <value> | <value> | <value> |

**Rules:** <2–3 specific rules about when and how to use each layer.>

---

## 5. Components

### Button

\`\`\`css
/* Primary */
background: var(--primary);       /* ${t.primary} */
color: var(--primary-foreground);  /* ${t.primaryForeground} */
border-radius: var(--radius);      /* ${t.radius} */
border: ${ideology?.constraints.borderWidth ?? "1px"} solid var(--primary);
\`\`\`

<Describe hover, active, disabled states with exact token values.>

### Card

\`\`\`css
background: var(--card);           /* ${t.card} */
color: var(--card-foreground);     /* ${t.cardForeground} */
border: ${ideology?.constraints.borderWidth ?? "1px"} solid var(--border); /* ${t.border} */
border-radius: var(--radius);      /* ${t.radius} */
\`\`\`

<Describe padding, shadow, and inner layout rules.>

### Input

\`\`\`css
background: var(--background);     /* ${t.background} */
border: ${ideology?.constraints.borderWidth ?? "1px"} solid var(--input);   /* ${t.input} */
color: var(--foreground);          /* ${t.foreground} */
border-radius: var(--radius);      /* ${t.radius} */
\`\`\`

<Describe focus ring using var(--ring) (${t.ring}), error state using var(--destructive) (${t.destructive}), and disabled state.>

### Badge

\`\`\`css
background: var(--secondary);         /* ${t.secondary} */
color: var(--secondary-foreground);   /* ${t.secondaryForeground} */
border-radius: var(--radius);         /* ${t.radius} */
\`\`\`

<Describe variant rules (accent, destructive, muted) with exact token values.>

---

## 6. Do's and Don'ts

<Exactly 5 rules, each specific to this theme's values. Format as a table with columns: Rule | Do | Don't.>`;
}

function sanitizeMarkdown(text: string): string {
    return text
        .replace(/&#x20;/gi, " ")
        .replace(/&#32;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
}

export async function generateMarkdownGuide(
    config: ThemeConfig,
    apiKey: string,
    model: AIModel,
    onChunk?: (chunk: string) => void
): Promise<string> {
    const prompt = buildPrompt(config);

    let text = "";

    if (model.provider === "google") {
        text = await callGoogle(prompt, apiKey, model.apiModel);
    } else if (model.provider === "anthropic") {
        text = await callAnthropic(prompt, apiKey, model.apiModel);
    } else if (model.provider === "openai" || model.provider === "mistral") {
        text = await callOpenAIFormat(prompt, apiKey, model.apiModel, model.provider);
    } else if (model.provider === "openrouter") {
        text = await callOpenRouter(prompt, apiKey, model.apiModel);
    }

    return sanitizeMarkdown(text);
}

async function callGoogle(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: MAX_TOKENS },
            }),
        }
    );
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `Google API error: ${response.status}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callAnthropic(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-allow-cors": "true",
        },
        body: JSON.stringify({
            model,
            max_tokens: MAX_TOKENS,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `Anthropic API error: ${response.status}`);
    }
    const data = await response.json();
    return data.content?.filter((b: { type: string }) => b.type === "text")
        .map((b: { text: string }) => b.text).join("") ?? "";
}

async function callOpenAIFormat(
    prompt: string,
    apiKey: string,
    model: string,
    provider: "openai" | "mistral"
): Promise<string> {
    const baseUrl = provider === "mistral"
        ? "https://api.mistral.ai/v1"
        : "https://api.openai.com/v1";

    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            max_tokens: MAX_TOKENS,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `${provider} API error: ${response.status}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "";
}

async function callOpenRouter(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
            "X-Title": "AI Design Engineer",
        },
        body: JSON.stringify({
            model,
            max_tokens: MAX_TOKENS,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `OpenRouter error: ${response.status}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "";
}

export function downloadMarkdown(content: string, primaryHex: string): void {
    const filename = `design-system-${primaryHex.replace("#", "")}.md`;
    downloadFile(content, filename, "text/markdown");
}