import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ByokConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface ByokState extends ByokConfig {
  setConfig: (config: Partial<ByokConfig>) => void;
  clearApiKey: () => void;
  isConfigured: () => boolean;
}

const DEFAULT_CONFIG: ByokConfig = {
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4.1-mini",
};

export const useByokStore = create<ByokState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CONFIG,
      setConfig: (config) =>
        set((state) => ({
          ...state,
          ...config,
          baseUrl: config.baseUrl?.trim() || state.baseUrl,
          model: config.model?.trim() || state.model,
        })),
      clearApiKey: () => set({ apiKey: "" }),
      isConfigured: () => Boolean(get().apiKey.trim() && get().baseUrl.trim() && get().model.trim()),
    }),
    {
      name: "arcanum-byok",
      partialize: (state) => ({
        apiKey: state.apiKey,
        baseUrl: state.baseUrl,
        model: state.model,
      }),
    },
  ),
);
