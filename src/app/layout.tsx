import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
/* import { SpeedInsights } from "@vercel/speed-insights/next" */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtVault - Online Art Gallery System",
  description: "Showcase, discover, and manage creative artworks and live workshops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-50`}>
        
        <Navbar />
        
        
        <main className="flex-grow">
          {children}
        </main>

        
        <Footer />
      </body>
    </html>
  );
}