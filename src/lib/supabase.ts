import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          special_award: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon?: string;
          special_award?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          special_award?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      nominees: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          photo_url: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          photo_url?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          photo_url?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          voter_id: string;
          nominee_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          voter_id: string;
          nominee_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          voter_id?: string;
          nominee_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Connection test error:', err);
    return false;
  }
};