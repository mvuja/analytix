import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe2, LogOut, Menu, Moon, Sun } from "lucide-react";
import { Button } from "../ui/Button";
import { useWebsitesQuery } from "../../hooks/useDashboardQueries";
import { useAuthStore } from "../../stores/authStore";
import { useFilterStore } from "../../stores/filterStore";
import { useUiStore } from "../../stores/uiStore";

export function TopNav() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme, setSidebarOpen } = useUiStore();
  const { data: websites = [] } = useWebsitesQuery();
  const siteId = useFilterStore((state) => state.siteId);
  const setSiteId = useFilterStore((state) => state.setSiteId);
  const displayName = user?.name?.trim() || "there";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    // Close the account menu when focus moves back to the dashboard
    function closeAccountMenu(event: MouseEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", closeAccountMenu);

    return () => document.removeEventListener("mousedown", closeAccountMenu);
  }, []);

  async function handleLogout() {
    // Collapse the menu first so navigation back to login feels immediate
    setIsAccountOpen(false);
    await logout();
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 min-w-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" className="px-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
          <Menu size={20} />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">Analytics dashboard</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">Welcome back, {displayName}</p>
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
        <div ref={accountMenuRef} className="relative">
          <button
            type="button"
            className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 text-left transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-mint dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            onClick={() => setIsAccountOpen((current) => !current)}
            aria-expanded={isAccountOpen}
            aria-haspopup="menu"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-slate-950 text-xs font-bold text-white dark:bg-mint dark:text-slate-950">
              {initials || "A"}
            </span>
            <span className="hidden min-w-0 md:block">
              <span className="block max-w-32 truncate text-sm font-semibold text-slate-950 dark:text-white">{displayName}</span>
            </span>
            <ChevronDown size={15} className="hidden shrink-0 text-slate-400 md:block" />
          </button>
          {isAccountOpen && (
            <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-md border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900" role="menu">
              <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{displayName}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={handleLogout}
                role="menuitem"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
