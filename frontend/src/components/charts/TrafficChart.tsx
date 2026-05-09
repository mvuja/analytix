import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrafficPoint } from "../../types/analytics";
import { chartTooltipItemStyle, chartTooltipLabelStyle, chartTooltipStyle } from "./chartTooltip";

export function TrafficChart({ data }: { data: TrafficPoint[] }) {
  return (
    <div className="h-80 rounded-lg border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Traffic trend</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Daily pageviews across the selected window</p>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <AreaChart data={data}>
          {/* The fill keeps low-traffic days visible without overpowering the grid */}
          <defs>
            <linearGradient id="traffic" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.38} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} />
          <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} fill="url(#traffic)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
