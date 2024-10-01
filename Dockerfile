# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for installing dependencies
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all project files to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production image with the built app
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy the build folder from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment variable to production
ENV NODE_ENV=production

# Expose the port that your app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
