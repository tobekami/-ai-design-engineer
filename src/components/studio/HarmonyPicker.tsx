"use client";

import { useThemeStore } from "@/lib/store/theme.store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import type { HarmonyType } from "@/lib/schema/theme-config.schema";
import { hexToOklch } from "@/lib/harmony/oklch";

const HARMONIES: { value: HarmonyType; label: string; description: string }[] = [
    { value: "analogous", label: "Analogous", description: "Calm, natural" },
    { value: "complementary", label: "Complementary", description: "High contrast" },
    { value: "split-comp", label: "Split-Comp", description: "Sophisticated" },
    { value: "triadic", label: "Triadic", description: "Vibrant, rich" },
    { value: "tetradic", label: "Tetradic", description: "Bold, complex" },
    { value: "monochromatic", label: "Mono", description: "Refined, minimal" },
];

export function HarmonyPicker() {
    const harmonyType = useThemeStore((s) => s.current.harmonyType);
    const harmonyLocked = useThemeStore((s) => s.current.locks.harmony);
    const setHarmonyType = useThemeStore((s) => s.setHarmonyType);
    const toggleLock = useThemeStore((s) => s.toggleLock);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Harmony Type
                </Label>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => toggleLock("harmony")}
                    title={harmonyLocked ? "Unlock harmony" : "Lock harmony"}
                >
                    {harmonyLocked ? (
                        <Lock className="h-3.5 w-3.5 text-primary" />
                    ) : (
                        <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {HARMONIES.map((h) => (
                    <button
                        key={h.value}
                        onClick={() => setHarmonyType(h.value)}
                        className={`rounded-md border px-3 py-2 text-left transition-all hover:border-primary/50 ${harmonyType === h.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-card-foreground"
                            }`}
                    >
                        <div className="text-xs font-semibold">{h.label}</div>
                        <div className="text-xs text-muted-foreground">{h.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function hexToOklchCss(hex: string): string {
    const oklch = hexToOklch(hex);
    return `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${(oklch.h ?? 0).toFixed(2)})`;
}