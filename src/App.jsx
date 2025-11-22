import { useState, useEffect } from 'react';
import { Trash2, Plus, LinkIcon, ChevronRight, Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generate or get unique user ID
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export default function App() {
  const [links, setLinks] = useState([]);
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [hoveredId, setHoveredId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [loading, setLoading] = useState(true);
  const [expandedPlatforms, setExpandedPlatforms] = useState({
    instagram: true,
    twitter: true,
    facebook: true
  });

  const userId = getUserId();

  // Fetch links from MongoDB
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/links/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
      // Fallback to localStorage if API fails
      const savedLinks = localStorage.getItem('links');
      setLinks(savedLinks ? JSON.parse(savedLinks) : []);
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platformName) => {
    setExpandedPlatforms(prev => ({
      ...prev,
      [platformName]: !prev[platformName]
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ message: '', type: '', visible: false });
    }, 2000);
  };

  const addLink = async () => {
    if (input.trim()) {
      try {
        const response = await fetch(`${API_URL}/links`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: input, platform, userId })
        });
        
        if (response.ok) {
          const newLink = await response.json();
          setLinks([newLink, ...links]);
          setInput('');
          showToast('Link added successfully!', 'success');
        }
      } catch (error) {
        console.error('Failed to add link:', error);
        showToast('Failed to add link', 'error');
      }
    }
  };

  const deleteLink = async (id) => {
    try {
      const response = await fetch(`${API_URL}/links/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setLinks(links.filter(link => link._id !== id));
        showToast('Link deleted!', 'error');
      }
    } catch (error) {
      console.error('Failed to delete link:', error);
      showToast('Failed to delete link', 'error');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addLink();
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 border text-white text-sm font-semibold z-50 transition-opacity duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-600 border-green-700' 
            : 'bg-red-600 border-red-700'
        }`}>
          {toast.message}
        </div>
      )}
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900"></div>
        
        {/* Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIEwgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5"></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white">
                <span className="text-white">Buzz</span>
                <span>in</span>
                <span className="text-white">UAE</span>
              </h1>
              <p className="text-blue-400 text-sm sm:text-base md:text-lg mt-2">Your link management hub</p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 sm:mb-12">
          <div className="relative group">
            <div className="relative bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 md:p-8 border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
              <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-3 sm:mb-4 uppercase tracking-widest">
                <span className="text-white">Add Your Link</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Paste your link here"
                  className="flex-1 px-3 sm:px-6 py-3 sm:py-4 bg-gray-800/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm sm:text-base transition-all duration-300 backdrop-blur-sm"
                />
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="px-3 sm:px-4 py-3 sm:py-4 bg-gray-800/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm sm:text-base transition-all duration-300"
                >
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                </select>
                <button
                  onClick={addLink}
                  className="group/btn px-4 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 relative overflow-hidden whitespace-nowrap text-sm sm:text-base"
                >
                  <span className="absolute inset-0 bg-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                  <Plus size={18} className="relative z-10 sm:w-5 sm:h-5" />
                  <span className="relative z-10 font-semibold">Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        {links.length > 0 && (
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-gray-700">
                <Star size={16} className="text-yellow-400" />
                <span className="text-gray-300 font-semibold text-sm sm:text-base">{links.length} {links.length === 1 ? 'Link' : 'Links'} Saved</span>
              </div>
            </div>
          </div>
        )}

        {/* Links Grid/Table Section */}
        {links.length > 0 && (
          <div className="space-y-8">
            {['instagram', 'twitter', 'facebook'].map((socialPlatform) => {
              const platformLinks = links.filter(link => link.platform === socialPlatform);
              if (platformLinks.length === 0) return null;
              
              return (
                <div key={socialPlatform}>
                  <button
                    onClick={() => togglePlatform(socialPlatform)}
                    className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold text-white mb-4 hover:text-blue-400 transition-colors w-full"
                  >
                    <ChevronRight 
                      size={20}
                      className={`flex-shrink-0 transition-transform duration-300 ${expandedPlatforms[socialPlatform] ? 'rotate-90' : ''}`}
                    />
                    <span className="capitalize">{socialPlatform}</span>
                    <span className="text-xs sm:text-sm text-gray-400">({platformLinks.length})</span>
                  </button>
                  
                  {expandedPlatforms[socialPlatform] && (
                    <div className="grid gap-4">
                      {platformLinks.map((link) => (
                      <div
                        key={link.id}
                        onMouseEnter={() => setHoveredId(link.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="group relative"
                      >
                        <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 p-4 sm:p-6 border border-gray-700 group-hover:border-gray-600 transition-all duration-300 backdrop-blur-xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                                <div className="p-2 bg-blue-600 mt-1 flex-shrink-0">
                                  <LinkIcon size={16} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm sm:text-lg font-semibold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 break-all line-clamp-2"
                                  >
                                    {link.url}
                                  </a>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500">
                                      {new Date(link.id).toLocaleDateString()} at {new Date(link.id).toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 w-full sm:w-auto sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 flex-shrink-0">
                                <button
                                  onClick={() => copyToClipboard(link.url)}
                                  className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 active:scale-95 text-xs sm:text-sm font-semibold"
                                >
                                  Copy
                                </button>
                                <button
                                  onClick={() => deleteLink(link._id)}
                                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 active:scale-95 flex items-center gap-2"
                                >
                                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {links.length === 0 && (
          <div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 p-8 sm:p-12 md:p-16 border border-gray-700 backdrop-blur-xl text-center">
                <div className="mb-4 sm:mb-6 flex justify-center">
                  <div className="relative">
                    <div className="relative p-2 sm:p-3 bg-blue-600">
                      <LinkIcon className="text-white" size={28} />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                  No Links Yet
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Paste your first link above 
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 sm:mt-12 md:mt-16 text-center">
          <p className="text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span>@BuzzinUAE</span>
            <span className="hidden sm:inline">.</span>
            <span>All Rights Reserved</span>
          </p>
        </div>
      </div>
    </div>
  );
}