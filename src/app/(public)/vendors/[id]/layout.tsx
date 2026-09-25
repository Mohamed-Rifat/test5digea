import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  fetchPublicWithStatus,
  toDescription,
} from "@/lib/seo";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { normalizeVendor } from "@/lib/vendor-normalizer";
import type { Vendor, VendorApiResponse } from "@/types/vendor";
import { bothLanguages, localizeText } from "@/lib/bilingual";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

const UUID = /^[0-9a-f-]{36}$/i;

/** null = unknown (API unreachable); "missing" = the API says 404. */
async function getVendor(id: string): Promise<Vendor | "missing" | null> {
  if (!UUID.test(id)) return "missing";
  const { data: raw, status } = await fetchPublicWithStatus<VendorApiResponse>(
    `/api/Vendors/${id}`,
  );
  if (status === 404) return "missing";
  if (!raw) return null;
  try {
    return normalizeVendor(raw);
  } catch {
    return null;
  }
}

/** Extracts http(s) profile links from the vendor's socialLinksJson. */
function socialLinks(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    const values =
      parsed && typeof parsed === "object" ? Object.values(parsed as Record<string, unknown>) : [];
    return values.filter(
      (v): v is string => typeof v === "string" && /^https?:\/\//i.test(v),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { id } = await params;
  const vendor = await getVendor(id);

  if (vendor === "missing") notFound();

  if (!vendor) {
    return buildMetadata({
      title: "مقدم خدمة أفراح",
      titleEn: "Wedding Vendor",
      description:
        "صفحة مقدم خدمة الأفراح على 5Digea: الصور والخدمات والتقييمات. Wedding vendor profile on 5Digea.",
      path: `/vendors/${id}`,
    });
  }

  const categories = vendor.categories?.map((c) => localizeText(c, "ar")).join("، ");
  const where = vendor.location ? ` في ${vendor.location}` : "";

  return buildMetadata({
    title: `${vendor.businessName}${categories ? ` | ${categories}` : ""}`,
    description:
      toDescription(
        `${vendor.businessName}${where}${vendor.slogan ? ` - ${vendor.slogan}` : ""}. ${vendor.bio ?? ""}`,
      ) || `${vendor.businessName} - ${SITE_NAME}`,
    path: `/vendors/${id}`,
    image: vendor.profileImageUrl || null,
    type: "profile",
    keywords: [vendor.businessName, ...(vendor.categories ?? []).flatMap(bothLanguages), vendor.location].filter(
      Boolean,
    ) as string[],
  });
}

export default async function VendorLayout({ params, children }: Props) {
  const { id } = await params;
  const result = await getVendor(id);

  // Unknown vendor: real 404 status + the site's not-found page.
  if (result === "missing") notFound();
  const vendor = result;

  const jsonLd = vendor
    ? [
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": absoluteUrl(`/vendors/${id}#business`),
          name: vendor.businessName,
          slogan: vendor.slogan || undefined,
          description: toDescription(vendor.bio, 500) || undefined,
          url: absoluteUrl(`/vendors/${id}`),
          image: vendor.profileImageUrl || undefined,
          telephone: vendor.contactPhone || undefined,
          email: vendor.contactEmail || undefined,
          address: vendor.location
            ? {
                "@type": "PostalAddress",
                addressLocality: vendor.location,
                addressCountry: "EG",
              }
            : undefined,
          geo:
            vendor.latitude && vendor.longitude
              ? {
                  "@type": "GeoCoordinates",
                  latitude: vendor.latitude,
                  longitude: vendor.longitude,
                }
              : undefined,
          sameAs: socialLinks(vendor.socialLinksJson),
          knowsAbout: (vendor.categories ?? []).flatMap(bothLanguages),
          aggregateRating:
            vendor.reviewsCount > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: Number(vendor.averageRating.toFixed(1)),
                  reviewCount: vendor.reviewsCount,
                  bestRating: 5,
                  worstRating: 1,
                }
              : undefined,
        },
        breadcrumbJsonLd([
          { name: SITE_NAME, path: "/" },
          { name: "مقدمي الخدمات", path: "/vendors" },
          { name: vendor.businessName, path: `/vendors/${id}` },
        ]),
      ]
    : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      {children}
    </>
  );
}
