import { DEMO_COMPETITORS, DEMO_PRIMARY_BRAND } from "@/lib/demo/demo-brands";

export type DemoCitationType = "brand_owned" | "publisher" | "competitor" | "government" | "wikipedia";

export type DemoCitationRow = {
  url: string;
  type: DemoCitationType;
  domain: string;
  authority: number; // 0-100
};

export type DemoCitationsData = {
  totals: {
    totalCitations: number;
    brandOwnedRate: number; // 0-1
    averageAuthority: number; // 0-100
    missingCitations: number;
  };
  byType: Array<{
    type: DemoCitationType;
    label: string;
    count: number;
    percent: number; // 0-1
  }>;
  rows: DemoCitationRow[];
};

export function citationTypeLabel(type: DemoCitationType) {
  switch (type) {
    case "brand_owned":
      return "Brand Owned";
    case "publisher":
      return "Publisher";
    case "competitor":
      return "Competitor";
    case "government":
      return "Government";
    case "wikipedia":
      return "Wikipedia";
  }
}

export function getDemoCitationsData(): DemoCitationsData {
  const [c1] = DEMO_COMPETITORS;

  const rows: DemoCitationRow[] = [
    {
      url: `https://${DEMO_PRIMARY_BRAND.domain}/enterprise`,
      type: "brand_owned",
      domain: DEMO_PRIMARY_BRAND.domain,
      authority: 85
    },
    {
      url: "https://wiki.example/enterprise-analytics",
      type: "wikipedia",
      domain: "wiki.example",
      authority: 95
    },
    {
      url: "https://industry-review.example/enterprise-analytics-platforms",
      type: "publisher",
      domain: "industry-review.example",
      authority: 92
    },
    {
      url: `https://${c1.domain}/comparison`,
      type: "competitor",
      domain: c1.domain,
      authority: 78
    },
    {
      url: "https://g2.example/compare/atlas-analytics-vs-orion-systems",
      type: "publisher",
      domain: "g2.example",
      authority: 88
    },
    {
      url: "https://capterra.example/pricing/analytics-platforms",
      type: "publisher",
      domain: "capterra.example",
      authority: 82
    },
    {
      url: `https://${DEMO_PRIMARY_BRAND.domain}/security`,
      type: "brand_owned",
      domain: DEMO_PRIMARY_BRAND.domain,
      authority: 90
    },
    {
      url: "https://standards.example/compliance/data-governance",
      type: "government",
      domain: "standards.example",
      authority: 98
    },
    {
      url: `https://${DEMO_PRIMARY_BRAND.domain}/about`,
      type: "brand_owned",
      domain: DEMO_PRIMARY_BRAND.domain,
      authority: 88
    },
    {
      url: "https://forbes.example/enterprise-software/analytics",
      type: "publisher",
      domain: "forbes.example",
      authority: 90
    }
  ];

  const totalCitations = rows.length;
  const brandOwnedCount = rows.filter((r) => r.type === "brand_owned").length;
  const averageAuthority =
    totalCitations === 0
      ? 0
      : rows.reduce((acc, r) => acc + r.authority, 0) / totalCitations;

  const types: DemoCitationType[] = [
    "brand_owned",
    "wikipedia",
    "publisher",
    "competitor",
    "government"
  ];

  const byType = types.map((type) => {
    const count = rows.filter((r) => r.type === type).length;
    return {
      type,
      label: citationTypeLabel(type),
      count,
      percent: totalCitations === 0 ? 0 : count / totalCitations
    };
  });

  return {
    totals: {
      totalCitations,
      brandOwnedRate: totalCitations === 0 ? 0 : brandOwnedCount / totalCitations,
      averageAuthority,
      missingCitations: 1
    },
    byType,
    rows
  };
}

