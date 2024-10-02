# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock files to install dependencies
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies, separate to enable layer caching
RUN npm install --force

# Copy all project files (after dependencies, so this layer is only invalidated when files change)
COPY . .

# Build the Next.js app
RUN pnpm run build

# Stage 2: Production image with the built app
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy the build folder and essential files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment variable to production
ENV NODE_ENV=production

# Expose the port that your app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start"]
