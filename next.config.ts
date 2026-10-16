import { withSentryConfig } from "@sentry/nextjs/config";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// The Sentry DSN is inlined into the server and client bundles, so it's checked here to fail the build instead of
// silently disabling Sentry. Unset or empty disables Sentry
const sentryDsn = z
  .union([z.literal(""), z.url()])
  .optional()
  .safeParse(process.env.NEXT_PUBLIC_SENTRY_DSN);

if (!sentryDsn.success) {
  throw new Error(
    `Invalid NEXT_PUBLIC_SENTRY_DSN:\n${z.prettifyError(sentryDsn.error)}`,
  );
}

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return webpackConfig;
  },
  output: "standalone",
  // Sentry registers its diagnostics-channel hook with module.register() using a path built at runtime, so file tracing
  // can't find it, and it's missing from the standalone output
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/.pnpm/@sentry+server-runtime-injection@*/node_modules/@sentry/server-runtime-injection/build/**/*",
      "./node_modules/.pnpm/@sentry+server-utils@*/node_modules/@sentry/server-utils/build/**/*",
    ],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
};

export default withSentryConfig(
  withPayload(nextConfig, { devBundleServerPackages: false }),
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    // Where source maps are uploaded. Read at build time, so in Docker they must be passed as build args. Empty strings
    // are turned into undefined because the plugin only falls back to its defaults for undefined values
    org: process.env.SENTRY_ORG || undefined,
    project: process.env.SENTRY_PROJECT || undefined,
    sentryUrl: process.env.SENTRY_URL || undefined,

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    webpack: {
      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,

      // Tree-shaking options for reducing bundle size
      treeshake: {
        // Automatically tree-shake Sentry logger statements to reduce bundle size
        removeDebugLogging: true,
      },
    },
  },
);
