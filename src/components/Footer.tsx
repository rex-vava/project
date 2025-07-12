import React from 'react';
import { Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Questions?</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              For any queries or nomination suggestions, reach out to us:
            </p>
            <div className="flex items-center space-x-2 text-yellow-400">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <a 
                href="mailto:dreamers@idebaterwanda.org" 
                className="hover:text-yellow-300 transition-colors text-sm sm:text-base break-all"
              >
                dreamers@idebaterwanda.org
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">How It Works</h3>
            <ol className="space-y-1 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li>1. Click on each category</li>
              <li>2. View the nominees</li>
              <li>3. Vote once per category</li>
              <li>4. Voting ends: July 10, 2025 at 11:59 PM</li>
            </ol>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-300 mb-2 text-sm sm:text-base">
            Powered by Dreamers Academy Camp
          </p>
          <p className="text-yellow-400 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
            "Glow up, Show up and Dream on!"
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs sm:text-sm">
            <span>© 2025 Dreamers Academy Camp. All rights reserved.</span>
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;