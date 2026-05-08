import { DateFilters } from "../../components/dashboard/DateFilters";
import { PagesTable } from "../../components/dashboard/PagesTable";
import { Skeleton } from "../../components/ui/Skeleton";
import { usePagesQuery } from "../../hooks/useDashboardQueries";

export function PagesPage() {
  const { data, isLoading } = usePagesQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Pages</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ranked page performance for the selected period.</p>
        </div>
        <DateFilters />
      </div>
      {isLoading || !data ? <Skeleton className="h-96" /> : <PagesTable rows={data} />}
    </div>
  );
}
