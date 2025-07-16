// Dreamers Academy 10-Year Gala Awards Categories
export interface Category {
  categoryId: string;
  title: string;
  description: string;
  icon: string;
  isAward: boolean;
  nominees: NomineeRef[];
  totalVotes: number
}

export interface NomineeRef {
  id: string;
  name: string;
  photo?: string;
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

export const fetchGalaCategories = async (): Promise<Category[]> => {
  const response = await fetch('https://galabackend.onrender.com/drm/all');
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    console.log("my fetched categories data:", data);
    return data as Category[];
  } else {
    const text = await response.text();
    console.error('Expected JSON but got:', text);
    throw new Error('Invalid response format');
  }
};

export const fetchGalaNominees = async (): Promise<Nominee[]> => {
  const response = await fetch('https://galabackend.onrender.com/drm/all/nom');
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    throw new Error('Failed to fetch nominees');
  }

  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    console.log("my fetched nominees data:", data);
    return data as Nominee[];
  } else {
    const text = await response.text();
    console.error('Expected JSON but got:', text);
    throw new Error('Invalid response format');
  }
};

// Sample nominees data structure (empty for now, can be populated later)
export const SAMPLE_NOMINEES: Nominee[] = [];

export const SAMPLE_CATEG_VOTES: CategoryVote[] = [];

export const SAMPLE_NOMINEESREF: NomineeRef[] = [];

// Helper functions
export const getCategoryById = (categories: Category[], id: string): Category | undefined => {
  return categories.find(category => category.categoryId === id);
};

export const getNomineesByCategory = (categoryId: string): CategoryVote[] => {
  return SAMPLE_CATEG_VOTES.filter(categoryVote => categoryVote.categId === categoryId);
};

export const getSpecialAwards = (categories: Category[]): Category[] => {
  return categories.filter(category => category.isAward);
};

export const getRegularAwards = (categories: Category[]): Category[] => {
  return categories.filter(category => !category.isAward);
};