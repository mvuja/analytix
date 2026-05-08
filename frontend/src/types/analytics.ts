export type Kpis = {
  pageviews: number;
  visitors: number;
  sessions: number;
  bounceRate: number;
};

export type Website = {
  id: string;
  siteId: string;
  name: string;
  domain: string;
  timezone: string;
  pageviews: number;
  sessions: number;
};

export type TrafficPoint = {
  date: string;
  views: number;
};

export type DeviceSlice = {
  device: string;
  value: number;
};

export type ReferrerRow = {
  source: string;
  visits: number;
};

export type OverviewResponse = {
  kpis: Kpis;
  traffic: TrafficPoint[];
  devices: DeviceSlice[];
  referrers: ReferrerRow[];
};

export type PageRow = {
  pathname: string;
  views: number;
  visitors: number;
};

export type RealtimeEvent = {
  type: string;
  pathname: string;
  referrer: string | null;
  browser: string | null;
  device: string | null;
  occurred_at: string;
};

export type RealtimeResponse = {
  activeVisitors: number;
  recentEvents: RealtimeEvent[];
};
