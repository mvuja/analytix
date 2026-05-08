import { Calendar } from "lucide-react";
import { Input } from "../ui/Input";
import { useFilterStore } from "../../stores/filterStore";

export function DateFilters() {
  const { from, to, setRange } = useFilterStore();

  return (
    <div className="flex max-w-full flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-panel dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <Calendar size={16} />
        Date range
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
        <Input type="date" value={from} onChange={(event) => setRange({ from: event.target.value, to })} />
        <Input type="date" value={to} onChange={(event) => setRange({ from, to: event.target.value })} />
      </div>
    </div>
  );
}
