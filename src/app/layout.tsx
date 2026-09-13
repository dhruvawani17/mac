import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brand My Mac — Let your brand travel",
  description: "24 sticker spots on a MacBook Air M5 from $25 to $240. Claim a spot and your logo travels to cafés, coworking spaces and every build-in-public video.",
  openGraph: {
    title: "Brand My Mac",
    description: "24 sticker spots from $25 to $240. Your logo travels with me.",
    url: "https://brandmymacbook.com",
    siteName: "Brand My Mac",
    locale: "en",
  },
  other: {
    "theme-color": "#ffffff",
    "color-scheme": "light",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
