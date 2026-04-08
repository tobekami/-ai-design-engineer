"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, ChevronDown, RotateCcw } from "lucide-react";

const RADIUS_PRESETS = [
    { label: "None", value: 0 },
    { label: "SM", value: 4 },
    { label: "MD", value: 8 },
    { label: "LG", value: 16 },
    { label: "Full", value: 9999 },
];

export function RadiusSlider() {
    const radiusOverride = useThemeStore((s) => s.current.radiusOverride);
    const radiusLocked = useThemeStore((s) => s.current.locks.radius);
    const tokens = useThemeStore((s) => s.current.tokens);
    const setRadiusOverride = useThemeStore((s) => s.setRadiusOverride);
    const toggleLock = useThemeStore((s) => s.toggleLock);
    const [open, setOpen] = useState(true);

    // Actual applied radius — from ideology if no override
    const appliedRadius = parseInt(tokens.radius) || 8;
    // What the slider shows — override if set, otherwise ideology value
    const sliderValue = radiusOverride !== null ? radiusOverride : appliedRadius;
    const isOverridden = radiusOverride !== null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Border Radius
                    </span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
                </button>
                <div className="flex items-center gap-1">
                    {/* Reset to ideology — only shown when manually overridden */}
                    {isOverridden && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setRadiusOverride(null)}
                            title="Reset to ideology default"
                        >
                            <RotateCcw className="h-3 w-3 text-muted-foreground" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => toggleLock("radius")}
                    >
                        {radiusLocked
                            ? <Lock className="h-3.5 w-3.5 text-primary" />
                            : <Unlock className="h-3.5 w-3.5 text-muted-foreground" />}
                    </Button>
                </div>
            </div>

            {open && (
                <div className="space-y-3">
                    {/* Ideology source indicator */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {isOverridden
                                ? "Manual override"
                                : "Set by ideology"}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                            {sliderValue === 9999 ? "pill" : `${sliderValue}px`}
                        </span>
                    </div>

                    {/* Presets */}
                    <div className="flex gap-2">
                        {RADIUS_PRESETS.map((p) => (
                            <button
                                key={p.label}
                                onClick={() => setRadiusOverride(p.value)}
                                className={`flex-1 rounded border py-1.5 text-xs font-medium transition-all ${sliderValue === p.value
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Slider */}
                    <input
                        type="range"
                        min={0}
                        max={24}
                        value={Math.min(sliderValue, 24)}
                        onChange={(e) => setRadiusOverride(Number(e.target.value))}
                        className="w-full accent-primary"
                    />
                </div>
            )}
        </div>
    );
}