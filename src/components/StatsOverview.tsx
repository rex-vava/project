import React, { useState, useEffect } from 'react';
import { Trophy, Users, Vote } from 'lucide-react';
import { GALA_CATEGORIES } from '../data/categories';

const StatsOverview: React.FC = () => {
  const [stats, setStats] = useState({
    categories: 0,
    nominees: 0,
    votes: 0
  });

  useEffect(() => {
    // Calculate stats from local data
    const categories = GALA_CATEGORIES.length;
    
    // Get nominees from localStorage
    const savedNominees = localStorage.getItem('dac_nominees');
    const nominees = savedNominees ? JSON.parse(savedNominees).length : 0;
    
    // Get votes from localStorage
    const savedVotes = localStorage.getItem('dac_all_votes');
    const votes = savedVotes ? JSON.parse(savedVotes).length : 0;

    setStats({ categories, nominees, votes });

    // Update stats periodically to reflect changes
    const interval = setInterval(() => {
      const savedNominees = localStorage.getItem('dac_nominees');
      const nominees = savedNominees ? JSON.parse(savedNominees).length : 0;
      
      const savedVotes = localStorage.getItem('dac_all_votes');
      const votes = savedVotes ? JSON.parse(savedVotes).length : 0;

      setStats({ categories, nominees, votes });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            Welcome to the Dreamers Academy 10-Year Gala Awards
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto px-2">
            Celebrating a decade of dreams, debates, and transformative moments. This special night 
            honors the legends, leaders, and unforgettable personalities who shaped the Dreamers 
            Academy journey. From serious recognition to fun memories — your vote helps celebrate 
            those who made this incredible decade possible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
          <div className="text-center bg-gradient-to-br from-orange-50 to-yellow-50 p-6 sm:p-8 rounded-2xl border border-orange-200">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">{stats.categories}</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Award Categories</div>
          </div>

          <div className="text-center bg-gradient-to-br from-orange-50 to-yellow-50 p-6 sm:p-8 rounded-2xl border border-orange-200">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">{stats.nominees}</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Nominees</div>
          </div>

          <div className="text-center bg-gradient-to-br from-orange-50 to-yellow-50 p-6 sm:p-8 rounded-2xl border border-orange-200">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Vote className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">{stats.votes}</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Votes Cast</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;