import { api } from "../lib/api";
import { demoOverview, demoPages, demoRealtime, demoWebsites } from "../data/demoAnalytics";
import { demoDelay, isDemoMode } from "../lib/demoMode";
import type { OverviewResponse, PageRow, RealtimeResponse, Website } from "../types/analytics";

export type DashboardFilters = {
  siteId?: string;
  from?: string;
  to?: string;
  timezone?: string;
};

// Dashboard services mirror the backend REST sections one-to-one
export const dashboardService = {
  async websites() {
    if (isDemoMode) {
      await demoDelay();
      return demoWebsites;
    }

    const { data } = await api.get<{ data: Website[] }>("/api/websites");
    return data.data;
  },
  async overview(filters: DashboardFilters) {
    if (isDemoMode) {
      await demoDelay();
      return demoOverview();
    }

    const { data } = await api.get<{ data: OverviewResponse }>("/api/dashboard/overview", {
      params: filters,
    });
    return data.data;
  },
  async pages(filters: DashboardFilters) {
    if (isDemoMode) {
      await demoDelay();
      return demoPages;
    }

    const { data } = await api.get<{ data: PageRow[] }>("/api/dashboard/pages", {
      params: filters,
    });
    return data.data;
  },
  async realtime(filters: DashboardFilters) {
    if (isDemoMode) {
      await demoDelay();
      return demoRealtime;
    }

    const { data } = await api.get<{ data: RealtimeResponse }>("/api/dashboard/realtime", {
      params: filters,
    });
    return data.data;
  },
};
