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
  // Build filter dates from the local calendar
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
      version: 2,
      partialize: (state) => ({
        siteId: state.siteId,
        from: state.from,
        to: state.to,
      }),
      migrate: (state) => {
        const previous = state as Partial<FilterState> | null;

        // Refresh persisted ranges when date handling changes
        return {
          siteId: previous?.siteId ?? "demo-site",
          from: isoDate(14),
          to: isoDate(0),
        } as FilterState;
      },
    },
  ),
);
