import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function JoinModal({ community, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_BASE_URL}/communities/${community.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to submit join request');
      }
      
      onSuccess();
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
        <h2 className="modal-title">Join {community.name}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Please fill out the application below to join this community.
        </p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleJoin} className="modal-form">
          <div className="form-group">
            <label>Why do you want to join this specific community?</label>
            <textarea name="why_join" required placeholder="I am very passionate about..." rows={3} />
          </div>
          
          <div className="form-group">
            <label>How will you contribute to the community?</label>
            <textarea name="contribution" required placeholder="I will organize meetups and..." rows={3} />
          </div>

          <button type="submit" className="btn full-width" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
