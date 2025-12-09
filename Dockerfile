# ============================================
# Dockerfile - Multi-Stage Build for Next.js
# ============================================
# This Dockerfile uses multi-stage builds to create
# a small, optimized production image

# ============================================
# Stage 1: Dependencies
# ============================================
# Install dependencies in a separate stage
# This layer can be cached if package.json doesn't change
FROM node:20-alpine AS deps

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# ============================================
# Stage 2: Builder
# ============================================
# Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# ============================================
# Stage 3: Runner (Production)
# ============================================
# Create final, minimal production image
FROM node:20-alpine AS runner

WORKDIR /app

# Don't run as root user (security best practice)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]

