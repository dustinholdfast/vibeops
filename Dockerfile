# ── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy source
COPY . .

# Build (Vite handles TypeScript via esbuild)
RUN npm run build

# ── Production stage ─────────────────────────────────────────
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/vibeops.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
