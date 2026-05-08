import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type UiState = {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setSystemTheme: (theme: ResolvedTheme) => void;
  setSidebarOpen: (open: boolean) => void;
};

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themePreference: "system",
      resolvedTheme: getSystemTheme(),
      sidebarOpen: false,
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.resolvedTheme === "light" ? "dark" : "light";

          return {
            themePreference: nextTheme,
            resolvedTheme: nextTheme,
          };
        }),
      setSystemTheme: (systemTheme) =>
        set((state) => ({
          resolvedTheme: state.themePreference === "system" ? systemTheme : state.resolvedTheme,
        })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: "analytix-ui-v2",
      partialize: (state) => ({
        themePreference: state.themePreference,
        resolvedTheme: state.resolvedTheme,
      }),
    },
  ),
);
