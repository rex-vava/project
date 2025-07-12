/*
  # Add admin user for login

  1. New Data
    - Insert admin user with username 'dreamers_admin'
    - Set password_hash to 'admin123' (plain text for development)
    - Ensure user is active

  2. Security
    - Admin user will have access to admin functions through existing RLS policies
*/

-- Insert admin user if it doesn't exist
INSERT INTO admins (username, password_hash, is_active)
VALUES ('dreamers_admin', 'admin123', true)
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active;