import Link from "next/link";

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

            <form className="mt-8 space-y-5">
              <label className="block">
                <div className="text-xs font-semibold text-slate-200">Email</div>
                <div className="mt-2 relative">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="h-10 w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-600/60 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-400">
                    …
                  </div>
                </div>
              </label>

              <label className="block">
                <div className="text-xs font-semibold text-slate-200">Password</div>
                <div className="mt-2 relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-10 w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-600/60 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-400">
                    …
                  </div>
                </div>
              </label>

              <button
                type="button"
                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-500"
              >
                Sign in
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
          </div>
        </div>
      </div>
    </div>
  );
}
