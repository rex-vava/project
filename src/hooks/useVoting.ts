import { useState, useEffect } from 'react';
import { fetchGalaCategories, fetchGalaNominees, SAMPLE_NOMINEES, SAMPLE_CATEG_VOTES, Category, Nominee, CategoryVote, NomineeRef } from '../data/categories';

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
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories and nominees
        const [categoriesData, nomineesData] = await Promise.all([
          fetchGalaCategories(),
          fetchGalaNominees()
        ]);
        
        setCategories(categoriesData);
        
        // Initialize nominees structure
        const nomineesMap: Record<string, Nominee[]> = {};
        categoriesData.forEach(category => {
          nomineesMap[category.categoryId] = nomineesData.filter(nominee => 
            nominee.categories.some(cat => cat.categId === category.categoryId)
          );
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
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to empty data
        setCategories([]);
        setNominees({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

      const response = await fetch("https://galabackend.onrender.com/drm/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomineeId: nomineeId,
          categoryId: categoryId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

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

  const addNominee = async (nominee: Omit<Nominee, 'nomId'>) => {
    const newNominee: Nominee = {
      ...nominee,
      nomId: `nominee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    try {
      const response = await fetch('https://galabackend.onrender.com/drm/add/nominee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nominee),
      });

      if (!response.ok) {
        throw new Error('Failed to add nominee');
      }

      const result = await response.json();
      console.log('Nominee added:', result);

      // Update local state
      const categoryId = nominee.categories[0]?.categId as string;
      if (categoryId) {
        setNominees(prev => ({
          ...prev,
          [categoryId]: [...(prev[categoryId] || []), newNominee]
        }));
      }

      // Save to localStorage for persistence
      const allNominees = Object.values(nominees).flat();
      allNominees.push(newNominee);
      localStorage.setItem('dac_nominees', JSON.stringify(allNominees));

      return result;
    } catch (error) {
      console.error('Error adding nominee:', error);
      throw error;
    }
  };

  const updateNominee = (nomineeId: string, updates: Partial<Nominee>) => {
    setNominees(prev => {
      const newNominees = { ...prev };
      
      // Find the nominee to update
      Object.keys(newNominees).forEach(categoryId => {
        newNominees[categoryId] = newNominees[categoryId].map(nominee =>
          nominee.nomId === nomineeId ? { ...nominee, ...updates } : nominee
        );
      });
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
        newNominees[categoryId] = newNominees[categoryId].filter(nominee => nominee.nomId !== nomineeId);
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