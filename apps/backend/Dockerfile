FROM node:18-alpine

WORKDIR /app

COPY apps/backend/package*.json ./
COPY pnpm-lock.yaml ./

RUN apk add --no-cache curl \
  && npm install -g pnpm \
  && pnpm install --no-frozen-lockfile

COPY apps/backend/ ./

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["pnpm", "dev"]