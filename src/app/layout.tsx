import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import AuthProvider from "@/components/providers/AuthProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ConfirmProvider } from "@/components/providers/ConfirmProvider";
import MuiThemeProvider from "@/components/providers/MuiThemeProvider";
import SessionExpiryProvider from "@/components/providers/SessionExpiryProvider";
import JsonLd from "@/components/seo/JsonLd";
import SkipLink from "@/components/layout/SkipLink";
import { LanguageProvider } from "@/context/LanguageContext";
import { LANGUAGE_INIT_SCRIPT } from "@/lib/i18n";
import {
  API_URL,
  BACKGROUND_COLOR,
  SITE_DESCRIPTION_AR,
  SITE_DESCRIPTION_EN,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE_AR,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { DEFAULT_LANGUAGE, LANGUAGE_DIRECTION } from "@/locales/config";

import "./globals.css";

/*
 * Cairo is self-hosted (no request to Google Fonts at build or run time).
 * Latin glyphs come from the first face and Arabic glyphs fall through to the
 * second one, so both scripts render in the same family.
 */
const cairoLatin = localFont({
  src: "./fonts/cairo-latin-wght-normal.woff2",
  variable: "--font-cairo-latin",
  weight: "200 1000",
  display: "swap",
  preload: true,
});

const cairoArabic = localFont({
  src: "./fonts/cairo-arabic-wght-normal.woff2",
  variable: "--font-cairo-arabic",
  weight: "200 1000",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_AR,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_AR,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Wedding services",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    title: SITE_TITLE_AR,
    description: SITE_DESCRIPTION_AR,
    images: [
      {
        url: absoluteUrl("/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_AR,
    description: SITE_DESCRIPTION_EN,
    images: [absoluteUrl("/og-image.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BACKGROUND_COLOR },
    { media: "(prefers-color-scheme: dark)", color: "#30251f" },
  ],
  colorScheme: "light",
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
      className={`${cairoLatin.variable} ${cairoArabic.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved language to <html lang/dir> before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: LANGUAGE_INIT_SCRIPT }} />
        <link rel="alternate" hrefLang="ar" href={SITE_URL} />
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="" />
        {API_URL && <link rel="preconnect" href={API_URL} crossOrigin="" />}
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <SkipLink />
          <MuiThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              <ToastProvider>
                <ConfirmProvider>
                  <SessionExpiryProvider>{children}</SessionExpiryProvider>
                </ConfirmProvider>
              </ToastProvider>
            </LoadingProvider>
          </AuthProvider>
          </MuiThemeProvider>
        </LanguageProvider>
        <noscript>
          <p style={{ padding: 16, textAlign: "center" }}>
            {SITE_DESCRIPTION_EN}
          </p>
        </noscript>
      </body>
    </html>
  );
}
