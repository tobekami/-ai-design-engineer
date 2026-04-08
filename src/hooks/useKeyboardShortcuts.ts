"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme.store";

export function useKeyboardShortcuts() {
    const undo = useThemeStore((s) => s.undo);
    const redo = useThemeStore((s) => s.redo);
    const randomize = useThemeStore((s) => s.randomizeUnlocked);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const meta = e.metaKey || e.ctrlKey;
            if (meta && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
            if (meta && e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
            if (meta && e.key === "Enter") { e.preventDefault(); randomize(); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [undo, redo, randomize]);
}