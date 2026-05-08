import { BarChart3, Bolt, Gauge, Settings, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { useUiStore } from "../../stores/uiStore";

const nav = [
  { to: "/overview", label: "Overview", icon: Gauge },
  { to: "/realtime", label: "Realtime", icon: Bolt },
  { to: "/pages", label: "Pages", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-slate-950/40 lg:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div>
            <p className="text-lg font-bold text-slate-950 dark:text-white">Analytix</p>
            <p className="text-xs font-medium text-slate-500">demo-site</p>
          </div>
          <Button variant="ghost" className="px-2 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={18} />
          </Button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-slate-950 text-white dark:bg-mint dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900",
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
