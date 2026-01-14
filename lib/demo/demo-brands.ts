export type DemoBrand = {
  id: string;
  name: string;
  domain: string;
  industry: string;
};

export const DEMO_PRIMARY_BRAND: DemoBrand = {
  id: "demo-atlas-analytics",
  name: "Atlas Analytics",
  domain: "atlas-analytics.example",
  industry: "Enterprise Software"
};

export const DEMO_COMPETITORS: DemoBrand[] = [
  {
    id: "demo-orion-systems",
    name: "Orion Systems",
    domain: "orion-systems.example",
    industry: "Enterprise Software"
  },
  {
    id: "demo-vertex-ai-labs",
    name: "Vertex AI Labs",
    domain: "vertex-ai-labs.example",
    industry: "Enterprise Software"
  },
  {
    id: "demo-nimbus-cloud",
    name: "Nimbus Cloudworks",
    domain: "nimbus-cloudworks.example",
    industry: "Enterprise Software"
  }
];

export const DEMO_BRANDS: DemoBrand[] = [DEMO_PRIMARY_BRAND, ...DEMO_COMPETITORS];

