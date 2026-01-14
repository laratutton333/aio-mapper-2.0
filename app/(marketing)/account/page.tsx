import Link from "next/link";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Field({
  label,
  type,
  placeholder,
  autoComplete
}: {
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-slate-200">{label}</div>
      <div className="mt-2 relative">
        <input
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-10 w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-600/60 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
        />
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-400">
          …
        </div>
      </div>
    </label>
  );
}

export default function AccountPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-blue-600/12 blur-3xl" />
        <div className="absolute -top-10 left-1/2 h-[240px] w-[520px] -translate-x-1/2 rounded-full bg-slate-700/25 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Start Your AI Visibility Journey
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
            Join hundreds of brands already tracking their AI search presence.
          </p>

          <div className="mt-8 space-y-4 text-sm text-slate-200">
            {[
              "10 free credits to start",
              "No credit card required",
              "Full feature access",
              "Cancel anytime"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/15 text-blue-400">
                  <CheckIcon />
                </div>
                <div>{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-7 shadow-sm shadow-black/30">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
              <p className="mt-2 text-sm text-slate-300">
                Get 10 free credits to explore AI visibility
              </p>
            </div>

            <form className="mt-8 space-y-5">
              <Field label="Full Name" type="text" placeholder="John Doe" autoComplete="name" />
              <Field
                label="Email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
              />
              <Field
                label="Company (optional)"
                type="text"
                placeholder="Acme Inc."
                autoComplete="organization"
              />
              <Field
                label="Password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
              />

              <button
                type="button"
                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-500"
              >
                Create Account
              </button>

              <p className="text-center text-xs text-slate-400">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-slate-300 hover:text-white underline-offset-2 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-slate-300 hover:text-white underline-offset-2 hover:underline"
                >
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
          </div>
        </div>
      </div>
    </div>
  );
}

