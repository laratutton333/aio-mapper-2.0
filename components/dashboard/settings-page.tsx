"use client";

import * as React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import type { UserBrandConfig } from "@/types/user-config";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

function SettingRow({
  label,
  description,
  right
}: {
  label: string;
  description: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 border-t border-slate-200 py-4 dark:border-slate-900 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function DisabledOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/70 backdrop-blur-[1px] dark:bg-slate-950/40" />
      <div className="absolute right-4 top-4">
        <Badge className="border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          Demo · Read-only
        </Badge>
      </div>
      <div className="opacity-60">{children}</div>
    </div>
  );
}

function AppearanceCard() {
  const [mode, setMode] = React.useState<"dark" | "light">("dark");

  React.useEffect(() => {
    const stored = window.localStorage.getItem("aio-theme");
    if (stored === "light") setMode("light");
    if (stored === "dark") setMode("dark");
  }, []);

  function apply(next: "dark" | "light") {
    setMode(next);
    window.localStorage.setItem("aio-theme", next);
    window.location.reload();
  }

  return (
    <Card className="border-slate-200 dark:border-slate-900">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Appearance</CardTitle>
        </div>
        <CardDescription>Customize how the dashboard looks on your device.</CardDescription>
      </CardHeader>

      <div className="mt-4">
        <SettingRow
          label="Theme"
          description="Switch between light and dark mode."
          right={
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => apply("light")}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                  mode === "light"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                )}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => apply("dark")}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                  mode === "dark"
                    ? "bg-slate-900 text-white dark:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50"
                )}
              >
                Dark
              </button>
            </div>
          }
        />
      </div>
    </Card>
  );
}

function textFieldBaseClass() {
  return "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700";
}

