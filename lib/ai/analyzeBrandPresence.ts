import type { BrandPresenceResult } from "@/types/ai";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function generateVariants(brandName: string): string[] {
  const base = normalize(brandName);
  const stripped = base.replace(/[^a-z0-9]+/g, " ").trim();
  const noSpaces = stripped.replace(/\s+/g, "");
  const withoutSuffix = stripped
    .replace(/\b(inc|inc\.|ltd|ltd\.|llc|corp|corp\.|co|co\.|company)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const variants = [base, stripped, noSpaces, withoutSuffix].filter(Boolean);
  return Array.from(new Set(variants));
}

function findEarliestMatch(text: string, variants: string[]) {
  let earliestIndex: number | null = null;
  let matchedVariant: string | null = null;

  for (const variant of variants) {
    const pattern = new RegExp(`\\b${escapeRegExp(variant)}\\b`, "i");
    const match = pattern.exec(text);
    if (!match || match.index === undefined) continue;

    const index = match.index;
    if (earliestIndex === null || index < earliestIndex) {
      earliestIndex = index;
      matchedVariant = variant;
    }
  }

  return { earliestIndex, matchedVariant };
}

export function extractUrls(text: string): string[] {
  const matches = text.match(/\bhttps?:\/\/[^\s)>\]]+/gi) ?? [];
  return Array.from(new Set(matches.map((u) => u.replace(/[.,;:]+$/, ""))));
}

function isPrimaryMention(text: string, brandName: string) {
  const escaped = escapeRegExp(brandName.trim());
  const inFirstChars = new RegExp(`\\b${escaped}\\b`, "i").test(text.slice(0, 250));
  const firstListItem = new RegExp(
    `(^|\\n)\\s*(1\\.|-|\\*)\\s+[^\\n]*\\b${escaped}\\b`,
    "i"
  ).test(text);

  return inFirstChars || firstListItem;
}

function hasCitationNearIndex(text: string, index: number, urls: string[]) {
  if (urls.length === 0) return false;
  const windowText = text.slice(Math.max(0, index - 100), index + 250);
  return /\bhttps?:\/\/[^\s)>\]]+/i.test(windowText);
}

export function analyzeBrandPresence(args: {
  responseText: string;
  brandName: string;
  citations?: string[];
}): { result: BrandPresenceResult; extractedUrls: string[] } {
  const responseText = args.responseText ?? "";
  const brandName = args.brandName ?? "";

  const variants = generateVariants(brandName);
  const { earliestIndex, matchedVariant } = findEarliestMatch(responseText, variants);
  const extractedUrls = extractUrls(responseText);
  const citations = (args.citations ?? []).filter(Boolean);

  const brandDetected = earliestIndex !== null;
  const exactMatched = normalize(brandName) === normalize(matchedVariant ?? "");

  let mentionType: BrandPresenceResult["mentionType"] = "none";
  if (!brandDetected) {
    mentionType = "none";
  } else if (!exactMatched) {
    mentionType = "implied";
  } else if (isPrimaryMention(responseText, brandName)) {
    mentionType = "primary";
  } else {
    mentionType = "secondary";
  }

  const citationPresent =
    brandDetected &&
    (citations.length > 0 ||
      (earliestIndex !== null && hasCitationNearIndex(responseText, earliestIndex, extractedUrls)));

  const confidence: number | null =
    mentionType === "none"
      ? null
      : mentionType === "primary"
        ? 0.9
        : mentionType === "secondary"
          ? 0.75
          : 0.6;

  return {
    extractedUrls,
    result: {
      brandDetected,
      mentionType,
      citationPresent,
      confidence
    }
  };
}

