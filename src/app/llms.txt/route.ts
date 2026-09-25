import { SITE_URL } from "@/lib/site";

// llms.txt - a plain-language summary of the site for AI answer engines (GEO).
export const dynamic = "force-static";

export function GET() {
  const body = `# 5Digea

> 5Digea (فايف ديجيا) is an Egyptian wedding-planning marketplace. Couples discover, compare and save trusted wedding vendors and services — venues and halls, photographers, makeup artists, bridal dresses, men's suits, decoration, DJs and bands, luxury cars, honeymoon packages and more — read moderated reviews, and follow a personal wedding roadmap with a countdown to the wedding day. The site is bilingual (Arabic first, English) and serves all of Egypt.

## Key facts

- Audience: engaged couples in Egypt planning a wedding or engagement, and wedding businesses (vendors) who want to reach them.
- Free for couples: accounts, browsing, favorites, comparison and the wedding roadmap cost nothing.
- Vendors apply through "Become a vendor"; every vendor profile, service, photo and review is checked by the 5Digea moderation team before it is published.
- Reviews can only be written by signed-in couples for services linked to their wedding roadmap.
- Prices are shown in Egyptian pounds (EGP) per package, as set by each vendor.
- Languages: Arabic (default, right-to-left) and English.
- Contact: hello@5digea.com · +20 122 280 0121

## Main pages

- [Home](${SITE_URL}/): overview, featured categories, services and vendors.
- [Wedding services](${SITE_URL}/services): search and filter every approved service by category, price and rating; each service page lists its packages, prices, photos and reviews.
- [Wedding vendors](${SITE_URL}/vendors): directory of approved vendors with location, categories, rating and contact details.
- [Become a vendor](${SITE_URL}/become-a-vendor): how wedding businesses join 5Digea.
- [Help center & FAQ](${SITE_URL}/support): answers to common questions for couples and vendors.
- [About](${SITE_URL}/about): the story and mission of 5Digea.
- [Contact](${SITE_URL}/contact): contact form and support details.

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml): every public service and vendor page.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
