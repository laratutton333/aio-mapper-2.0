"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export function RunVisibilityForm() {
  const [brand, setBrand] = React.useState<string>("");
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsRunning(true);
    setMessage(null);

    try {
      const res = await fetch("/api/ai/run-visibility", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ brand, auditId: null, model: null })
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to run visibility check");
      }
      setMessage("Run complete. Refresh to see updated data.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onSubmit}>
      <label className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-slate-700">Brand name</span>
        <input
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g. Acme"
          required
        />
      </label>
      <Button disabled={isRunning} type="submit">
        {isRunning ? "Running…" : "Run"}
      </Button>
      {message ? (
        <div className="text-sm text-slate-600 sm:ml-2 sm:self-center">
          {message}
        </div>
      ) : null}
    </form>
  );
}
