/*
  # Create Initial Admin User
  
  This script creates the initial admin user for the DAC Decade Awards admin panel.
  
  1. Admin User Creation
    - Username: dreamers_admin
    - Password: DAC2025_Gala_Admin!
    - Active status: true
  
  Run this script in your Supabase SQL Editor to create the admin user.
*/

-- Insert the admin user with the credentials you provided
INSERT INTO admins (username, password_hash, is_active)
VALUES ('dreamers_admin', 'DAC2025_Gala_Admin!', true)
ON CONFLICT (username) DO NOTHING;

-- Verify the admin user was created
SELECT username, is_active, created_at FROM admins WHERE username = 'dreamers_admin';