import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pills — The Minority Mints",
  description:
    "10,000 NFTs. $0.20 each. 10-second rounds. Every round, choose Red or Blue. The side with fewer people gets to mint.",
  openGraph: {
    title: "Pills — The Minority Mints",
    description: "Every 10 seconds, choose Red or Blue. The minority mints.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pills",
    description: "Every 10 seconds, choose Red or Blue. The minority mints.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative">{children}</body>
    </html>
  );
}
