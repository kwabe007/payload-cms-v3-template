// Validated environment variables. Import `env` instead of reading process.env directly
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  PAYLOAD_SECRET: z.string().min(1),
  SERVER_URL: z.url(),
  FRONTEND_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

// Checked by name in instrumentation-node.ts
const ENV_VALIDATION_ERROR = "EnvValidationError";

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const error = new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`,
    );
    error.name = ENV_VALIDATION_ERROR;
    throw error;
  }

  return result.data;
}

export const env = parseEnv();
