import { useState, useEffect } from 'react';
import { GALA_CATEGORIES, SAMPLE_NOMINEES, Category, Nominee } from '../data/categories';

export const useVoting = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nominees, setNominees] = useState<Record<string, Nominee[]>>({});
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Get or create voter ID
  const getVoterId = () => {
    let voterId = localStorage.getItem('dac_voter_id');
    if (!voterId) {
      voterId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('dac_voter_id', voterId);
    }
    return voterId;
  };

  useEffect(() => {
    // Load categories and nominees from local data
    setCategories(GALA_CATEGORIES);
    
    // Initialize nominees structure
    const nomineesMap: Record<string, Nominee[]> = {};
    GALA_CATEGORIES.forEach(category => {
      nomineesMap[category.id] = SAMPLE_NOMINEES.filter(nominee => nominee.category_id === category.id);
    });
    setNominees(nomineesMap);

    // Load user votes from localStorage
    const savedVotes = localStorage.getItem('dac_user_votes');
    if (savedVotes) {
      try {
        setUserVotes(JSON.parse(savedVotes));
      } catch (error) {
        console.error('Error parsing saved votes:', error);
      }
    }

    setLoading(false);
  }, []);

  const submitVote = async (categoryId: string, nomineeId: string) => {
    const voterId = getVoterId();
    
    try {
      // Check if user already voted in this category
      if (userVotes[categoryId]) {
        throw new Error('You have already voted in this category');
      }

      // For now, just store votes locally
      // Later this can be replaced with MongoDB API calls
      const newVotes = {
        ...userVotes,
        [categoryId]: nomineeId
      };

      setUserVotes(newVotes);
      localStorage.setItem('dac_user_votes', JSON.stringify(newVotes));

      // Store vote details for future MongoDB integration
      const voteData = {
        voter_id: voterId,
        category_id: categoryId,
        nominee_id: nomineeId,
        timestamp: new Date().toISOString()
      };

      // Save individual vote for MongoDB migration
      const existingVotes = JSON.parse(localStorage.getItem('dac_all_votes') || '[]');
      existingVotes.push(voteData);
      localStorage.setItem('dac_all_votes', JSON.stringify(existingVotes));

      return { success: true };
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      return { success: false, error: error.message };
    }
  };

  const addNominee = (categoryId: string, nominee: Omit<Nominee, 'id' | 'created_at'>) => {
    const newNominee: Nominee = {
      ...nominee,
      id: `nominee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };

    // Add nominee to all specified categories
    setNominees(prev => {
      const newNominees = { ...prev };
      newNominee.category_ids.forEach(catId => {
        if (!newNominees[catId]) {
          newNominees[catId] = [];
        }
        newNominees[catId] = [...newNominees[catId], newNominee];
      });
      return newNominees;
    });

    // Save to localStorage for persistence
    const allNominees = Object.values(nominees).flat();
    allNominees.push(newNominee);
    localStorage.setItem('dac_nominees', JSON.stringify(allNominees));

    return newNominee;
  };

  const updateNominee = (nomineeId: string, updates: Partial<Nominee>) => {
    setNominees(prev => {
      const newNominees = { ...prev };
      
      // Find the nominee to update
      let updatedNominee: Nominee | null = null;
      Object.keys(newNominees).forEach(categoryId => {
        const nomineeIndex = newNominees[categoryId].findIndex(n => n.id === nomineeId);
        if (nomineeIndex !== -1) {
          updatedNominee = { ...newNominees[categoryId][nomineeIndex], ...updates };
        }
      });
      
      if (updatedNominee) {
        // Remove nominee from all categories first
        Object.keys(newNominees).forEach(categoryId => {
          newNominees[categoryId] = newNominees[categoryId].filter(n => n.id !== nomineeId);
        });
        
        // Add nominee to new categories
        updatedNominee.category_ids.forEach(catId => {
          if (!newNominees[catId]) {
            newNominees[catId] = [];
          }
          newNominees[catId] = [...newNominees[catId], updatedNominee];
        });
      }
      
      return newNominees;
    });

    // Save to localStorage
    const allNominees = Object.values(nominees).flat();
    localStorage.setItem('dac_nominees', JSON.stringify(allNominees));
  };

  const deleteNominee = (nomineeId: string) => {
    setNominees(prev => {
      const newNominees = { ...prev };
      Object.keys(newNominees).forEach(categoryId => {
        newNominees[categoryId] = newNominees[categoryId].filter(nominee => nominee.id !== nomineeId);
      });
      return newNominees;
    });

    // Remove from user votes if voted for this nominee
    const newUserVotes = { ...userVotes };
    Object.keys(newUserVotes).forEach(categoryId => {
      if (newUserVotes[categoryId] === nomineeId) {
        delete newUserVotes[categoryId];
      }
    });
    setUserVotes(newUserVotes);
    localStorage.setItem('dac_user_votes', JSON.stringify(newUserVotes));

    // Save nominees to localStorage
    const allNominees = Object.values(nominees).flat();
    localStorage.setItem('dac_nominees', JSON.stringify(allNominees));
  };

  return {
    categories,
    nominees,
    userVotes,
    loading,
    submitVote,
    addNominee,
    updateNominee,
    deleteNominee,
    votedCount: Object.keys(userVotes).length
  };
};