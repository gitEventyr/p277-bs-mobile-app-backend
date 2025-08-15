# Development Dockerfile
FROM node:20-alpine AS development

# Add DNS tools and configure DNS
RUN apk add --no-cache bind-tools curl

WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock ./

# Configure npm/yarn with DNS and retry settings
RUN yarn config set network-timeout 600000 && \
    yarn config set registry https://registry.npmjs.org/ && \
    echo "nameserver 8.8.8.8" > /etc/resolv.conf && \
    echo "nameserver 8.8.4.4" >> /etc/resolv.conf

# Install dependencies with retries
RUN for i in 1 2 3; do yarn install --frozen-lockfile --network-concurrency 1 && break || sleep 10; done

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application in development mode
CMD ["yarn", "start:dev"]

# Production Dockerfile
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock ./

# Install only production dependencies with network retry
RUN apk add --no-cache bind-tools && \
    yarn config set network-timeout 300000 && \
    yarn config set registry https://registry.npmjs.org/ && \
    yarn install --frozen-lockfile --production --network-concurrency 1

# Copy built application
COPY dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]