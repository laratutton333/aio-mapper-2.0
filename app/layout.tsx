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
      <body>
        <div className="container">
          <header className="nav">
            <Link href="/">AIO Mapper</Link>
            <nav style={{ display: "flex", gap: 8 }}>
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
            </nav>
          </header>
          <main style={{ paddingTop: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}

