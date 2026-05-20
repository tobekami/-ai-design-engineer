"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function FavouritesPanel() {
    const favourites = useThemeStore((s) => s.favourites);
    const saveFavourite = useThemeStore((s) => s.saveFavourite);
    const removeFavourite = useThemeStore((s) => s.removeFavourite);
    const restoreFavourite = useThemeStore((s) => s.restoreFavourite);
    const currentId = useThemeStore((s) => s.current.id);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Favourites
                </Label>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => { saveFavourite(); toast.success("Theme saved to favourites"); }}
                        title="Save current theme"
                    >
                        <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setIsOpen(!isOpen)}
                        title="Toggle favourites"
                    >
                        <span className="text-xs font-mono text-muted-foreground">
                            {favourites.length}
                        </span>
                    </Button>
                </div>
            </div>

            {isOpen && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {favourites.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-3">
                            No favourites yet. Hit ♥ to save.
                        </p>
                    )}
                    {favourites.map((fav) => (
                        <div
                            key={fav.id}
                            className={`flex items-center gap-2 rounded-md border px-2.5 py-2 ${fav.config.id === currentId
                                    ? "border-primary bg-primary/10"
                                    : "border-border bg-card"
                                }`}
                        >
                            {/* Color swatch */}
                            <div
                                className="h-5 w-5 shrink-0 rounded-sm border border-border"
                                style={{ backgroundColor: fav.config.primaryHex }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{fav.label}</p>
                                <p className="text-xs text-muted-foreground font-mono truncate">
                                    {fav.config.primaryHex} · {fav.config.ideologyId}
                                </p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => { restoreFavourite(fav.id); toast.success("Theme applied"); }}
                                    title="Restore"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => { removeFavourite(fav.id); toast("Removed from favourites"); }}
                                    title="Remove"
                                >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}