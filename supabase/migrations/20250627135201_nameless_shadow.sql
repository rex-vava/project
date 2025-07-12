/*
  # DAC Decade Awards Voting System Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `special_award` (boolean, default false)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
    
    - `nominees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category_id` (uuid, foreign key)
      - `photo_url` (text, optional)
      - `description` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
    
    - `votes`
      - `id` (uuid, primary key)
      - `voter_id` (text) - session-based identifier
      - `nominee_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public voting access
    - Add policies for admin management
    - Prevent multiple votes per category per voter

  3. Indexes
    - Index on votes for performance
    - Unique constraint on voter_id + category_id
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '🏆',
  special_award boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Nominees table
CREATE TABLE IF NOT EXISTS nominees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  photo_url text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id text NOT NULL,
  nominee_id uuid REFERENCES nominees(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(voter_id, category_id)
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominees ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public policies for voting
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active nominees"
  ON nominees FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can insert votes"
  ON votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view votes for statistics"
  ON votes FOR SELECT
  USING (true);

-- Admin policies
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admins 
    WHERE username = current_setting('app.admin_username', true)
    AND is_active = true
  ));

CREATE POLICY "Admins can manage nominees"
  ON nominees FOR ALL
  USING (EXISTS (
    SELECT 1 FROM admins 
    WHERE username = current_setting('app.admin_username', true)
    AND is_active = true
  ));

CREATE POLICY "Admins can view admin table"
  ON admins FOR SELECT
  USING (username = current_setting('app.admin_username', true));

-- Insert default admin
INSERT INTO admins (username, password_hash) 
VALUES ('dreamers_admin', crypt('DAC2025_Gala_Admin!', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, description, icon, special_award) VALUES
('Mama Mekha Award', 'Lifetime Service Recognition - Special Award', '🥇', true),
('Execution Excellence Award', 'Outstanding Project Implementation and Leadership', '⚡', false),
('Best Camp Coordinator', 'Based on camper feedback, leadership, and dedication', '🏕️', false),
('Top Host Venue', 'Most welcoming venue with strong logistical support', '🏛️', false),
('Volunteer Intake of the Decade', 'Group that left a lasting mark through service and spirit', '🤝', false),
('Mentor of the Decade', 'Known for creating winning teams and impacting students', '👨‍🏫', false),
('Best Afternoon Class', 'The most engaging and enjoyable experience for campers', '🎨', false),
('The Partner''s Spotlight', 'Organization that provided exceptional support and partnership', '🤝', false),
('Dreamer of the Decade', 'When you think of camp, who comes to mind?', '💭', false),
('Face of the Dreamers', 'The person who best represents the spirit of Dreamers Academy', '👑', false),
('Hype Maker of the Decade', 'The person who brought the most energy and excitement to camp', '🎉', false),
('Most Involved Alumni', 'Alumni who consistently returned to support and mentor', '🔄', false),
('Dream Creator of the Decade', 'The visionary who helped shape and create the dream', '✨', false)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_category_id ON votes(category_id);
CREATE INDEX IF NOT EXISTS idx_votes_nominee_id ON votes(nominee_id);
CREATE INDEX IF NOT EXISTS idx_nominees_category_id ON nominees(category_id);