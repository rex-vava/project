import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Settings, Smartphone } from 'lucide-react';
import { NomineeRef } from './data/categories';

// Components
import Header from './components/Header';
import CountdownTimer from './components/CountdownTimer';
import StatsOverview from './components/StatsOverview';
import CategoryCard from './components/CategoryCard';
import VotingProgress from './components/VotingProgress';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Hooks
import { useVoting } from './hooks/useVoting';
import { useAdmin } from './hooks/useAdmin';

const VotingPage: React.FC = () => {
  const { categories, nominees, userVotes, loading, submitVote, votedCount } = useVoting();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleVote = async (categoryId: string, nomineeId: string) => {
    const result = await submitVote(categoryId, nomineeId);
    if (!result.success) {
      alert(result.error || 'Failed to submit vote');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading voting platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <Header />
      <CountdownTimer />
      <StatsOverview />
      
      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            🏆 Award Categories
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto px-2 leading-relaxed">
            Click on each category to view nominees and submit your vote. 
            Each participant can vote once per category.
          </p>
        </div>

        <div className={`grid gap-4 sm:gap-8 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-4'}`}>
          <div className={isMobile ? 'order-2' : 'lg:col-span-3'}>
            <div className="grid gap-4 sm:gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.categoryId}
                  category={category}
                  nominees={category.nominees || []}
                  onVote={handleVote}
                  userVotes={userVotes}
                />
              ))}
            </div>
          </div>

          <div className={`${isMobile ? 'order-1 mb-6' : 'lg:col-span-1'}`}>
            <VotingProgress 
              totalCategories={categories.length}
              votedCategories={votedCount}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const AdminPage: React.FC = () => {
  const { isAuthenticated, loading, error, login, logout, checkAuth } = useAdmin();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} loading={loading} error={error} />;
  }

  return <AdminDashboard onLogout={logout} />;
};

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Router>
      <div className="relative">
        {/* Admin Access Button - Mobile Optimized */}
        <Link
          to="/admin"
          className={`fixed z-50 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-full shadow-lg hover:from-orange-500 hover:to-yellow-500 transition-all transform hover:scale-110 active:scale-95 ${
            isMobile 
              ? 'bottom-4 right-4 p-3' 
              : 'top-4 right-4 p-3'
          }`}
          title="Admin Access"
        >
          {isMobile ? (
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Admin</span>
            </div>
          ) : (
            <Settings className="w-5 h-5" />
          )}
        </Link>

        {/* Mobile Device Indicator */}
        {isMobile && (
          <div className="fixed bottom-4 left-4 z-40 bg-blue-500 text-white p-2 rounded-full shadow-lg">
            <Smartphone className="w-4 h-4" />
          </div>
        )}

        <Routes>
          <Route path="/" element={<VotingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;