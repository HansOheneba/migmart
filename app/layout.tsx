import type { Metadata } from "next";
import { Anek_Devanagari, Lato } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

const headingFont = Anek_Devanagari({
  variable: "--font-heading",
  weight: ["600", "700"],
  subsets: ["latin"],
});

const bodyFont = Lato({
  variable: "--font-body",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Migmart",
  description: "Premium grocery commerce and loyalty app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen font-body text-(--ink-900) antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
