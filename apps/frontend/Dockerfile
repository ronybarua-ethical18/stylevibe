FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy the monorepo (use .dockerignore to keep it small)
COPY . .

# Install only the frontend workspace
RUN pnpm -C apps/frontend install --frozen-lockfile

# Build-time client env
ARG NEXT_PUBLIC_API_URL=http://backend:8000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Skip lint and TS during Docker build
ENV NEXT_DISABLE_ESLINT=1
ENV NEXT_PRIVATE_SKIP_TYPE_CHECK=1

# Build Next.js
RUN pnpm -C apps/frontend exec next build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/package.json ./package.json

# Install only production dependencies
RUN npm install --only=production

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]