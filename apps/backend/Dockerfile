FROM node:18-alpine

WORKDIR /app

# Add build dependencies for native modules like bcrypt
RUN apk add --no-cache python3 make g++ curl

# Copy package files from the correct location when context is root
COPY apps/backend/package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm \
  && pnpm install --no-frozen-lockfile

# Copy backend source
COPY apps/backend/ ./

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["pnpm", "dev"]