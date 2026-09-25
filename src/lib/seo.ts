import type { Metadata } from "next";

import {
  API_URL,
  SITE_DESCRIPTION_AR,
  SITE_DESCRIPTION_EN,
  SITE_LOGO,
  SITE_NAME,
  SITE_NAME_AR,
  SITE_URL,
  SOCIAL_LINKS,
  absoluteUrl,
} from "@/lib/site";

/* ------------------------------------------------------------------------ */
/* Metadata helpers                                                          */
/* ------------------------------------------------------------------------ */

interface PageSeo {
  /** Arabic title (primary language). English is appended for bilingual SEO. */
  title: string;
  titleEn?: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string | null;
  /** Private / transactional pages are kept out of search engines. */
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
}

/** Builds consistent, bilingual metadata for a route segment. */
export function buildMetadata({
  title,
  titleEn,
  description,
  path,
  keywords,
  image,
  noIndex,
  type = "website",
}: PageSeo): Metadata {
  const fullTitle = titleEn ? `${title} | ${titleEn}` : title;
  const images = [
    {
      url: image || absoluteUrl("/og-image.jpg"),
      width: image ? undefined : 1200,
      height: image ? undefined : 630,
      alt: fullTitle,
    },
  ];

  return {
    // Absolute so nested layouts always end with the brand name.
    title: { absolute: `${fullTitle} | ${SITE_NAME}` },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: absoluteUrl(path),
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      locale: "ar_EG",
      alternateLocale: ["en_US"],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

/** Metadata for dashboards, auth flows and other private pages. */
export const privateMetadata = (title: string): Metadata => ({
  title,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
});

/** Trims and shortens free text to a meta-description friendly length. */
export function toDescription(text: string | null | undefined, max = 160) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/* ------------------------------------------------------------------------ */
/* Server-side data fetching for SEO (never throws)                          */
/* ------------------------------------------------------------------------ */

/**
 * Fetches public API data from the server for metadata / sitemap / JSON-LD.
 * Returns null on any failure so SEO never breaks page rendering.
 */
export async function fetchPublicWithStatus<T>(
  path: string,
  revalidate = 3600,
): Promise<{ data: T | null; status: number }> {
  if (!API_URL) return { data: null, status: 0 };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate },
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);
    if (!res.ok) return { data: null, status: res.status };
    return { data: (await res.json()) as T, status: res.status };
  } catch {
    return { data: null, status: 0 };
  }
}

export async function fetchPublic<T>(
  path: string,
  revalidate = 3600,
): Promise<T | null> {
  return (await fetchPublicWithStatus<T>(path, revalidate)).data;
}

/* ------------------------------------------------------------------------ */
/* JSON-LD builders (schema.org) - used for SEO and GEO (AI answer engines)   */
/* ------------------------------------------------------------------------ */

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: [SITE_NAME_AR, "5digea", "Digea"],
  url: SITE_URL,
  logo: absoluteUrl(SITE_LOGO),
  description: SITE_DESCRIPTION_EN,
  email: "hello@5digea.com",
  telephone: "+201222800121",
  areaServed: { "@type": "Country", name: "Egypt" },
  knowsLanguage: ["ar", "en"],
  sameAs: Object.values(SOCIAL_LINKS).filter(Boolean),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@5digea.com",
      telephone: "+201222800121",
      availableLanguage: ["Arabic", "English"],
      areaServed: "EG",
    },
  ],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: SITE_NAME_AR,
  url: SITE_URL,
  description: SITE_DESCRIPTION_AR,
  inLanguage: ["ar", "en"],
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/services?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export { SITE_DESCRIPTION_AR, SITE_DESCRIPTION_EN };
