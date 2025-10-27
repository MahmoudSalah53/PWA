import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UpdateNotification from "../components/UpdateNotification";
import { useEffect } from "react";
import InstallPWA from "../components/InstallPWA";
import PWAWelcomeModal from "../components/PWAWelcomeModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TSTCommerce - Your Trusted Online Store",
  description:
    "Shop for quality products with fast shipping and excellent customer service",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TSTCommerce",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TSTCommerce",
    title: "TSTCommerce - Your Trusted Online Store",
    description:
      "Shop for quality products with fast shipping and excellent customer service",
  },
  twitter: {
    card: "summary_large_image",
    title: "TSTCommerce - Your Trusted Online Store",
    description:
      "Shop for quality products with fast shipping and excellent customer service",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport = {
  viewport: { width: "device-width", initialScale: 1 },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <InstallPWA />
        <UpdateNotification />
      </body>
    </html>
  );
}
