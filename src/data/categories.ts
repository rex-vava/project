// Dreamers Academy 10-Year Gala Awards Categories
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  special_award: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Nominee {
  id: string;
  name: string;
  category_ids: string[];
  photo_url?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export const GALA_CATEGORIES: Category[] = [
  // Serious Awards
  {
    id: 'sam-baker-legacy',
    name: 'The Sam Baker Legacy Award',
    description: 'For Outstanding Student Leadership in Debate & Impact. Named in honor of the late Sam Baker, one of Dreamers Academy\'s co-founders, this award celebrates a current student who embodies kindness, leadership, and excellence in debate. They not only shine on stage but lead with humility and purpose — carrying Sam\'s legacy forward with grace.',
    icon: '🏆',
    special_award: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'nasser-fiston-volunteer',
    name: 'The Nasser Fiston Award – Volunteer of the Year',
    description: 'For Heart, Service, and Unshakable Energy. Named after one of Dreamers\' most joyful and committed volunteers, this award goes to someone who showed up consistently, brought life to every moment, and served not for applause, but from a deep belief in the Dreamers mission.',
    icon: '❤️',
    special_award: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'dreamer-for-life',
    name: 'Dreamer for Life Award',
    description: 'For Long-Term Dedication to the Dreamers Journey. Awarded to a former camper or alumnus who never really left. Whether through mentorship, support, or leadership behind the scenes, they have continued to build the Dreamers legacy long after their own camp days ended.',
    icon: '🌟',
    special_award: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'trailblazer',
    name: 'Trailblazer Award',
    description: 'For Bold, Public Impact Beyond the Camp. This award goes to a Dreamer who dared to dream even bigger — someone who launched a movement, founded a powerful initiative, or created a bold impact in their field. A true example of what it means to take the Dreamers spirit into the world.',
    icon: '🚀',
    special_award: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  
  // Fun Awards
  {
    id: 'most-likely-meme',
    name: 'The "Most Likely to Become a Meme" Award',
    description: 'For legendary expressions and moments that broke the internet (or at least the camp group chat). This award celebrates the camper who unintentionally became a walking meme.',
    icon: '😂',
    special_award: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'serial-snacker',
    name: 'The "Serial Snacker" Award',
    description: 'For always having food — in pockets, bags, or somehow under their pillow. This one goes to the camper whose snack game is elite, unstoppable, and a little mysterious.',
    icon: '🍿',
    special_award: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'social-butterfly',
    name: 'The "Social Butterfly" Award',
    description: 'For knowing everyone\'s name, life story, and shoe size by Day 2. This camper floated from team to team like a breeze of good vibes.',
    icon: '🦋',
    special_award: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'lost-but-confident',
    name: 'The "Lost But Confident" Award',
    description: 'For confidently striding in the completely wrong direction every single time. This one\'s for the camper who was never on time… but always on brand.',
    icon: '🧭',
    special_award: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'one-person-show',
    name: 'The "One-Person Show" Award',
    description: 'For turning every group intro, dinner story, or icebreaker into a full-on performance. They brought drama, flair, and laughter to every corner of camp.',
    icon: '🎭',
    special_award: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'future-debater',
    name: 'The "Future Debater" Award',
    description: 'For passionately arguing about food portions, bedtime, or Uno rules with peak debate energy. Even outside the rounds — they never missed a chance to make a case.',
    icon: '🗣️',
    special_award: false,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Sample nominees data structure (empty for now, can be populated later)
export const SAMPLE_NOMINEES: Nominee[] = [];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return GALA_CATEGORIES.find(category => category.id === id);
};

export const getNomineesByCategory = (categoryId: string): Nominee[] => {
  return SAMPLE_NOMINEES.filter(nominee => nominee.category_id === categoryId);
};

export const getSpecialAwards = (): Category[] => {
  return GALA_CATEGORIES.filter(category => category.special_award);
};

export const getRegularAwards = (): Category[] => {
  return GALA_CATEGORIES.filter(category => !category.special_award);
};