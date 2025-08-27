import type { Metadata } from "next";
import { Geist, Geist_Mono, Funnel_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: { default: "Harsh Sharma", template: "%s | Harsh Sharma" },
  metadataBase: new URL("https://imharshsharma.com"),
  description: "Design Engineer",
  alternates: {
    canonical: "https://iharshsharma.com",
    languages: {
      "en-US": "https://iharshsharma.com/en-US",
      "de-DE": "https://iharshsharma.com/de-DE",
    },
  },
  openGraph: {
    title: "Harsh Sharma",
    description: "Design Engineer",
    url: "https://iharshsharma.com",
    siteName: "Harsh Sharma",
    images: [
      {
        url: "https://iharshsharma.com/api/og?title=Harsh Sharma&name=Harsh Sharma&role=Design Engineer",
        width: 1200,
        height: 630,
        alt: "Harsh Sharma - Design Engineer",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${funnelDisplay.variable} antialiased`}
      >
        <Toaster />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
