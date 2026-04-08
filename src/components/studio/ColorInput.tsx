"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Shuffle, ChevronDown } from "lucide-react";
import { useColorName } from "@/hooks/useColorName";

export function ColorInput() {
    const primaryHex = useThemeStore((s) => s.current.primaryHex);
    const colorLocked = useThemeStore((s) => s.current.locks.color);
    const setPrimaryHex = useThemeStore((s) => s.setPrimaryHex);
    const toggleLock = useThemeStore((s) => s.toggleLock);
    const randomizeUnlocked = useThemeStore((s) => s.randomizeUnlocked);

    const [inputValue, setInputValue] = useState(primaryHex);
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(true);
    const colorName = useColorName(primaryHex);

    const handleHexInput = (val: string) => {
        setInputValue(val);
        const clean = val.startsWith("#") ? val : `#${val}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
            setError(false);
            setPrimaryHex(clean);
        } else {
            setError(true);
        }
    };

    const handleColorPicker = (val: string) => {
        setInputValue(val);
        setError(false);
        setPrimaryHex(val);
    };

    return (
        <div className="space-y-3">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-1.5 group"
                >
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Primary Color
                    </span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
                </button>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                        onClick={() => toggleLock("color")}
                        title={colorLocked ? "Unlock color" : "Lock color"}
                    >
                        {colorLocked
                            ? <Lock className="h-3.5 w-3.5 text-primary" />
                            : <Unlock className="h-3.5 w-3.5 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                        onClick={randomizeUnlocked} title="Randomize"
                    >
                        <Shuffle className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {open && (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border"
                            style={{ borderColor: "var(--border)" }}>
                            <input
                                type="color"
                                value={primaryHex}
                                onChange={(e) => handleColorPicker(e.target.value)}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                            <div className="h-full w-full rounded-md" style={{ backgroundColor: primaryHex }} />
                        </div>
                        <Input
                            value={inputValue}
                            onChange={(e) => handleHexInput(e.target.value)}
                            placeholder="#6d28d9"
                            className={`font-mono text-sm ${error ? "border-destructive" : ""}`}
                            maxLength={7}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{colorName}</span>
                        {error && <span className="text-xs text-destructive">Invalid hex</span>}
                    </div>

                    <div className="flex gap-1.5">
                        {["#6d28d9", "#2563eb", "#059669", "#d97706", "#dc2626", "#db2777"].map((color) => (
                            <button
                                key={color}
                                onClick={() => { setInputValue(color); setError(false); setPrimaryHex(color); }}
                                className="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: color,
                                    borderColor: primaryHex === color ? "white" : "transparent",
                                    outline: primaryHex === color ? `2px solid ${color}` : "none",
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}