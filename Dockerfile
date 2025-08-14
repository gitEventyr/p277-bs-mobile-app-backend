# Development Dockerfile
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies with network retry
RUN yarn config set network-timeout 300000 && \
    yarn config set registry https://registry.npmjs.org/ && \
    yarn install --frozen-lockfile --network-concurrency 1

# Copy source code
COPY . .

# Build the application
RUN yarn build

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
RUN yarn config set network-timeout 300000 && \
    yarn config set registry https://registry.npmjs.org/ && \
    yarn install --frozen-lockfile --production --network-concurrency 1

# Copy built application
COPY dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]