# Manual Migration Process

## Overview
The staging branch does not automatically run migrations on deployment. All database migrations must be executed manually to ensure proper deployment control and avoid potential data issues.

## Migration Commands

### Development Environment
```bash
# Generate a new migration
yarn typeorm migration:generate -n MigrationName

# Run pending migrations
yarn typeorm migration:run

# Revert last migration
yarn typeorm migration:revert

# Show migration status
yarn typeorm migration:show
```

### Production/Staging Deployment Process

1. **Before Deployment**
   - Review all pending migrations
   - Test migrations on a staging database copy
   - Document any potential downtime requirements

2. **During Deployment**
   ```bash
   # Connect to the production/staging database
   # Check current migration status
   yarn typeorm migration:show
   
   # Run all pending migrations
   yarn typeorm migration:run
   
   # Verify migrations were successful
   yarn typeorm migration:show
   ```

3. **After Deployment**
   - Verify application starts successfully
   - Run basic smoke tests
   - Monitor application logs for any database-related errors

## Migration Best Practices

### Creating Migrations
- Always review generated migrations before running
- Ensure migrations are reversible when possible
- Test both up and down migrations
- Consider data migration requirements

### Deployment Checklist
- [ ] Backup production database before migration
- [ ] Review all pending migrations
- [ ] Test migrations on staging environment
- [ ] Run migrations during maintenance window if needed
- [ ] Verify application functionality after migration
- [ ] Update deployment documentation

## Troubleshooting

### Common Issues
1. **Migration fails**: 
   - Check database connection
   - Review migration SQL for syntax errors
   - Ensure proper permissions

2. **Application fails to start after migration**:
   - Check entity definitions match database schema
   - Verify all required columns exist
   - Review application logs

3. **Data integrity issues**:
   - Run data validation queries
   - Check foreign key constraints
   - Verify default values are applied correctly

## Environment Variables
Ensure these are properly configured for each environment:
```
DB_HOST=your-database-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-database-name
```

## Notes
- Always coordinate migrations with team members
- Document any manual data fixes required
- Keep migration rollback plans ready
- Test thoroughly before production deployment

---
*Last Updated: 2025-08-27*
*Contact: Development Team for questions*