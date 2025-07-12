/*
  # Add Initial Admin User

  1. New Data
    - Insert initial admin user with username 'dreamers_admin'
    - Set a default password that can be changed later
    - Ensure the user is active

  2. Security
    - User will be able to log in immediately
    - Password should be changed after first login in production
*/

-- Insert initial admin user
INSERT INTO admins (username, password_hash, is_active)
VALUES ('dreamers_admin', 'admin123', true)
ON CONFLICT (username) DO NOTHING;