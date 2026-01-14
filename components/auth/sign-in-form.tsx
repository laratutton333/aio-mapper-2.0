"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/components/ui/cn";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const nextPath = searchParams.get("next") ?? "/dashboard";

  React.useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(err);
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInError) throw signInError;

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={onSubmit}>
      <label className="block">
        <div className="text-xs font-semibold text-slate-200">Email</div>
        <div className="mt-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            required
            className="h-10 w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-600/60 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          />
        </div>
      </label>

      <label className="block">
        <div className="text-xs font-semibold text-slate-200">Password</div>
        <div className="mt-2">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="h-10 w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-600/60 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          />
        </div>
      </label>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <button
        disabled={isSubmitting}
        type="submit"
        className={cn(
          "mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-500",
          isSubmitting ? "cursor-not-allowed opacity-70" : ""
        )}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/account" className="text-blue-400 hover:text-blue-300">
          Sign up
        </Link>
      </p>

      <div className="pt-2 text-center text-sm text-slate-500">
        Or{" "}
        <Link href="/dashboard?demo=true" className="text-slate-300 hover:text-white">
          try the demo
        </Link>{" "}
        without signing in
      </div>
    </form>
  );
}
