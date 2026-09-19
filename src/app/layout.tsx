import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import AuthProvider from "@/components/providers/AuthProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import SessionExpiryProvider from "@/components/providers/SessionExpiryProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { LANGUAGE_INIT_SCRIPT } from "@/lib/i18n";
import { DEFAULT_LANGUAGE, LANGUAGE_DIRECTION } from "@/locales/config";

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
  title: "5digea",
  description: "Wedding Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      dir={LANGUAGE_DIRECTION[DEFAULT_LANGUAGE]}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved language to <html lang/dir> before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: LANGUAGE_INIT_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <AuthProvider>
            <LoadingProvider>
              <ToastProvider>
                <SessionExpiryProvider>{children}</SessionExpiryProvider>
              </ToastProvider>
            </LoadingProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}