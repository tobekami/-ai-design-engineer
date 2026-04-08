const loadedFonts = new Set<string>();

export function injectGoogleFont(googleFamily: string, weights: number[]): void {
    if (typeof window === "undefined") return;
    const key = `${googleFamily}-${weights.join("-")}`;
    if (loadedFonts.has(key)) return;
    const weightsStr = weights.join(";");
    const url = `https://fonts.googleapis.com/css2?family=${googleFamily}:wght@${weightsStr}&display=swap`;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
    loadedFonts.add(key);
}

export function injectFontPair(pair: {
    display: { googleFamily: string; weights: number[] };
    body: { googleFamily: string; weights: number[] };
    mono: { googleFamily: string };
}): void {
    injectGoogleFont(pair.display.googleFamily, pair.display.weights);
    if (pair.body.googleFamily !== pair.display.googleFamily) {
        injectGoogleFont(pair.body.googleFamily, pair.body.weights);
    }
    injectGoogleFont(pair.mono.googleFamily, [400]);
}

export function applyFontPair(pair: {
    display: { name: string };
    body: { name: string };
    mono: { name: string };
}): void {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--font-display", `"${pair.display.name}", sans-serif`);
    root.style.setProperty("--font-body", `"${pair.body.name}", sans-serif`);
    root.style.setProperty("--font-mono", `"${pair.mono.name}", monospace`);
    // Also apply directly to body so all text inherits it
    document.body.style.fontFamily = `"${pair.body.name}", sans-serif`;
}