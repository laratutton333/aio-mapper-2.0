import type { PromptResult } from "@/types/dashboard";

type DemoPromptRow = {
  promptName: string;
  intent: string;
  mentionType: PromptResult["result"]["mentionType"];
  citationPresent: boolean;
  citationCount: number;
};

export const DEMO_PROMPTS: DemoPromptRow[] = [
  {
    promptName: "Atlas Analytics vs competitors",
    intent: "Comparative",
    mentionType: "primary",
    citationPresent: true,
    citationCount: 3
  },
  {
    promptName: "Team collaboration analytics platform recommendations",
    intent: "Informational",
    mentionType: "primary",
    citationPresent: true,
    citationCount: 2
  },
  {
    promptName: "Most trusted enterprise analytics vendors",
    intent: "Trust",
    mentionType: "secondary",
    citationPresent: false,
    citationCount: 0
  },
  {
    promptName: "Enterprise analytics software pricing",
    intent: "Transactional",
    mentionType: "secondary",
    citationPresent: true,
    citationCount: 1
  },
  {
    promptName: "Compare data observability tools",
    intent: "Comparative",
    mentionType: "implied",
    citationPresent: true,
    citationCount: 2
  },
  {
    promptName: "Best analytics platform for project reporting",
    intent: "Informational",
    mentionType: "primary",
    citationPresent: true,
    citationCount: 1
  }
];

