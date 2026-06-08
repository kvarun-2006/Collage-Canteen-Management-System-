import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE_URL}/users/login?email=${encodeURIComponent(data.email)}`, {
          method: 'POST'
        });
        if (!response.ok) throw new Error('Invalid credentials');
        const result = await response.json();
        login(result.access_token);
        onClose();
      } else {
        const payload = {
          full_name: data.full_name,
          profile_picture_url: data.profile_picture_url || "https://i.pravatar.cc/150",
          profession: data.profession,
          current_organization: data.current_organization,
          city: data.city,
          bio: data.bio,
          join_reason: data.join_reason,
          contribution_statement: data.contribution_statement,
          linkedin_url: data.linkedin_url,
          email: data.email
        };
        const response = await fetch(`${API_BASE_URL}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'Registration failed');
        }
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h2 className="modal-title">{isLogin ? 'Welcome Back' : 'Join the Directory'}</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleAuth} className="modal-form">
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required placeholder="you@example.com" />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input name="full_name" type="text" required placeholder="Jane Doe" />
              </div>
              <div className="form-group">
                <label>Profession</label>
                <input name="profession" type="text" required placeholder="Software Engineer" />
              </div>
              <div className="form-group">
                <label>Current Organization</label>
                <input name="current_organization" type="text" required placeholder="Tech Corp" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input name="city" type="text" required placeholder="New York" />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" required placeholder="Tell us about yourself..." />
              </div>
              <div className="form-group">
                <label>Why do you want to join?</label>
                <textarea name="join_reason" required placeholder="To learn and connect..." />
              </div>
              <div className="form-group">
                <label>What will you contribute?</label>
                <textarea name="contribution_statement" required placeholder="I can share my expertise in..." />
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input name="linkedin_url" type="text" required placeholder="https://linkedin.com/in/..." />
              </div>
            </>
          )}

          <button type="submit" className="btn full-width" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <div className="modal-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-btn">
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
