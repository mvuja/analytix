import { Globe2, LogOut, Menu, Moon, Sun } from "lucide-react";
import { Button } from "../ui/Button";
import { useWebsitesQuery } from "../../hooks/useDashboardQueries";
import { useAuthStore } from "../../stores/authStore";
import { useFilterStore } from "../../stores/filterStore";
import { useUiStore } from "../../stores/uiStore";

export function TopNav() {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme, setSidebarOpen } = useUiStore();
  const { data: websites = [] } = useWebsitesQuery();
  const siteId = useFilterStore((state) => state.siteId);
  const setSiteId = useFilterStore((state) => state.setSiteId);

  return (
    <header className="sticky top-0 z-20 flex h-16 min-w-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" className="px-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
          <Menu size={20} />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">Analytics dashboard</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">Signed in as {user?.email}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <label className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:flex">
          <Globe2 size={16} />
          <select
            className="max-w-44 bg-transparent text-sm outline-none"
            value={siteId}
            onChange={(event) => setSiteId(event.target.value)}
          >
            {websites.map((website) => (
              <option key={website.id} value={website.siteId}>
                {website.name}
              </option>
            ))}
          </select>
        </label>
        <Button variant="secondary" className="px-3" onClick={toggleTheme} aria-label="Toggle theme">
          {resolvedTheme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </Button>
        <Button variant="ghost" className="px-3" onClick={logout} aria-label="Logout">
          <LogOut size={17} />
        </Button>
      </div>
    </header>
  );
}
