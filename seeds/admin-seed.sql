-- Insert a test admin user for development
-- Password is 'admin123' hashed with bcrypt
INSERT INTO admin_users (email, password_hash, display_name, is_active, created_at, updated_at) 
VALUES (
  'admin@casino.com',
  '$2b$10$xGqEZG1v2tJxPtRFQw7Ym.JKL8fGqM9mPmTrQPnXGtGq5tJ5tJ5tJ', -- This is a placeholder hash
  'Casino Admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert another admin for testing
INSERT INTO admin_users (email, password_hash, display_name, is_active, created_at, updated_at) 
VALUES (
  'test@admin.com',
  '$2b$10$xGqEZG1v2tJxPtRFQw7Ym.JKL8fGqM9mPmTrQPnXGtGq5tJ5tJ5tJ', -- This is a placeholder hash  
  'Test Admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;