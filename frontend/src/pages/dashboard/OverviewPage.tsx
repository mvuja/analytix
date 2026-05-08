import { Activity, MousePointerClick, Timer, Users } from "lucide-react";
import { DateFilters } from "../../components/dashboard/DateFilters";
import { DevicePieChart } from "../../components/charts/DevicePieChart";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { ReferrersTable } from "../../components/dashboard/ReferrersTable";
import { Skeleton } from "../../components/ui/Skeleton";
import { TrafficChart } from "../../components/charts/TrafficChart";
import { useOverviewQuery } from "../../hooks/useDashboardQueries";

export function OverviewPage() {
  const { data, isLoading } = useOverviewQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Overview</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A focused snapshot of traffic, visitors, and acquisition.</p>
        </div>
        <DateFilters />
      </div>

      {isLoading || !data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-36" />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Pageviews"
              value={data.kpis.pageviews.toLocaleString()}
              trend="+12.4%"
              icon={<MousePointerClick size={18} />}
              description="Total tracked page loads in the selected date range."
            />
            <KpiCard
              label="Visitors"
              value={data.kpis.visitors.toLocaleString()}
              trend="+8.1%"
              icon={<Users size={18} />}
              description="Unique visitor identifiers seen during the selected date range."
            />
            <KpiCard
              label="Sessions"
              value={data.kpis.sessions.toLocaleString()}
              trend="+9.6%"
              icon={<Activity size={18} />}
              description="Tracked browsing sessions for the selected website and date range."
            />
            <KpiCard
              label="Bounce rate"
              value={`${data.kpis.bounceRate}%`}
              trend="-3.2%"
              icon={<Timer size={18} />}
              description="Percentage of sessions with only one pageview."
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(22rem,0.8fr)]">
            <TrafficChart data={data.traffic} />
            <DevicePieChart data={data.devices} />
          </div>
          <ReferrersTable rows={data.referrers} />
        </>
      )}
    </div>
  );
}
