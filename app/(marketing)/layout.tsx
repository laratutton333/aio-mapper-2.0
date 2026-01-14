import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" }
] as const;

function LogoMark() {
  return (
    <Image
      src="/brand/logos/logo-64.png"
      alt="AIO Mapper"
      width={28}
      height={28}
      className="h-7 w-7 rounded-md"
    />
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <header className="border-b border-slate-900/80 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <LogoMark />
            <span>AIO Mapper</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm text-slate-300">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="hidden hover:text-white sm:inline-flex">
              Log in
            </Link>
            <Link
              href="/pricing"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-slate-900/80 bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <LogoMark />
              <div className="text-sm font-semibold">AIO Mapper</div>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              Measure, explain, and improve how your brand appears across AI search and generative
              answers.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="text-sm font-semibold text-slate-200">Product</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-400">
              <Link href="/pricing" className="hover:text-slate-200">
                Pricing
              </Link>
              <Link href="/how-it-works" className="hover:text-slate-200">
                How it works
              </Link>
              <Link href="/dashboard?demo=true" className="hover:text-slate-200">
                Demo
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-sm font-semibold text-slate-200">Legal</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-400">
              <Link href="/terms" className="hover:text-slate-200">
                Terms of service
              </Link>
              <Link href="/privacy" className="hover:text-slate-200">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-sm font-semibold text-slate-200">Get Started</div>
            <p className="mt-3 text-sm text-slate-400">
              Start measuring your AI visibility today.
            </p>
            <div className="mt-4">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900/80">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} AIO Mapper. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="/how-it-works" className="hover:text-slate-300">
                How it works
              </Link>
              <Link href="/pricing" className="hover:text-slate-300">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
