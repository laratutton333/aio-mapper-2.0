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
      await new Promise((resolve) => setTimeout(resolve, 250));
      setMessage("TODO: wire this form to your existing audit/run backend.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onSubmit}>
      <label className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Brand name</span>
        <input
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="e.g. Acme"
          required
        />
      </label>
      <label className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Category</span>
        <input
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. online lottery"
        />
      </label>
      <Button disabled={isRunning} type="submit">
        {isRunning ? "Running…" : "Run"}
      </Button>
      {message ? <div className="text-sm text-slate-600 dark:text-slate-400">{message}</div> : null}
    </form>
  );
}

