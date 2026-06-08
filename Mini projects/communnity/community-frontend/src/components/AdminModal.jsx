/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function AdminModal({ community, onClose }) {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const { token } = useAuth();

  const fetchMeetups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/communities/${community.id}/meetups`);
      if (response.ok) setMeetups(await response.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/communities/${community.id}/admin/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch requests');
      setRequests(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'meetup') fetchMeetups();
  }, [activeTab, community.id]);

  const handleResolve = async (requestId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/communities/${community.id}/admin/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error(`Failed to ${status.toLowerCase()} request`);
      setRequests(requests.filter(r => (r._id || r.id) !== requestId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.target);
    try {
      const response = await fetch(`${API_BASE_URL}/communities/${community.id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to update community');
      setSuccessMsg("Community updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMeetupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    // Convert date string to ISO date
    data.date = new Date(data.date).toISOString();
    
    try {
      const response = await fetch(`${API_BASE_URL}/communities/${community.id}/meetups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create meetup');
      setSuccessMsg("Meetup created successfully!");
      fetchMeetups();
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass" style={{ maxWidth: '600px' }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h2 className="modal-title">Manage {community.name}</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <button onClick={() => {setActiveTab('requests'); setSuccessMsg(null); setError(null);}} className="text-btn" style={{ fontWeight: activeTab === 'requests' ? '700' : '400' }}>Requests</button>
          <button onClick={() => {setActiveTab('edit'); setSuccessMsg(null); setError(null);}} className="text-btn" style={{ fontWeight: activeTab === 'edit' ? '700' : '400' }}>Edit Community</button>
          <button onClick={() => {setActiveTab('meetup'); setSuccessMsg(null); setError(null);}} className="text-btn" style={{ fontWeight: activeTab === 'meetup' ? '700' : '400' }}>Meetups</button>
        </div>

        {error && <div className="error">{error}</div>}
        {successMsg && <div className="toast" style={{background: '#22c55e', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center'}}>{successMsg}</div>}

        {activeTab === 'requests' && (
          loading ? <div className="loading">Loading requests...</div> : 
          requests.length === 0 ? <div className="loading" style={{ paddingTop: '1rem' }}>No pending requests.</div> : 
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {requests.map(req => {
              const reqId = req._id || req.id;
              return (
                <div key={reqId} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                      {req.user_avatar ? <img src={req.user_avatar} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : 'U'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{req.user_name || 'Unknown User'}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {req.user_id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>Why Join:</strong><p style={{ marginTop: '0.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{req.why_join}</p></div>
                  <div style={{ marginBottom: '1.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Contribution:</strong><p style={{ marginTop: '0.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{req.contribution}</p></div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleResolve(reqId, 'APPROVED')} className="btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#22c55e' }}><CheckCircle size={18} /> Approve</button>
                    <button onClick={() => handleResolve(reqId, 'REJECTED')} className="btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#ef4444' }}><XCircle size={18} /> Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'edit' && (
          <form onSubmit={handleEditSubmit} className="modal-form">
            <div className="form-group"><label>Description</label><textarea name="description" defaultValue={community.description} rows={3} /></div>
            <div className="form-group"><label>City</label><input name="city" type="text" defaultValue={community.city} /></div>
            <div className="form-group"><label>Category</label><input name="category" type="text" defaultValue={community.category} /></div>
            <div className="form-group"><label>Website</label><input name="website" type="text" defaultValue={community.website || ''} /></div>
            <div className="form-group"><label>Discord Link</label><input name="discord_link" type="text" defaultValue={community.discord_link || ''} /></div>
            <div className="form-group"><label>Rules</label><textarea name="rules" defaultValue={community.rules} rows={2} /></div>
            <button type="submit" className="btn full-width" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        )}

        {activeTab === 'meetup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {meetups.length > 0 && (
              <div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Existing Meetups</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {meetups.map(m => (
                    <div key={m._id || m.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ margin: '0 0 0.25rem 0' }}>{m.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {new Date(m.date).toLocaleString()} • {m.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Create New Meetup</h3>
              <form onSubmit={handleMeetupSubmit} className="modal-form">
                <div className="form-group"><label>Meetup Title</label><input name="title" type="text" required placeholder="Monthly Hacker Mixer" /></div>
                <div className="form-group"><label>Date & Time</label><input name="date" type="datetime-local" required /></div>
                <div className="form-group"><label>Location / Link</label><input name="location" type="text" required placeholder="Downtown Cafe or Zoom Link" /></div>
                <div className="form-group"><label>Description</label><textarea name="description" required placeholder="Join us for networking..." rows={3} /></div>
                <button type="submit" className="btn full-width" disabled={loading}>{loading ? 'Creating...' : 'Create Meetup'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
