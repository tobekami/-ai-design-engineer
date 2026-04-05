"use client";

import { useThemeStore } from "@/lib/store/theme.store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

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
    const setRadiusOverride = useThemeStore((s) => s.setRadiusOverride);
    const toggleLock = useThemeStore((s) => s.toggleLock);

    const current = radiusOverride ?? 8;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Border Radius
                </Label>
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

            {/* Presets */}
            <div className="flex gap-2">
                {RADIUS_PRESETS.map((p) => (
                    <button
                        key={p.label}
                        onClick={() => setRadiusOverride(p.value)}
                        className={`flex-1 rounded border py-1.5 text-xs font-medium transition-all ${current === p.value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:border-primary/50"
                            }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Fine slider */}
            <input
                type="range"
                min={0}
                max={24}
                value={Math.min(current, 24)}
                onChange={(e) => setRadiusOverride(Number(e.target.value))}
                className="w-full accent-primary"
            />
            <div className="text-right font-mono text-xs text-muted-foreground">
                {current === 9999 ? "9999px (pill)" : `${current}px`}
            </div>
        </div>
    );
}