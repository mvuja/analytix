// Demo mode lets the hosted portfolio build run without Laravel or Postgres
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

// A tiny delay keeps loading states visible enough to feel like the real app
export function demoDelay() {
  return new Promise((resolve) => window.setTimeout(resolve, 180));
}
