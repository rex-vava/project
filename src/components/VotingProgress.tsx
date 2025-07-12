import React from 'react';
import { CheckCircle, Circle, Trophy, Target } from 'lucide-react';

interface VotingProgressProps {
  totalCategories: number;
  votedCategories: number;
}

const VotingProgress: React.FC<VotingProgressProps> = ({ totalCategories, votedCategories }) => {
  const progress = totalCategories > 0 ? (votedCategories / totalCategories) * 100 : 0;
  const remaining = totalCategories - votedCategories;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-3xl p-4 sm:p-6 shadow-lg sticky top-6">
      <div className="text-center mb-4">
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Your Voting Progress</h3>
      </div>
      
      {/* Progress Stats */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-green-600">{votedCategories}</span>
            <span className="text-gray-600 text-lg sm:text-xl"> / {totalCategories}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Categories Completed</div>
          {remaining > 0 && (
            <div className="text-xs sm:text-sm text-orange-600 font-bold flex items-center">
              <Target className="w-3 h-3 mr-1" />
              {remaining} remaining
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 shadow-inner">
          <div 
            className="bg-gradient-to-r from-orange-400 to-yellow-400 h-3 sm:h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
          <span>0%</span>
          <span className="font-bold text-orange-600">{Math.round(progress)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center">
        {progress === 100 ? (
          <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-3 sm:p-4">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-green-700 font-bold text-sm sm:text-base">
              All categories completed!
            </p>
            <p className="text-green-600 text-xs sm:text-sm mt-1">
              Thank you for participating!
            </p>
          </div>
        ) : progress > 0 ? (
          <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-3 sm:p-4">
            <div className="text-xl mb-2">🗳️</div>
            <p className="text-blue-700 font-bold text-sm sm:text-base">
              Great progress!
            </p>
            <p className="text-blue-600 text-xs sm:text-sm mt-1">
              Keep voting to complete all categories
            </p>
          </div>
        ) : (
          <div className="bg-orange-100 border-2 border-orange-300 rounded-2xl p-3 sm:p-4">
            <div className="text-xl mb-2">🚀</div>
            <p className="text-orange-700 font-bold text-sm sm:text-base">
              Ready to start?
            </p>
            <p className="text-orange-600 text-xs sm:text-sm mt-1">
              Click on categories to view nominees and vote
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 sm:mt-6 pt-4 border-t border-orange-200">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white rounded-xl p-2 sm:p-3 shadow-sm">
            <div className="text-lg sm:text-xl font-bold text-orange-600">{totalCategories}</div>
            <div className="text-xs text-gray-600">Total Awards</div>
          </div>
          <div className="bg-white rounded-xl p-2 sm:p-3 shadow-sm">
            <div className="text-lg sm:text-xl font-bold text-blue-600">{Math.round(progress)}%</div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingProgress;