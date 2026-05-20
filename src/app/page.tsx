"use client";

import { ColorInput } from "@/components/studio/ColorInput";
import { HarmonyPicker } from "@/components/studio/HarmonyPicker";
import { IdeologyPicker } from "@/components/studio/IdeologyPicker";
import { TypographyPicker } from "@/components/studio/TypographyPicker";
import { RadiusSlider } from "@/components/studio/RadiusSlider";
import { TokenDisplay } from "@/components/studio/TokenDisplay";
import { FavouritesPanel } from "@/components/studio/FavouritesPanel";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { useThemeStore } from "@/lib/store/theme.store";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Undo2, Redo2, Shuffle, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useState } from "react";
import { ExportPanel } from "@/components/studio/ExportPanel";
import { LogoUpload } from "@/components/studio/LogoUpload";
import { UrlExtract } from "@/components/studio/UrlExtract";

export default function Home() {
  const undo = useThemeStore((s) => s.undo);
  const redo = useThemeStore((s) => s.redo);
  const randomizeUnlocked = useThemeStore((s) => s.randomizeUnlocked);
  const past = useThemeStore((s) => s.past);
  const future = useThemeStore((s) => s.future);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useKeyboardShortcuts();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Left panel: Studio controls ── */}
      <aside className={[
        "flex w-80 shrink-0 flex-col border-r border-border bg-card",
        "fixed inset-y-0 left-0 z-40 transition-transform duration-300",
        "md:relative md:translate-x-0 md:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              AI Design Engineer
            </h1>
            <p className="text-xs text-muted-foreground">
              Design system generator
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={undo}
              disabled={past.length === 0}
              title="Undo (Cmd+Z)"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={redo}
              disabled={future.length === 0}
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Controls - reordered */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <FavouritesPanel />
          <Separator />
          <ColorInput />
          <Separator />
          <UrlExtract />
          <Separator />
          <LogoUpload />
          <Separator />
          <HarmonyPicker />
          <Separator />
          <TypographyPicker />
          <Separator />
          <IdeologyPicker />
          <Separator />
          <RadiusSlider />
          <Separator />
          <ExportPanel />
          <Separator />
          <TokenDisplay />
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-2">
          <Button className="w-full gap-2" onClick={randomizeUnlocked}>
            <Shuffle className="h-4 w-4" />
            Randomize Unlocked
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Cmd+Enter to randomize · Cmd+Z to undo
          </p>
        </div>
      </aside>

      {/* ── Right panel: Preview canvas ── */}
      <main className="flex-1 overflow-hidden relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 left-3 z-20 h-8 w-8 md:hidden"
          onClick={() => setSidebarOpen((o) => !o)}
          title="Toggle sidebar"
        >
          {sidebarOpen
            ? <PanelLeftClose className="h-4 w-4" />
            : <PanelLeftOpen className="h-4 w-4" />
          }
        </Button>
        <PreviewCanvas />
      </main>
    </div>
  );
}