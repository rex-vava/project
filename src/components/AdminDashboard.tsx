import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Users, Trophy, Settings, LogOut, Eye, EyeOff, 
  User, Save, X, BarChart3, TrendingUp, Clock, Award, Smartphone,
  Monitor, Tablet, RefreshCw, Activity
} from 'lucide-react';
import { GALA_CATEGORIES, Category, Nominee } from '../data/categories';
import { useVoting } from '../hooks/useVoting';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { nominees, addNominee, updateNominee, deleteNominee } = useVoting();
  const [categories] = useState<Category[]>(GALA_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddNominee, setShowAddNominee] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [editingNominee, setEditingNominee] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'nominees' | 'analytics'>('overview');
  const [stats, setStats] = useState({ 
    totalVotes: 0, 
    categoriesWithVotes: 0, 
    totalNominees: 0,
    recentVotes: 0,
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 }
  });
  const [newNominee, setNewNominee] = useState({
    name: '',
    description: '',
    photo_url: '',
    category_ids: [] as string[]
  });
  const [editNomineeData, setEditNomineeData] = useState({
    name: '',
    description: '',
    photo_url: '',
    category_ids: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    updateStats();
    const interval = setInterval(() => {
      updateStats();
      setLastUpdate(new Date());
    }, 2000); // Update every 2 seconds for real-time feel
    
    return () => clearInterval(interval);
  }, [nominees]);

  const updateStats = () => {
    // Calculate real-time stats from localStorage
    const savedVotes = localStorage.getItem('dac_all_votes');
    const votes = savedVotes ? JSON.parse(savedVotes) : [];
    const totalVotes = votes.length;
    
    // Recent votes (last 5 minutes)
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    const recentVotes = votes.filter((vote: any) => 
      new Date(vote.timestamp).getTime() > fiveMinutesAgo
    ).length;
    
    const categoriesWithVotes = new Set(votes.map((vote: any) => vote.category_id)).size;
    const totalNominees = Object.values(nominees).reduce((total, categoryNominees) => total + categoryNominees.length, 0);
    
    // Simulate device breakdown (in real MongoDB implementation, this would come from user agent data)
    const deviceBreakdown = {
      mobile: Math.floor(totalVotes * 0.6),
      desktop: Math.floor(totalVotes * 0.3),
      tablet: Math.floor(totalVotes * 0.1)
    };
    
    setStats({ totalVotes, categoriesWithVotes, totalNominees, recentVotes, deviceBreakdown });
  };

  const handleAddNominee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNominee.category_ids.length === 0 || !newNominee.name.trim()) return;

    setLoading(true);
    try {
      addNominee('', {
        name: newNominee.name.trim(),
        description: newNominee.description.trim() || undefined,
        photo_url: newNominee.photo_url.trim() || undefined,
        category_ids: newNominee.category_ids,
        is_active: true
      });

      setNewNominee({ name: '', description: '', photo_url: '', category_ids: [] });
      setShowAddNominee(false);
    } catch (error) {
      console.error('Error adding nominee:', error);
      alert('Error adding nominee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNominee = async (nomineeId: string) => {
    if (!editNomineeData.name.trim()) return;

    setLoading(true);
    try {
      updateNominee(nomineeId, {
        name: editNomineeData.name.trim(),
        description: editNomineeData.description.trim() || undefined,
        photo_url: editNomineeData.photo_url.trim() || undefined,
        category_ids: editNomineeData.category_ids,
      });

      setEditingNominee(null);
    } catch (error) {
      console.error('Error updating nominee:', error);
      alert('Error updating nominee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (nominee: Nominee) => {
    setEditingNominee(nominee.id);
    setEditNomineeData({
      name: nominee.name,
      description: nominee.description || '',
      photo_url: nominee.photo_url || '',
      category_ids: nominee.category_ids || []
    });
  };

  const cancelEditing = () => {
    setEditingNominee(null);
    setEditNomineeData({ name: '', description: '', photo_url: '', category_ids: [] });
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

  const filteredNominees = selectedCategory 
    ? selectedCategory === 'all' 
      ? Object.values(nominees).flat()
      : Object.values(nominees).flat().filter(nominee => 
          nominee.category_ids && nominee.category_ids.includes(selectedCategory)
        )
    : Object.values(nominees).flat();

  const getCategoryVotes = (categoryId: string) => {
    const savedVotes = localStorage.getItem('dac_all_votes');
    const votes = savedVotes ? JSON.parse(savedVotes) : [];
    return votes.filter((vote: any) => vote.category_id === categoryId).length;
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
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'overview' 
                  ? 'bg-white/20 text-white' 
                  : 'text-yellow-100 hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('nominees')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'nominees' 
                  ? 'bg-white/20 text-white' 
                  : 'text-yellow-100 hover:bg-white/10'
              }`}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1" />
              Nominees
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analytics' 
                  ? 'bg-white/20 text-white' 
                  : 'text-yellow-100 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1" />
              Analytics
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
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalNominees}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Nominees</div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                  <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.totalVotes}</div>
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
                  const categoryVotes = getCategoryVotes(category.id);
                  const categoryNominees = nominees[category.id]?.length || 0;
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-orange-300 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <span className="text-xl sm:text-2xl flex-shrink-0">{category.icon}</span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{category.name}</h4>
                            {category.special_award && (
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
                            <div className="text-lg sm:text-xl font-bold text-green-600">{categoryVotes}</div>
                            <div className="text-xs text-gray-500">Votes</div>
                          </div>
                        </div>
                      </div>
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
                  <div className="text-xs text-blue-500">{stats.totalVotes > 0 ? Math.round((stats.deviceBreakdown.mobile / stats.totalVotes) * 100) : 0}%</div>
                </div>
                <div className="text-center">
                  <Monitor className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-green-500" />
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.deviceBreakdown.desktop}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Desktop</div>
                  <div className="text-xs text-green-500">{stats.totalVotes > 0 ? Math.round((stats.deviceBreakdown.desktop / stats.totalVotes) * 100) : 0}%</div>
                </div>
                <div className="text-center">
                  <Tablet className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-purple-500" />
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.deviceBreakdown.tablet}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Tablet</div>
                  <div className="text-xs text-purple-500">{stats.totalVotes > 0 ? Math.round((stats.deviceBreakdown.tablet / stats.totalVotes) * 100) : 0}%</div>
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

              {/* Category Filter - Radio Buttons */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Filter by Category:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="categoryFilter"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-orange-500 focus:ring-orange-400"
                    />
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="text-lg">🎯</span>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-800">All Categories</span>
                        <div className="text-xs text-gray-500">({Object.values(nominees).flat().length} nominees)</div>
                      </div>
                    </div>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="categoryFilter"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-orange-500 focus:ring-orange-400"
                      />
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className="text-lg">{category.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-gray-800 truncate block">{category.name}</span>
                          <div className="text-xs text-gray-500">({nominees[category.id]?.length || 0} nominees)</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add Nominee Form */}
              {showAddNominee && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 sm:p-6 mb-6 border border-orange-200">
                  <h4 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">Add New Nominee</h4>
                  <form onSubmit={handleAddNominee} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Select Categories * (Choose one or more)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3">
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-center space-x-3 p-2 border border-gray-100 rounded-lg hover:border-orange-300 transition-all cursor-pointer">
                            <input
                              type="checkbox"
                              value={category.id}
                              checked={newNominee.category_ids.includes(category.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewNominee({ 
                                    ...newNominee, 
                                    category_ids: [...newNominee.category_ids, category.id] 
                                  });
                                } else {
                                  setNewNominee({ 
                                    ...newNominee, 
                                    category_ids: newNominee.category_ids.filter(id => id !== category.id) 
                                  });
                                }
                              }}
                              className="text-orange-500 focus:ring-orange-400"
                            />
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <span className="text-base">{category.icon}</span>
                              <div className="min-w-0 flex-1">
                                <span className="text-sm font-medium text-gray-800 truncate block">{category.name}</span>
                                {category.special_award && (
                                  <span className="text-xs text-orange-600 bg-orange-100 px-1 py-0.5 rounded">Special Award</span>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                      <textarea
                        value={newNominee.description}
                        onChange={(e) => setNewNominee({ ...newNominee, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                        rows={3}
                        placeholder="Enter nominee description"
                      />
                    </div>

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
                        disabled={loading || newNominee.category_ids.length === 0}
                        className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-50 shadow-lg text-sm sm:text-base"
                      >
                        {loading ? 'Adding...' : 'Add Nominee'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddNominee(false);
                          setNewNominee({ name: '', description: '', photo_url: '', category_ids: [] });
                        }}
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
                {selectedCategory !== 'all' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{categories.find(c => c.id === selectedCategory)?.icon}</span>
                      <div>
                        <h4 className="font-semibold text-blue-800">
                          {categories.find(c => c.id === selectedCategory)?.name}
                        </h4>
                        <p className="text-sm text-blue-600">
                          {categories.find(c => c.id === selectedCategory)?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {filteredNominees.length > 0 ? (
                  filteredNominees.map((nominee) => (
                    <div key={nominee.id} className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-orange-300 transition-all">
                      {editingNominee === nominee.id ? (
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
                            value={editNomineeData.description}
                            onChange={(e) => setEditNomineeData({ ...editNomineeData, description: e.target.value })}
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                              {categories.map((category) => (
                                <label key={category.id} className="flex items-center space-x-2 text-xs">
                                  <input
                                    type="checkbox"
                                    value={category.id}
                                    checked={editNomineeData.category_ids.includes(category.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditNomineeData({ 
                                          ...editNomineeData, 
                                          category_ids: [...editNomineeData.category_ids, category.id] 
                                        });
                                      } else {
                                        setEditNomineeData({ 
                                          ...editNomineeData, 
                                          category_ids: editNomineeData.category_ids.filter(id => id !== category.id) 
                                        });
                                      }
                                    }}
                                    className="text-orange-500 focus:ring-orange-400"
                                  />
                                  <span>{category.icon} {category.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditNominee(nominee.id)}
                              disabled={loading}
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
                              {nominee.photo_url ? (
                                <img
                                  src={nominee.photo_url}
                                  alt={nominee.name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-200"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center text-white ${nominee.photo_url ? 'hidden' : ''}`}>
                                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{nominee.name}</h4>
                              {nominee.description && (
                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{nominee.description}</p>
                              )}
                              <div className="flex items-center space-x-2 mt-1">
                                {nominee.category_ids && nominee.category_ids.map(categoryId => {
                                  const category = categories.find(c => c.id === categoryId);
                                  return category ? (
                                    <span key={categoryId} className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                      {category.icon} {category.name}
                                    </span>
                                  ) : null;
                                })}
                                {nominee.category_ids && nominee.category_ids.some(catId => 
                                  categories.find(c => c.id === catId)?.special_award
                                ) && (
                                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                    Special Award
                                  </span>
                                )}
                              </div>
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
                              onClick={() => handleDeleteNominee(nominee.id)}
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
                      {selectedCategory && selectedCategory !== 'all'
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