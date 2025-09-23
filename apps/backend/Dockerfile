FROM node:18-alpine AS base
RUN apk add --no-cache python3 make g++ curl
WORKDIR /app

FROM base AS deps
RUN npm install -g pnpm
# Copy workspace files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/
# Install all dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
RUN npm install -g pnpm
COPY . .
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app
# Install dependencies specifically for backend
RUN pnpm install --frozen-lockfile --filter=backend
WORKDIR /app/apps/backend
RUN pnpm build

# Debug: Check if dist folder was created
RUN echo "=== Checking if dist folder exists ==="
RUN ls -la /app/apps/backend/
RUN ls -la /app/apps/backend/dist/ || echo "dist folder not found"

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 backend

# Copy built app
COPY --from=builder --chown=backend:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/apps/backend/package.json ./package.json

# Copy email templates
COPY --from=builder --chown=backend:nodejs /app/apps/backend/src/services/mail/templates ./dist/services/mail/templates

# Copy .env file for local testing
COPY --from=builder --chown=backend:nodejs /app/apps/backend/.env ./.env

# Debug: Check what's in the runner stage
RUN echo "=== Checking runner stage contents ==="
RUN ls -la /app/
RUN ls -la /app/dist/ || echo "dist folder not found in runner"

# Install dependencies using npm instead of pnpm to avoid workspace issues
RUN npm install --production --ignore-scripts

# Remove the "type": "module" from package.json to use CommonJS
RUN sed -i '/"type": "module"/d' package.json

USER backend
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["node", "dist/server.js"]