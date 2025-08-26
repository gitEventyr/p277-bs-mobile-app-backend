# AWS Ubuntu Deployment Guide

This guide will walk you through setting up the casino backend application on an AWS Ubuntu instance with AWS RDS PostgreSQL database.

## Prerequisites
- AWS EC2 Ubuntu instance running
- AWS RDS PostgreSQL database created
- Database endpoint, username, and password from AWS
- SSH access to your Ubuntu instance

## Step 1: Initial Server Setup

### Connect to your Ubuntu instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Update the system
```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install Required Software

### Install Node.js (version 20)
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Install Yarn
```bash
# Install Yarn globally
sudo npm install -g yarn

# Verify installation
yarn --version
```

### Install PM2 (Process Manager)
```bash
# Install PM2 globally for process management
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Install Nginx (Web Server/Reverse Proxy)
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

## Step 3: Clone and Setup the Project

### Clone the repository
```bash
# Navigate to home directory
cd ~

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Install project dependencies
```bash
# Install all dependencies
yarn install
```

## Step 4: Environment Configuration

### Create environment file
```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file
nano .env
```

### Configure your .env file with these values:
```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# AWS RDS PostgreSQL Database Configuration
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-database-name

# Migration Configuration (REQUIRED for production)
USE_MIGRATIONS=true
RUN_MIGRATIONS=false

# JWT Configuration (required for authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# Additional configurations (if needed)
CORS_ORIGIN=http://your-domain.com
```

**Important Notes:**
- Replace `your-rds-endpoint.region.rds.amazonaws.com` with your actual RDS endpoint
- Replace database credentials with your actual AWS RDS values
- Generate a strong session secret (you can use: `openssl rand -base64 32`)
- `USE_MIGRATIONS=true` ensures proper database schema management in production
- `RUN_MIGRATIONS=false` means migrations are run manually for safety
- Save and exit nano with `Ctrl+X`, then `Y`, then `Enter`

## Step 5: Build the Application

### Build the project
```bash
# Build the application
yarn build
```

### Test the connection
```bash
# Test if the app starts correctly
yarn start

# If successful, you should see:
# - Server running on port 3000
# - Database connection successful
# - No errors in console

# Stop the test with Ctrl+C
```

## Step 6: Configure PM2 for Process Management

### Create PM2 ecosystem file
```bash
# Create PM2 configuration
nano ecosystem.config.js
```

### Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'casino-backend',
    script: 'dist/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### Start the application with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it gives you (usually something like: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu)

# Check application status
pm2 status
pm2 logs casino-backend
```

## Step 7: Configure Nginx Reverse Proxy

### Create Nginx configuration
```bash
# Create a new Nginx site configuration
sudo nano /etc/nginx/sites-available/casino-backend
```

### Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or use _ for any domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable the site and restart Nginx
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/casino-backend /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 8: Configure Security Group (AWS Console)

### In your AWS Console:
1. Go to EC2 → Security Groups
2. Find your instance's security group
3. Add these inbound rules:
   - **HTTP**: Port 80, Source: 0.0.0.0/0 (Anywhere)
   - **HTTPS**: Port 443, Source: 0.0.0.0/0 (Anywhere) - for future SSL
   - **SSH**: Port 22, Source: Your IP (for security)

## Step 9: Test the Deployment

### Check if everything is running
```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check application logs
pm2 logs casino-backend

# Test the API endpoint
curl http://localhost/api
# or
curl http://your-ec2-public-ip/api
```

### Access your application
- Open your browser and go to: `http://your-ec2-public-ip`
- API documentation should be available at: `http://your-ec2-public-ip/api`

## Step 10: Database Migration (CRITICAL - Database Schema Setup)

### Run database migrations to create all tables
```bash
# IMPORTANT: This step creates all database tables and relationships
# The migration system will create:
# - players (main user table with all fields including soft delete)
# - admin_users (admin authentication)
# - devices (device tracking)
# - coins_balance_changes (transaction history)
# - play_history (game records)
# - in_app_purchases (purchase records)
# - vouchers (reward system)
# - users_vouchers (user-voucher relationships)
# - password_reset_tokens (password recovery)

# First, verify migration files exist
ls src/migrations/
# Should show: 1725000000000-InitialDatabaseSchema.ts

# Run the migration to create all tables
yarn migration:run

# Verify migration was successful
yarn migration:show
# Should show: ✓ InitialDatabaseSchema1725000000000

# Check for any errors in the logs
pm2 logs casino-backend
```

**What the initial migration creates:**
- Complete database schema with all 9 tables
- Primary keys, foreign keys, and relationships
- Indexes for optimal query performance
- Soft delete functionality built into players table
- UUID support for admin users and password tokens
- Proper PostgreSQL data types and constraints

### Test database connection and migration
```bash
# Check application logs for database connection
pm2 logs casino-backend

# Look for messages like:
# - "Database connection successful"
# - Migration completed messages
# - No database-related errors

# Test registration still works after migration
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User", "password": "Test123456"}'
```

## Maintenance Commands

### Useful commands for managing your deployment:

```bash
# View application logs
pm2 logs casino-backend

# Restart application
pm2 restart casino-backend

# Stop application
pm2 stop casino-backend

# Monitor application
pm2 monit

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Pull latest code and redeploy
git pull origin main
yarn install
yarn build

# IMPORTANT: Run database migrations to create/update all tables
yarn migration:run

pm2 restart casino-backend
```

## Troubleshooting

### Common Issues:

1. **Database Connection Issues:**
   - Check if RDS security group allows connections from your EC2 instance
   - Verify database credentials in `.env` file
   - Ensure RDS instance is publicly accessible (if needed)

2. **Application Won't Start:**
   - Check PM2 logs: `pm2 logs casino-backend`
   - Verify all environment variables are set correctly
   - Ensure all dependencies are installed: `yarn install`

3. **Can't Access from Browser:**
   - Check EC2 security group has port 80 open
   - Verify Nginx is running: `sudo systemctl status nginx`
   - Check Nginx configuration: `sudo nginx -t`

4. **High Memory Usage:**
   - Monitor with `pm2 monit`
   - Adjust `max_memory_restart` in `ecosystem.config.js`

5. **Database Migration Issues:**
   ```bash
   # Check migration status
   yarn migration:show
   
   # If migration fails, check specific error
   pm2 logs casino-backend
   
   # Common fix for "column already exists" error:
   # This might happen if migration was partially applied
   
   # To manually check database state:
   # (Replace with your actual RDS credentials)
   ```
   
6. **Registration Returns "Database operation failed":**
   - This indicates database tables are missing or incomplete
   - Run: `yarn migration:run`
   - Verify with: `yarn migration:show`
   - Check logs: `pm2 logs casino-backend`
   - Restart app: `pm2 restart casino-backend`

### Check Services Status:
```bash
# Check all services
pm2 status
sudo systemctl status nginx
sudo systemctl status ssh

# Check open ports
sudo netstat -tlnp
```

## Security Recommendations

1. **Set up a firewall:**
```bash
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS (future SSL)
```

2. **Keep system updated:**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Consider SSL/TLS certificate (Let's Encrypt)** - This can be added later once you have a domain name.

---

Your casino backend should now be running on AWS Ubuntu with AWS RDS PostgreSQL database!