import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  Brand,
  InsertBrand,
  Audit,
  InsertAudit,
  Competitor,
  InsertCompetitor,
  PromptTemplate,
  InsertPromptTemplate,
  PromptRun,
  InsertPromptRun,
  PromptMention,
  InsertPromptMention,
  Citation,
  InsertCitation,
  PromptMetric,
  InsertPromptMetric,
  Recommendation,
  InsertRecommendation,
  AuditSummary,
  PromptRunDetail,
  ComparisonData,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Brands
  getBrand(id: string): Promise<Brand | undefined>;
  getAllBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;

  // Audits
  getAudit(id: string): Promise<Audit | undefined>;
  getAllAudits(): Promise<Audit[]>;
  createAudit(audit: InsertAudit): Promise<Audit>;

  // Competitors
  getCompetitorsByAudit(auditId: string): Promise<Competitor[]>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;

  // Prompt Templates
  getPromptTemplate(id: string): Promise<PromptTemplate | undefined>;
  getAllPromptTemplates(): Promise<PromptTemplate[]>;
  createPromptTemplate(template: InsertPromptTemplate): Promise<PromptTemplate>;

  // Prompt Runs
  getPromptRun(id: string): Promise<PromptRun | undefined>;
  getPromptRunsByAudit(auditId: string): Promise<PromptRun[]>;
  createPromptRun(run: InsertPromptRun): Promise<PromptRun>;

  // Prompt Mentions
  getMentionsByRun(runId: string): Promise<PromptMention[]>;
  createMention(mention: InsertPromptMention): Promise<PromptMention>;

  // Citations
  getCitationsByRun(runId: string): Promise<Citation[]>;
  getAllCitations(auditId?: string): Promise<Citation[]>;
  createCitation(citation: InsertCitation): Promise<Citation>;

  // Prompt Metrics
  getMetricsByRun(runId: string): Promise<PromptMetric | undefined>;
  createMetric(metric: InsertPromptMetric): Promise<PromptMetric>;

  // Recommendations
  getRecommendation(id: string): Promise<Recommendation | undefined>;
  getRecommendationsByAudit(auditId: string): Promise<Recommendation[]>;
  createRecommendation(rec: InsertRecommendation): Promise<Recommendation>;
  updateRecommendationStatus(id: string, status: string): Promise<Recommendation | undefined>;

  // Aggregated data
  getDashboardData(): Promise<{
    summary: AuditSummary;
    recentRuns: Array<{
      run: PromptRun;
      template: PromptTemplate;
      mentions: PromptMention[];
    }>;
  }>;
  getPromptRunDetail(id: string): Promise<PromptRunDetail | undefined>;
  getComparisonData(): Promise<{
    brands: ComparisonData[];
    byIntent: Array<{ intent: string; data: ComparisonData[] }>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private brands: Map<string, Brand>;
  private audits: Map<string, Audit>;
  private competitors: Map<string, Competitor>;
  private promptTemplates: Map<string, PromptTemplate>;
  private promptRuns: Map<string, PromptRun>;
  private promptMentions: Map<string, PromptMention>;
  private citations: Map<string, Citation>;
  private promptMetrics: Map<string, PromptMetric>;
  private recommendations: Map<string, Recommendation>;

  constructor() {
    this.users = new Map();
    this.brands = new Map();
    this.audits = new Map();
    this.competitors = new Map();
    this.promptTemplates = new Map();
    this.promptRuns = new Map();
    this.promptMentions = new Map();
    this.citations = new Map();
    this.promptMetrics = new Map();
    this.recommendations = new Map();

    this.seedData();
  }

  private seedData() {
    // Create demo brand
    const brand: Brand = {
      id: "brand-1",
      name: "Acme Corp",
      primaryDomain: "acmecorp.com",
      brandVariants: ["Acme", "Acme Corp", "Acme Corporation"],
    };
    this.brands.set(brand.id, brand);

    // Create demo audit
    const audit: Audit = {
      id: "audit-1",
      brandId: brand.id,
      auditName: "Q1 2026 Visibility Audit",
      targetCategory: "Enterprise Software",
      createdAt: new Date(),
      status: "completed",
    };
    this.audits.set(audit.id, audit);

    // Create competitors
    const competitors: Competitor[] = [
      { id: "comp-1", auditId: audit.id, name: "TechCo", domain: "techco.com" },
      { id: "comp-2", auditId: audit.id, name: "InnovateLabs", domain: "innovatelabs.io" },
      { id: "comp-3", auditId: audit.id, name: "NextGen Solutions", domain: "nextgen.com" },
    ];
    competitors.forEach((c) => this.competitors.set(c.id, c));

    // Create prompt templates
    const templates: PromptTemplate[] = [
      {
        id: "tpl-1",
        name: "Best enterprise software for project management",
        intent: "informational",
        template: "What are the best enterprise software solutions for project management in 2026?",
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "tpl-2",
        name: "Compare project management tools",
        intent: "comparative",
        template: "Compare the top 5 project management tools for large enterprises",
        isActive: true,
        sortOrder: 2,
      },
      {
        id: "tpl-3",
        name: "Enterprise software pricing",
        intent: "transactional",
        template: "What is the pricing for enterprise project management software?",
        isActive: true,
        sortOrder: 3,
      },
      {
        id: "tpl-4",
        name: "Most trusted enterprise vendors",
        intent: "trust",
        template: "Which enterprise software vendors are most trusted for security and compliance?",
        isActive: true,
        sortOrder: 4,
      },
      {
        id: "tpl-5",
        name: "Team collaboration software recommendations",
        intent: "informational",
        template: "What software do you recommend for team collaboration in a remote work environment?",
        isActive: true,
        sortOrder: 5,
      },
      {
        id: "tpl-6",
        name: "Acme vs competitors",
        intent: "comparative",
        template: "How does Acme Corp compare to its competitors in enterprise software?",
        isActive: true,
        sortOrder: 6,
      },
    ];
    templates.forEach((t) => this.promptTemplates.set(t.id, t));

    // Create prompt runs with sample answers
    const sampleAnswers = [
      `The best enterprise software solutions for project management in 2026 include:

1. **Acme Corp Enterprise Suite** - Known for its comprehensive feature set and excellent security compliance. Acme Corp offers robust project tracking, resource management, and real-time collaboration tools.

2. **TechCo Platform** - A strong contender with focus on AI-driven insights and automation.

3. **Asana Enterprise** - Popular for its intuitive interface and workflow automation capabilities.

4. **Monday.com** - Offers flexible project views and strong integration ecosystem.

5. **NextGen Solutions** - Emerging player with innovative approach to agile project management.

Acme Corp is particularly recommended for organizations requiring enterprise-grade security and compliance features.`,

      `Here's a comparison of top 5 project management tools for large enterprises:

| Feature | Acme Corp | TechCo | InnovateLabs | NextGen | Monday.com |
|---------|-----------|--------|--------------|---------|------------|
| Security | Excellent | Good | Good | Fair | Good |
| Scalability | Enterprise | Enterprise | Mid-market | Enterprise | Enterprise |
| Price | $$$$ | $$$ | $$ | $$$ | $$ |
| Support | 24/7 | Business hours | 24/7 | Business hours | 24/7 |

Acme Corp leads in security and compliance but comes at a premium price point. TechCo offers the best value for mid-sized enterprises.`,

      `Enterprise project management software pricing varies significantly:

- **Acme Corp**: $45-85/user/month for enterprise plans
- **TechCo Platform**: $25-55/user/month
- **InnovateLabs**: $15-35/user/month
- **NextGen Solutions**: $30-60/user/month

Most vendors offer volume discounts for 100+ users. Contact vendors directly for enterprise pricing negotiations.`,

      `The most trusted enterprise software vendors for security and compliance include:

1. **Acme Corp** - SOC 2 Type II certified, GDPR compliant, FedRAMP authorized
2. **Microsoft** - Comprehensive security certifications
3. **TechCo** - ISO 27001 certified
4. **Salesforce** - Strong security track record

Acme Corp stands out for its transparent security practices and dedicated compliance team.`,

      `For remote team collaboration, I recommend:

1. **Acme Corp Collaborate** - Excellent for enterprise teams needing security
2. **Slack** - Great for real-time communication
3. **Microsoft Teams** - Best for Microsoft ecosystem users
4. **Notion** - Good for documentation-heavy teams

The choice depends on your team size and security requirements.`,

      `Comparing Acme Corp to its competitors:

**Strengths of Acme Corp:**
- Industry-leading security features
- Comprehensive enterprise support
- Deep integration capabilities
- Strong customer retention

**Areas where competitors excel:**
- TechCo has better AI features
- InnovateLabs offers lower pricing
- NextGen has more modern UI

Overall, Acme Corp is the preferred choice for security-conscious enterprises.`,
    ];

    const promptRuns: PromptRun[] = templates.map((template, i) => ({
      id: `run-${i + 1}`,
      auditId: audit.id,
      promptTemplateId: template.id,
      llmModel: "gpt-4",
      runStatus: "completed",
      executedAt: new Date(Date.now() - (templates.length - i) * 3600000),
      rawAnswer: sampleAnswers[i],
      promptText: template.template,
    }));
    promptRuns.forEach((r) => this.promptRuns.set(r.id, r));

    // Create mentions for each run
    const mentionData: Array<{ runId: string; mentions: Partial<PromptMention>[] }> = [
      {
        runId: "run-1",
        mentions: [
          { brandName: "Acme Corp", matchType: "primary", isTargetBrand: true, confidence: 0.95, isCited: true },
          { brandName: "TechCo", matchType: "secondary", isTargetBrand: false, confidence: 0.88 },
          { brandName: "NextGen Solutions", matchType: "secondary", isTargetBrand: false, confidence: 0.82 },
        ],
      },
      {
        runId: "run-2",
        mentions: [
          { brandName: "Acme Corp", matchType: "primary", isTargetBrand: true, confidence: 0.92, isCited: true },
          { brandName: "TechCo", matchType: "secondary", isTargetBrand: false, confidence: 0.90 },
          { brandName: "InnovateLabs", matchType: "secondary", isTargetBrand: false, confidence: 0.85 },
          { brandName: "NextGen", matchType: "secondary", isTargetBrand: false, confidence: 0.80 },
        ],
      },
      {
        runId: "run-3",
        mentions: [
          { brandName: "Acme Corp", matchType: "secondary", isTargetBrand: true, confidence: 0.88 },
          { brandName: "TechCo", matchType: "secondary", isTargetBrand: false, confidence: 0.85 },
          { brandName: "InnovateLabs", matchType: "secondary", isTargetBrand: false, confidence: 0.82 },
          { brandName: "NextGen", matchType: "secondary", isTargetBrand: false, confidence: 0.78 },
        ],
      },
      {
        runId: "run-4",
        mentions: [
          { brandName: "Acme Corp", matchType: "primary", isTargetBrand: true, confidence: 0.96, isCited: true },
          { brandName: "TechCo", matchType: "secondary", isTargetBrand: false, confidence: 0.75 },
        ],
      },
      {
        runId: "run-5",
        mentions: [
          { brandName: "Acme Corp", matchType: "primary", isTargetBrand: true, confidence: 0.90 },
        ],
      },
      {
        runId: "run-6",
        mentions: [
          { brandName: "Acme Corp", matchType: "primary", isTargetBrand: true, confidence: 0.98, isCited: true },
          { brandName: "TechCo", matchType: "secondary", isTargetBrand: false, confidence: 0.88 },
          { brandName: "InnovateLabs", matchType: "secondary", isTargetBrand: false, confidence: 0.85 },
          { brandName: "NextGen", matchType: "implied", isTargetBrand: false, confidence: 0.70 },
        ],
      },
    ];

    let mentionId = 1;
    mentionData.forEach(({ runId, mentions }) => {
      mentions.forEach((m, pos) => {
        const mention: PromptMention = {
          id: `mention-${mentionId++}`,
          promptRunId: runId,
          brandName: m.brandName!,
          matchType: m.matchType!,
          mentionPosition: pos + 1,
          confidence: m.confidence || 0.8,
          isCited: m.isCited || false,
          isTargetBrand: m.isTargetBrand || false,
        };
        this.promptMentions.set(mention.id, mention);
      });
    });

    // Create citations
    const citationData: Citation[] = [
      { id: "cit-1", promptRunId: "run-1", sourceUrl: "https://acmecorp.com/enterprise", sourceType: "brand_owned", authorityScore: 0.85, sourceDomain: "acmecorp.com" },
      { id: "cit-2", promptRunId: "run-1", sourceUrl: "https://en.wikipedia.org/wiki/Project_management_software", sourceType: "wikipedia", authorityScore: 0.95, sourceDomain: "wikipedia.org" },
      { id: "cit-3", promptRunId: "run-1", sourceUrl: "https://gartner.com/reviews/enterprise-pm", sourceType: "publisher", authorityScore: 0.92, sourceDomain: "gartner.com" },
      { id: "cit-4", promptRunId: "run-2", sourceUrl: "https://techco.com/comparison", sourceType: "competitor", authorityScore: 0.78, sourceDomain: "techco.com" },
      { id: "cit-5", promptRunId: "run-2", sourceUrl: "https://g2.com/compare/acme-vs-techco", sourceType: "publisher", authorityScore: 0.88, sourceDomain: "g2.com" },
      { id: "cit-6", promptRunId: "run-3", sourceUrl: "https://capterra.com/pricing", sourceType: "publisher", authorityScore: 0.82, sourceDomain: "capterra.com" },
      { id: "cit-7", promptRunId: "run-4", sourceUrl: "https://acmecorp.com/security", sourceType: "brand_owned", authorityScore: 0.90, sourceDomain: "acmecorp.com" },
      { id: "cit-8", promptRunId: "run-4", sourceUrl: "https://nist.gov/compliance", sourceType: "government", authorityScore: 0.98, sourceDomain: "nist.gov" },
      { id: "cit-9", promptRunId: "run-6", sourceUrl: "https://acmecorp.com/about", sourceType: "brand_owned", authorityScore: 0.88, sourceDomain: "acmecorp.com" },
      { id: "cit-10", promptRunId: "run-6", sourceUrl: "https://forbes.com/enterprise-software", sourceType: "publisher", authorityScore: 0.90, sourceDomain: "forbes.com" },
    ];
    citationData.forEach((c) => this.citations.set(c.id, c));

    // Create metrics for each run
    const metricsData: PromptMetric[] = [
      { id: "met-1", promptRunId: "run-1", presenceRate: 0.92, recommendationRate: 0.85, citationRate: 0.75, authorityDiversity: 0.80, compositeScore: 0.83 },
      { id: "met-2", promptRunId: "run-2", presenceRate: 0.88, recommendationRate: 0.70, citationRate: 0.65, authorityDiversity: 0.75, compositeScore: 0.75 },
      { id: "met-3", promptRunId: "run-3", presenceRate: 0.75, recommendationRate: 0.55, citationRate: 0.50, authorityDiversity: 0.60, compositeScore: 0.60 },
      { id: "met-4", promptRunId: "run-4", presenceRate: 0.95, recommendationRate: 0.90, citationRate: 0.85, authorityDiversity: 0.88, compositeScore: 0.90 },
      { id: "met-5", promptRunId: "run-5", presenceRate: 0.80, recommendationRate: 0.75, citationRate: 0.40, authorityDiversity: 0.50, compositeScore: 0.61 },
      { id: "met-6", promptRunId: "run-6", presenceRate: 0.95, recommendationRate: 0.88, citationRate: 0.80, authorityDiversity: 0.85, compositeScore: 0.87 },
    ];
    metricsData.forEach((m) => this.promptMetrics.set(m.id, m));

    // Create recommendations
    const recommendations: Recommendation[] = [
      {
        id: "rec-1",
        auditId: audit.id,
        title: "Improve pricing page content",
        summary: "AI models are citing competitor pricing pages more often. Enhance your pricing page with clearer tier breakdowns and feature comparisons.",
        category: "content",
        evidencePromptRunId: "run-3",
        impact: "high",
        effort: "low",
        status: "pending",
        rationale: "Pricing transparency directly influences AI recommendations for transactional queries.",
      },
      {
        id: "rec-2",
        auditId: audit.id,
        title: "Add structured data markup",
        summary: "Implement Product and Organization schema markup to improve AI understanding of your brand and offerings.",
        category: "structure",
        evidencePromptRunId: null,
        impact: "medium",
        effort: "low",
        status: "in_progress",
        rationale: "Structured data helps AI systems better understand and accurately represent your brand.",
      },
      {
        id: "rec-3",
        auditId: audit.id,
        title: "Expand third-party validation",
        summary: "Increase presence on review platforms like G2, Capterra, and Gartner Peer Insights to improve citation diversity.",
        category: "authority",
        evidencePromptRunId: "run-2",
        impact: "high",
        effort: "medium",
        status: "pending",
        rationale: "Third-party reviews are heavily weighted in AI answer generation.",
      },
      {
        id: "rec-4",
        auditId: audit.id,
        title: "Create comparison content",
        summary: "Develop detailed comparison pages for key competitors to own the comparative narrative in AI answers.",
        category: "content",
        evidencePromptRunId: "run-6",
        impact: "high",
        effort: "medium",
        status: "pending",
        rationale: "Comparative queries often cite the most comprehensive comparison sources.",
      },
      {
        id: "rec-5",
        auditId: audit.id,
        title: "Update security documentation",
        summary: "Your security and compliance content is performing well. Keep it updated with latest certifications.",
        category: "content",
        evidencePromptRunId: "run-4",
        impact: "low",
        effort: "low",
        status: "completed",
        rationale: "Maintaining accurate security documentation ensures continued high visibility in trust queries.",
      },
    ];
    recommendations.forEach((r) => this.recommendations.set(r.id, r));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Brand methods
  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const brand: Brand = { ...insertBrand, id };
    this.brands.set(id, brand);
    return brand;
  }

  // Audit methods
  async getAudit(id: string): Promise<Audit | undefined> {
    return this.audits.get(id);
  }

  async getAllAudits(): Promise<Audit[]> {
    return Array.from(this.audits.values());
  }

  async createAudit(insertAudit: InsertAudit): Promise<Audit> {
    const id = randomUUID();
    const audit: Audit = { ...insertAudit, id, createdAt: new Date() };
    this.audits.set(id, audit);
    return audit;
  }

  // Competitor methods
  async getCompetitorsByAudit(auditId: string): Promise<Competitor[]> {
    return Array.from(this.competitors.values()).filter((c) => c.auditId === auditId);
  }

  async createCompetitor(insertCompetitor: InsertCompetitor): Promise<Competitor> {
    const id = randomUUID();
    const competitor: Competitor = { ...insertCompetitor, id };
    this.competitors.set(id, competitor);
    return competitor;
  }

  // Prompt Template methods
  async getPromptTemplate(id: string): Promise<PromptTemplate | undefined> {
    return this.promptTemplates.get(id);
  }

  async getAllPromptTemplates(): Promise<PromptTemplate[]> {
    return Array.from(this.promptTemplates.values()).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async createPromptTemplate(insertTemplate: InsertPromptTemplate): Promise<PromptTemplate> {
    const id = randomUUID();
    const template: PromptTemplate = { ...insertTemplate, id };
    this.promptTemplates.set(id, template);
    return template;
  }

  // Prompt Run methods
  async getPromptRun(id: string): Promise<PromptRun | undefined> {
    return this.promptRuns.get(id);
  }

  async getPromptRunsByAudit(auditId: string): Promise<PromptRun[]> {
    return Array.from(this.promptRuns.values())
      .filter((r) => r.auditId === auditId)
      .sort((a, b) => (b.executedAt?.getTime() || 0) - (a.executedAt?.getTime() || 0));
  }

  async createPromptRun(insertRun: InsertPromptRun): Promise<PromptRun> {
    const id = randomUUID();
    const run: PromptRun = { ...insertRun, id, executedAt: new Date() };
    this.promptRuns.set(id, run);
    return run;
  }

  // Mention methods
  async getMentionsByRun(runId: string): Promise<PromptMention[]> {
    return Array.from(this.promptMentions.values())
      .filter((m) => m.promptRunId === runId)
      .sort((a, b) => (a.mentionPosition || 0) - (b.mentionPosition || 0));
  }

  async createMention(insertMention: InsertPromptMention): Promise<PromptMention> {
    const id = randomUUID();
    const mention: PromptMention = { ...insertMention, id };
    this.promptMentions.set(id, mention);
    return mention;
  }

  // Citation methods
  async getCitationsByRun(runId: string): Promise<Citation[]> {
    return Array.from(this.citations.values()).filter((c) => c.promptRunId === runId);
  }

  async getAllCitations(auditId?: string): Promise<Citation[]> {
    const citations = Array.from(this.citations.values());
    if (!auditId) return citations;

    const runIds = new Set(
      Array.from(this.promptRuns.values())
        .filter((r) => r.auditId === auditId)
        .map((r) => r.id)
    );
    return citations.filter((c) => runIds.has(c.promptRunId));
  }

  async createCitation(insertCitation: InsertCitation): Promise<Citation> {
    const id = randomUUID();
    const citation: Citation = { ...insertCitation, id };
    this.citations.set(id, citation);
    return citation;
  }

  // Metric methods
  async getMetricsByRun(runId: string): Promise<PromptMetric | undefined> {
    return Array.from(this.promptMetrics.values()).find((m) => m.promptRunId === runId);
  }

  async createMetric(insertMetric: InsertPromptMetric): Promise<PromptMetric> {
    const id = randomUUID();
    const metric: PromptMetric = { ...insertMetric, id };
    this.promptMetrics.set(id, metric);
    return metric;
  }

  // Recommendation methods
  async getRecommendation(id: string): Promise<Recommendation | undefined> {
    return this.recommendations.get(id);
  }

  async getRecommendationsByAudit(auditId: string): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter((r) => r.auditId === auditId);
  }

  async createRecommendation(insertRec: InsertRecommendation): Promise<Recommendation> {
    const id = randomUUID();
    const rec: Recommendation = { ...insertRec, id };
    this.recommendations.set(id, rec);
    return rec;
  }

  async updateRecommendationStatus(id: string, status: string): Promise<Recommendation | undefined> {
    const rec = this.recommendations.get(id);
    if (rec) {
      rec.status = status;
      this.recommendations.set(id, rec);
    }
    return rec;
  }

  // Aggregated data methods
  async getDashboardData() {
    const audits = await this.getAllAudits();
    const audit = audits[0];
    if (!audit) throw new Error("No audit found");

    const brand = await this.getBrand(audit.brandId);
    if (!brand) throw new Error("No brand found");

    const competitors = await this.getCompetitorsByAudit(audit.id);
    const runs = await this.getPromptRunsByAudit(audit.id);
    const templates = await this.getAllPromptTemplates();

    // Calculate aggregate metrics
    const allMetrics = await Promise.all(runs.map((r) => this.getMetricsByRun(r.id)));
    const validMetrics = allMetrics.filter(Boolean) as PromptMetric[];

    const avgMetrics = validMetrics.reduce(
      (acc, m) => ({
        presenceRate: acc.presenceRate + m.presenceRate / validMetrics.length,
        citationRate: acc.citationRate + m.citationRate / validMetrics.length,
        recommendationRate: acc.recommendationRate + m.recommendationRate / validMetrics.length,
        compositeScore: acc.compositeScore + m.compositeScore / validMetrics.length,
      }),
      { presenceRate: 0, citationRate: 0, recommendationRate: 0, compositeScore: 0 }
    );

    const recentRuns = await Promise.all(
      runs.slice(0, 10).map(async (run) => {
        const template = templates.find((t) => t.id === run.promptTemplateId);
        const mentions = await this.getMentionsByRun(run.id);
        return { run, template: template!, mentions };
      })
    );

    // Generate trend data (last 7 days)
    const recentTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: Math.round((avgMetrics.compositeScore * 100 + (Math.random() - 0.5) * 10) * 10) / 10,
      };
    });

    return {
      summary: {
        audit,
        brand,
        competitors,
        metrics: {
          visibilityScore: avgMetrics.compositeScore,
          presenceRate: avgMetrics.presenceRate,
          citationRate: avgMetrics.citationRate,
          recommendationRate: avgMetrics.recommendationRate,
          totalPrompts: runs.length,
          completedPrompts: runs.filter((r) => r.runStatus === "completed").length,
        },
        recentTrend,
      },
      recentRuns,
    };
  }

  async getPromptRunDetail(id: string): Promise<PromptRunDetail | undefined> {
    const run = await this.getPromptRun(id);
    if (!run) return undefined;

    const template = await this.getPromptTemplate(run.promptTemplateId);
    if (!template) return undefined;

    const mentions = await this.getMentionsByRun(id);
    const citations = await this.getCitationsByRun(id);
    const metrics = await this.getMetricsByRun(id);

    return { run, template, mentions, citations, metrics: metrics || null };
  }

  async getComparisonData() {
    const audits = await this.getAllAudits();
    const audit = audits[0];
    if (!audit) throw new Error("No audit found");

    const brand = await this.getBrand(audit.brandId);
    const competitors = await this.getCompetitorsByAudit(audit.id);

    // Generate comparison data
    const brands: ComparisonData[] = [
      {
        brand: brand?.name || "Your Brand",
        presenceRate: 0.87,
        citationRate: 0.72,
        recommendationRate: 0.78,
        compositeScore: 0.79,
      },
      ...competitors.map((c, i) => ({
        brand: c.name,
        presenceRate: 0.75 - i * 0.05,
        citationRate: 0.65 - i * 0.08,
        recommendationRate: 0.68 - i * 0.1,
        compositeScore: 0.69 - i * 0.07,
      })),
    ];

    const intents = ["informational", "comparative", "transactional", "trust"];
    const byIntent = intents.map((intent) => ({
      intent,
      data: brands.map((b) => ({
        ...b,
        presenceRate: b.presenceRate * (0.9 + Math.random() * 0.2),
        citationRate: b.citationRate * (0.9 + Math.random() * 0.2),
        recommendationRate: b.recommendationRate * (0.9 + Math.random() * 0.2),
        compositeScore: b.compositeScore * (0.9 + Math.random() * 0.2),
      })),
    }));

    return { brands, byIntent };
  }
}

export const storage = new MemStorage();
