export type AiPromptTemplateRow = {
  id: string;
  name: string;
  intent: string;
  prompt_template: string;
  is_active: boolean;
  created_at: string | null;
};

export type AiPromptRunRow = {
  id: string;
  audit_id: string | null;
  prompt_id: string | null;
  brand_name: string;
  model: string;
  raw_response: string;
  executed_at: string | null;
};

export type AiBrandPresenceRow = {
  id: string;
  prompt_run_id: string | null;
  brand_detected: boolean;
  mention_type: string | null;
  citation_present: boolean;
  confidence: number | null;
  created_at: string | null;
};

export type BrandPresenceResult = {
  brandDetected: boolean;
  mentionType: string | null;
  citationPresent: boolean;
  confidence: number | null;
};

export type RunVisibilityRequest = {
  brand: string;
  auditId: string | null;
  model: string | null;
};
