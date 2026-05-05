import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coderoom | Collaborative IDE",
  description: "A real-time collaborative code editor supporting JS and Python",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-[#0a0a0a] text-white selection:bg-blue-500/30">
        {children}
        
        {/* 
          Removed 'strategy="beforeInteractive"'. 
          This defaults to 'afterInteractive', fixing the React Hydration crash 
          and preventing Pyodide from blocking the UI load.
        */}
        <Script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" />
      </body>
    </html>
  );
}