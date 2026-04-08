"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { useApiKey, AI_PROVIDERS, AI_MODELS } from "@/hooks/useApiKey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { downloadCSS, exportAsCSS } from "@/lib/export/css";
import { downloadJSON } from "@/lib/export/json";
import { downloadTailwind } from "@/lib/export/tailwind";
import { generateMarkdownGuide, downloadMarkdown } from "@/lib/export/markdown";
import {
    ChevronDown,
    Copy,
    Download,
    FileJson,
    FileCode,
    FileText,
    Sparkles,
    Eye,
    EyeOff,
    Check,
} from "lucide-react";


export function ExportPanel() {
    type MdState = "idle" | "loading" | "done" | "error";
    const current = useThemeStore((s) => s.current);
    const { apiKey, setApiKey, hasKey, selectedModel, setSelectedModel } = useApiKey();

    const [open, setOpen] = useState(true);
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mdState, setMdState] = useState<MdState>("idle");
    const [mdContent, setMdContent] = useState("");
    const [mdError, setMdError] = useState("");


    const handleCopyCSS = () => {
        navigator.clipboard.writeText(exportAsCSS(current));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerateMd = async () => {
        if (!hasKey) return;
        setMdState("loading");
        setMdError("");
        try {
            const content = await generateMarkdownGuide(current, apiKey, selectedModel);
            setMdContent(content);
            setMdState("done");
        } catch (err) {
            setMdError(err instanceof Error ? err.message : "Unknown error");
            setMdState("error");
        }
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5"
            >
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Export
                </span>
                <ChevronDown
                    className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"
                        }`}
                />
            </button>

            {open && (
                <div className="space-y-4">
                    {/* CSS export */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            CSS Variables
                        </Label>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1.5"
                                onClick={handleCopyCSS}
                            >
                                {copied ? (
                                    <Check className="h-3.5 w-3.5" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                                {copied ? "Copied" : "Copy CSS"}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1.5"
                                onClick={() => downloadCSS(current)}
                            >
                                <Download className="h-3.5 w-3.5" />
                                theme.css
                            </Button>
                        </div>
                    </div>

                    {/* JSON export */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Theme JSON
                        </Label>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1.5"
                            onClick={() => downloadJSON(current)}
                        >
                            <FileJson className="h-3.5 w-3.5" />
                            Download theme.json
                        </Button>
                    </div>

                    {/* Tailwind export */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Tailwind Config
                        </Label>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1.5"
                            onClick={() => downloadTailwind(current)}
                        >
                            <FileCode className="h-3.5 w-3.5" />
                            Download tailwind.theme.ts
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border" />

                    {/* Markdown guide — needs API key */}
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">AI Design Guide</Label>

                        {/* Model selector */}
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Model</Label>
                            <select
                                value={selectedModel.id}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                {AI_PROVIDERS.map((provider) => (
                                    <optgroup key={provider.id} label={provider.label}>
                                        {AI_MODELS.filter((m) => m.provider === provider.id).map((model) => (
                                            <option key={model.id} value={model.id}>
                                                {model.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {/* API key input */}
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                                {AI_PROVIDERS.find((p) => p.id === selectedModel.provider)?.label} API Key
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showKey ? "text" : "password"}
                                    placeholder={
                                        AI_PROVIDERS.find((p) => p.id === selectedModel.provider)?.keyPlaceholder ?? "API key..."
                                    }
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="font-mono text-xs pr-8"
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Stored locally. Never sent to our servers.
                            </p>
                        </div>

                        {/* Generate button */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1.5"
                            onClick={handleGenerateMd}
                            disabled={!hasKey || mdState === "loading"}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            {mdState === "loading" ? "Generating..." : "Generate Design Guide"}
                        </Button>

                        {mdState === "error" && (
                            <p className="text-xs text-destructive">{mdError}</p>
                        )}

                        {mdState === "done" && mdContent && (
                            <div className="space-y-1.5">
                                <p className="text-xs text-muted-foreground">
                                    ✓ Guide generated ({Math.round(mdContent.length / 1000)}k chars)
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 gap-1.5"
                                        onClick={() => { navigator.clipboard.writeText(mdContent); }}>
                                        <Copy className="h-3.5 w-3.5" />Copy
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 gap-1.5"
                                        onClick={() => downloadMarkdown(mdContent, current.primaryHex)}>
                                        <FileText className="h-3.5 w-3.5" />Download
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}