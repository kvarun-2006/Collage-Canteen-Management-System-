/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Users, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import AdminModal from '../components/AdminModal';

const API_BASE_URL = 'http://localhost:8000/api';

export default function HomePage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isLoggedIn, userEmail, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCommunityToManage, setSelectedCommunityToManage] = useState(null);
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'admin@example.com';

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sortOption, setSortOption] = useState("member_count");

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/communities?sort=${sortOption}`;
      if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`;
      if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`;
      if (cityFilter) url += `&city=${encodeURIComponent(cityFilter)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch communities');
      const data = await response.json();
      setCommunities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayFn = setTimeout(() => fetchCommunities(), 300);
    return () => clearTimeout(delayFn);
  }, [searchQuery, categoryFilter, cityFilter, sortOption]);



  const handleManageClick = (e, community) => {
    e.stopPropagation();
    setSelectedCommunityToManage(community);
  };

  return (
    <div className="app">
      <nav className="navbar glass">
        <div className="container navbar-content">
          <div className="brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Directory.</div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isLoggedIn && userEmail === ADMIN_EMAIL && (
              <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Platform Admin</button>
            )}
            {isLoggedIn ? (
              <button className="btn btn-secondary" onClick={logout}>Sign Out</button>
            ) : (
              <button className="btn" onClick={() => setShowAuthModal(true)}>Sign In</button>
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <h1>Discover Your Tribe</h1>
          <p>Explore thousands of communities built around your interests, profession, and location.</p>
        </section>

        <section className="filters-section glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search communities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          <div className="form-group" style={{ flex: '1 1 150px' }}>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '0.75rem', color: 'var(--text-primary)' }}>
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Test">Test</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: '1 1 150px' }}>
            <input 
              type="text" 
              placeholder="Filter by City" 
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group" style={{ flex: '1 1 150px' }}>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '0.75rem', color: 'var(--text-primary)' }}>
              <option value="member_count">Sort: Members</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </section>

        {error && <div className="error">Error connecting to backend: {error}</div>}

        {loading ? (
          <div className="loading">Loading communities...</div>
        ) : (
          <div className="communities-grid">
            {communities.length === 0 && !error ? (
              <div className="loading" style={{ gridColumn: '1 / -1' }}>No communities found matching your criteria.</div>
            ) : (
              communities.map((community) => {
                const isPlatformAdmin = userEmail === ADMIN_EMAIL;

                return (
                  <div key={community.id} className="card glass" onClick={() => navigate(`/community/${community.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="card-image-container">
                      <img src={community.cover_image_url} alt="Cover" className="card-cover" />
                      <img src={community.logo_url} alt={`${community.name} logo`} className="card-logo" />
                    </div>
                    
                    <div className="card-content">
                      <h3 className="card-title">{community.name}</h3>
                      <p className="card-description">{community.description}</p>
                      
                      <div className="card-footer">
                        <span className="badge">{community.category}</span>
                        <div className="flex-center">
                          <MapPin size={16} />
                          <span>{community.city}</span>
                        </div>
                        <div className="flex-center">
                          <Users size={16} />
                          <span>{community.member_count}</span>
                        </div>
                      </div>

                      {isPlatformAdmin ? (
                        <button 
                          className="btn full-width" 
                          style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}
                          onClick={(e) => handleManageClick(e, community)}
                        >
                          Manage Community
                        </button>
                      ) : (
                        <button 
                          className="btn full-width" 
                          style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/community/${community.id}`);
                          }}
                        >
                          View Community
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {selectedCommunityToManage && (
        <AdminModal
          community={selectedCommunityToManage}
          onClose={() => {
            setSelectedCommunityToManage(null);
            fetchCommunities(); 
          }}
        />
      )}
    </div>
  );
}
