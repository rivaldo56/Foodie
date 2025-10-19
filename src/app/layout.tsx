import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import AIChatbot from "@/components/AIChatbot";

// Use system fonts instead of Google Fonts to avoid network issues
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "ChefConnect - Book Personal Chefs in 3 Taps",
  description: "Connect with trusted freelance chefs for home meals, events, and personalized dining experiences. AI-powered recommendations in English and Swahili.",
  keywords: "chef booking, personal chef, home dining, event catering, food delivery, Kenya chefs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`} suppressHydrationWarning>
        <Providers>
          <main className="pb-16">{children}</main>
          <AIChatbot />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
