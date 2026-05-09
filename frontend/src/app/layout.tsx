import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SDE Hub — System Design Feed for Engineers",
  description: "Personalized system design, LLD, and HLD content curated for SDE-1, SDE-2, and SDE-3 engineers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full bg-white text-slate-900 antialiased`}>
        <Navbar />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
      </body>
    </html>
  );
}
