/**
 * Central, server-safe site configuration used by SEO metadata, the sitemap,
 * robots.txt, the web manifest and JSON-LD structured data.
 *
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://5digea.com) so every
 * canonical URL, Open Graph URL and sitemap entry points at the real domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://test5digea.vercel.app"
).replace(/\/+$/, "");

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
  /\/+$/,
  "",
);

export const SITE_NAME = "5Digea";
export const SITE_NAME_AR = "فايف ديجيا";

export const SITE_TITLE_AR =
  "5Digea | منصة تخطيط الأفراح ومقدمي خدمات الزفاف في مصر";
export const SITE_TITLE_EN =
  "5Digea | Wedding Planning & Wedding Vendors Platform in Egypt";

export const SITE_DESCRIPTION_AR =
  "5Digea منصة متكاملة لتخطيط الفرح: اكتشف أفضل قاعات الأفراح والمصورين وخبراء المكياج وفساتين الزفاف ومنظمي الحفلات، قارن الأسعار والتقييمات، واحفظ المفضلة، وتابع خطة فرحك خطوة بخطوة.";
export const SITE_DESCRIPTION_EN =
  "5Digea is an all-in-one wedding planning platform. Discover and compare wedding venues, photographers, makeup artists, bridal dresses and planners, read real reviews, save favorites and follow a personalised wedding roadmap.";

/** Bilingual description used where a single string is required. */
export const SITE_DESCRIPTION = `${SITE_DESCRIPTION_AR} ${SITE_DESCRIPTION_EN}`;

export const SITE_KEYWORDS = [
  "5Digea",
  "تخطيط الفرح",
  "تجهيزات الفرح",
  "قاعات أفراح",
  "مصور أفراح",
  "ميكب أرتست",
  "فساتين زفاف",
  "منظم حفلات زفاف",
  "خدمات الزفاف مصر",
  "wedding planning Egypt",
  "wedding vendors",
  "wedding venues",
  "wedding photographers",
  "bridal makeup",
  "wedding dresses",
  "wedding planner",
];

export const SITE_LOGO = "/Logo.png";
export const THEME_COLOR = "#a47e43";
export const BACKGROUND_COLOR = "#faf8f6";

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Official social profiles. Set the env vars to show the icons in the footer
 * and to add them to the Organization structured data (sameAs).
 */
export const SOCIAL_LINKS = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
};
