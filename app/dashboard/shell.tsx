"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/prompt-explorer", label: "Prompt Explorer" },
  { href: "/dashboard/brand-vs-competitors", label: "Brand vs Competitors" },
  { href: "/dashboard/citations", label: "Citations" },
  { href: "/dashboard/recommendations", label: "Recommendations" },
  { href: "/dashboard/settings", label: "Settings" }
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = React.useState<boolean>(true);

  React.useEffect(() => {
    const stored = window.localStorage.getItem("aio-theme");
    if (stored === "light") setIsDark(false);
    if (stored === "dark") setIsDark(true);
  }, []);

  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev;
      window.localStorage.setItem("aio-theme", next ? "dark" : "light");
      return next;
    });
  }

  return (
    <div className={cn(isDark ? "dark" : "", "min-h-dvh")}>
      <div className="min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-dvh">
          <aside className="hidden w-64 flex-col border-r border-slate-200 bg-slate-50 px-4 py-6 dark:border-slate-900 dark:bg-slate-950 md:flex">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold tracking-tight">AIO Mapper</div>
              <Button variant="secondary" size="sm" type="button" onClick={toggleTheme}>
                {isDark ? "Light" : "Dark"}
              </Button>
            </div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              AI Visibility Intelligence
            </div>

            <nav className="mt-6 space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 dark:border-slate-900 dark:bg-slate-950 dark:text-slate-400">
              <div className="font-medium text-slate-900 dark:text-slate-100">John Doe</div>
              <div>Enterprise Plan</div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

