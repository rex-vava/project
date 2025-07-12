/*
  # Replace Categories with Dreamers Academy 10-Year Gala Awards

  1. Data Cleanup
    - Delete all existing votes, nominees, and categories
    - Start fresh with new award structure

  2. New Categories
    - 4 Serious Awards (2 special awards)
    - 6 Fun Awards
    - Proper descriptions and icons for each

  3. Security
    - Maintain existing RLS policies
    - Keep all tables properly configured
*/

-- Clear all existing data to start fresh
DELETE FROM votes;
DELETE FROM nominees;
DELETE FROM categories;

-- Insert new award categories for Dreamers Academy 10-Year Gala Awards
INSERT INTO categories (name, description, icon, special_award, is_active) VALUES

-- Serious Awards
(
  'The Sam Baker Legacy Award', 
  'For Outstanding Student Leadership in Debate & Impact. Named in honor of the late Sam Baker, one of Dreamers Academy''s co-founders, this award celebrates a current student who embodies kindness, leadership, and excellence in debate. They not only shine on stage but lead with humility and purpose — carrying Sam''s legacy forward with grace.', 
  '🏆', 
  true, 
  true
),
(
  'The Nasser Fiston Award – Volunteer of the Year', 
  'For Heart, Service, and Unshakable Energy. Named after one of Dreamers'' most joyful and committed volunteers, this award goes to someone who showed up consistently, brought life to every moment, and served not for applause, but from a deep belief in the Dreamers mission.', 
  '❤️', 
  true, 
  true
),
(
  'Dreamer for Life Award', 
  'For Long-Term Dedication to the Dreamers Journey. Awarded to a former camper or alumnus who never really left. Whether through mentorship, support, or leadership behind the scenes, they have continued to build the Dreamers legacy long after their own camp days ended.', 
  '🌟', 
  false, 
  true
),
(
  'Trailblazer Award', 
  'For Bold, Public Impact Beyond the Camp. This award goes to a Dreamer who dared to dream even bigger — someone who launched a movement, founded a powerful initiative, or created a bold impact in their field. A true example of what it means to take the Dreamers spirit into the world.', 
  '🚀', 
  false, 
  true
),

-- Fun Awards
(
  'The "Most Likely to Become a Meme" Award', 
  'For legendary expressions and moments that broke the internet (or at least the camp group chat). This award celebrates the camper who unintentionally became a walking meme.', 
  '😂', 
  false, 
  true
),
(
  'The "Serial Snacker" Award', 
  'For always having food — in pockets, bags, or somehow under their pillow. This one goes to the camper whose snack game is elite, unstoppable, and a little mysterious.', 
  '🍿', 
  false, 
  true
),
(
  'The "Social Butterfly" Award', 
  'For knowing everyone''s name, life story, and shoe size by Day 2. This camper floated from team to team like a breeze of good vibes.', 
  '🦋', 
  false, 
  true
),
(
  'The "Lost But Confident" Award', 
  'For confidently striding in the completely wrong direction every single time. This one''s for the camper who was never on time… but always on brand.', 
  '🧭', 
  false, 
  true
),
(
  'The "One-Person Show" Award', 
  'For turning every group intro, dinner story, or icebreaker into a full-on performance. They brought drama, flair, and laughter to every corner of camp.', 
  '🎭', 
  false, 
  true
),
(
  'The "Future Debater" Award', 
  'For passionately arguing about food portions, bedtime, or Uno rules with peak debate energy. Even outside the rounds — they never missed a chance to make a case.', 
  '🗣️', 
  false, 
  true
);