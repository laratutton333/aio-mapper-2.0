import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AIO Mapper",
    template: "%s · AIO Mapper"
  },
  description: "SaaS dashboard starter using Next.js App Router."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-slate-900 antialiased">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-4">
            <Link className="text-sm font-semibold tracking-tight" href="/">
              AIO Mapper
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/prompts"
              >
                Prompts
              </Link>
              <Link
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/recommendations"
              >
                Recommendations
              </Link>
            </nav>
          </header>
          <main className="pt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
