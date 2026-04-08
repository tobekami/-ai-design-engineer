import type { ThemeConfig } from "../schema/theme-config.schema";
import { IDEOLOGY_REGISTRY } from "../ideology/registry";
import { FONT_PAIRS } from "../typography/registry";
import { downloadFile } from "./css";
import type { AIModel } from "@/hooks/useApiKey";

function buildPrompt(config: ThemeConfig): string {
    const ideology = IDEOLOGY_REGISTRY[config.ideologyId];
    const fontPair = FONT_PAIRS.find((p) => p.id === config.fontPairId);
    const t = config.tokens;

    return `You are a senior product designer writing a design system document for a development team.

Generate a comprehensive design system document in Markdown format. You MUST use the exact token values provided below — do not approximate, describe, or substitute them. Every color reference must use the exact oklch() value or CSS variable name from the token list.

## Exact Token Values — USE THESE VERBATIM
### Light Mode
| Token | CSS Variable | Value |
|-------|-------------|-------|
| Background | --background | \`${t.background}\` |
| Foreground | --foreground | \`${t.foreground}\` |
| Primary | --primary | \`${t.primary}\` |
| Primary Foreground | --primary-foreground | \`${t.primaryForeground}\` |
| Secondary | --secondary | \`${t.secondary}\` |
| Secondary Foreground | --secondary-foreground | \`${t.secondaryForeground}\` |
| Muted | --muted | \`${t.muted}\` |
| Muted Foreground | --muted-foreground | \`${t.mutedForeground}\` |
| Accent | --accent | \`${t.accent}\` |
| Accent Foreground | --accent-foreground | \`${t.accentForeground}\` |
| Destructive | --destructive | \`${t.destructive}\` |
| Destructive Foreground | --destructive-foreground | \`${t.destructiveForeground}\` |
| Border | --border | \`${t.border}\` |
| Input | --input | \`${t.input}\` |
| Ring | --ring | \`${t.ring}\` |
| Card | --card | \`${t.card}\` |
| Card Foreground | --card-foreground | \`${t.cardForeground}\` |

### Dark Mode
| Token | CSS Variable | Value |
|-------|-------------|-------|
| Background | --background | \`${t.darkBackground}\` |
| Foreground | --foreground | \`${t.darkForeground}\` |
| Primary | --primary | \`${t.darkPrimary}\` |
| Secondary | --secondary | \`${t.darkSecondary}\` |
| Muted | --muted | \`${t.darkMuted}\` |
| Accent | --accent | \`${t.darkAccent}\` |
| Border | --border | \`${t.darkBorder}\` |

## Theme Configuration
- **Primary Color (hex):** ${config.primaryHex}
- **Harmony Type:** ${config.harmonyType}
- **Design Ideology:** ${ideology?.label ?? config.ideologyId} — ${ideology?.description ?? ""}
- **Industry:** ${config.industryTag}
- **Border Radius:** ${t.radius}
- **Border Width:** ${ideology?.constraints.borderWidth ?? "1px"}
- **Shadow Style:** ${ideology?.constraints.shadowStyle ?? "none"}
- **Surface Style:** ${ideology?.constraints.surfaceStyle ?? "solid"}

## Typography
${fontPair ? `- Display Font: ${fontPair.display.name} (weights: ${fontPair.display.weights.join(", ")})
- Body Font: ${fontPair.body.name} (weights: ${fontPair.body.weights.join(", ")})
- Mono Font: ${fontPair.mono.name}` : "- System fonts"}

## Instructions
Write the document with these exact sections:

1. **Overview & Creative North Star** — Name this theme. Describe its personality in 2-3 sentences based on the ideology (${ideology?.label}) and primary color. What products is it right for?

2. **Colors** — For each token, state its exact CSS variable name, its exact value from the table above, and its usage rule. Include explicit "No-Go Zones."

3. **Typography** — Describe the font pairing rationale, recommended size scale, and weight rules specific to this ideology.

4. **Elevation & Depth** — Based on the ideology constraints above (border: ${ideology?.constraints.borderWidth}, shadow: ${ideology?.constraints.shadowStyle}), describe exactly how depth works. Be specific.

5. **Components** — Specific implementation guidance for Buttons, Cards, Inputs, and Badges. Reference exact token values from the table.

6. **Do's and Don'ts** — 5 rules derived directly from this theme's specific values. No generic advice.

CRITICAL: Every color mentioned must use its exact CSS variable (e.g., \`var(--primary)\`) or exact value (e.g., \`${t.primary}\`). Never approximate or describe colors in plain language without the exact value.`;
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

    return text;
}

async function callGoogle(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 4096 },
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
            max_tokens: 4096,
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
            max_tokens: 4096,
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
            max_tokens: 4096,
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