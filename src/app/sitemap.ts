import type { MetadataRoute } from "next";

import { fetchPublic } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

// Rebuild the sitemap at most once an hour.
export const revalidate = 3600;

type Paged<T> = { items?: T[]; totalPages?: number };
type IdItem = { id: string; updatedAt?: string | null; createdAt?: string | null };

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

async function collect(path: string): Promise<IdItem[]> {
  const all: IdItem[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await fetchPublic<Paged<IdItem>>(
      `${path}?page=${page}&pageSize=${PAGE_SIZE}`,
    );
    const items = data?.items ?? [];
    all.push(...items);
    if (!data || page >= (data.totalPages ?? 1) || items.length === 0) break;
  }
  return all;
}

const lastModified = (item: IdItem) => {
  const value = item.updatedAt || item.createdAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : undefined;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/vendors"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/become-a-vendor"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/support"), changeFrequency: "monthly", priority: 0.5 },
    ] as const
  ).map((route) => ({ ...route, lastModified: now }));

  const [services, vendors] = await Promise.all([
    collect("/api/Services/search"),
    collect("/api/Vendors/search"),
  ]);

  return [
    ...staticRoutes,
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.id}`),
      lastModified: lastModified(s),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...vendors.map((v) => ({
      url: absoluteUrl(`/vendors/${v.id}`),
      lastModified: lastModified(v),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
