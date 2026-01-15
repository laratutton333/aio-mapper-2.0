import "server-only";

type ServerEnvName =
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "OPENAI_API_KEY"
  | "OPENAI_MODEL_MAIN"
  | "OPENAI_MODEL_ANALYSIS"
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET"
  | "DATABASE_URL";

function requireServerEnv(name: ServerEnvName) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseServiceRoleEnv() {
  return {
    SUPABASE_SERVICE_ROLE_KEY: requireServerEnv("SUPABASE_SERVICE_ROLE_KEY")
  };
}

export function getOpenAiEnv() {
  return {
    OPENAI_API_KEY: requireServerEnv("OPENAI_API_KEY")
  };
}

export function getOpenAiModelEnv() {
  return {
    OPENAI_MODEL_MAIN: requireServerEnv("OPENAI_MODEL_MAIN"),
    OPENAI_MODEL_ANALYSIS: requireServerEnv("OPENAI_MODEL_ANALYSIS")
  };
}

export function getStripeEnv() {
  return {
    STRIPE_SECRET_KEY: requireServerEnv("STRIPE_SECRET_KEY"),
    STRIPE_WEBHOOK_SECRET: requireServerEnv("STRIPE_WEBHOOK_SECRET")
  };
}

export function getDatabaseEnv() {
  return {
    DATABASE_URL: requireServerEnv("DATABASE_URL")
  };
}
