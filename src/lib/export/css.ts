import type { ThemeConfig } from "../schema/theme-config.schema";

export function exportAsCSS(config: ThemeConfig): string {
    const t = config.tokens;

    const lightVars = `  --background: ${t.background};
  --foreground: ${t.foreground};
  --card: ${t.card};
  --card-foreground: ${t.cardForeground};
  --popover: ${t.popover};
  --popover-foreground: ${t.popoverForeground};
  --primary: ${t.primary};
  --primary-foreground: ${t.primaryForeground};
  --secondary: ${t.secondary};
  --secondary-foreground: ${t.secondaryForeground};
  --muted: ${t.muted};
  --muted-foreground: ${t.mutedForeground};
  --accent: ${t.accent};
  --accent-foreground: ${t.accentForeground};
  --destructive: ${t.destructive};
  --destructive-foreground: ${t.destructiveForeground};
  --border: ${t.border};
  --input: ${t.input};
  --ring: ${t.ring};
  --radius: ${t.radius};`;

    const darkVars = `  --background: ${t.darkBackground};
  --foreground: ${t.darkForeground};
  --card: ${t.darkCard};
  --card-foreground: ${t.darkCardForeground};
  --popover: ${t.darkPopover};
  --popover-foreground: ${t.darkPopoverForeground};
  --primary: ${t.darkPrimary};
  --primary-foreground: ${t.darkPrimaryForeground};
  --secondary: ${t.darkSecondary};
  --secondary-foreground: ${t.darkSecondaryForeground};
  --muted: ${t.darkMuted};
  --muted-foreground: ${t.darkMutedForeground};
  --accent: ${t.darkAccent};
  --accent-foreground: ${t.darkAccentForeground};
  --destructive: ${t.darkDestructive};
  --destructive-foreground: ${t.darkDestructiveForeground};
  --border: ${t.darkBorder};
  --input: ${t.darkInput};
  --ring: ${t.darkRing};`;

    return `@layer base {
  :root {
${lightVars}
  }

  .dark {
${darkVars}
  }
}`;
}

export function downloadCSS(config: ThemeConfig): void {
    const content = exportAsCSS(config);
    downloadFile(content, "theme.css", "text/css");
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}