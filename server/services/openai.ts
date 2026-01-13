import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export interface PromptAnalysisResult {
  rawAnswer: string;
  mentions: BrandMention[];
  citations: ExtractedCitation[];
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface BrandMention {
  brandName: string;
  matchType: "primary" | "secondary" | "implied" | "none";
  mentionPosition: number;
  confidence: number;
  context: string;
  isTargetBrand: boolean;
  isCited: boolean;
}

export interface ExtractedCitation {
  sourceUrl: string;
  sourceType: "publisher" | "brand_owned" | "competitor" | "government" | "wikipedia" | "social" | "unknown";
  sourceDomain: string;
  authorityScore: number;
}

const AUTHORITY_SCORES: Record<string, number> = {
  "gartner.com": 0.95,
  "forrester.com": 0.93,
  "g2.com": 0.85,
  "capterra.com": 0.82,
  "wikipedia.org": 0.75,
  "techcrunch.com": 0.80,
  "linkedin.com": 0.70,
  "twitter.com": 0.60,
  "reddit.com": 0.55,
};

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getSourceType(domain: string, brandDomain?: string, competitorDomains?: string[]): ExtractedCitation["sourceType"] {
  if (brandDomain && domain.includes(brandDomain.replace(/^www\./, ""))) {
    return "brand_owned";
  }
  if (competitorDomains?.some(cd => domain.includes(cd.replace(/^www\./, "")))) {
    return "competitor";
  }
  if (domain.endsWith(".gov") || domain.includes("government")) {
    return "government";
  }
  if (domain.includes("wikipedia.org")) {
    return "wikipedia";
  }
  if (["twitter.com", "linkedin.com", "facebook.com", "reddit.com"].some(s => domain.includes(s))) {
    return "social";
  }
  if (["gartner.com", "forrester.com", "g2.com", "capterra.com", "techcrunch.com", "wired.com", "forbes.com"].some(s => domain.includes(s))) {
    return "publisher";
  }
  return "unknown";
}

function getAuthorityScore(domain: string): number {
  for (const [key, score] of Object.entries(AUTHORITY_SCORES)) {
    if (domain.includes(key)) {
      return score;
    }
  }
  if (domain.endsWith(".gov")) return 0.90;
  if (domain.endsWith(".edu")) return 0.85;
  if (domain.endsWith(".org")) return 0.75;
  return 0.50;
}

export async function runPromptAnalysis(
  promptText: string,
  targetBrand: string,
  brandVariants: string[] = [],
  competitorBrands: string[] = [],
  brandDomain?: string,
  competitorDomains?: string[],
  model: string = "gpt-4o-mini"
): Promise<PromptAnalysisResult> {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `You are an AI assistant helping users find information. Provide helpful, accurate responses with citations when available. Include URLs to relevant sources when appropriate.`
      },
      {
        role: "user",
        content: promptText
      }
    ],
    max_tokens: 2048,
    temperature: 0.7,
  });

  const rawAnswer = response.choices[0]?.message?.content || "";
  
  const citations = extractCitations(rawAnswer, brandDomain, competitorDomains);
  const mentions = detectBrandMentions(rawAnswer, targetBrand, brandVariants, competitorBrands);
  
  // Update isCited flag based on whether brand-owned citations exist
  const hasBrandCitation = citations.some(c => c.sourceType === "brand_owned");
  const hasCompetitorCitation = (domain: string) => 
    citations.some(c => c.sourceDomain.includes(domain.replace(/^www\./, "")));
  
  // Update mentions with citation status
  const updatedMentions = mentions.map(mention => {
    if (mention.isTargetBrand) {
      return { ...mention, isCited: hasBrandCitation };
    }
    // Check if competitor has a citation
    const competitorDomain = competitorDomains?.find(cd => 
      mention.brandName.toLowerCase().includes(cd.split('.')[0].toLowerCase())
    );
    return { 
      ...mention, 
      isCited: competitorDomain ? hasCompetitorCitation(competitorDomain) : false 
    };
  });

  return {
    rawAnswer,
    mentions: updatedMentions,
    citations,
    tokenUsage: {
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
    },
  };
}

function detectBrandMentions(
  text: string,
  targetBrand: string,
  brandVariants: string[],
  competitorBrands: string[]
): BrandMention[] {
  const mentions: BrandMention[] = [];
  const allBrandTerms = [targetBrand, ...brandVariants];
  const textLower = text.toLowerCase();
  
  let position = 1;
  
  for (const term of allBrandTerms) {
    const termLower = term.toLowerCase();
    const regex = new RegExp(`\\b${escapeRegex(termLower)}\\b`, "gi");
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const contextStart = Math.max(0, match.index - 50);
      const contextEnd = Math.min(text.length, match.index + term.length + 50);
      const context = text.slice(contextStart, contextEnd);
      
      const matchType = determineMatchType(context, term, position);
      
      mentions.push({
        brandName: term,
        matchType,
        mentionPosition: position++,
        confidence: calculateConfidence(context, term),
        context,
        isTargetBrand: true,
        isCited: false,
      });
    }
  }
  
  for (const competitor of competitorBrands) {
    const competitorLower = competitor.toLowerCase();
    const regex = new RegExp(`\\b${escapeRegex(competitorLower)}\\b`, "gi");
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

function determineMatchType(context: string, term: string, position: number): BrandMention["matchType"] {
  const contextLower = context.toLowerCase();
  
  const recommendationIndicators = ["recommend", "best", "top choice", "leading", "excellent", "outstanding", "#1", "number one"];
  const hasRecommendation = recommendationIndicators.some(ind => contextLower.includes(ind));
  
  if (position === 1 && hasRecommendation) {
    return "primary";
  }
  
  if (position <= 3 || hasRecommendation) {
    return "primary";
  }
  
  const comparisonIndicators = ["compare", "versus", "vs", "alternative", "competitor"];
  if (comparisonIndicators.some(ind => contextLower.includes(ind))) {
    return "secondary";
  }
  
  const impliedIndicators = ["similar to", "like", "such as"];
  if (impliedIndicators.some(ind => contextLower.includes(ind))) {
    return "implied";
  }
  
  return "secondary";
}

function calculateConfidence(context: string, term: string): number {
  let confidence = 0.70;
  
  const contextLower = context.toLowerCase();
  const termLower = term.toLowerCase();
  
  if (contextLower.includes(`"${termLower}"`) || contextLower.includes(`'${termLower}'`)) {
    confidence += 0.15;
  }
  
  const strongIndicators = ["recommend", "best", "leading", "top"];
  if (strongIndicators.some(ind => contextLower.includes(ind))) {
    confidence += 0.10;
  }
  
  return Math.min(confidence, 0.98);
}

function extractCitations(
  text: string,
  brandDomain?: string,
  competitorDomains?: string[]
): ExtractedCitation[] {
  const citations: ExtractedCitation[] = [];
  
  const urlRegex = /https?:\/\/[^\s\)"\]]+/gi;
  const matches = text.match(urlRegex) || [];
  
  const uniqueUrls = Array.from(new Set(matches));
  
  for (const url of uniqueUrls) {
    const cleanUrl = url.replace(/[.,;:]+$/, "");
    const domain = extractDomain(cleanUrl);
    
    citations.push({
      sourceUrl: cleanUrl,
      sourceType: getSourceType(domain, brandDomain, competitorDomains),
      sourceDomain: domain,
      authorityScore: getAuthorityScore(domain),
    });
  }
  
  return citations;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isOpenAIConfigured(): boolean {
  return !!(process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY);
}

export { openai };
