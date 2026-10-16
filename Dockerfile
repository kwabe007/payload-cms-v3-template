# syntax=docker/dockerfile:1
ARG PNPM_VERSION=12.5.1

FROM node:24.12.0-alpine AS base

# Prevent "No TTY" errors from pnpm
ENV CI=true


# Install dependencies
FROM base AS deps
WORKDIR /app

ARG PNPM_VERSION

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable pnpm && corepack prepare pnpm@${PNPM_VERSION} --activate
RUN pnpm i --frozen-lockfile

# Build source
FROM base AS builder
WORKDIR /app

ARG PNPM_VERSION

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && corepack prepare pnpm@${PNPM_VERSION} --activate
# Sentry project that source maps are uploaded to, and the DSN that's inlined into the client bundle
ARG SENTRY_URL
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG NEXT_PUBLIC_SENTRY_DSN
# Sentry auth token for uploading source maps. Passed as a secret so it isn't stored in the image
RUN --mount=type=secret,id=sentry_auth_token,env=SENTRY_AUTH_TOKEN \
    pnpm run build


# Production image
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Remove this line if you do not have this folder
# COPY --from=builder /app/public ./public

# Create folder for the prerender cache
RUN mkdir .next

# Create folder for file uploads
RUN mkdir uploads

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nodejs:nodejs /app

ENV NODE_ENV=production
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000

USER nodejs

CMD ["node", "server.js"]