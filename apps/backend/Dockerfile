FROM node:18-alpine AS base
RUN apk add --no-cache python3 make g++ curl
WORKDIR /app

FROM base AS deps
RUN npm install -g pnpm
# Copy all workspace files for proper dependency resolution
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/
# Install all dependencies (including workspace dependencies)
RUN pnpm install --frozen-lockfile

FROM base AS builder
RUN npm install -g pnpm
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# Recreate the workspace structure for backend
WORKDIR /app
RUN pnpm install --frozen-lockfile --filter=backend
WORKDIR /app/apps/backend
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 backend

# Copy built app and all necessary dependencies
COPY --from=builder --chown=backend:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/apps/backend/package.json ./package.json
COPY --from=deps --chown=backend:nodejs /app/node_modules ./node_modules

USER backend
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["node", "dist/server.js"]