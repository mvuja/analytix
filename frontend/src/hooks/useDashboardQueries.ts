import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { useFilterStore } from "../stores/filterStore";

// Every dashboard query uses the same filter shape
export function useDashboardFilters() {
  const siteId = useFilterStore((state) => state.siteId);
  const from = useFilterStore((state) => state.from);
  const to = useFilterStore((state) => state.to);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { siteId, from, to, timezone };
}

// The site selector refreshes because tracker.js can create websites at runtime
export function useWebsitesQuery() {
  return useQuery({
    queryKey: ["websites"],
    queryFn: () => dashboardService.websites(),
    refetchInterval: 10_000,
  });
}

// Date and timezone stay in the key so chart data refreshes when either changes
export function useOverviewQuery() {
  const filters = useDashboardFilters();
  return useQuery({
    queryKey: ["dashboard", "overview", filters.siteId, filters.from, filters.to, filters.timezone],
    queryFn: () => dashboardService.overview(filters),
  });
}

// Pages share the same filters as Overview for consistent drill-downs
export function usePagesQuery() {
  const filters = useDashboardFilters();
  return useQuery({
    queryKey: ["dashboard", "pages", filters.siteId, filters.from, filters.to, filters.timezone],
    queryFn: () => dashboardService.pages(filters),
  });
}

// Polling keeps the Realtime screen useful before websocket wiring is enabled
export function useRealtimeQuery() {
  const filters = useDashboardFilters();
  return useQuery({
    queryKey: ["dashboard", "realtime", filters.siteId, filters.from, filters.to, filters.timezone],
    queryFn: () => dashboardService.realtime(filters),
    refetchInterval: 15_000,
  });
}
