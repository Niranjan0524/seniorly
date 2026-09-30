import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { MobileNav } from "@/components/mobile-nav";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seniorly",
  description: "Searchable campus interview experiences",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink pb-20 font-sans text-paper md:pb-0">
        <SiteHeader />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
