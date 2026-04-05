"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import type { ShadcnTokenSet } from "@/lib/schema/theme-config.schema";

function injectTokens(tokens: ShadcnTokenSet, isDark: boolean) {
    const root = document.documentElement;

    if (!isDark) {
        root.classList.remove("dark");
        root.style.setProperty("--background", tokens.background);
        root.style.setProperty("--foreground", tokens.foreground);
        root.style.setProperty("--card", tokens.card);
        root.style.setProperty("--card-foreground", tokens.cardForeground);
        root.style.setProperty("--popover", tokens.popover);
        root.style.setProperty("--popover-foreground", tokens.popoverForeground);
        root.style.setProperty("--primary", tokens.primary);
        root.style.setProperty("--primary-foreground", tokens.primaryForeground);
        root.style.setProperty("--secondary", tokens.secondary);
        root.style.setProperty("--secondary-foreground", tokens.secondaryForeground);
        root.style.setProperty("--muted", tokens.muted);
        root.style.setProperty("--muted-foreground", tokens.mutedForeground);
        root.style.setProperty("--accent", tokens.accent);
        root.style.setProperty("--accent-foreground", tokens.accentForeground);
        root.style.setProperty("--destructive", tokens.destructive);
        root.style.setProperty("--destructive-foreground", tokens.destructiveForeground);
        root.style.setProperty("--border", tokens.border);
        root.style.setProperty("--input", tokens.input);
        root.style.setProperty("--ring", tokens.ring);
        root.style.setProperty("--radius", tokens.radius);
    } else {
        root.classList.add("dark");
        root.style.setProperty("--background", tokens.darkBackground);
        root.style.setProperty("--foreground", tokens.darkForeground);
        root.style.setProperty("--card", tokens.darkCard);
        root.style.setProperty("--card-foreground", tokens.darkCardForeground);
        root.style.setProperty("--popover", tokens.darkPopover);
        root.style.setProperty("--popover-foreground", tokens.darkPopoverForeground);
        root.style.setProperty("--primary", tokens.darkPrimary);
        root.style.setProperty("--primary-foreground", tokens.darkPrimaryForeground);
        root.style.setProperty("--secondary", tokens.darkSecondary);
        root.style.setProperty("--secondary-foreground", tokens.darkSecondaryForeground);
        root.style.setProperty("--muted", tokens.darkMuted);
        root.style.setProperty("--muted-foreground", tokens.darkMutedForeground);
        root.style.setProperty("--accent", tokens.darkAccent);
        root.style.setProperty("--accent-foreground", tokens.darkAccentForeground);
        root.style.setProperty("--destructive", tokens.darkDestructive);
        root.style.setProperty("--destructive-foreground", tokens.darkDestructiveForeground);
        root.style.setProperty("--border", tokens.darkBorder);
        root.style.setProperty("--input", tokens.darkInput);
        root.style.setProperty("--ring", tokens.darkRing);
        root.style.setProperty("--radius", tokens.radius);
        root.style.setProperty("--radius-sm", `calc(${tokens.radius} - 4px)`);
        root.style.setProperty("--radius-md", tokens.radius);
        root.style.setProperty("--radius-lg", `calc(${tokens.radius} + 2px)`);
        root.style.setProperty("--radius-xl", `calc(${tokens.radius} + 4px)`);
    }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const tokens = useThemeStore((s) => s.current.tokens);
    const isDark = useThemeStore((s) => s.isDark);

    useEffect(() => {
        injectTokens(tokens, isDark);
    }, [tokens, isDark]);

    return <>{children}</>;
}