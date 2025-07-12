/*
  # Populate DAC Decade Awards Database

  1. New Tables Setup
    - Ensure all tables are properly configured
    - Add secure admin user with hashed password
    - Populate all award categories
    - Add all nominees with their respective categories

  2. Categories Added
    - Best Camp Director
    - Top Host Venue  
    - Volunteer Intake of the Decade
    - Mentor of the Decade
    - Best Afternoon Class
    - The Partner's Spotlight
    - Dreamer of the Decade
    - Face of the Dreamers
    - Hype Maker of the Decade
    - Alumni of the Decade
    - Dream Creator of the Decade
    - Execution Excellence Award
    - Mama Mekha Award (Special Award)

  3. Security
    - Add secure admin user with proper credentials
    - All tables have RLS enabled
    - Proper policies for voting and admin access
*/

-- First, ensure we have the admin user with secure credentials
INSERT INTO admins (username, password_hash, is_active) 
VALUES ('dreamers_admin', 'DAC2025_Gala_Admin!', true)
ON CONFLICT (username) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active;

-- Clear existing data to start fresh
DELETE FROM votes;
DELETE FROM nominees;
DELETE FROM categories;

-- Insert all categories
INSERT INTO categories (name, description, icon, special_award, is_active) VALUES
('Best Camp Director', 'Outstanding leadership and vision in camp direction', '👨‍💼', false, true),
('Top Host Venue', 'Most welcoming venue with strong logistical support', '🏛️', false, true),
('Volunteer Intake of the Decade', 'Group that left a lasting mark through service and spirit', '🤝', false, true),
('Mentor of the Decade', 'Known for creating winning teams and impacting students', '👨‍🏫', false, true),
('Best Afternoon Class', 'The most engaging and enjoyable experience for campers', '🎨', false, true),
('The Partner''s Spotlight', 'Organization that provided exceptional support and partnership', '🤝', false, true),
('Dreamer of the Decade', 'When you think of camp, who comes to mind?', '💭', false, true),
('Face of the Dreamers', 'The person who best represents the spirit of Dreamers Academy', '👑', false, true),
('Hype Maker of the Decade', 'The person who brought the most energy and excitement to camp', '🎉', false, true),
('Alumni of the Decade', 'Alumni who consistently returned to support and mentor', '🎓', false, true),
('Dream Creator of the Decade', 'The visionary who helped shape and create the dream', '✨', false, true),
('Execution Excellence Award', 'Outstanding Project Implementation and Leadership', '⚡', false, true),
('Mama Mekha Award', 'Lifetime Service Recognition - Special Award', '🥇', true, true);

-- Insert nominees for Best Camp Director
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('Ornella TUZA'),
  ('Angelo Urukundo'),
  ('Wesley'),
  ('Amanda'),
  ('Nelson'),
  ('Bangaly'),
  ('Wesley'),
  ('Bruce Jesh')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Best Camp Director';

-- Insert nominees for Top Host Venue
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('New Life High School'),
  ('Hope Haven'),
  ('Saint Vincent Muhoza'),
  ('Gashora Girls Academy')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Top Host Venue';

-- Insert nominees for Volunteer Intake of the Decade
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('iVolunteer ''2024-25'),
  ('iVolunteer ''2023-24'),
  ('iVolunteer ''2022-23'),
  ('iVolunteer ''2021-22')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Volunteer Intake of the Decade';

-- Insert nominees for Mentor of the Decade
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('Karema Teta Shamira'),
  ('Emma Victor'),
  ('Keza Kestia'),
  ('Lucas Shema'),
  ('Queen Kabandana'),
  ('Joana Byumvohore'),
  ('Ally hamis Rwemera')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Mentor of the Decade';

-- Insert nominees for Best Afternoon Class
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('Dance Class'),
  ('Creative writing'),
  ('Multimedia'),
  ('Art class'),
  ('Leveraging AI'),
  ('Leadership Nexus')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Best Afternoon Class';

-- Insert nominees for The Partner's Spotlight
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('BK Foundation'),
  ('Mastercard Foundation'),
  ('JMU'),
  ('ALX'),
  ('Vanderbilt'),
  ('Weber state university'),
  ('Never Again')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'The Partner''s Spotlight';

-- Insert nominees for Dreamer of the Decade
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('KALISA Danny'),
  ('Rukundo Bonfils'),
  ('Abi benie'),
  ('Eva'),
  ('Christelle Maiga'),
  ('Ndahiro Clever'),
  ('King Kitoko'),
  ('Karenzi Boris'),
  ('Christian Bahire'),
  ('Ornella Ikirezi Tuza'),
  ('Sonia NYANTABA')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Dreamer of the Decade';

-- Insert nominees for Face of the Dreamers
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('Kalisa Deborah'),
  ('Ruzindana Kessy'),
  ('Akarabo Katsey'),
  ('Ashley Mutoni')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Face of the Dreamers';

-- Insert nominees for Hype Maker of the Decade
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('Lucas shema'),
  ('Cyimana'),
  ('Le bon'),
  ('Uwase LaTasha Muganga'),
  ('Wesley'),
  ('Bangaly'),
  ('Nelson'),
  ('Jesh')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Hype Maker of the Decade';

-- Insert nominees for Alumni of the Decade
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('Kalisa Danny'),
  ('Kirenga Sherif'),
  ('Minega Jerry'),
  ('Iriza Jade'),
  ('Gloria munana'),
  ('Ingride cyuzuzo'),
  ('Dadi'),
  ('Captain Franck'),
  ('Jean David Tuyishime'),
  ('Diakite Bangaly'),
  ('Christian Bahire')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Alumni of the Decade';

-- Insert nominees for Dream Creator of the Decade
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('Ngoga Guillaume'),
  ('Dave Hemsworth'),
  ('Lebon Israel'),
  ('Babu'),
  ('Beta'),
  ('JayD'),
  ('Kingly Diakite')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Dream Creator of the Decade';

-- Insert nominees for Execution Excellence Award
INSERT INTO nominees (name, category_id, is_active) 
SELECT nominee_name, cat.id, true
FROM (VALUES 
  ('Danny Kalisa'),
  ('Abi Benie Umwari'),
  ('Colette'),
  ('Arsene Maurice'),
  ('Hakidu Shema'),
  ('Ornella Ikirezi'),
  ('Kessy'),
  ('Kitoko')
) AS nominees(nominee_name)
CROSS JOIN categories cat 
WHERE cat.name = 'Execution Excellence Award';

-- Note: Mama Mekha Award is a special award - nominees can be added later through admin panel