#!/bin/bash

# Casino Backend Deployment Script for AWS
# This script handles deployment to AWS ECS/EC2 with RDS database

set -e  # Exit on any error

echo "🚀 Starting Casino Backend AWS Deployment"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Environment setup
export NODE_ENV="${NODE_ENV:-staging}"
export USE_MIGRATIONS="${USE_MIGRATIONS:-true}"
export RUN_MIGRATIONS="${RUN_MIGRATIONS:-false}"  # Don't auto-run on startup in AWS
export DB_SSL="${DB_SSL:-true}"  # Enable SSL for AWS RDS

echo "📋 Environment: $NODE_ENV"
echo "🔒 SSL Enabled: $DB_SSL"
echo "🗃️  Using Migrations: $USE_MIGRATIONS"

# Verify required environment variables
required_vars=("DB_HOST" "DB_USERNAME" "DB_PASSWORD" "DB_NAME" "JWT_SECRET" "SESSION_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile --production=false

# Run linting and tests (optional, can be skipped with SKIP_TESTS=true)
if [ "$SKIP_TESTS" != "true" ]; then
    echo "🔍 Running linter..."
    yarn lint
    
    echo "🧪 Running tests..."
    yarn test --passWithNoTests
fi

# Build the application
echo "🔨 Building application..."
yarn build

# Database operations
echo "🗃️  Database Operations"
echo "📊 Checking current migration status..."
yarn migration:show || true  # Don't fail if no migrations exist yet

# Run migrations manually (safer for production)
echo "🗃️  Running database migrations..."
yarn migration:run

echo "📊 Final migration status..."
yarn migration:show

# Clean up dev dependencies for smaller image
if [ "$CLEAN_DEPS" = "true" ]; then
    echo "🧹 Cleaning up dev dependencies..."
    yarn install --frozen-lockfile --production=true
fi

# Health check
echo "🏥 Running health check..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build artifact created successfully"
else
    echo "❌ Error: Build artifact not found"
    exit 1
fi

echo ""
echo "🎉 AWS Deployment completed successfully!"
echo ""
echo "Next steps for Linux container deployment:"
echo "1. 📦 Transfer dist/ and node_modules/ to your AWS instance"
echo "2. 🔄 Update environment variables on the instance"
echo "3. 🚀 Restart the application service:"
echo "   - PM2: pm2 restart casino-backend"
echo "   - Systemd: sudo systemctl restart casino-backend"
echo "   - Direct: NODE_ENV=staging node dist/main.js"
echo "4. 🔍 Monitor logs:"
echo "   - PM2: pm2 logs casino-backend"
echo "   - Systemd: journalctl -u casino-backend -f"
echo "   - CloudWatch: aws logs tail /aws/ec2/casino-backend --follow"
echo ""
echo "Or start locally with: yarn start:prod"