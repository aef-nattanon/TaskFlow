# ── Server Dockerfile ──
FROM node:20-alpine AS base

WORKDIR /app

# Install ALL dependencies (including dev for prisma CLI + tsc)
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code and build
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

# ── Production stage ──
FROM node:20-alpine AS production

WORKDIR /app

# Install ALL dependencies (we need prisma CLI for db push at startup)
COPY package.json package-lock.json ./
RUN npm ci

# Copy generated Prisma client, schema, and built JS
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Push schema to DB and start server
CMD npx prisma db push --skip-generate && node dist/index.js
