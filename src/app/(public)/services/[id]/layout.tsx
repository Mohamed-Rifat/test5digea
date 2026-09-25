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
import type { Service } from "@/types/service";
import { bothLanguages, localizeText } from "@/lib/bilingual";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

const UUID = /^[0-9a-f-]{36}$/i;

/** null = unknown (API unreachable); "missing" = the API says 404. */
async function getService(id: string): Promise<Service | "missing" | null> {
  if (!UUID.test(id)) return "missing";
  const { data, status } = await fetchPublicWithStatus<Service>(`/api/Services/${id}`);
  if (status === 404) return "missing";
  return data;
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  if (service === "missing") notFound();

  if (!service) {
    return buildMetadata({
      title: "خدمة زفاف",
      titleEn: "Wedding Service",
      description:
        "تفاصيل خدمة الزفاف والأسعار والتقييمات على 5Digea. Wedding service details, prices and reviews on 5Digea.",
      path: `/services/${id}`,
    });
  }

  const prices = (service.prices ?? []).map((p) => p.price).filter(Number.isFinite);
  const from = prices.length ? Math.min(...prices) : null;
  const priceText = from !== null ? ` - تبدأ من ${from.toLocaleString("en-US")} ج.م` : "";

  return buildMetadata({
    title: `${service.name}${service.categoryName ? ` | ${localizeText(service.categoryName, "ar")}` : ""}`,
    titleEn: service.vendorBusinessName || undefined,
    description:
      toDescription(
        `${service.name} من ${service.vendorBusinessName}${priceText}. ${service.description ?? ""}`,
      ) || `${service.name} - ${SITE_NAME}`,
    path: `/services/${id}`,
    image: service.images?.[0]?.url ?? null,
    keywords: [service.name, ...bothLanguages(service.categoryName), service.vendorBusinessName].filter(
      Boolean,
    ) as string[],
  });
}

export default async function ServiceLayout({ params, children }: Props) {
  const { id } = await params;
  const result = await getService(id);

  // Unknown service: real 404 status + the site's not-found page.
  if (result === "missing") notFound();
  const service = result;

  const jsonLd = service
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": absoluteUrl(`/services/${id}#service`),
          name: service.name,
          description: toDescription(service.description, 500),
          serviceType: localizeText(service.categoryName, "ar") || undefined,
          url: absoluteUrl(`/services/${id}`),
          image: (service.images ?? []).map((img) => img.url).slice(0, 6),
          areaServed: { "@type": "Country", name: "Egypt" },
          provider: {
            "@type": "LocalBusiness",
            name: service.vendorBusinessName,
            url: absoluteUrl(`/vendors/${service.vendorId}`),
          },
          offers: (service.prices ?? []).map((p) => ({
            "@type": "Offer",
            name: p.label,
            price: p.price,
            priceCurrency: "EGP",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/services/${id}`),
          })),
        },
        breadcrumbJsonLd([
          { name: SITE_NAME, path: "/" },
          { name: "الخدمات", path: "/services" },
          { name: service.name, path: `/services/${id}` },
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
