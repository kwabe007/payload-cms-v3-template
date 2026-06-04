ARG PNPM_VERSION=11.1.1

FROM node:24.15.0-alpine AS base

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
RUN pnpm run generate:importmap
RUN pnpm run build


# Production image
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Remove this line if you do not have this folder
# COPY --from=builder /app/public ./public

# Create folder for the prerender cache
RUN mkdir .next

# Create media folder for uploads
RUN mkdir media

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nodejs:nodejs /app

ENV NODE_ENV production
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME=0.0.0.0
ENV PORT 3000

EXPOSE 3000

USER nodejs

CMD ["node", "server.js"]