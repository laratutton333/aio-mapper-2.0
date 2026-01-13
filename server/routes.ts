import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./auth";
import { stripeService } from "./stripeService";
import { stripeStorage } from "./stripeStorage";
import { getStripePublishableKey } from "./stripeClient";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { runPromptAnalysis, isOpenAIConfigured } from "./services/openai";
import { getSamplePromptRunsData, getSampleCitationsData, getSampleRecommendationsData, getSamplePromptRunDetail } from "./sampleData";

const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required").startsWith("price_", "Invalid price ID format"),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication (must be before other routes)
  setupAuth(app);
  registerAuthRoutes(app);
  // Dashboard data
  app.get("/api/dashboard", async (_req, res) => {
    try {
      const data = await storage.getDashboardData();
      res.json(data);
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: "Failed to load dashboard data" });
    }
  });

  // Get all prompt runs with details
  app.get("/api/prompt-runs", async (_req, res) => {
    try {
      const audits = await storage.getAllAudits();
      const audit = audits[0];
      if (!audit) {
        // Return sample data when no audit exists
        return res.json(getSamplePromptRunsData());
      }

      const runs = await storage.getPromptRunsByAudit(audit.id);
      if (runs.length === 0) {
        // Return sample data when no runs exist
        return res.json(getSamplePromptRunsData());
      }
      
      const templates = await storage.getAllPromptTemplates();

      const runsWithDetails = await Promise.all(
        runs.map(async (run) => {
          const template = templates.find((t) => t.id === run.promptTemplateId);
          const mentions = await storage.getMentionsByRun(run.id);
          const citations = await storage.getCitationsByRun(run.id);
          return { run, template: template!, mentions, citations };
        })
      );

      res.json({
        runs: runsWithDetails,
        filters: {
          intents: ["informational", "comparative", "transactional", "trust"],
          statuses: ["pending", "running", "completed", "failed"],
        },
      });
    } catch (error) {
      console.error("Prompt runs error:", error);
      res.status(500).json({ error: "Failed to load prompt runs" });
    }
  });

  // Get single prompt run detail
  app.get("/api/prompt-runs/:id", async (req, res) => {
    try {
      const detail = await storage.getPromptRunDetail(req.params.id);
      if (!detail) {
        // Try sample data
        const sampleDetail = getSamplePromptRunDetail(req.params.id);
        if (sampleDetail) {
          return res.json(sampleDetail);
        }
        return res.status(404).json({ error: "Prompt run not found" });
      }
      res.json(detail);
    } catch (error) {
      console.error("Prompt run detail error:", error);
      res.status(500).json({ error: "Failed to load prompt run details" });
    }
  });

  // Get comparison data
  app.get("/api/comparison", async (_req, res) => {
    try {
      const data = await storage.getComparisonData();
      res.json(data);
    } catch (error) {
      console.error("Comparison error:", error);
      res.status(500).json({ error: "Failed to load comparison data" });
    }
  });

  // Get citations data
  app.get("/api/citations", async (_req, res) => {
    try {
      const audits = await storage.getAllAudits();
      const audit = audits[0];
      if (!audit) {
        // Return sample data when no audit exists
        return res.json(getSampleCitationsData());
      }

      const citations = await storage.getAllCitations(audit.id);
      if (citations.length === 0) {
        // Return sample data when no citations exist
        return res.json(getSampleCitationsData());
      }
      
      const runs = await storage.getPromptRunsByAudit(audit.id);

      // Calculate distribution
      const typeCount: Record<string, number> = {};
      citations.forEach((c) => {
        typeCount[c.sourceType] = (typeCount[c.sourceType] || 0) + 1;
      });

      const distribution = Object.entries(typeCount).map(([type, count]) => ({
        type,
        count,
        percentage: (count / citations.length) * 100,
      }));

      // Calculate stats
      const brandOwned = citations.filter((c) => c.sourceType === "brand_owned").length;
      const avgAuthority =
        citations.reduce((sum, c) => sum + (c.authorityScore || 0), 0) / citations.length;

      // Count runs without citations
      const runsWithCitations = new Set(citations.map((c) => c.promptRunId));
      const missingCitationPrompts = runs.filter((r) => !runsWithCitations.has(r.id)).length;

      res.json({
        citations,
        distribution,
        totalCitations: citations.length,
        brandOwnedPercentage: (brandOwned / citations.length) * 100,
        authorityAverage: avgAuthority,
        missingCitationPrompts,
      });
    } catch (error) {
      console.error("Citations error:", error);
      res.status(500).json({ error: "Failed to load citations data" });
    }
  });

  // Get recommendations
  app.get("/api/recommendations", async (_req, res) => {
    try {
      const audits = await storage.getAllAudits();
      const audit = audits[0];
      if (!audit) {
        // Return sample data when no audit exists
        return res.json(getSampleRecommendationsData());
      }

      const recommendations = await storage.getRecommendationsByAudit(audit.id);
      
      if (recommendations.length === 0) {
        // Return sample data when no recommendations exist
        return res.json(getSampleRecommendationsData());
      }

      const stats = {
        total: recommendations.length,
        pending: recommendations.filter((r) => r.status === "pending").length,
        inProgress: recommendations.filter((r) => r.status === "in_progress").length,
        completed: recommendations.filter((r) => r.status === "completed").length,
      };

      res.json({ recommendations, stats });
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ error: "Failed to load recommendations" });
    }
  });

  // Update recommendation status
  app.patch("/api/recommendations/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ["pending", "in_progress", "completed", "dismissed"];
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
        });
      }

      const updated = await storage.updateRecommendationStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: "Recommendation not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Update recommendation error:", error);
      res.status(500).json({ error: "Failed to update recommendation" });
    }
  });

  // Get all audits
  app.get("/api/audits", async (_req, res) => {
    try {
      const audits = await storage.getAllAudits();
      res.json(audits);
    } catch (error) {
      console.error("Audits error:", error);
      res.status(500).json({ error: "Failed to load audits" });
    }
  });

  // Get prompt templates
  app.get("/api/prompt-templates", async (_req, res) => {
    try {
      const templates = await storage.getAllPromptTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Templates error:", error);
      res.status(500).json({ error: "Failed to load templates" });
    }
  });

  // Check if OpenAI is configured
  app.get("/api/openai/status", async (_req, res) => {
    res.json({ configured: isOpenAIConfigured() });
  });

  // Analyze a prompt with OpenAI
  app.post("/api/analyze-prompt", async (req, res) => {
    try {
      if (!isOpenAIConfigured()) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

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

      const result = await runPromptAnalysis(
        promptText,
        targetBrand,
        brandVariants,
        competitorBrands,
        brandDomain,
        competitorDomains,
        model
      );

      const targetMentions = result.mentions.filter(m => m.isTargetBrand);
      const primaryMentions = targetMentions.filter(m => m.matchType === "primary");

      const metrics = {
        presenceRate: targetMentions.length > 0 ? 1 : 0,
        recommendationRate: primaryMentions.length > 0 
          ? primaryMentions.length / Math.max(targetMentions.length, 1) 
          : 0,
        citationRate: result.citations.length > 0 
          ? result.citations.filter(c => c.sourceType === "brand_owned").length / result.citations.length 
          : 0,
        authorityDiversity: result.citations.length > 0 
          ? Array.from(new Set(result.citations.map(c => c.sourceType))).length / 6 
          : 0,
        compositeScore: 0,
      };

      metrics.compositeScore = (
        metrics.presenceRate * 0.3 +
        metrics.recommendationRate * 0.3 +
        metrics.citationRate * 0.2 +
        metrics.authorityDiversity * 0.2
      );

      res.json({
        success: true,
        rawAnswer: result.rawAnswer,
        mentions: result.mentions.map((m, i) => ({
          ...m,
          id: `mention-live-${i}`,
        })),
        citations: result.citations.map((c, i) => ({
          ...c,
          id: `cit-live-${i}`,
        })),
        metrics,
        tokenUsage: result.tokenUsage,
      });
    } catch (error: any) {
      console.error("Analyze prompt error:", error);
      res.status(500).json({
        error: "Failed to analyze prompt",
        message: error.message || "Unknown error",
      });
    }
  });

  // Stripe routes
  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Stripe key error:", error);
      res.status(500).json({ error: "Failed to get Stripe key" });
    }
  });

  app.get("/api/stripe/products", async (_req, res) => {
    try {
      const rows = await stripeStorage.listProductsWithPrices();
      const productsMap = new Map();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
            metadata: row.price_metadata,
          });
        }
      }
      res.json({ data: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Products error:", error);
      res.status(500).json({ error: "Failed to load products" });
    }
  });

  app.post("/api/stripe/checkout", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const parsed = checkoutSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid request" });
      }
      const { priceId } = parsed.data;

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeService.createCustomer(user.email || '', user.id);
        await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, user.id));
        customerId = customer.id;
      }

      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${req.protocol}://${req.get('host')}/checkout/success`,
        `${req.protocol}://${req.get('host')}/checkout/cancel`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/stripe/portal", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user?.stripeCustomerId) {
        return res.status(400).json({ error: "No billing account found" });
      }

      const session = await stripeService.createCustomerPortalSession(
        user.stripeCustomerId,
        `${req.protocol}://${req.get('host')}/settings`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Portal error:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  app.get("/api/stripe/subscription", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user?.stripeSubscriptionId) {
        return res.json({ subscription: null });
      }

      const subscription = await stripeStorage.getSubscription(user.stripeSubscriptionId);
      res.json({ subscription });
    } catch (error) {
      console.error("Subscription error:", error);
      res.status(500).json({ error: "Failed to load subscription" });
    }
  });

  return httpServer;
}
