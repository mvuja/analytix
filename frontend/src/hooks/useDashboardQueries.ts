import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { useFilterStore } from "../stores/filterStore";

export function useDashboardFilters() {
  const siteId = useFilterStore((state) => state.siteId);
  const from = useFilterStore((state) => state.from);
  const to = useFilterStore((state) => state.to);

  return { siteId, from, to };
}

export function useWebsitesQuery() {
  return useQuery({
    queryKey: ["websites"],
    queryFn: () => dashboardService.websites(),
    refetchInterval: 10_000,
  });
}

export function useOverviewQuery() {
  const filters = useDashboardFilters();
  return useQuery({
    queryKey: ["dashboard", "overview", filters.siteId, filters.from, filters.to],
    queryFn: () => dashboardService.overview(filters),
  });
}

export function usePagesQuery() {
  const filters = useDashboardFilters();
  return useQuery({
    queryKey: ["dashboard", "pages", filters.siteId, filters.from, filters.to],
    queryFn: () => dashboardService.pages(filters),
  });
}

export function useRealtimeQuery() {
  const filters = useDashboardFilters();
  return useQuery({
    queryKey: ["dashboard", "realtime", filters.siteId, filters.from, filters.to],
    queryFn: () => dashboardService.realtime(filters),
    refetchInterval: 15_000,
  });
}
