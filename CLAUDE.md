# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Commit Guidelines

**IMPORTANT: When creating git commits:**
- NEVER include "Claude", "AI", "assistant", or any AI-related mentions in commit messages
- NEVER add "Co-Authored-By: Claude" or similar attribution
- NEVER use "🤖 Generated with [Claude Code]" or similar taglines
- Write commit messages as if they were written directly by the developer
- Use professional, concise commit messages following conventional commit format
- Focus on WHAT changed and WHY, not WHO or WHAT TOOL made the changes

Example of correct commit message:
```
fix: Update Dockerfile for Node.js 20 compatibility

- Upgrade from Node.js 18 to Node.js 20 to support latest dependencies
- Remove DNS configuration lines causing build failures
```

## Commands

**Development:**
- `yarn install` - Install dependencies
- `yarn start:dev` - Run in development with hot reload
- `yarn start` - Run in production mode
- `yarn build` - Build the application

**Testing:**
- `yarn test` - Run unit tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:e2e` - Run end-to-end tests
- `yarn test:cov` - Run tests with coverage

**Code Quality:**
- `yarn lint` - Run ESLint with auto-fix
- `yarn format` - Format code with Prettier

## Architecture

This is a NestJS-based casino backend application with the following key architectural components:

### Core Stack
- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL with TypeORM (auto-sync enabled)
- **Session Management:** Redis with express-session
- **Authentication:** Cookie-based sessions
- **API Documentation:** Swagger UI available at `/api`

### Global Infrastructure
The application uses several global components configured in `main.ts`:

1. **Global Exception Filter** (`src/common/filters/global-exception.filter.ts`): Standardizes all error responses with `{ success: false, statusCode, message }` format
2. **Response Interceptor** (`src/common/interceptors/response.interceptor.ts`): Wraps all successful responses in `{ success: true, data }` format
3. **Validation Pipe**: Global input validation with whitelist and transform enabled
4. **CORS**: Configured for `http://localhost:3000` with credentials support

### Database Configuration
- TypeORM is configured with `autoLoadEntities: true` and `synchronize: true` (development setting)
- Database connection uses environment variables from `.env.example`
- PostgreSQL is the primary database

### Session & Security
- Redis-backed session storage using connect-redis v5
- Helmet for security headers
- Cookie parser middleware
- Session-based authentication with configurable security settings

### Environment Configuration
The application expects these environment variables:
- `PORT` (default: 3000)
- `SESSION_SECRET`
- `REDIS_HOST`, `REDIS_PORT`
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`

### Response Format
All API responses follow a consistent format:
- Success: `{ success: true, data: ... }`
- Error: `{ success: false, statusCode: number, message: ... }`

### Testing Setup
- Jest configuration in `package.json`
- Unit tests use `.spec.ts` suffix
- E2E tests configured with separate Jest config
- Coverage reporting enabled