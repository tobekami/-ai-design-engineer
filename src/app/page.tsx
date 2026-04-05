"use client";

import { ColorInput } from "@/components/studio/ColorInput";
import { HarmonyPicker } from "@/components/studio/HarmonyPicker";
import { RadiusSlider } from "@/components/studio/RadiusSlider";
import { TokenDisplay } from "@/components/studio/TokenDisplay";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { useThemeStore } from "@/lib/store/theme.store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Undo2, Redo2, Shuffle } from "lucide-react";

export default function Home() {
  const undo = useThemeStore((s) => s.undo);
  const redo = useThemeStore((s) => s.redo);
  const randomizeUnlocked = useThemeStore((s) => s.randomizeUnlocked);
  const past = useThemeStore((s) => s.past);
  const future = useThemeStore((s) => s.future);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* ── Left panel: Studio controls ── */}
      <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-card">
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

        {/* Controls */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <ColorInput />
          <Separator />
          <RadiusSlider />
          <Separator />
          <HarmonyPicker />
          <Separator />
          <TokenDisplay />
        </div>

        {/* Footer: Randomize */}
        <div className="border-t border-border p-4">
          <Button
            className="w-full gap-2"
            onClick={randomizeUnlocked}
          >
            <Shuffle className="h-4 w-4" />
            Randomize Unlocked
          </Button>
        </div>
      </aside>

      {/* ── Right panel: Preview canvas ── */}
      <main className="flex-1 overflow-hidden">
        <PreviewCanvas />
      </main>
    </div>
  );
}