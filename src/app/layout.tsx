import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
