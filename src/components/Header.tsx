import React from 'react';
import { Trophy, Calendar, MapPin, Star } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 right-16 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 border-2 border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 text-center relative z-10">
        {/* Main Title Section */}
        <div className="flex justify-center items-center mb-4 sm:mb-6">
          <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-3xl mr-3 sm:mr-4 shadow-lg">
            <Trophy className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-yellow-200" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black leading-tight">
              DREAMERS
            </h1>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black leading-tight">
              ACADEMY
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl lg:text-4xl mb-2 sm:mb-4 text-yellow-100 font-bold">
            10-Year Gala Awards
          </p>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200" />
            <p className="text-base sm:text-xl lg:text-2xl text-yellow-100 font-semibold">
              Celebrating a Decade of Dreams
            </p>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200" />
          </div>
        </div>
        
        {/* Info Card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto shadow-2xl border border-white/20">
          <h2 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-yellow-200 font-bold">
            🗳️ Official Voting Platform
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="flex items-center justify-center bg-white/10 rounded-2xl p-3 sm:p-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base lg:text-lg font-medium">Inzozi Park, Kigali</span>
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded-2xl p-3 sm:p-4">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base lg:text-lg font-medium">18 July 2025</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-base sm:text-lg lg:text-xl text-yellow-100 font-semibold leading-relaxed">
              🥂 Honoring the legends, leaders, and unforgettable moments
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl text-white font-bold mt-2">
              Cast Your Vote!
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 sm:mt-8">
          <p className="text-sm sm:text-base lg:text-lg text-yellow-100 font-medium">
            "Glow up, Show up and Dream on!"
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;