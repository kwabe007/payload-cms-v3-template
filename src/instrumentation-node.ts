// Node.js-only startup checks. Kept separate from instrumentation.ts so it's never bundled for the Edge runtime
const requiredEnvVars = [
  "DATABASE_URL",
  "PAYLOAD_SECRET",
  "SERVER_URL",
  "CORS_ORIGINS",
  "FRONTEND_URL",
];

export function validateEnv() {
  const missing = requiredEnvVars.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
    process.exit(1);
  }
}
