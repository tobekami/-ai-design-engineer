export interface ExtractedColor {
    hex: string;
    source: "theme-color" | "manifest" | "favicon-color" | "og-color";
    label: string;
}

function normalizeHex(value: string): string | null {
    const clean = value.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) return clean;
    if (/^#[0-9A-Fa-f]{3}$/.test(clean)) {
        return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
    }
    const rgb = clean.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgb) {
        const r = parseInt(rgb[1]).toString(16).padStart(2, "0");
        const g = parseInt(rgb[2]).toString(16).padStart(2, "0");
        const b = parseInt(rgb[3]).toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
    }
    return null;
}

async function fetchViaProxy(url: string): Promise<string | null> {
    try {
        const res = await fetch(`/api/extract-url?url=${encodeURIComponent(url)}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.html ?? null;
    } catch {
        return null;
    }
}

function extractFromHtml(html: string): ExtractedColor[] {
    const results: ExtractedColor[] = [];

    // theme-color — both attribute orderings
    const themePatterns = [
        /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/gi,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/gi,
    ];
    for (const pattern of themePatterns) {
        const match = pattern.exec(html);
        if (match) {
            const hex = normalizeHex(match[1]);
            if (hex && !results.find((r) => r.hex === hex)) {
                results.push({ hex, source: "theme-color", label: "meta theme-color" });
            }
        }
    }

    // msapplication-TileColor
    const tileMatch = /<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i.exec(html);
    if (tileMatch) {
        const hex = normalizeHex(tileMatch[1]);
        if (hex && !results.find((r) => r.hex === hex)) {
            results.push({ hex, source: "theme-color", label: "msapplication-TileColor" });
        }
    }

    // og:site_name color hints (some sites put color in og tags)
    const ogColorMatch = /<meta[^>]+property=["']og:theme-color["'][^>]+content=["']([^"']+)["']/i.exec(html);
    if (ogColorMatch) {
        const hex = normalizeHex(ogColorMatch[1]);
        if (hex && !results.find((r) => r.hex === hex)) {
            results.push({ hex, source: "og-color", label: "og:theme-color" });
        }
    }

    return results;
}

async function tryManifest(html: string, baseUrl: string): Promise<ExtractedColor[]> {
    const results: ExtractedColor[] = [];

    const manifestMatch =
        /<link[^>]+rel=["'][^"']*manifest[^"']*["'][^>]+href=["']([^"']+)["']/i.exec(html) ??
        /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*manifest[^"']*["']/i.exec(html);

    if (!manifestMatch) return results;

    try {
        const base = new URL(baseUrl);
        const manifestUrl = new URL(manifestMatch[1], base).toString();
        const manifestContent = await fetchViaProxy(manifestUrl);
        if (!manifestContent) return results;

        const manifest = JSON.parse(manifestContent);

        if (manifest.theme_color) {
            const hex = normalizeHex(manifest.theme_color);
            if (hex) results.push({ hex, source: "manifest", label: "manifest theme_color" });
        }
        if (manifest.background_color) {
            const hex = normalizeHex(manifest.background_color);
            if (hex && !results.find((r) => r.hex === hex)) {
                results.push({ hex, source: "manifest", label: "manifest background_color" });
            }
        }
    } catch {
        // silent
    }

    return results;
}

async function tryCommonManifestPaths(baseUrl: string): Promise<ExtractedColor[]> {
    // Many sites have manifest at predictable paths even if not linked in HTML
    const base = new URL(baseUrl);
    const paths = [
        `${base.origin}/manifest.json`,
        `${base.origin}/site.webmanifest`,
        `${base.origin}/manifest.webmanifest`,
    ];

    for (const path of paths) {
        try {
            const content = await fetchViaProxy(path);
            if (!content) continue;
            const manifest = JSON.parse(content);
            const results: ExtractedColor[] = [];
            if (manifest.theme_color) {
                const hex = normalizeHex(manifest.theme_color);
                if (hex) results.push({ hex, source: "manifest", label: "manifest theme_color" });
            }
            if (manifest.background_color) {
                const hex = normalizeHex(manifest.background_color);
                if (hex && !results.find((r) => r.hex === hex)) {
                    results.push({ hex, source: "manifest", label: "manifest background_color" });
                }
            }
            if (results.length > 0) return results;
        } catch {
            continue;
        }
    }

    return [];
}

export async function extractColorsFromUrl(
    inputUrl: string
): Promise<ExtractedColor[]> {
    let url = inputUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
    }

    const results: ExtractedColor[] = [];

    // Strategy 1 — fetch homepage HTML and scan meta tags
    const html = await fetchViaProxy(url);

    if (html) {
        const fromHtml = extractFromHtml(html);
        results.push(...fromHtml);

        // Strategy 2 — follow manifest link found in HTML
        if (results.length < 2) {
            const fromManifest = await tryManifest(html, url);
            for (const c of fromManifest) {
                if (!results.find((r) => r.hex === c.hex)) results.push(c);
            }
        }
    }

    // Strategy 3 — try common manifest paths regardless of HTML result
    if (results.length === 0) {
        const fromPaths = await tryCommonManifestPaths(url);
        results.push(...fromPaths);
    }

    return results;
}