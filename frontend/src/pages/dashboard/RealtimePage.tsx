import { Activity, Radio } from "lucide-react";
import { useRealtimeQuery } from "../../hooks/useDashboardQueries";
import { Skeleton } from "../../components/ui/Skeleton";

export function RealtimePage() {
  const { data, isLoading } = useRealtimeQuery();

  // Include the date because late-night testing can cross dashboard days
  function formatEventTimestamp(timestamp: string) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(timestamp));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Realtime</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Prepared for Reverb-powered live updates, polling every 15 seconds.</p>
      </div>
      {isLoading || !data ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-mint">
              <Radio size={22} />
              <span className="text-sm font-semibold">Live visitors</span>
            </div>
            <p className="mt-6 text-6xl font-bold text-slate-950 dark:text-white">{data.activeVisitors}</p>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Active in the last 30 minutes</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">Recent events</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.recentEvents.map((event, index) => (
                <div key={`${event.pathname}-${event.occurred_at}-${index}`} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-md bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Activity size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{event.pathname}</p>
                      <p className="text-xs text-slate-500">{event.browser} on {event.device}</p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-xs font-medium text-slate-500">{formatEventTimestamp(event.occurred_at)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
