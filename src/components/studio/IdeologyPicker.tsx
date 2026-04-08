"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, ChevronDown } from "lucide-react";
import { IDEOLOGY_LIST } from "@/lib/ideology/registry";

export function IdeologyPicker() {
    const ideologyId = useThemeStore((s) => s.current.ideologyId);
    const ideologyTension = useThemeStore((s) => s.current.ideologyTension);
    const ideologyLocked = useThemeStore((s) => s.current.locks.ideology);
    const setIdeologyId = useThemeStore((s) => s.setIdeologyId);
    const setRadiusOverride = useThemeStore((s) => s.setRadiusOverride);
    const setIdeologyTension = useThemeStore((s) => s.setIdeologyTension);
    const toggleLock = useThemeStore((s) => s.toggleLock);
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Design Ideology
                    </span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
                </button>
                <Button variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => toggleLock("ideology")}
                >
                    {ideologyLocked
                        ? <Lock className="h-3.5 w-3.5 text-primary" />
                        : <Unlock className="h-3.5 w-3.5 text-muted-foreground" />}
                </Button>
            </div>

            {open && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-1.5">
                        {IDEOLOGY_LIST.map((ideology) => (
                            <button
                                key={ideology.id}
                                onClick={() => {
                                    setIdeologyId(ideology.id);
                                    setRadiusOverride(null);
                                }}
                                className={`rounded-md border px-2.5 py-2 text-left transition-all hover:border-primary/50 ${ideologyId === ideology.id
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border bg-card text-card-foreground"
                                    }`}
                            >
                                <div className="text-xs font-semibold">{ideology.label}</div>
                                <div className="truncate text-xs text-muted-foreground">{ideology.description}</div>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Ideology Blend</Label>
                            <span className="font-mono text-xs text-muted-foreground">
                                {Math.round(ideologyTension * 100)}%
                            </span>
                        </div>
                        <input
                            type="range" min={0} max={100}
                            value={Math.round(ideologyTension * 100)}
                            onChange={(e) => setIdeologyTension(Number(e.target.value) / 100)}
                            className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Subtle</span>
                            <span>Full</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}