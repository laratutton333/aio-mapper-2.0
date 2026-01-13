import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
        return res.status(404).json({ error: "No audit found" });
      }

      const runs = await storage.getPromptRunsByAudit(audit.id);
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
        return res.status(404).json({ error: "No audit found" });
      }

      const citations = await storage.getAllCitations(audit.id);
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
        return res.status(404).json({ error: "No audit found" });
      }

      const recommendations = await storage.getRecommendationsByAudit(audit.id);

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

  return httpServer;
}
