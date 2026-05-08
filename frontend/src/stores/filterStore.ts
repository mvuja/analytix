import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilterState = {
  siteId: string;
  from: string;
  to: string;
  setSiteId: (siteId: string) => void;
  setRange: (range: { from: string; to: string }) => void;
};

function isoDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      siteId: "demo-site",
      from: isoDate(14),
      to: isoDate(0),
      setSiteId: (siteId) => set({ siteId }),
      setRange: (range) => set(range),
    }),
    {
      name: "analytix-filters",
      partialize: (state) => ({
        siteId: state.siteId,
        from: state.from,
        to: state.to,
      }),
    },
  ),
);
