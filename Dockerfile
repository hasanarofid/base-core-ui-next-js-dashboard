# ---------- Dependencies (install sekali, cacheable)
FROM node:20-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---------- Build (Next.js 15, React 19)
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build production (menghasilkan .next/standalone dan .next/static)
RUN npm run build

# ---------- Runtime (minimal, non-root, standalone)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3034

# Non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Salin artefak minimal untuk run
# .next/standalone sudah termasuk server.js dan node_modules yang dibutuhkan
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Healthcheck sederhana
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:3034/ || exit 1

EXPOSE 3034
USER nextjs

# Next standalone start
CMD ["node", "server.js"]
