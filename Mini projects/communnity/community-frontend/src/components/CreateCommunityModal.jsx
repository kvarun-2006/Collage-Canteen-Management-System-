import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function CreateCommunityModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target);

    try {
      const response = await fetch(`${API_BASE_URL}/communities`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to create community');
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
      <div className="modal-content glass" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h2 className="modal-title">Create New Community</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Community Name</label>
            <input name="name" type="text" required placeholder="Design Thinkers Club" />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Category</label>
              <select name="category" required style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '0.75rem', color: 'var(--text-primary)' }}>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Test">Test</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>City</label>
              <input name="city" type="text" required placeholder="New York" />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required placeholder="A community for..." rows={3} />
          </div>
          
          <div className="form-group">
            <label>Community Rules</label>
            <textarea name="rules" required placeholder="1. Be respectful..." rows={3} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Logo Image</label>
              <input name="logo" type="file" required accept="image/*" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Cover Image</label>
              <input name="cover_image" type="file" required accept="image/*" />
            </div>
          </div>
          
          <div className="form-group">
            <label>Approval Type</label>
            <select name="approval_type" required style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '0.75rem', color: 'var(--text-primary)' }}>
              <option value="AUTO_APPROVE">Auto Approve</option>
              <option value="ADMIN_APPROVAL">Admin Approval</option>
            </select>
          </div>

          <div className="form-group">
            <label>Website (Optional)</label>
            <input name="website" type="text" placeholder="https://..." />
          </div>
          
          <div className="form-group">
            <label>Discord Link (Optional)</label>
            <input name="discord_link" type="text" placeholder="https://discord.gg/..." />
          </div>

          <button type="submit" className="btn full-width" disabled={loading}>
            {loading ? 'Creating...' : 'Launch Community'}
          </button>
        </form>
      </div>
    </div>
  );
}
