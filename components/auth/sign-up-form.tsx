"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/components/ui/cn";

export function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
          data: {
            full_name: fullName.trim() || null,
            company: company.trim() || null
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setMessage("Check your email to confirm your account, then sign in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={onSubmit}>
      <label className="block">
        <div className="text-xs font-semibold text-slate-200">Full Name</div>
        <div className="mt-2">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            className="h-10 w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-600/60 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          />
        </div>
      </label>

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
        <div className="text-xs font-semibold text-slate-200">Company (optional)</div>
        <div className="mt-2">
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            type="text"
            placeholder="Acme Inc."
            autoComplete="organization"
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
            placeholder="Create a password"
            autoComplete="new-password"
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
      {message ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2 text-sm text-slate-200">
          {message}{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Sign in →
          </Link>
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
        {isSubmitting ? "Creating..." : "Create Account"}
      </button>

      <p className="text-center text-xs text-slate-400">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-slate-300 hover:text-white underline-offset-2 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-slate-300 hover:text-white underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:text-blue-300">
          Sign in
        </Link>
      </p>
    </form>
  );
}

