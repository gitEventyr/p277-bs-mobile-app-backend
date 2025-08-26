module.exports = {
  apps: [
    {
      name: 'casino-backend',
      script: 'dist/main.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'staging',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_file: '/var/log/casino-backend/combined.log',
      out_file: '/var/log/casino-backend/out.log',
      error_file: '/var/log/casino-backend/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Restart policy
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      // Health check
      health_check_grace_period: 30000, // 30 seconds
      // Environment-specific settings
      source_map_support: true,
      ignore_watch: ['node_modules', 'logs'],
    },
  ],
  
  // Deployment configuration (optional)
  deploy: {
    staging: {
      user: 'ec2-user',
      host: ['your-staging-server.com'],
      key: '~/.ssh/your-key.pem',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/casino-backend.git',
      path: '/var/www/casino-backend',
      'pre-deploy-local': '',
      'post-deploy': 'yarn install --production && yarn build && pm2 reload ecosystem.config.js --env staging && pm2 save',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    
    production: {
      user: 'ec2-user', 
      host: ['your-production-server.com'],
      key: '~/.ssh/your-key.pem',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/casino-backend.git',
      path: '/var/www/casino-backend',
      'pre-deploy-local': '',
      'post-deploy': 'yarn install --production && yarn build && yarn migration:run && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
};