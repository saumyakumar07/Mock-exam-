import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { COMPANY_NAME, PLATFORM_NAME, TAGLINE } from "@/components/brand/BrandLogo";
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
  title: `CERTIFENCE — ${PLATFORM_NAME}`,
  description: `Timed cybersecurity and penetration-testing quizzes by ${COMPANY_NAME}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="border-t border-zinc-800/80 px-4 py-4 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} {COMPANY_NAME} · {TAGLINE}
        </footer>
      </body>
    </html>
  );
}
