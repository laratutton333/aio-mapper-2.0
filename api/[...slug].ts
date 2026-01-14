import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { setCorsHeaders } from "./_cors";
import {
  computeRecommendationStats,
  getCitationsData,
  getComparisonData,
  getDashboardData,
  getPromptRunDetail,
  getPromptRunsData,
  getPromptsData,
  getRecommendationsData,
  getStripeProducts,
  getStripePublishableKey,
  getStripeSubscription,
} from "./lib/demo-data";

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY ||
    "",
  baseURL:
    process.env.OPENAI_BASE_URL ||
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ||
    "https://api.openai.com/v1",
});

function extractDomain(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

type SourceType =
  | "publisher"
  | "brand_owned"
  | "competitor"
  | "government"
  | "wikipedia"
  | "social"
  | "unknown";

function getSourceType(
  domain: string,
  brandDomain?: string,
  competitorDomains?: string[],
): SourceType {
  if (brandDomain && domain.includes(brandDomain.replace(/^www\./, ""))) {
    return "brand_owned";
  }
  if (
    competitorDomains?.some((cd) =>
      domain.includes(cd.replace(/^www\./, "")),
    )
  ) {
    return "competitor";
  }
  if (domain.endsWith(".gov")) return "government";
  if (domain.includes("wikipedia.org")) return "wikipedia";
  if (
    [
      "twitter.com",
      "linkedin.com",
      "facebook.com",
      "reddit.com",
    ].some((handle) => domain.includes(handle))
  ) {
    return "social";
  }
  if (
    ["gartner.com", "forrester.com", "g2.com", "capterra.com", "techcrunch.com"].some(
      (publisher) => domain.includes(publisher),
    )
  ) {
    return "publisher";
  }
  return "unknown";
}

function getAuthorityScore(domain: string) {
  const authorityLookup: Record<string, number> = {
    "gartner.com": 0.95,
    "forrester.com": 0.93,
    "g2.com": 0.85,
    "capterra.com": 0.82,
    "wikipedia.org": 0.75,
    "techcrunch.com": 0.8,
  };
  for (const [key, score] of Object.entries(authorityLookup)) {
    if (domain.includes(key)) return score;
  }
  if (domain.endsWith(".gov")) return 0.9;
  if (domain.endsWith(".edu")) return 0.85;
  if (domain.endsWith(".org")) return 0.75;
  return 0.5;
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface BrandMention {
  brandName: string;
  matchType: "primary" | "secondary" | "implied" | "none";
  mentionPosition: number;
  confidence: number;
  context: string;
  isTargetBrand: boolean;
  isCited: boolean;
}

function detectBrandMentions(
  text: string,
  targetBrand: string,
  brandVariants: string[],
  competitorBrands: string[],
) {
  const mentions: BrandMention[] = [];
  const allBrandTerms = [targetBrand, ...brandVariants];
  let position = 1;

  for (const term of allBrandTerms) {
    const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, "gi");
    let match;

    while ((match = regex.exec(text)) !== null) {
      const contextStart = Math.max(0, match.index - 50);
      const contextEnd = Math.min(text.length, match.index + term.length + 50);
      const context = text.slice(contextStart, contextEnd);
      const contextLower = context.toLowerCase();

      const recommendationIndicators = [
        "recommend",
        "best",
        "top",
        "leading",
        "excellent",
      ];
      const hasRecommendation = recommendationIndicators.some((indicator) =>
        contextLower.includes(indicator),
      );

      let matchType: BrandMention["matchType"] = position <= 3 || hasRecommendation
        ? "primary"
        : "secondary";
      let confidence = 0.7 + (hasRecommendation ? 0.15 : 0) + (position === 1 ? 0.1 : 0);

      mentions.push({
        brandName: term,
        matchType,
        mentionPosition: position++,
        confidence: Math.min(confidence, 0.98),
        context,
        isTargetBrand: true,
        isCited: false,
      });
    }
  }

  for (const competitor of competitorBrands) {
    const regex = new RegExp(`\\b${escapeRegex(competitor)}\\b`, "gi");
    let match;

    while ((match = regex.exec(text)) !== null) {
      const contextStart = Math.max(0, match.index - 50);
      const contextEnd = Math.min(text.length, match.index + competitor.length + 50);
      const context = text.slice(contextStart, contextEnd);

      mentions.push({
        brandName: competitor,
        matchType: "secondary",
        mentionPosition: position++,
        confidence: 0.85,
        context,
        isTargetBrand: false,
        isCited: false,
      });
    }
  }

  return mentions;
}

interface ExtractedCitation {
  sourceUrl: string;
  sourceType: SourceType;
  sourceDomain: string;
  authorityScore: number;
}

function extractCitations(
  text: string,
  brandDomain?: string,
  competitorDomains?: string[],
) {
  const urlRegex = /https?:\/\/[^\s\)"\]]+/gi;
  const matches = text.match(urlRegex) || [];
  const uniqueUrls = [...new Set(matches)];

  return uniqueUrls.map((url) => {
    const cleanUrl = url.replace(/[.,;:]+$/, "");
    const domain = extractDomain(cleanUrl);
    return {
      sourceUrl: cleanUrl,
      sourceType: getSourceType(domain, brandDomain, competitorDomains),
      sourceDomain: domain,
      authorityScore: getAuthorityScore(domain),
    };
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const slugParam = req.query.slug;
  const slug = Array.isArray(slugParam)
    ? slugParam
    : typeof slugParam === "string"
    ? slugParam.split("/").filter(Boolean)
    : undefined;
  const [route, id] = slug || [];

  switch (route) {
    case "dashboard": {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }
      const data = getDashboardData();
      return res.status(200).json(data);
    }
    case "comparison": {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }
      const data = getComparisonData();
      return res.status(200).json(data);
    }
    case "citations": {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }
      const data = getCitationsData();
      return res.status(200).json(data);
    }
    case "prompts": {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }
      const data = getPromptsData();
      return res.status(200).json(data);
    }
    case "prompt-runs": {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }
      const runId =
        (typeof req.query.id === "string" ? req.query.id : undefined) || id;
      if (runId) {
        const detail = getPromptRunDetail(runId);
        if (!detail) {
          return res.status(404).json({ error: "Prompt run not found" });
        }
        return res.status(200).json(detail);
      }
      const data = getPromptRunsData();
      return res.status(200).json(data);
    }
    case "recommendations": {
      if (req.method === "GET") {
        const recommendations = getRecommendationsData();
        const stats = computeRecommendationStats(recommendations);
        return res.status(200).json({ recommendations, stats });
      }
      if (req.method === "PATCH") {
        if (!id) {
          return res.status(400).json({ error: "Recommendation ID is required" });
        }

        const payload =
          typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        const { status } = payload || {};

        const recommendations = getRecommendationsData();
        const recommendation = recommendations.find((rec) => rec.id === id);

        if (!recommendation) {
          return res.status(404).json({ error: "Recommendation not found" });
        }

        if (status) {
          recommendation.status = status;
        }

        const stats = computeRecommendationStats(recommendations);
        return res.status(200).json({ recommendation, stats });
      }
      return res.status(405).json({ error: "Method not allowed" });
    }
    case "analyze-prompt": {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const apiKey =
        process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
      if (!apiKey && !openai.configuration.apiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      try {
        const {
          promptText,
          targetBrand = "Acme Corp",
          brandVariants = ["Acme", "Acme Corporation"],
          competitorBrands = ["TechCo", "InnovateLabs", "NextGen Solutions"],
          brandDomain = "acmecorp.com",
          competitorDomains = ["techco.com", "innovatelabs.io", "nextgen.com"],
          model = "gpt-4o-mini",
        } = req.body;

        if (!promptText) {
          return res.status(400).json({ error: "promptText is required" });
        }

        const response = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant helping users find information about software and technology products. Provide helpful, accurate responses. When mentioning products or companies, include relevant details about their features, pricing, and market position. If you reference external sources, include URLs when available.",
            },
            {
              role: "user",
              content: promptText,
            },
          ],
          max_tokens: 2048,
          temperature: 0.7,
        });

        const rawAnswer = response.choices[0]?.message?.content || "";
        const citations = extractCitations(rawAnswer, brandDomain, competitorDomains);
        const rawMentions = detectBrandMentions(
          rawAnswer,
          targetBrand,
          brandVariants,
          competitorBrands,
        );

        const hasBrandCitation = citations.some(
          (citation) => citation.sourceType === "brand_owned",
        );
        const hasCompetitorCitation = (domain: string) =>
          citations.some((citation) =>
            citation.sourceDomain.includes(domain.replace(/^www\./, "")),
          );

        const mentions = rawMentions.map((mention) => {
          if (mention.isTargetBrand) {
            return { ...mention, isCited: hasBrandCitation };
          }
          const compDomain = competitorDomains?.find((domain) =>
            mention.brandName.toLowerCase().includes(domain.split(".")[0].toLowerCase()),
          );
          return {
            ...mention,
            isCited: compDomain ? hasCompetitorCitation(compDomain) : false,
          };
        });

        const targetMentions = mentions.filter((mention) => mention.isTargetBrand);
        const primaryMentions = targetMentions.filter(
          (mention) => mention.matchType === "primary",
        );

        const metrics = {
          presenceRate: targetMentions.length > 0 ? 1 : 0,
          recommendationRate:
            primaryMentions.length > 0
              ? primaryMentions.length / Math.max(targetMentions.length, 1)
              : 0,
          citationRate:
            citations.length > 0
              ? citations.filter((citation) => citation.sourceType === "brand_owned")
                .length / citations.length
              : 0,
          authorityDiversity:
            citations.length > 0
              ? new Set(citations.map((citation) => citation.sourceType)).size / 6
              : 0,
          compositeScore: 0,
        };

        metrics.compositeScore =
          metrics.presenceRate * 0.3 +
          metrics.recommendationRate * 0.3 +
          metrics.citationRate * 0.2 +
          metrics.authorityDiversity * 0.2;

        const tokenUsage = {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        };

        return res.status(200).json({
          success: true,
          rawAnswer,
          mentions,
          citations,
          metrics,
          tokenUsage,
        });
      } catch (error: any) {
        console.error("Analyze prompt error:", error);
        return res.status(500).json({
          error: "Failed to analyze prompt",
          message: error?.message || "Unknown error",
        });
      }
    }
    case "stripe": {
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const action = (req.query.action as string) || "products";

      switch (action) {
        case "products":
        default:
          return res.status(200).json({ data: getStripeProducts() });
        case "subscription":
          return res.status(200).json({ subscription: getStripeSubscription() });
        case "publishable-key":
          return res.status(200).json({ publishableKey: getStripePublishableKey() });
      }
    }
    default:
      return res.status(404).json({ error: "Route not found" });
  }
}
