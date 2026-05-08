import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DeviceSlice } from "../../types/analytics";

const colors = ["#34d399", "#60a5fa", "#fb7185", "#f59e0b"];

export function DevicePieChart({ data }: { data: DeviceSlice[] }) {
  return (
    <div className="h-96 rounded-lg border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-950 dark:text-white">Devices</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Visitor device mix</p>
      <ResponsiveContainer width="100%" height="82%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="device"
            innerRadius={48}
            outerRadius={78}
            paddingAngle={3}
            cy="45%"
          >
            {data.map((entry, index) => (
              <Cell key={entry.device} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            iconType="circle"
            verticalAlign="bottom"
            height={42}
            formatter={(value) => <span className="text-sm capitalize text-slate-600 dark:text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
