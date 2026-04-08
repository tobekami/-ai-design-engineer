"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, ChevronDown } from "lucide-react";
import { FONT_PAIRS, INDUSTRY_TAGS } from "@/lib/typography/registry";
import { getTopPairs } from "@/lib/typography/scorer";
import { injectFontPair, applyFontPair } from "@/lib/typography/loader";

export function TypographyPicker() {
    const fontPairId = useThemeStore((s) => s.current.fontPairId);
    const industryTag = useThemeStore((s) => s.current.industryTag);
    const ideologyId = useThemeStore((s) => s.current.ideologyId);
    const fontsLocked = useThemeStore((s) => s.current.locks.fonts);
    const setFontPairId = useThemeStore((s) => s.setFontPairId);
    const setIndustryTag = useThemeStore((s) => s.setIndustryTag);
    const toggleLock = useThemeStore((s) => s.toggleLock);
    const [open, setOpen] = useState(true);

    const topPairs = getTopPairs(industryTag, ideologyId, 3);
    const currentPair = FONT_PAIRS.find((p) => p.id === fontPairId) ?? topPairs[0];

    useEffect(() => {
        if (!currentPair) return;
        injectFontPair(currentPair);
        applyFontPair(currentPair);
    }, [currentPair]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Typography
                    </span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
                </button>
                <Button variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => toggleLock("fonts")}
                >
                    {fontsLocked
                        ? <Lock className="h-3.5 w-3.5 text-primary" />
                        : <Unlock className="h-3.5 w-3.5 text-muted-foreground" />}
                </Button>
            </div>

            {open && (
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Industry</Label>
                        <div className="flex flex-wrap gap-1">
                            {INDUSTRY_TAGS.slice(0, 8).map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => setIndustryTag(tag.id)}
                                    className={`rounded-full border px-2 py-0.5 text-xs transition-all ${industryTag === tag.id
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border text-muted-foreground hover:border-primary/50"
                                        }`}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Recommended Pairs</Label>
                        <div className="space-y-1.5">
                            {topPairs.map((pair) => (
                                <button
                                    key={pair.id}
                                    onClick={() => setFontPairId(pair.id)}
                                    className={`w-full rounded-md border px-3 py-2 text-left transition-all hover:border-primary/50 ${fontPairId === pair.id
                                        ? "border-primary bg-primary/10"
                                        : "border-border bg-card"
                                        }`}
                                >
                                    <div className="text-sm font-semibold"
                                        style={{ fontFamily: `"${pair.display.name}", sans-serif` }}>
                                        {pair.display.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground"
                                        style={{ fontFamily: `"${pair.body.name}", sans-serif` }}>
                                        {pair.body.name} · {pair.mono.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {currentPair && (
                        <div className="rounded-md border border-border bg-muted/30 p-3 space-y-1">
                            <div className="text-base font-bold"
                                style={{ fontFamily: `"${currentPair.display.name}", sans-serif` }}>
                                The quick brown fox
                            </div>
                            <div className="text-xs text-muted-foreground"
                                style={{ fontFamily: `"${currentPair.body.name}", sans-serif` }}>
                                Jumps over the lazy dog.
                            </div>
                            <div className="text-xs text-muted-foreground"
                                style={{ fontFamily: `"${currentPair.mono.name}", monospace` }}>
                                const theme = generate();
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}