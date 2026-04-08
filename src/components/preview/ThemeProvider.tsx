"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { applyIdeology } from "@/lib/ideology/blend";
import type { ShadcnTokenSet } from "@/lib/schema/theme-config.schema";

function injectIdeologyStyles(ideologyId: string, tension: number) {
    const styleId = "ideology-overrides";
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
        el = document.createElement("style");
        el.id = styleId;
        document.head.appendChild(el);
    }

    if (ideologyId === "glassmorphism" && tension > 0.1) {
        const opacity = 0.4 + (1 - tension) * 0.4; // tension 1 = 0.4 opacity, tension 0 = 0.8
        el.textContent = `
      [data-slot="card"] {
        background-color: color-mix(in oklch, var(--card) ${Math.round(opacity * 100)}%, transparent) !important;
        backdrop-filter: blur(${Math.round(tension * 16)}px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(${Math.round(tension * 16)}px) saturate(180%) !important;
        border: 1px solid color-mix(in oklch, var(--border) 60%, transparent) !important;
      }
      body, [data-slot="tabs-content"] {
        background-image: none;
      }
    `;
    } else {
        el.textContent = "";
    }
}

function injectTokens(tokens: ShadcnTokenSet, isDark: boolean, ideologyCss: Record<string, string>) {
    const root = document.documentElement;

    const t = isDark ? {
        background: tokens.darkBackground,
        foreground: tokens.darkForeground,
        card: tokens.darkCard,
        cardForeground: tokens.darkCardForeground,
        popover: tokens.darkPopover,
        popoverForeground: tokens.darkPopoverForeground,
        primary: tokens.darkPrimary,
        primaryForeground: tokens.darkPrimaryForeground,
        secondary: tokens.darkSecondary,
        secondaryForeground: tokens.darkSecondaryForeground,
        muted: tokens.darkMuted,
        mutedForeground: tokens.darkMutedForeground,
        accent: tokens.darkAccent,
        accentForeground: tokens.darkAccentForeground,
        destructive: tokens.darkDestructive,
        destructiveForeground: tokens.darkDestructiveForeground,
        border: tokens.darkBorder,
        input: tokens.darkInput,
        ring: tokens.darkRing,
    } : {
        background: tokens.background,
        foreground: tokens.foreground,
        card: tokens.card,
        cardForeground: tokens.cardForeground,
        popover: tokens.popover,
        popoverForeground: tokens.popoverForeground,
        primary: tokens.primary,
        primaryForeground: tokens.primaryForeground,
        secondary: tokens.secondary,
        secondaryForeground: tokens.secondaryForeground,
        muted: tokens.muted,
        mutedForeground: tokens.mutedForeground,
        accent: tokens.accent,
        accentForeground: tokens.accentForeground,
        destructive: tokens.destructive,
        destructiveForeground: tokens.destructiveForeground,
        border: tokens.border,
        input: tokens.input,
        ring: tokens.ring,
    };

    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");

    // Token vars
    root.style.setProperty("--background", t.background);
    root.style.setProperty("--foreground", t.foreground);
    root.style.setProperty("--card", t.card);
    root.style.setProperty("--card-foreground", t.cardForeground);
    root.style.setProperty("--popover", t.popover);
    root.style.setProperty("--popover-foreground", t.popoverForeground);
    root.style.setProperty("--primary", t.primary);
    root.style.setProperty("--primary-foreground", t.primaryForeground);
    root.style.setProperty("--secondary", t.secondary);
    root.style.setProperty("--secondary-foreground", t.secondaryForeground);
    root.style.setProperty("--muted", t.muted);
    root.style.setProperty("--muted-foreground", t.mutedForeground);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-foreground", t.accentForeground);
    root.style.setProperty("--destructive", t.destructive);
    root.style.setProperty("--destructive-foreground", t.destructiveForeground);
    root.style.setProperty("--border", t.border);
    root.style.setProperty("--input", t.input);
    root.style.setProperty("--ring", t.ring);
    root.style.setProperty("--radius", tokens.radius);
    root.style.setProperty("--radius-sm", `calc(${tokens.radius} - 4px)`);
    root.style.setProperty("--radius-md", tokens.radius);
    root.style.setProperty("--radius-lg", `calc(${tokens.radius} + 2px)`);
    root.style.setProperty("--radius-xl", `calc(${tokens.radius} + 4px)`);

    // Ideology CSS overrides
    Object.entries(ideologyCss).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const tokens = useThemeStore((s) => s.current.tokens);
    const isDark = useThemeStore((s) => s.isDark);
    const ideologyId = useThemeStore((s) => s.current.ideologyId);
    const ideologyTension = useThemeStore((s) => s.current.ideologyTension);

    useEffect(() => {
        const { css } = applyIdeology(tokens, ideologyId, ideologyTension);
        injectTokens(tokens, isDark, css);
        injectIdeologyStyles(ideologyId, ideologyTension);
    }, [tokens, isDark, ideologyId, ideologyTension]);

    return <>{children}</>;
}