import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "365 — A Daily Reflection",
    template: "%s · 365"
  },
  description: "A year of poems, essays, and art.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "365",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#f4f0e7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
