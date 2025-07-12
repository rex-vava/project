// Dreamers Academy 10-Year Gala Awards Categories
export interface Category {
  categoryId: string;
  title: string;
  description: string;
  icon: string;
  isAward: boolean;
  nominees: NomineeRef[];
}

export interface NomineeRef {
  id: string;
  name: string;
}

export interface Nominee {
  nomId: string;
  name: string;
  photo?: string;
  categories: CategoryVote[];
}

export interface CategoryVote{
  categId: String;
  vote: number;
}


let galaCategoriesCache: Category[] | null = null;

export const fetchGalaCategories = async (): Promise<Category[]> => {
const response = await fetch('https://02dde82182ce.ngrok-free.app/drm/all');
const contentType = response.headers.get('content-type');

if (!response.ok) {
  throw new Error('Failed to fetch categories');
}

if (contentType && contentType.includes('application/json')) {
  const data = await response.json();
  galaCategoriesCache = data as Category[];
  console.log("my fetched data:",data)
  return galaCategoriesCache;
} else {
  const text = await response.text();
  console.error('Expected JSON but got:', text);
  throw new Error('Invalid response format');
}
};

export const GALA_CATEGORIES = await fetchGalaCategories();


// Sample nominees data structure (empty for now, can be populated later)
export const SAMPLE_NOMINEES: Nominee[] = [];

export const SAMPLE_CATEG_VOTES: CategoryVote[] = [];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return GALA_CATEGORIES.find(category => category.categoryId === id);
};

export const getNomineesByCategory = (categoryId: string): CategoryVote[] => {
  return SAMPLE_CATEG_VOTES.filter(categoryVote => categoryVote.categId === categoryId);
};

export const getSpecialAwards = (): Category[] => {
  return GALA_CATEGORIES.filter(category => category.isAward);
};

export const getRegularAwards = (): Category[] => {
  return GALA_CATEGORIES.filter(category => !category.isAward);
};