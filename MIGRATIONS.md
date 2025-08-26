# Database Migrations Guide

This guide explains how to manage database migrations for the Casino Backend API.

## Migration Strategy

- **Development**: Uses `synchronize: true` by default for rapid development
- **Staging/Production**: Uses proper migrations with `synchronize: false`
- **Migration Mode**: Can be forced in development by setting `USE_MIGRATIONS=true`

## Environment Variables

Add these to your `.env` files:

```bash
# Force migration mode in development (optional)
USE_MIGRATIONS=false

# Auto-run migrations on startup (production/staging)
RUN_MIGRATIONS=true

# Database SSL (production)
DB_SSL=true
```

## Migration Commands

### Generate a new migration based on entity changes
```bash
yarn migration:generate src/migrations/MigrationName
```

### Create an empty migration file
```bash
yarn migration:create src/migrations/MigrationName  
```

### Run pending migrations
```bash
yarn migration:run
```

### Revert the last migration
```bash
yarn migration:revert
```

### Show migration status
```bash
yarn migration:show
```

### Drop entire schema (DANGEROUS!)
```bash
yarn schema:drop
```

## Deployment Process

### 1. Using the Deploy Script (Recommended)
```bash
./scripts/deploy.sh
```

### 2. Manual Deployment Steps
```bash
# Install dependencies
yarn install --frozen-lockfile

# Build application
yarn build

# Run migrations
yarn migration:run

# Start application
yarn start:prod
```

### 3. CI/CD Integration
Add this to your deployment pipeline:

```yaml
- name: Run Database Migrations
  run: yarn migration:run
  env:
    NODE_ENV: production
    DB_HOST: ${{ secrets.DB_HOST }}
    DB_USERNAME: ${{ secrets.DB_USERNAME }}
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    DB_NAME: ${{ secrets.DB_NAME }}
    DB_SSL: true
```

## Migration Best Practices

### 1. Always Test Migrations
- Test in development first
- Test on staging environment
- Have a rollback plan

### 2. Migration Naming Convention
```
YYYYMMDDHHMM-DescriptiveName.ts
```

### 3. Safe Migration Practices
- Add columns as nullable first, then alter if needed
- Drop columns in separate migrations
- Create indexes in separate migrations for large tables
- Use transactions when possible

### 4. Example Migration
```typescript
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserPreferences1725019200000 implements MigrationInterface {
  name = 'AddUserPreferences1725019200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('players', new TableColumn({
      name: 'preferences',
      type: 'jsonb',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('players', 'preferences');
  }
}
```

## Troubleshooting

### Common Issues

1. **Migration fails with "column already exists"**
   - Check if migration was partially applied
   - Manually fix database state or create corrective migration

2. **Entities out of sync with database**
   - Run `yarn migration:generate` to create sync migration
   - Review and edit generated migration before applying

3. **Migration timeout**
   - Increase timeout in database config
   - Break large migrations into smaller chunks

### Recovery Commands

```bash
# Check current migration status
yarn migration:show

# Force mark migration as run (use carefully!)
# Manually insert into typeorm_migrations table

# Reset database (development only)
yarn schema:drop
yarn migration:run
```

## Production Deployment Checklist

- [ ] Migrations tested in development
- [ ] Migrations tested in staging
- [ ] Database backup created
- [ ] Migration rollback plan ready
- [ ] Environment variables configured
- [ ] SSL certificates configured (if needed)
- [ ] Migration scripts executable
- [ ] CI/CD pipeline configured