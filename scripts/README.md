# Admin Reset Script

## Overview

The `reset-admin.ts` script provides a secure way to completely reset admin access to the casino backend system. It removes all existing admin accounts and creates a new admin with a randomly generated strong password.

## Features

- Removes all existing admin accounts from the database
- Prompts for new admin email address
- Generates a cryptographically secure 16-character password containing:
  - Lowercase letters
  - Uppercase letters
  - Numbers
  - Special characters
- Creates new admin account with generated credentials
- Displays the new credentials for secure storage

## Usage

### Method 1: Using Yarn (Recommended)

```bash
yarn admin:reset
```

### Method 2: Direct Execution

```bash
ts-node -r tsconfig-paths/register scripts/reset-admin.ts
```

## Interactive Process

When you run the script, it will:

1. Prompt you to enter an email address for the new admin
2. Validate the email format
3. Connect to the database
4. Remove all existing admin accounts
5. Generate a strong random password
6. Create the new admin account
7. Display the credentials

## Example Output

```
============================================================
Admin Reset Script
============================================================

Enter the email for the new admin: admin@example.com

⚙️  Connecting to database...
✅ Database connected

🗑️  Removing all existing admins...
   Found 2 existing admin(s)
✅ All existing admins removed

🔐 Generating strong password...
✅ Password generated

👤 Creating new admin...
✅ New admin created successfully

============================================================
NEW ADMIN CREDENTIALS
============================================================

Email:    admin@example.com
Password: aB3$xK9#mQ2@wL7!

⚠️  IMPORTANT: Save these credentials securely!
   This password will not be shown again.
============================================================

✅ Script completed successfully
```

## Environment Variables

The script uses the following environment variables from your `.env` file:

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `DB_NAME` - Database name (default: casino_db)

## Security Considerations

- **Irreversible Action**: This script permanently deletes ALL admin accounts. Make sure this is what you want before running it.
- **Password Storage**: The generated password is only shown once. Store it securely (e.g., in a password manager).
- **Production Use**: Use caution when running this in production environments. Consider backing up your database first.
- **Access Control**: Only run this script if you have legitimate administrative access to the system.

## Password Strength

Generated passwords are 16 characters long and include:
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character
- Randomized character order using cryptographically secure random number generation

## Troubleshooting

### Database Connection Errors

If you see database connection errors:
1. Verify your `.env` file has correct database credentials
2. Ensure the database server is running
3. Check network connectivity to the database host

### Invalid Email Error

If you see "Invalid email format":
- Ensure the email follows standard format (e.g., user@domain.com)
- Check for typos or extra spaces

### TypeScript Compilation Errors

The script uses ts-node for execution and doesn't require pre-compilation. If you see TypeScript errors, they are likely pre-existing project configuration issues and won't affect the script's runtime execution.

## Related Files

- `scripts/reset-admin.ts` - Main script file
- `src/entities/admin-user.entity.ts` - Admin user entity definition
- `src/admin/services/admin.service.ts` - Admin authentication service
- `package.json` - Contains the `admin:reset` command definition
