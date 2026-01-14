import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AIO Mapper",
    template: "%s · AIO Mapper"
  },
  description: "Measure, explain, and improve how your brand appears across AI search and answers.",
  icons: {
    icon: [
      { url: "/brand/logos/logo-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/logos/logo-64.png", sizes: "64x64", type: "image/png" },
      { url: "/brand/logos/logo-128.png", sizes: "128x128", type: "image/png" }
    ],
    apple: [{ url: "/brand/logos/logo-256.png", sizes: "256x256", type: "image/png" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
