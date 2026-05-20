"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { extractColorsFromUrl, type ExtractedColor } from "@/lib/extract/url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Globe, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SOURCE_LABELS: Record<string, string> = {
    "theme-color": "theme-color",
    "og-image": "og:image",
    "favicon": "favicon",
    "manifest": "manifest.json",
};

export function UrlExtract() {
    const setPrimaryHex = useThemeStore((s) => s.setPrimaryHex);

    const [open, setOpen] = useState(true);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState<ExtractedColor[]>([]);
    const [selected, setSelected] = useState<string | null>(null);

    const handleExtract = async () => {
        if (!url.trim()) return;
        setLoading(true);
        setError("");
        setResults([]);
        setSelected(null);

        try {
            const colors = await extractColorsFromUrl(url);
            if (colors.length === 0) {
                setError("No brand colors found on this page. Try uploading their logo instead.");
            } else {
                setResults(colors);
                toast.success(`Found ${colors.length} color${colors.length > 1 ? "s" : ""} — click to apply`);
            }
        } catch (err) {
            const msg = err instanceof Error
                ? err.message
                : "Could not fetch URL. The site may block external requests.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (hex: string) => {
        setSelected(hex);
        setPrimaryHex(hex);
        toast.success(`Color applied — ${hex}`);
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Extract from URL
                </span>
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
            </button>

            {open && (
                <div className="space-y-3">
                    {/* URL input */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleExtract()}
                                placeholder="stripe.com"
                                className="pl-8 text-sm"
                            />
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleExtract}
                            disabled={loading || !url.trim()}
                            className="shrink-0"
                        >
                            {loading
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : "Extract"}
                        </Button>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-xs text-destructive">{error}</p>
                    )}

                    {/* Results */}
                    {results.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                                Found {results.length} color{results.length > 1 ? "s" : ""} — click to apply
                            </p>
                            <div className="space-y-1.5">
                                {results.map((result) => (
                                    <button
                                        key={result.hex}
                                        onClick={() => handleSelect(result.hex)}
                                        className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 transition-all hover:border-primary/50 ${selected === result.hex
                                            ? "border-primary bg-primary/10"
                                            : "border-border bg-card"
                                            }`}
                                    >
                                        <div
                                            className="h-6 w-6 shrink-0 rounded-sm border border-border"
                                            style={{ backgroundColor: result.hex }}
                                        />
                                        <div className="flex-1 text-left">
                                            <p className="font-mono text-xs text-foreground">{result.hex}</p>
                                            <p className="text-xs text-muted-foreground">{result.label}</p>
                                        </div>
                                        {selected === result.hex && (
                                            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Reads meta theme-color and manifest.json from any public URL. Works best on sites with PWA support. If nothing is found, use logo upload instead.
                    </p>
                </div>
            )}
        </div>
    );
}