/**
 * Category icons come from the Phosphor set (light weight) served as SVG by
 * the Iconify API. The stored value is a plain image URL, so the backend
 * doesn't change and any image link keeps working too.
 */
export const ICON_SET = "ph";
export const ICON_WEIGHT = "light";
export const ICON_COLOR = "#a47e43"; // brand gold

export const iconifyUrl = (name: string, color = ICON_COLOR) =>
  `https://api.iconify.design/${ICON_SET}/${name}.svg?color=${encodeURIComponent(color)}`;

/** "ph:camera-bold" / "camera" -> "camera" (drops the weight suffix). */
export const baseIconName = (name: string) =>
  name.replace(/^[a-z0-9-]+:/, "").replace(/-(thin|light|bold|fill|duotone)$/, "");

export const styledIconName = (base: string) => `${base}-${ICON_WEIGHT}`;

/** Curated wedding icons, shown before any search. */
export const CURATED_ICONS = [
  "camera", "video-camera", "film-slate", "buildings", "church", "house",
  "bed", "confetti", "champagne", "diamond", "crown-simple", "dress",
  "t-shirt", "high-heel", "sneaker", "paint-brush", "palette", "sparkle",
  "scissors", "flower", "flower-lotus", "flower-tulip", "music-notes",
  "microphone-stage", "speaker-hifi", "car", "car-profile", "clipboard-text",
  "cake", "fork-knife", "cooking-pot", "wine", "gift", "envelope-simple",
  "airplane-tilt", "map-pin", "heart", "hand-heart", "hand", "star", "sun",
  "tent",
];

/** Category-name keywords (Arabic or English) -> best matching icons. */
const KEYWORD_ICONS: [RegExp, string[]][] = [
  [/photo|camera|تصوير|مصور/i, ["camera", "film-slate"]],
  [/video|film|فيديو/i, ["video-camera", "film-slate"]],
  [/hall|venue|hotel|resort|قاع|فندق|منتجع/i, ["buildings", "church", "bed"]],
  [/outdoor|beach|garden|مفتوح|بحر|حديق/i, ["sun", "tent", "flower-lotus"]],
  [/plan|organ|منظم|تنظيم/i, ["clipboard-text", "confetti"]],
  [/ring|jewel|engage|دبل|شبك|خاتم|مجوهر/i, ["diamond", "crown-simple"]],
  [/dress|bridal|gown|فستان|فساتين|عروس/i, ["dress", "crown-simple"]],
  [/suit|groom|بدل|عريس/i, ["t-shirt", "high-heel"]],
  [/makeup|beauty|hair|ميكب|مكياج|تجميل|شعر|كوافير/i, ["paint-brush", "palette", "sparkle", "scissors"]],
  [/decor|flower|ديكور|ورد|زهور|تنسيق/i, ["flower", "flower-tulip", "flower-lotus"]],
  [/dj|band|music|sing|zaffa|dance|موسيق|دي جي|فرق|زفة|رقص/i, ["music-notes", "microphone-stage", "speaker-hifi"]],
  [/cater|food|buffet|أكل|بوفيه|طعام/i, ["fork-knife", "cooking-pot", "wine"]],
  [/cake|dessert|تورت|حلو/i, ["cake"]],
  [/car|limo|عربي|سيار/i, ["car", "car-profile"]],
  [/invit|card|دعو|كروت/i, ["envelope-simple"]],
  [/gift|favor|هدي|هدايا|توزيع/i, ["gift"]],
  [/shoe|heel|أحذي|جزم/i, ["high-heel", "sneaker"]],
  [/henna|حن/i, ["hand", "hand-heart"]],
  [/honeymoon|travel|trip|عسل|سفر|رحل/i, ["airplane-tilt", "map-pin"]],
];

/** Icons that fit a category name, best first (may be empty). */
export function suggestIcons(...names: string[]): string[] {
  const text = names.join(" ");
  const out: string[] = [];
  KEYWORD_ICONS.forEach(([re, icons]) => {
    if (re.test(text)) icons.forEach((i) => !out.includes(i) && out.push(i));
  });
  return out;
}

/** Searches the icon set (English keywords). Returns base icon names. */
export async function searchIcons(query: string, signal?: AbortSignal): Promise<string[]> {
  const url = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&prefix=${ICON_SET}&limit=96`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Icon search failed (${res.status})`);
  const data = (await res.json()) as { icons?: string[] };
  return Array.from(new Set((data.icons ?? []).map(baseIconName)));
}

/** Base icon name of a stored URL if it is one of ours, else null. */
export function iconNameFromUrl(url: string | null | undefined): string | null {
  const m = (url ?? "").match(/api\.iconify\.design\/ph\/([a-z0-9-]+)\.svg/);
  return m ? baseIconName(m[1]) : null;
}
