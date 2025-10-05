import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookReview - Discover and Share Amazing Books",
  description: "A modern book review platform where you can discover, review, and share your favorite books with the community.",
  keywords: ["books", "reviews", "reading", "community", "literature"],
  authors: [{ name: "BookReview Team" }],
  openGraph: {
    title: "BookReview - Discover and Share Amazing Books",
    description: "A modern book review platform where you can discover, review, and share your favorite books with the community.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookReview - Discover and Share Amazing Books",
    description: "A modern book review platform where you can discover, review, and share your favorite books with the community.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
