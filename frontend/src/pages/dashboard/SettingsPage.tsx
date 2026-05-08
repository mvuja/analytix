import { useRef, useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useFilterStore } from "../../stores/filterStore";

export function SettingsPage() {
  const siteId = useFilterStore((state) => state.siteId);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const snippet = `<script
  defer
  src="http://localhost:8000/tracker.js"
  data-site-id="${siteId}"
></script>`;

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Workspace details, tracker installation, and future API key management.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">Tracking script</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Install this snippet before the closing head tag.</p>
            </div>
            <div className="relative">
              <Button variant="secondary" className="px-3" onClick={copySnippet} aria-label="Copy tracker snippet">
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </Button>
              {copied && (
                <div className="absolute right-0 top-12 z-10 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-panel dark:border-emerald-500/30 dark:bg-slate-950 dark:text-emerald-300">
                  Copied
                </div>
              )}
            </div>
          </div>
          <pre className="mt-5 overflow-x-auto rounded-md bg-slate-950 p-4 text-sm text-slate-100"><code>{snippet}</code></pre>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-md bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <KeyRound size={20} />
          </div>
          <h2 className="mt-5 text-base font-semibold text-slate-950 dark:text-white">Realtime readiness</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Events are broadcast from the ingestion job, so Reverb channels can be connected without reshaping the API.
          </p>
        </section>
      </div>
    </div>
  );
}
