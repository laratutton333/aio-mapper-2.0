import Link from "next/link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" }
] as const;

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <header className="border-b border-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            AIO Mapper
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} AIO Mapper</div>
          <div className="flex items-center gap-4">
            <Link href="/how-it-works" className="hover:text-slate-200">
              How it works
            </Link>
            <Link href="/pricing" className="hover:text-slate-200">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

