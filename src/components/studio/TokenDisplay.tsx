"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { ChevronDown } from "lucide-react";
import type { ShadcnTokenSet } from "@/lib/schema/theme-config.schema";

const LIGHT_TOKENS: { key: keyof ShadcnTokenSet; label: string }[] = [
    { key: "background", label: "background" },
    { key: "foreground", label: "foreground" },
    { key: "primary", label: "primary" },
    { key: "primaryForeground", label: "primary-foreground" },
    { key: "secondary", label: "secondary" },
    { key: "secondaryForeground", label: "secondary-foreground" },
    { key: "muted", label: "muted" },
    { key: "mutedForeground", label: "muted-foreground" },
    { key: "accent", label: "accent" },
    { key: "accentForeground", label: "accent-foreground" },
    { key: "destructive", label: "destructive" },
    { key: "card", label: "card" },
    { key: "border", label: "border" },
    { key: "input", label: "input" },
    { key: "ring", label: "ring" },
];

function tokenValueToHex(value: string): string {
    try {
        if (value.startsWith("oklch(")) {
            const inner = value.replace("oklch(", "").replace(")", "");
            const parts = inner.trim().split(/\s+/);
            const l = parseFloat(parts[0]);
            const c = parseFloat(parts[1]);
            const h = parseFloat(parts[2]) || 0;
            const s = Math.min(c * 2.5, 1);
            const a = s * Math.min(l, 1 - l);
            const f = (n: number) => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, "0");
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        }
        return "#888888";
    } catch { return "#888888"; }
}

export function TokenDisplay() {
    const tokens = useThemeStore((s) => s.current.tokens);
    const isDark = useThemeStore((s) => s.isDark);
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-3">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Generated Tokens
                </span>
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
            </button>

            {open && (
                <div className="space-y-1 rounded-md border border-border bg-card p-2">
                    {LIGHT_TOKENS.map(({ key, label }) => {
                        const value = tokens[key] as string;
                        const darkKey = `dark${key.charAt(0).toUpperCase()}${key.slice(1)}` as keyof ShadcnTokenSet;
                        const displayValue = isDark && tokens[darkKey]
                            ? (tokens[darkKey] as string)
                            : value;
                        const hexApprox = tokenValueToHex(displayValue);

                        return (
                            <div key={key} className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-muted/50">
                                <div className="h-4 w-4 shrink-0 rounded-sm border border-border"
                                    style={{ backgroundColor: hexApprox }} />
                                <span className="w-36 font-mono text-xs text-muted-foreground">--{label}</span>
                                <span className="truncate font-mono text-xs text-foreground">{displayValue}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}