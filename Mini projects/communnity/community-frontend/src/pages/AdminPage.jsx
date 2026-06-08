/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import CreateCommunityModal from '../components/CreateCommunityModal';

const API_BASE_URL = 'http://localhost:8000/api';

export default function AdminPage() {
  const { isLoggedIn, userEmail, token } = useAuth();
  const navigate = useNavigate();
  
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState(null);

  // For testing, hardcode specific admin email. 
  const ADMIN_EMAIL = 'admin@example.com';

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/communities`);
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
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    // Simple protection check
    if (userEmail && userEmail !== ADMIN_EMAIL) {
      navigate('/');
      return;
    }
    fetchCommunities();
  }, [isLoggedIn, userEmail, navigate]);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this community? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete community');
      
      showToast('Community deleted successfully');
      setCommunities(communities.filter(c => c.id !== id));
    } catch (err) {
      showToast(err.message, true);
    }
  };

  if (!isLoggedIn || userEmail !== ADMIN_EMAIL) return null;

  return (
    <div className="app" style={{ paddingBottom: '4rem' }}>
      <nav className="navbar glass">
        <div className="container navbar-content">
          <div className="brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <ArrowLeft size={24} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Back to Directory
          </div>
          <div>Platform Admin</div>
        </div>
      </nav>

      <main className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Platform Dashboard</h1>
          <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> Create Community
          </button>
        </div>

        {toast && (
          <div className="toast" style={{
            textAlign: 'center', background: toast.isError ? '#ef4444' : '#22c55e', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem'
          }}>{toast.msg}</div>
        )}

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading communities...</div>
        ) : (
          <div className="glass" style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden' }}>
            {communities.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No communities found. Create one!</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Community</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Members</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map(community => (
                    <tr key={community.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={community.logo_url} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{community.name}</span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{community.category}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{community.member_count}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDelete(community.id)} 
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                          title="Delete Community"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateCommunityModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            showToast('Community created successfully!');
            fetchCommunities();
          }}
        />
      )}
    </div>
  );
}
