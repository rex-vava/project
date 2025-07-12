import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-07-10T23:59:59');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <h3 className="text-xl sm:text-2xl font-bold">Voting Ends In</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mb-3 sm:mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold">{timeLeft.days}</div>
            <div className="text-xs sm:text-sm text-yellow-100">Days</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-xs sm:text-sm text-yellow-100">Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-xs sm:text-sm text-yellow-100">Minutes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-xs sm:text-sm text-yellow-100">Seconds</div>
          </div>
        </div>
        
        <p className="text-sm sm:text-base text-yellow-100">
          July 10, 2025 at 11:59 PM
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;