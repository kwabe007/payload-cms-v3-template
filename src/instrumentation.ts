import * as Sentry from "@sentry/nextjs";

/**
 * Runs once when the Next.js server starts (does not run during build or Payload CLI commands).
 */
export async function register() {
  // register() is also called in the Edge runtime (if edge code exists), which doesn't support process.exit. Importing
  // inside this check keeps the Node-only code out of the Edge bundle
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("./instrumentation-node");
    await validateEnv();
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
