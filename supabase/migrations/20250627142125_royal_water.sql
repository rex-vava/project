/*
  # Fix Admin Authentication and Setup

  1. Admin Setup
    - Create admin user with correct credentials
    - Fix password verification system
  
  2. Database Functions
    - Add RPC function for configuration
    - Ensure proper RLS policies
*/

-- Create or update the set_config function for admin sessions
CREATE OR REPLACE FUNCTION set_config(setting_name text, setting_value text, is_local boolean DEFAULT false)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config(setting_name, setting_value, is_local);
  RETURN setting_value;
END;
$$;

-- Ensure admin user exists with correct credentials
INSERT INTO admins (username, password_hash, is_active) 
VALUES ('dreamers_admin', 'DAC2025_Gala_Admin!', true)
ON CONFLICT (username) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active;

-- Update RLS policies to ensure proper admin access
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE username = current_setting('app.admin_username', true) 
      AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage nominees" ON nominees;
CREATE POLICY "Admins can manage nominees"
  ON nominees
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE username = current_setting('app.admin_username', true) 
      AND is_active = true
    )
  );

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION set_config TO public;