"use client";

import { useState, useRef } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Upload, X } from "lucide-react";

interface ColorSwatch {
    hex: string;
    population: number;
}

function extractDominantColors(img: HTMLImageElement, count: number = 5): ColorSwatch[] {
    const canvas = document.createElement("canvas");
    const size = 100; // downsample for performance
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];

    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    // Bucket pixels into 32-step RGB cubes for quantization
    const buckets: Record<string, number> = {};
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip transparent or near-white/near-black pixels
        if (a < 128) continue;
        const brightness = (r + g + b) / 3;
        if (brightness > 240 || brightness < 15) continue;

        // Quantize to reduce noise
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const key = `${qr},${qg},${qb}`;
        buckets[key] = (buckets[key] ?? 0) + 1;
    }

    // Sort by population
    const sorted = Object.entries(buckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count * 3); // grab extra to deduplicate similar colors

    // Deduplicate colors that are too similar
    const result: ColorSwatch[] = [];
    for (const [key, population] of sorted) {
        const [r, g, b] = key.split(",").map(Number);
        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

        // Check if this color is too similar to already selected ones
        const tooSimilar = result.some((existing) => {
            const er = parseInt(existing.hex.slice(1, 3), 16);
            const eg = parseInt(existing.hex.slice(3, 5), 16);
            const eb = parseInt(existing.hex.slice(5, 7), 16);
            const distance = Math.sqrt(
                Math.pow(r - er, 2) + Math.pow(g - eg, 2) + Math.pow(b - eb, 2)
            );
            return distance < 60; // threshold for "too similar"
        });

        if (!tooSimilar) {
            result.push({ hex, population });
        }

        if (result.length >= count) break;
    }

    return result;
}

export function LogoUpload() {
    const setPrimaryHex = useThemeStore((s) => s.setPrimaryHex);

    const [open, setOpen] = useState(true);
    const [preview, setPreview] = useState<string | null>(null);
    const [swatches, setSwatches] = useState<ColorSwatch[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string;
            setPreview(src);

            const img = new Image();
            img.onload = () => {
                const colors = extractDominantColors(img, 5);
                setSwatches(colors);
                setSelected(null);
            };
            img.src = src;
        };
        reader.readAsDataURL(file);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleSelectColor = (hex: string) => {
        setSelected(hex);
        setPrimaryHex(hex);
    };

    const handleClear = () => {
        setPreview(null);
        setSwatches([]);
        setSelected(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Logo / Image
                    </span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
                </button>
                {preview && (
                    <button onClick={handleClear} className="text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {open && (
                <div className="space-y-3">
                    {!preview ? (
                        // Drop zone
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${dragging
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                                }`}
                        >
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <div className="text-center">
                                <p className="text-xs font-medium text-foreground">
                                    Drop your logo here
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG, SVG, WEBP
                                </p>
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFile}
                            />
                        </div>
                    ) : (
                        // Preview + swatches
                        <div className="space-y-3">
                            {/* Image preview */}
                            <div className="flex items-center justify-center rounded-lg border border-border bg-muted/30 p-3">
                                <img
                                    src={preview}
                                    alt="Uploaded logo"
                                    className="max-h-16 max-w-full object-contain"
                                />
                            </div>

                            {/* Extracted swatches */}
                            {swatches.length > 0 && (
                                <div className="space-y-1.5">
                                    <p className="text-xs text-muted-foreground">
                                        Pick a color to use as primary
                                    </p>
                                    <div className="flex gap-2">
                                        {swatches.map((swatch) => (
                                            <button
                                                key={swatch.hex}
                                                onClick={() => handleSelectColor(swatch.hex)}
                                                title={swatch.hex}
                                                className="relative flex-1 h-8 rounded-md transition-transform hover:scale-105"
                                                style={{ backgroundColor: swatch.hex }}
                                            >
                                                {selected === swatch.hex && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="rounded-full bg-white/20 p-0.5">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        {swatches.map((swatch) => (
                                            <p key={swatch.hex}
                                                className="flex-1 text-center font-mono text-xs text-muted-foreground truncate">
                                                {swatch.hex}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {swatches.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-2">
                                    No distinct colors found. Try a different image.
                                </p>
                            )}

                            {/* Re-upload */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-1.5"
                                onClick={() => fileRef.current?.click()}
                            >
                                <Upload className="h-3.5 w-3.5" />
                                Upload different image
                            </Button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFile}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}