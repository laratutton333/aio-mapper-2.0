"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export function RunVisibilityForm() {
  const [brandName, setBrandName] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
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
        body: JSON.stringify({
          audit_id: null,
          brand_name: brandName,
          category: category.length ? category : null,
          model: null
        })
      });
      const json = (await res.json()) as {
        success: boolean;
        audit_id?: string;
        error?: string;
      };
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to run visibility check");
      }
      setMessage(json.audit_id ? `Run complete (audit_id: ${json.audit_id}).` : "Run complete.");
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
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="e.g. Acme"
          required
        />
      </label>
      <label className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-slate-700">Category</span>
        <input
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. online lottery"
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