function BrandConfigurationCard({
  demoMode,
  config,
  onChange,
  onSave,
  saving,
  message
}: {
  demoMode: boolean;
  config: UserBrandConfig;
  onChange: (next: UserBrandConfig) => void;
  onSave: () => void;
  saving: boolean;
  message: { kind: "error" | "success"; text: string } | null;
}) {
  const content = (
    <Card className="border-slate-200 dark:border-slate-900">
      <CardHeader>
        <div>
          <CardTitle>Brand Configuration</CardTitle>
          <CardDescription>Configure your primary brand and domain for tracking.</CardDescription>
        </div>
      </CardHeader>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Brand Name</span>
          <input
            className={textFieldBaseClass()}
            value={config.brand_name ?? ""}
            onChange={(e) => onChange({ ...config, brand_name: e.target.value })}
            placeholder="Acme Corp"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Primary Domain</span>
          <input
            className={textFieldBaseClass()}
            value={config.primary_domain ?? ""}
            onChange={(e) => onChange({ ...config, primary_domain: e.target.value })}
            placeholder="acmecorp.com"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="min-h-[20px] text-xs">
          {message ? (
            <span className={message.kind === "success" ? "text-emerald-700" : "text-rose-700"}>
              {message.text}
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="primary"
          disabled={demoMode || saving}
          onClick={onSave}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </Card>
  );

  return demoMode ? <DisabledOverlay>{content}</DisabledOverlay> : content;
}

function CompetitorsCard({
  demoMode,
  config,
  onChange
}: {
  demoMode: boolean;
  config: UserBrandConfig;
  onChange: (next: UserBrandConfig) => void;
}) {
  const [name, setName] = React.useState("");
  const [domain, setDomain] = React.useState("");

  function addCompetitor() {
    const nextName = name.trim();
    if (!nextName) return;
    const nextDomain = domain.trim() || null;
    onChange({
      ...config,
      competitors: [...config.competitors, { name: nextName, domain: nextDomain }]
    });
    setName("");
    setDomain("");
  }

  function removeCompetitor(index: number) {
    onChange({
      ...config,
      competitors: config.competitors.filter((_, i) => i !== index)
    });
  }

  const content = (
    <Card className="border-slate-200 dark:border-slate-900">
      <CardHeader>
        <div>
          <CardTitle>Competitors</CardTitle>
          <CardDescription>Optional list of competitors for configuration and display.</CardDescription>
        </div>
      </CardHeader>

      <div className="mt-6 space-y-3">
        {config.competitors.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
            No competitors added yet.
          </div>
        ) : (
          config.competitors.map((c, idx) => (
            <div
              key={`${c.name}-${c.domain ?? "none"}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {c.name}
                </div>
                <div className="truncate text-xs text-slate-600 dark:text-slate-400">{c.domain ?? "—"}</div>
              </div>
              <Button type="button" variant="outline" size="sm" disabled={demoMode} onClick={() => removeCompetitor(idx)}>
                Remove
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Competitor Name</span>
          <input
            className={textFieldBaseClass()}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Competitor"
            disabled={demoMode}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Domain</span>
          <input
            className={textFieldBaseClass()}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="competitor.com"
            disabled={demoMode}
          />
        </label>
      </div>

      <div className="mt-4">
        <Button type="button" variant="outline" disabled={demoMode || !name.trim()} onClick={addCompetitor}>
          Add Competitor
        </Button>
      </div>
    </Card>
  );

  return demoMode ? <DisabledOverlay>{content}</DisabledOverlay> : content;
}

function NotificationsCard({ demoMode }: { demoMode: boolean }) {
  const content = (
    <Card className="border-slate-200 dark:border-slate-900">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Control updates, alerts, and weekly summaries.</CardDescription>
      </CardHeader>
      <div className="mt-4">
        <SettingRow
          label="Weekly report email"
          description="Get a weekly summary of visibility changes."
          right={
            <Button type="button" variant="outline" size="sm" disabled>
              Enabled
            </Button>
          }
        />
        <SettingRow
          label="Alert thresholds"
          description="Notify when visibility changes exceed thresholds."
          right={
            <Button type="button" variant="outline" size="sm" disabled>
              Configure
            </Button>
          }
        />
      </div>
    </Card>
  );

  return demoMode ? <DisabledOverlay>{content}</DisabledOverlay> : content;
}

function ExportDataCard({ demoMode }: { demoMode: boolean }) {
  const content = (
    <Card className="border-slate-200 dark:border-slate-900">
      <CardHeader>
        <div>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download your audit data and reports.</CardDescription>
        </div>
      </CardHeader>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled>
          Export as CSV
        </Button>
        <Button type="button" variant="outline" disabled>
          Export as JSON
        </Button>
        <Button type="button" variant="outline" disabled>
          Generate PDF Report
        </Button>
      </div>
      {demoMode ? (
        <div className="mt-3 text-xs text-slate-500">Exports are not available in demo mode.</div>
      ) : null}
    </Card>
  );

  return demoMode ? <DisabledOverlay>{content}</DisabledOverlay> : content;
}

export function DashboardSettingsPage({ demoMode }: { demoMode: boolean }) {
  const [config, setConfig] = React.useState<UserBrandConfig>({
    brand_name: null,
    primary_domain: null,
    competitors: []
  });
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<null | { kind: "error" | "success"; text: string }>(null);

  React.useEffect(() => {
    if (demoMode) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/user/config");
        if (!res.ok) return;
        const json = (await res.json()) as { config?: UserBrandConfig };
        if (cancelled) return;
        if (json.config) setConfig(json.config);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [demoMode]);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/config", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ config })
      });
      const json = (await res.json()) as { config?: UserBrandConfig; error?: string };
      if (!res.ok) {
        setMessage({ kind: "error", text: json.error ?? "Unable to save changes." });
        return;
      }
      if (json.config) setConfig(json.config);
      setMessage({ kind: "success", text: "Saved." });
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Unable to save changes." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Settings"
        description={
          demoMode
            ? "Demo mode is read-only. Customize appearance now; other settings are preview-only."
            : "Configure your AIO Mapper preferences and integrations."
        }
      />

      {demoMode ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-slate-900 dark:border-blue-600/40 dark:bg-blue-600/10 dark:text-slate-100">
          <span className="font-semibold text-blue-700 dark:text-blue-300">Demo Mode</span>{" "}
          <span className="text-slate-700 dark:text-slate-300">
            Settings shown here are a preview. Demo views display fictional brands and simulated data for illustrative purposes only.
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <AppearanceCard />
        <BrandConfigurationCard
          demoMode={demoMode}
          config={config}
          onChange={(next) => setConfig(next)}
          onSave={save}
          saving={saving}
          message={message}
        />
        <CompetitorsCard demoMode={demoMode} config={config} onChange={(next) => setConfig(next)} />
        <NotificationsCard demoMode={demoMode} />
        <ExportDataCard demoMode={demoMode} />
      </div>

      {demoMode ? (
        <div className="text-sm text-slate-400">
          Want to run a real audit?{" "}
          <Link href="/account" className="text-blue-400 hover:underline">
            Create an account →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
