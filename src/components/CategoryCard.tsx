import React, { useState } from 'react';
import { ChevronRight, Users, Check, User, Trophy } from 'lucide-react';
import { Category, Nominee, NomineeRef } from '../data/categories';

interface CategoryCardProps {
  category: Category;
  nominees: NomineeRef[];
  onVote: (categoryId: string, nomineeId: string) => void;
  userVotes: Record<string, string>;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, nominees, onVote, userVotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasVoted = userVotes[category.categoryId];

  const handleVote = (nomineeId: string) => {
    onVote(category.categoryId, nomineeId);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div 
        className="p-4 sm:p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 shadow-lg">
              {category.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-xl font-bold text-gray-800 leading-tight mb-1">
                {category.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {category.description}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {category.isAward && (
                  <span className="inline-flex items-center bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                    <Trophy className="w-3 h-3 mr-1" />
                    Special Award
                  </span>
                )}
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {nominees.length} nominee{nominees.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 ml-2">
            {hasVoted && (
              <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm font-medium">Voted</span>
              </div>
            )}
            <ChevronRight 
              className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-4 sm:p-6">
            {nominees.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
                  Choose your nominee:
                </h4>
                {nominees.map((nominee) => (
                  <div 
                    key={nominee.id}
                    className={`bg-white border-2 rounded-2xl p-3 sm:p-4 transition-all duration-200 ${
                      hasVoted === nominee.id 
                        ? 'border-green-300 bg-green-50 shadow-lg' 
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {nominee.name ? (
                            <img 
                              src={nominee.id} 
                              alt={nominee.name}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-3 border-white shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center text-white shadow-lg ${nominee.id ? 'hidden' : ''}`}>
                            <User className="w-6 h-6 sm:w-7 sm:h-7" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base leading-tight">
                            {nominee.name}
                          </h4>
                          {/* {nominee.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-3 leading-relaxed">
                              {nominee.description}
                            </p>
                          )} */}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(nominee.id);
                        }}
                        disabled={!!hasVoted}
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base flex-shrink-0 ml-3 shadow-lg ${
                          hasVoted === nominee.id
                            ? 'bg-green-500 text-white cursor-not-allowed transform scale-105'
                            : hasVoted
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white hover:from-orange-500 hover:to-yellow-500 hover:shadow-xl transform hover:scale-105 active:scale-95'
                        }`}
                      >
                        {hasVoted === nominee.id ? (
                          <div className="flex items-center space-x-1">
                            <Check className="w-4 h-4" />
                            <span>Voted</span>
                          </div>
                        ) : hasVoted ? (
                          'Voted'
                        ) : (
                          'Vote'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 text-gray-500">
                <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <p className="text-sm sm:text-base font-medium mb-2">No nominees yet</p>
                <p className="text-xs sm:text-sm">Nominees will be added soon for this category!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;