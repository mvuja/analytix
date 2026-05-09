import type { OverviewResponse, PageRow, RealtimeResponse, Website } from "../types/analytics";

function localDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isoMinutesAgo(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

export const demoUser = {
  id: 1,
  name: "Maja Analytics",
  email: "demo@analytix.dev",
};

export const demoWebsites: Website[] = [
  {
    id: "demo-shop",
    siteId: "demo-site",
    name: "Demo Shop",
    domain: "shop.example.com",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    pageviews: 18_420,
    sessions: 7_340,
  },
  {
    id: "launch-blog",
    siteId: "launch-blog",
    name: "Launch Blog",
    domain: "blog.example.com",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    pageviews: 9_870,
    sessions: 4_110,
  },
];

const trafficPattern = [186, 214, 198, 244, 276, 301, 288, 336, 359, 391, 420, 438, 472, 515, 548];

export function demoOverview(): OverviewResponse {
  return {
    kpis: {
      pageviews: 5_686,
      visitors: 2_143,
      sessions: 2_884,
      bounceRate: 42.8,
    },
    traffic: trafficPattern.map((views, index) => ({
      date: localDate(trafficPattern.length - index - 1),
      views,
    })),
    devices: [
      { device: "desktop", value: 52 },
      { device: "mobile", value: 38 },
      { device: "tablet", value: 10 },
    ],
    referrers: [
      { source: "Direct", visits: 1280 },
      { source: "google.com", visits: 982 },
      { source: "github.com", visits: 426 },
      { source: "linkedin.com", visits: 311 },
      { source: "news.ycombinator.com", visits: 184 },
    ],
  };
}

export const demoPages: PageRow[] = [
  { pathname: "/", views: 1620, visitors: 820 },
  { pathname: "/pricing", views: 884, visitors: 510 },
  { pathname: "/products/analytics-kit", views: 731, visitors: 402 },
  { pathname: "/blog/self-hosted-analytics", views: 608, visitors: 386 },
  { pathname: "/docs/tracker-install", views: 492, visitors: 276 },
  { pathname: "/contact", views: 214, visitors: 180 },
];

export const demoRealtime: RealtimeResponse = {
  activeVisitors: 7,
  recentEvents: [
    { type: "pageview", pathname: "/pricing", referrer: "https://google.com", browser: "Chrome", device: "desktop", occurred_at: isoMinutesAgo(1) },
    { type: "pageview", pathname: "/products/analytics-kit", referrer: "Direct", browser: "Safari", device: "mobile", occurred_at: isoMinutesAgo(3) },
    { type: "pageview", pathname: "/docs/tracker-install", referrer: "https://github.com", browser: "Firefox", device: "desktop", occurred_at: isoMinutesAgo(6) },
    { type: "pageview", pathname: "/", referrer: "https://linkedin.com", browser: "Edge", device: "desktop", occurred_at: isoMinutesAgo(9) },
    { type: "pageview", pathname: "/blog/self-hosted-analytics", referrer: "Direct", browser: "Chrome", device: "tablet", occurred_at: isoMinutesAgo(12) },
  ],
};
