export type SourceType =
  | "brand_owned"
  | "wikipedia"
  | "government"
  | "publisher"
  | "unknown";

export function getDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function classifySourceType(args: { url: string; brandName: string | null }): SourceType {
  const domain = getDomain(args.url);
  if (!domain) return "unknown";

  if (domain === "wikipedia.org" || domain.endsWith(".wikipedia.org")) return "wikipedia";
  if (domain.endsWith(".gov") || domain.includes(".gov.")) return "government";
  if (domain === "canada.ca" || domain.endsWith(".gc.ca")) return "government";

  const brand = args.brandName ? normalizeToken(args.brandName) : "";
  if (brand.length >= 4 && domain.includes(brand)) return "brand_owned";

  return "publisher";
}

export function authorityScoreForType(type: SourceType): number {
  switch (type) {
    case "government":
      return 0.95;
    case "wikipedia":
      return 0.95;
    case "brand_owned":
      return 0.85;
    case "publisher":
      return 0.75;
    case "unknown":
      return 0.6;
  }
}

