<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Casino Backend API

A comprehensive NestJS-based casino backend system with user management, game session tracking, financial transactions, and administrative controls.

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Git

### Run the entire stack locally:

```bash
# Clone and navigate to the project
git clone <repository-url>
cd casino-backend

# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# Check logs
docker-compose logs -f api
```

The services will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Stop services:
```bash
docker-compose down
```

### Stop services and remove volumes:
```bash
docker-compose down -v
```

## 🛠️ Local Development Setup (without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Setup Steps:

1. **Install dependencies:**
```bash
yarn install
```

2. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your local database credentials
```

3. **Setup PostgreSQL database:**
```sql
-- Connect to PostgreSQL and run:
CREATE DATABASE casino_dev;
-- Import the schema:
\i initial-files/test-schema.sql
```

4. **Start Redis:**
```bash
redis-server
```

5. **Run the application:**
```bash
# Development mode with hot reload
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📚 API Documentation

Once running, visit http://localhost:3000/api for comprehensive Swagger documentation.

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache/Sessions**: Redis
- **Authentication**: JWT + Session-based
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

### Database Entities
- Players (user management)
- Admin Users (admin authentication)
- Devices (device tracking)
- Coins Balance Changes (transaction audit)
- Play History (game sessions)
- In-App Purchases (monetization)
- Vouchers & User Vouchers (rewards system)

## 🔧 Available Scripts

### Development Scripts
```bash
yarn start:dev      # Start development server with hot reload
yarn build          # Build the application
yarn start:prod     # Start production server
yarn lint           # Run ESLint with auto-fix
yarn format         # Format code with Prettier
```

### Testing Scripts
```bash
yarn test           # Run unit tests
yarn test:watch     # Run tests in watch mode
yarn test:e2e       # Run end-to-end tests
yarn test:cov       # Run tests with coverage
```

### Database Scripts
```bash
# Migrations
yarn migration:generate  # Generate a new migration
yarn migration:create    # Create an empty migration file
yarn migration:run       # Run pending migrations
yarn migration:revert    # Revert the last migration
yarn migration:show      # Show migration status

# Database Management
yarn schema:drop         # Drop entire database schema
yarn db:cleanup          # Clean all data and re-seed admin users
```

### Database Cleanup Script

The `yarn db:cleanup` command provides a safe way to reset your development database:

- **What it does**: Removes ALL data from all tables while preserving the database structure
- **Safety**: Uses `TRUNCATE` to clear tables without dropping/recreating them
- **Auto-seeding**: Automatically re-creates admin users after cleanup
- **Foreign keys**: Temporarily disables constraints to ensure clean truncation

**Usage:**
```bash
yarn db:cleanup
```

**After running, you'll have:**
- Empty database with intact structure
- Fresh admin accounts:
  - `admin@casino.com` / `admin123`
  - `test@admin.com` / `test123`

⚠️ **Warning**: This removes ALL data including players, transactions, and game history. Only use in development!

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
