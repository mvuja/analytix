import type { PageRow } from "../../types/analytics";

export function PagesTable({ rows }: { rows: PageRow[] }) {
  return (
    <div className="max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Top pages</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Path</th>
              <th className="px-5 py-3 text-right font-medium">Views</th>
              <th className="px-5 py-3 text-right font-medium">Visitors</th>
              <th className="px-5 py-3 text-right font-medium">Views / visitor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => (
              <tr key={row.pathname}>
                <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{row.pathname}</td>
                <td className="px-5 py-3 text-right text-slate-600 dark:text-slate-300">{row.views}</td>
                <td className="px-5 py-3 text-right text-slate-600 dark:text-slate-300">{row.visitors}</td>
                <td className="px-5 py-3 text-right text-slate-600 dark:text-slate-300">
                  {(row.views / Math.max(row.visitors, 1)).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
