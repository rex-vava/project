import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Users, Trophy, Settings, LogOut, Eye, EyeOff, 
  User, Save, X, BarChart3, TrendingUp, Clock, Award, Smartphone,
  Monitor, Tablet, RefreshCw, Activity, Crown, Star, PieChart
} from 'lucide-react';
import { CategoryVote, Category, Nominee, NomineeRef } from '../data/categories';
import { useVoting } from '../hooks/useVoting';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { categories, nominees, addNominee, updateNominee, deleteNominee, loading } = useVoting();
  const [selectedCategories, setSelectedCategories] = useState<string>('');
  const [showAddNominee, setShowAddNominee] = useState(false);
  const [showStats, setShowStats] = useState(true);
  
  // Derive allNominees from the nominees map
  const allNominees = Object.values(nominees).flat();
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategories(categoryId);
  };

  const [editingNominee, setEditingNominee] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'nominees' | 'analytics' | 'voting-stats'>('overview');
  const [stats, setStats] = useState({ 
    totalVotes: 0, 
    categoriesWithVotes: 0, 
    totalNominees: 0,
    recentVotes: 0,
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 }
  });
  const [votingStats, setVotingStats] = useState<Record<string, { nomineeId: string; nomineeName: string; votes: number; }[]>>({});
  const [leadingNominees, setLeadingNominees] = useState<Record<string, { nomineeId: string; nomineeName: string; votes: number; }>>({});
  const [votingData, setVotingData] = useState<any[]>([]);
  const [newNominee, setNewNominee] = useState({
    name: '',
    photo_url: '',
    categories: []
  });
  const [editNomineeData, setEditNomineeData] = useState({
    name: '',
    photo_url: '',
    categories: []
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    updateStats();
    updateVotingStats();
    fetchVotingData();
    const interval = setInterval(() => {
      updateStats();
      updateVotingStats();
      fetchVotingData();
      setLastUpdate(new Date());
    }, 2000); // Update every 2 seconds for real-time feel
    
    return () => clearInterval(interval);
  }, [nominees]);

  const fetchVotingData = async () => {
    try {
      const response = await fetch('https://galabackend.onrender.com/drm/votes');
      if (response.ok) {
        const data = await response.json();
        setVotingData(data);
      } else {
        console.error('Failed to fetch voting data');
      }
    } catch (error) {
      console.error('Error fetching voting data:', error);
    }
  };

  const updateStats = () => {
    // Calculate real-time stats from MongoDB data
    const totalVotes = votingData.length;
    
    // Recent votes (last 5 minutes)
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    const recentVotes = votingData.filter((vote: any) => 
      new Date(vote.createdAt || vote.timestamp).getTime() > fiveMinutesAgo
    ).length;
    
    const categoriesWithVotes = new Set(votingData.map((vote: any) => vote.categoryId || vote.category_id)).size;
    const totalNominees = Object.values(nominees).reduce((total, categoryNominees) => total + categoryNominees.length, 0);

    
    // Simulate device breakdown (in real MongoDB implementation, this would come from user agent data)
    const deviceBreakdown = {
      mobile: Math.floor(totalVotes * 0.6),
      desktop: Math.floor(totalVotes * 0.3),
      tablet: Math.floor(totalVotes * 0.1)
    };
    
    setStats({ totalVotes, categoriesWithVotes, totalNominees, recentVotes, deviceBreakdown });
  };

  const updateVotingStats = () => {
    const votes = votingData;
    
    // Group votes by category and nominee
    const categoryStats: Record<string, Record<string, number>> = {};
    const newVotingStats: Record<string, { nomineeId: string; nomineeName: string; votes: number; }[]> = {};
    const newLeadingNominees: Record<string, { nomineeId: string; nomineeName: string; votes: number; }> = {};
    
    // Initialize category stats
    categories.forEach(category => {
      categoryStats[category.categoryId] = {};
      category.nominees.forEach(nominee => {
        categoryStats[category.categoryId][nominee.id] = 0;
      });
    });
    
    // Count votes
    votes.forEach((vote: any) => {
      const categoryId = vote.categoryId || vote.category_id;
      const nomineeId = vote.nomineeId || vote.nominee_id;
      
      if (categoryStats[categoryId] && categoryStats[categoryId][nomineeId] !== undefined) {
        categoryStats[categoryId][nomineeId]++;
      }
    });
    
    // Convert to sorted arrays and find leaders
    categories.forEach(category => {
      const categoryVotes = category.nominees.map(nominee => ({
        nomineeId: nominee.id,
        nomineeName: nominee.name,
        votes: categoryStats[category.categoryId][nominee.id] || 0
      })).sort((a, b) => b.votes - a.votes);
      
      newVotingStats[category.categoryId] = categoryVotes;
      
      // Set leading nominee (first in sorted array)
      if (categoryVotes.length > 0 && categoryVotes[0].votes > 0) {
        newLeadingNominees[category.categoryId] = categoryVotes[0];
      }
    });
    
    setVotingStats(newVotingStats);
    setLeadingNominees(newLeadingNominees);
  };

  const handleAddNominee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategories || !newNominee.name.trim()) return;

    setActionLoading(true);
    try {
      addNominee({
        name: newNominee.name.trim(),
        photo: newNominee.photo_url.trim() || undefined,
        categories: [{categId: selectedCategories, vote: 0}]
      });

      setNewNominee({ name: '', photo_url: '', categories: [] });
      setShowAddNominee(false);
    } catch (error) {
      console.error('Error adding nominee:', error);
      alert('Error adding nominee. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditNominee = async (nomineeId: string) => {
    if (!editNomineeData.name.trim()) return;

    setActionLoading(true);
    try {
      updateNominee(nomineeId, {
        name: editNomineeData.name.trim(),
        photo: editNomineeData.photo_url.trim() || undefined,
      });

      setEditingNominee(null);
    } catch (error) {
      console.error('Error updating nominee:', error);
      alert('Error updating nominee. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const startEditing = (nominee: Nominee) => {
    setEditingNominee(nominee.nomId);
    setEditNomineeData({
      name: nominee.name,
      photo_url: nominee.photo || '',
      categories: nominee.categories
    });
  };

  const cancelEditing = () => {
    setEditingNominee(null);
    setEditNomineeData({ name: '', photo_url: '', categories: [] });
  };

  const handleDeleteNominee = async (nomineeId: string) => {
    if (!confirm('Are you sure you want to delete this nominee? This will also delete all votes for this nominee.')) return;

    try {
      deleteNominee(nomineeId);
    } catch (error) {
      console.error('Error deleting nominee:', error);
      alert('Error deleting nominee. Please try again.');
    }
  };
  
  const filteredNominees = selectedCategories 
    ? allNominees.filter(nominee => nominee.categories.some(cat => cat.categId === selectedCategories)) 
    : allNominees;
  const allTotalVotes = categories.reduce((sum, category) => sum + category.totalVotes, 0);

  const getCategoryVotes = (categoryId: string) => {
    return votingData.filter((vote: any) => 
      (vote.categoryId || vote.category_id) === categoryId
    ).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold truncate">Admin Dashboard</h1>
                <p className="text-yellow-100 text-xs sm:text-sm truncate">Gala Awards Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              <button
                onClick={() => updateStats()}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="flex space-x-1 mt-3 sm:mt-4 bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'overview' 
                  ? 'bg-white/20 text-white' 
                  : 'text-yellow-100 hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-3 h-3 mx-auto mb-1" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('nominees')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'nominees' 
                  ? 'bg-white/20 text-white' 
                  : 'text-yellow-100 hover:bg-white/10'
              }`}
            >
              <Users className="w-3 h-3 mx-auto mb-1" />
              Nominees
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics' 
                  ? 'bg-white/20 text-white' 
                  : 'text-yellow-100 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-3 h-3 mx-auto mb-1" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('voting-stats')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'voting-stats' 
                  ? 'bg-white/20 text-white' 
                  : 'text-yellow-100 hover:bg-white/10'
              }`}
            >
              <PieChart className="w-3 h-3 mx-auto mb-1" />
              Voting
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Real-time Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                  <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">{categories.length}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Categories</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{allNominees.length}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Nominees</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                  <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{allTotalVotes}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Total Votes</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                  <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.recentVotes}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Recent (5m)</div>
              </div>
            </div>

            {/* Categories Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-orange-500" />
                Categories Overview
              </h3>
              <div className="grid gap-3 sm:gap-4">
                {categories.map((category) => {
                  const categoryVotes = getCategoryVotes(category.categoryId);
                  const categoryNominees = category.nominees.length || 0;
                  
                  return (
                    <div key={category.categoryId} className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-orange-300 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <span className="text-xl sm:text-2xl flex-shrink-0">{category.icon}</span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{category.title}</h4>
                            {category.isAward && (
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Special Award</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-3 sm:space-x-4 text-center flex-shrink-0">
                          <div>
                            <div className="text-lg sm:text-xl font-bold text-blue-600">{categoryNominees}</div>
                            <div className="text-xs text-gray-500">Nominees</div>
                          </div>
                          <div>
                            <div className="text-lg sm:text-xl font-bold text-green-600">{category.totalVotes}</div>
                            <div className="text-xs text-gray-500">Votes</div>
                          </div>
                          {leadingNominees[category.categoryId] && (
                            <div className="ml-2">
                              <Crown className="w-4 h-4 text-yellow-500" />
                            </div>
                          )}
                        </div>
                      </div>
                      {leadingNominees[category.categoryId] && (
                        <div className="mt-2 text-xs text-gray-600 bg-yellow-50 px-2 py-1 rounded-lg">
                          <span className="font-medium">Leading: </span>
                          {leadingNominees[category.categoryId].nomineeName} 
                          <span className="text-yellow-600 font-bold ml-1">
                            ({leadingNominees[category.categoryId].votes} votes)
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Device Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                Device Analytics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-blue-500" />
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.deviceBreakdown.mobile}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Mobile</div>
                  <div className="text-xs text-blue-500">{allTotalVotes > 0 ? Math.round((stats.deviceBreakdown.mobile / allTotalVotes) * 100) : 0}%</div>
                </div>
                <div className="text-center">
                  <Monitor className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-green-500" />
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.deviceBreakdown.desktop}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Desktop</div>
                  <div className="text-xs text-green-500">{allTotalVotes > 0 ? Math.round((stats.deviceBreakdown.desktop / allTotalVotes) * 100) : 0}%</div>
                </div>
                <div className="text-center">
                  <Tablet className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-purple-500" />
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.deviceBreakdown.tablet}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Tablet</div>
                  <div className="text-xs text-purple-500">{allTotalVotes > 0 ? Math.round((stats.deviceBreakdown.tablet / allTotalVotes) * 100) : 0}%</div>
                </div>
              </div>
            </div>

            {/* Real-time Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Live Activity
                </h3>
                <div className="text-xs sm:text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <span className="text-sm sm:text-base text-gray-700">Active voting sessions</span>
                  <span className="text-lg font-bold text-green-600">{stats.recentVotes}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm sm:text-base text-gray-700">Categories with votes</span>
                  <span className="text-lg font-bold text-blue-600">{stats.categoriesWithVotes}/{categories.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                  <span className="text-sm sm:text-base text-gray-700">Completion rate</span>
                  <span className="text-lg font-bold text-orange-600">
                    {categories.length > 0 ? Math.round((stats.categoriesWithVotes / categories.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voting Statistics Tab */}
        {activeTab === 'voting-stats' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Overall Voting Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-orange-500" />
                Voting Statistics Overview
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold text-green-600">{Object.keys(leadingNominees).length}</div>
                  <div className="text-xs text-gray-600">Categories with Leaders</div>
                </div>
                <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <Star className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-blue-600">{allTotalVotes}</div>
                  <div className="text-xs text-gray-600">Total Votes Cast</div>
                </div>
                <div className="text-center bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold text-purple-600">{category.}</div>
                  <div className="text-xs text-gray-600">Active Categories</div>
                </div>
                <div className="text-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold text-orange-600">{stats.recentVotes}</div>
                  <div className="text-xs text-gray-600">Recent Votes (5m)</div>
                </div>
              </div>
            </div>

            {/* Category-wise Voting Results */}
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryVotingStats = votingStats[category.categoryId] || [];
                const totalCategoryVotes = categoryVotingStats.reduce((sum, nominee) => sum + nominee.votes, 0);
                const leader = leadingNominees[category.categoryId];
                
                return (
                  <div key={category.categoryId} className="bg-white rounded-2xl shadow-lg border border-orange-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{category.title}</h4>
                          {category.isAward && (
                            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Special Award</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{totalCategoryVotes}</div>
                        <div className="text-xs text-gray-500">Total Votes</div>
                      </div>
                    </div>

                    {leader && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">Current Leader:</span>
                          <span className="font-bold text-gray-800">{leader.nomineeName}</span>
                          <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                            {leader.votes} votes ({totalCategoryVotes > 0 ? Math.round((leader.votes / totalCategoryVotes) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {categoryVotingStats.length > 0 ? (
                        categoryVotingStats.map((nominee, index) => {
                          const percentage = totalCategoryVotes > 0 ? (nominee.votes / totalCategoryVotes) * 100 : 0;
                          const isLeader = leader && leader.nomineeId === nominee.nomineeId;
                          
                          return (
                            <div key={nominee.nomineeId} className={`flex items-center justify-between p-3 rounded-xl border ${
                              isLeader 
                                ? 'bg-yellow-50 border-yellow-200' 
                                : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                  isLeader ? 'bg-yellow-500' : 'bg-gray-400'
                                }`}>
                                  {isLeader ? <Crown className="w-4 h-4" /> : index + 1}
                                </div>
                                <span className="font-medium text-gray-800">{nominee.nomineeName}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      isLeader ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <div className="text-right min-w-[60px]">
                                  <div className={`text-lg font-bold ${isLeader ? 'text-yellow-600' : 'text-blue-600'}`}>
                                    {nominee.votes}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {percentage.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-base">No votes cast yet in this category</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Nominees Tab */}
        {activeTab === 'nominees' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-500" />
                  Nominees Management
                </h3>
                <button
                  onClick={() => setShowAddNominee(true)}
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 hover:from-orange-500 hover:to-yellow-500 transition-all shadow-lg text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Nominee</span>
                </button>
              </div>

              {/* Category Filter  */   } 
              <div className="mb-4">
                <select
                  value={selectedCategories} 
                  onChange={(e) => setSelectedCategories(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">All Categories ({allNominees.length} nominees)</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} 
                    value={category.categoryId}>
                      {category.icon} 
                      {category.title} 
                      ({category.nominees.length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Nominee Form */}
              {showAddNominee && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 sm:p-6 mb-6 border border-orange-200">
                  <h4 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">Add New Nominee</h4>
                  <form onSubmit={handleAddNominee} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value ={selectedCategories}
                        onChange={handleCategoryChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.categoryId} 
                          value={category.categoryId}>
                            {category.icon} 
                            {category.title}
                          </option>
                        ))}
                      </select> 
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nominee Name *</label>
                      <input
                        type="text"
                        value={newNominee.name}
                        onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                        placeholder="Enter nominee name"
                        required
                      />
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                      <textarea
                        // value={newNominee.description}
                        // onChange={(e) => setNewNominee({ ...newNominee, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                        rows={3}
                        placeholder="Enter nominee description"
                      />
                    </div> */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL (Optional)</label>
                      <input
                        type="url"
                        value={newNominee.photo_url}
                        onChange={(e) => setNewNominee({ ...newNominee, photo_url: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-50 shadow-lg text-sm sm:text-base"
                      >
                        {actionLoading ? 'Adding...' : 'Add Nominee'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddNominee(false)}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Nominees List */}
              <div className="space-y-3">
                {filteredNominees.length > 0 ? (
                  filteredNominees.map((nominee) => (
                    <div key={nominee.nomId} className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-orange-300 transition-all">
                      {editingNominee === nominee.nomId ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editNomineeData.name}
                            onChange={(e) => setEditNomineeData({ ...editNomineeData, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                            placeholder="Nominee name"
                          />
                          <textarea
                            value={editNomineeData.name}
                            onChange={(e) => setEditNomineeData({ ...editNomineeData, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                            rows={2}
                            placeholder="Description"
                          />
                          <input
                            type="url"
                            value={editNomineeData.photo_url}
                            onChange={(e) => setEditNomineeData({ ...editNomineeData, photo_url: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                            placeholder="Photo URL"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditNominee(nominee.nomId)}
                              disabled={actionLoading}
                              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center space-x-1 text-sm"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center space-x-1 text-sm"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="flex-shrink-0">
                              {nominee.photo ? (
                                <img
                                  src={nominee.photo}
                                  alt={nominee.name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-200"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center text-white ${nominee.photo ? 'hidden' : ''}`}>
                                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{nominee.name}</h4>
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full inline-block mt-1">
                                {categories.find(c => c.categoryId === selectedCategories)?.title || 'Multiple Categories'}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-1 flex-shrink-0">
                            <button
                              onClick={() => startEditing(nominee)}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all"
                              title="Edit nominee"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNominee(nominee.nomId)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all"
                              title="Delete nominee"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-base sm:text-lg">
                      {selectedCategories 
                        ? 'No nominees in this category yet.' 
                        : 'No nominees added yet.'
                      }
                    </p>
                    <p className="text-sm">Click "Add Nominee" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default AdminDashboard;