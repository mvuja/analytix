import { HelpCircle } from "lucide-react";
import { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string;
  trend: string;
  icon: ReactNode;
  description: string;
};

export function KpiCard({ label, value, trend, icon, description }: KpiCardProps) {
  return (
    <div className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <span className="group/help relative inline-flex">
            <button
              type="button"
              className="text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-mint dark:text-slate-500 dark:hover:text-slate-200"
              aria-label={`${label} definition`}
            >
              <HelpCircle size={15} />
            </button>
            <span className="pointer-events-none absolute left-0 top-7 z-20 w-56 max-w-[calc(100vw-2rem)] rounded-md border border-slate-200 bg-white p-3 text-sm leading-5 text-slate-600 opacity-0 shadow-panel transition group-hover/help:opacity-100 group-focus-within/help:opacity-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 sm:left-1/2 sm:w-64 sm:-translate-x-1/2">
              {description}
            </span>
          </span>
        </div>
        <div className="rounded-md bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{icon}</div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
          {trend}
        </span>
      </div>
    </div>
  );
}
