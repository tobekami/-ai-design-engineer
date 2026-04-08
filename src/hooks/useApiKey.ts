import { useState } from "react";

export type AIProvider = "google" | "anthropic" | "openai" | "mistral" | "openrouter";

export interface AIModel {
    id: string;
    label: string;
    provider: AIProvider;
    apiModel: string;
}

export const AI_PROVIDERS: { id: AIProvider; label: string; keyPlaceholder: string }[] = [
    { id: "google", label: "Google Gemini", keyPlaceholder: "AIza..." },
    { id: "anthropic", label: "Anthropic", keyPlaceholder: "sk-ant-..." },
    { id: "openai", label: "OpenAI", keyPlaceholder: "sk-..." },
    { id: "mistral", label: "Mistral", keyPlaceholder: "..." },
    { id: "openrouter", label: "OpenRouter", keyPlaceholder: "sk-or-..." },
];

export const AI_MODELS: AIModel[] = [
    // Google (Gemini) - Latest & Highest Limits (Standard Text/Logic)
    { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (Preview)", provider: "google", apiModel: "gemini-3.1-pro-preview" },
    { id: "gemini-3.1-flash-lite-preview", label: "Gemini 3.1 Flash Lite (Preview)", provider: "google", apiModel: "gemini-3.1-flash-lite-preview" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "google", apiModel: "gemini-2.5-pro" },
    { id: "gemini-flash-latest", label: "Gemini Flash (Latest Stable)", provider: "google", apiModel: "gemini-flash-latest" },

    // Google (Gemma) - Top Open-Weights Models
    { id: "gemma-3-27b", label: "Gemma 3 27B", provider: "google", apiModel: "gemma-3-27b-it" },

    // Anthropic (Claude)
    { id: "claude-3-7-sonnet", label: "Claude 3.7 Sonnet", provider: "anthropic", apiModel: "claude-3-7-sonnet-20250219" },
    { id: "claude-3-5-haiku", label: "Claude 3.5 Haiku", provider: "anthropic", apiModel: "claude-3-5-haiku-20241022" },
    { id: "claude-3-opus", label: "Claude 3 Opus", provider: "anthropic", apiModel: "claude-3-opus-20240229" },

    // OpenAI
    { id: "o1", label: "OpenAI o1", provider: "openai", apiModel: "o1" },
    { id: "o3-mini", label: "OpenAI o3-mini", provider: "openai", apiModel: "o3-mini" },
    { id: "gpt-4o", label: "GPT-4o", provider: "openai", apiModel: "gpt-4o" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini", provider: "openai", apiModel: "gpt-4o-mini" },

    // Mistral
    { id: "mistral-large", label: "Mistral Large", provider: "mistral", apiModel: "mistral-large-latest" },
    { id: "mistral-small", label: "Mistral Small", provider: "mistral", apiModel: "mistral-small-latest" },
    // OpenRouter (covers DeepSeek, Qwen, Llama, etc.)
    { id: "or-deepseek-r1", label: "DeepSeek R1", provider: "openrouter", apiModel: "deepseek/deepseek-r1" },
    { id: "or-qwen-72b", label: "Qwen 2.5 72B", provider: "openrouter", apiModel: "qwen/qwen-2.5-72b-instruct" },
    { id: "or-llama-70b", label: "Llama 3.3 70B", provider: "openrouter", apiModel: "meta-llama/llama-3.3-70b-instruct" },
    { id: "or-gemma-27b", label: "Gemma 2 27B", provider: "openrouter", apiModel: "google/gemma-2-27b-it" },
];

export const DEFAULT_MODEL = AI_MODELS[0]; // Gemini 2.0 Flash

const KEY_PREFIX = "aide-apikey-";
const MODEL_KEY = "aide-selected-model";

export function useApiKey() {
    const [selectedModelId, setSelectedModelIdState] = useState<string>(() => {
        if (typeof window === "undefined") return DEFAULT_MODEL.id;
        return localStorage.getItem(MODEL_KEY) ?? DEFAULT_MODEL.id;
    });

    const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId) ?? DEFAULT_MODEL;

    const [apiKey, setApiKeyState] = useState<string>(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem(`${KEY_PREFIX}${selectedModel.provider}`) ?? "";
    });

    const setSelectedModel = (modelId: string) => {
        const model = AI_MODELS.find((m) => m.id === modelId) ?? DEFAULT_MODEL;
        setSelectedModelIdState(modelId);
        localStorage.setItem(MODEL_KEY, modelId);
        // Load the key for this provider
        const stored = localStorage.getItem(`${KEY_PREFIX}${model.provider}`) ?? "";
        setApiKeyState(stored);
    };

    const setApiKey = (key: string) => {
        setApiKeyState(key);
        if (key) {
            localStorage.setItem(`${KEY_PREFIX}${selectedModel.provider}`, key);
        } else {
            localStorage.removeItem(`${KEY_PREFIX}${selectedModel.provider}`);
        }
    };

    const clearApiKey = () => {
        setApiKeyState("");
        localStorage.removeItem(`${KEY_PREFIX}${selectedModel.provider}`);
    };

    return {
        apiKey,
        setApiKey,
        clearApiKey,
        hasKey: apiKey.length > 0,
        selectedModel,
        setSelectedModel,
        allModels: AI_MODELS,
        providers: AI_PROVIDERS,
    };
}