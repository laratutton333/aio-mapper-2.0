import { SignInForm } from "@/components/auth/sign-in-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-blue-600/12 blur-3xl" />
        <div className="absolute -top-10 left-1/2 h-[240px] w-[520px] -translate-x-1/2 rounded-full bg-slate-700/25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7 shadow-sm shadow-black/30">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-600/20">
                AI
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-slate-300">Sign in to your account to continue</p>
            </div>

            <Suspense
              fallback={
                <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2 text-sm text-slate-200">
                  Loading…
                </div>
              }
            >
              <SignInForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
