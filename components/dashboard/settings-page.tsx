"use client";

import * as React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";

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
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-slate-950/40" />
      <div className="absolute right-4 top-4">
        <Badge className="border-slate-800 bg-slate-900 text-slate-200">Demo · Read-only</Badge>
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
          <Badge className="border-slate-800 bg-slate-900 text-slate-200">Available in demo</Badge>
        </div>
        <CardDescription>Customize how the dashboard looks on your device.</CardDescription>
      </CardHeader>

      <div className="mt-4">
        <SettingRow
          label="Theme"
          description="Switch between light and dark mode."
          right={
            <div className="inline-flex items-center rounded-md border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => apply("light")}
                className={cn(
                  "rounded-md px-3 py-2 text-sm",
                  mode === "light"
                    ? "bg-slate-900 text-white dark:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
                )}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => apply("dark")}
                className={cn(
                  "rounded-md px-3 py-2 text-sm",
                  mode === "dark"
                    ? "bg-slate-900 text-white dark:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
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

function AccountCard({ demoMode }: { demoMode: boolean }) {
  const content = (
    <Card className="border-slate-200 dark:border-slate-900">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your profile, team, and access.</CardDescription>
      </CardHeader>
      <div className="mt-4">
        <SettingRow
          label="Profile"
          description="Update your name, email, and organization."
          right={
            <button
              type="button"
              disabled
              className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
            >
              Edit
            </button>
          }
        />
        <SettingRow
          label="Team"
          description="Invite teammates and manage roles."
          right={
            <button
              type="button"
              disabled
              className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
            >
              Manage
            </button>
          }
        />
      </div>
    </Card>
  );

  return demoMode ? <DisabledOverlay>{content}</DisabledOverlay> : content;
}

function BillingCard({ demoMode }: { demoMode: boolean }) {
  const content = (
    <Card className="border-slate-200 dark:border-slate-900">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Plans, usage, invoices, and payment methods.</CardDescription>
      </CardHeader>
      <div className="mt-4">
        <SettingRow
          label="Current Plan"
          description="Preview: Enterprise Plan"
          right={
            <button
              type="button"
              disabled
              className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
            >
              Change plan
            </button>
          }
        />
        <SettingRow
          label="Invoices"
          description="Download invoices and receipts."
          right={
            <button
              type="button"
              disabled
              className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
            >
              View
            </button>
          }
        />
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
            <div className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200">
              Enabled
            </div>
          }
        />
        <SettingRow
          label="Alert thresholds"
          description="Notify when visibility changes exceed thresholds."
          right={
            <button
              type="button"
              disabled
              className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
            >
              Configure
            </button>
          }
        />
      </div>
    </Card>
  );

  return demoMode ? <DisabledOverlay>{content}</DisabledOverlay> : content;
}

export function DashboardSettingsPage({ demoMode }: { demoMode: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Settings"
        description={
          demoMode
            ? "Demo mode is read-only. Customize appearance now; other settings are preview-only."
            : "Manage preferences, billing, and account configuration."
        }
      />

      {demoMode ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
          <span className="font-semibold text-blue-300">Demo Mode</span>{" "}
          <span className="text-slate-300">
            Settings shown here are a preview. Demo views display fictional brands and simulated data for illustrative purposes only.
          </span>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <AppearanceCard />
        <AccountCard demoMode={demoMode} />
        <BillingCard demoMode={demoMode} />
        <NotificationsCard demoMode={demoMode} />
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

