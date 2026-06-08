/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, MapPin, ArrowLeft, Globe, Link as LinkIcon } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import JoinModal from '../components/JoinModal';
import AdminModal from '../components/AdminModal';

const API_BASE_URL = 'http://localhost:8000/api';

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userEmail } = useAuth();
  const ADMIN_EMAIL = 'admin@example.com';
  
  const [community, setCommunity] = useState(null);
  const [meetups, setMeetups] = useState([]);
  const [members, setMembers] = useState([]);
  const [userRole, setUserRole] = useState("VISITOR"); // VISITOR, MEMBER, ADMIN
  const [pendingRequests, setPendingRequests] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [toast, setToast] = useState(null);
  const { token } = useAuth();

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      const resComm = await fetch(`${API_BASE_URL}/communities/${id}`);
      if (!resComm.ok) throw new Error('Failed to fetch community details');
      const commData = await resComm.json();
      setCommunity(commData);

      // Determine initial admin status
      let isAdmin = false;
      if (userEmail === ADMIN_EMAIL) {
        isAdmin = true;
        setUserRole("ADMIN");
      }

      const resMeetups = await fetch(`${API_BASE_URL}/communities/${id}/meetups`);
      if (resMeetups.ok) setMeetups(await resMeetups.json());

      // Attempt to fetch members if logged in
      if (isLoggedIn) {
        const resMembers = await fetch(`${API_BASE_URL}/communities/${id}/members`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (resMembers.ok) {
          const membersData = await resMembers.json();
          setMembers(membersData);
          if (!isAdmin) setUserRole("MEMBER");
          // Fetch pending join requests count for admin view
          const resRequests = await fetch(`${API_BASE_URL}/communities/${id}/admin/requests`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (resRequests.ok) {
            const reqData = await resRequests.json();
            setPendingRequests(reqData.length);
          }
        } else {
          if (!isAdmin) setUserRole("VISITOR");
        }
      } else {
        setUserRole("VISITOR");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [id, isLoggedIn]);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const handleJoinClick = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setShowJoinModal(true);
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '5rem'}}><div className="loading">Loading community...</div></div>;
  if (error) return <div className="container" style={{paddingTop: '5rem'}}><div className="error">{error}</div></div>;
  if (!community) return <div className="container" style={{paddingTop: '5rem'}}><div className="error">Community not found.</div></div>;

  return (
    <div className="app" style={{ paddingBottom: '4rem' }}>
      <nav className="navbar glass">
        <div className="container navbar-content">
          <div className="brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <ArrowLeft size={24} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Back to Directory
          </div>
        </div>
      </nav>

      {toast && (
        <div className="toast" style={{
          textAlign: 'center', background: toast.isError ? '#ef4444' : '#22c55e', color: 'white', padding: '1rem', borderRadius: '8px', margin: '2rem auto', maxWidth: '600px'
        }}>{toast.msg}</div>
      )}

      <main className="container" style={{ marginTop: '2rem' }}>
        <div className="glass" style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: '300px' }}>
            <img src={community.cover_image_url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <img src={community.logo_url} alt="Logo" style={{ position: 'absolute', bottom: '-40px', left: '2rem', width: '120px', height: '120px', borderRadius: 'var(--border-radius-lg)', border: '4px solid var(--bg-primary)' }} />
          </div>
          
          <div style={{ padding: '4rem 2rem 2rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{community.name}</h1>
                <div className="badge">{community.category}</div>
              </div>
              
              <div>
                {userRole === 'VISITOR' && (
                  <button className="btn" onClick={handleJoinClick} style={{ padding: '0.75rem 2rem' }}>
                    Join Community
                  </button>
                )}
                {userRole === 'MEMBER' && (
                  <div className="badge" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid #22c55e', fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
                    ✓ You are a Member
                  </div>
                )}
                {userRole === 'ADMIN' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button className="btn" onClick={() => setShowAdminModal(true)} style={{ padding: '0.75rem 2rem', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>
                      Manage Community
                    </button>
                    {pendingRequests > 0 && (
                      <span className="badge" style={{ background: 'rgba(255,165,0,0.2)', color: '#ffa500', border: '1px solid #ffa500' }}>{pendingRequests} Pending</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <div className="flex-center"><MapPin size={18} /> {community.city}</div>
              <div className="flex-center"><Users size={18} /> {community.member_count} Members</div>
              <div className="flex-center"><Calendar size={18} /> {community.upcoming_meetups_count} Meetups</div>
            </div>

            <p style={{ marginTop: '2rem', fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-primary)' }}>
              {community.description}
            </p>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {community.website && <a href={community.website} target="_blank" rel="noreferrer" className="flex-center" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}><Globe size={18} /> Website</a>}
              {community.instagram_link && <a href={community.instagram_link} target="_blank" rel="noreferrer" className="flex-center" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}><LinkIcon size={18} /> Instagram</a>}
            </div>
          </div>
        </div>

        <section style={{ marginTop: '3rem' }}>
          <h2>Upcoming Meetups</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            {meetups.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No upcoming meetups scheduled.</p>
            ) : (
              meetups.map(meetup => (
                <div key={meetup.id} className="card glass" style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{meetup.title}</h3>
                  <div className="flex-center" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                    <Calendar size={16} /> {new Date(meetup.date).toLocaleDateString()}
                  </div>
                  <div className="flex-center" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <MapPin size={16} /> {meetup.location}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{meetup.description}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {userRole !== 'VISITOR' && (
          <section style={{ marginTop: '3rem' }}>
            <h2>Members Directory</h2>
            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--border-radius-lg)', marginTop: '1.5rem' }}>
              {members.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No members found.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
                  {members.map(member => (
                    <li key={member.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden' }}>
                          {member.user_avatar ? <img src={member.user_avatar} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Users size={20} />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.05rem' }}>{member.user_name || 'Unknown User'}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>ID: {member.user_id.substring(0, 8)}...</span>
                        </div>
                      </div>
                      <span className="badge" style={{ background: member.role === 'ADMIN' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)', color: member.role === 'ADMIN' ? '#3b82f6' : 'var(--text-secondary)' }}>
                        {member.role}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
      {showJoinModal && (
        <JoinModal 
          community={community} 
          onClose={() => setShowJoinModal(false)} 
          onSuccess={() => {
            setShowJoinModal(false);
            showToast(`Join request sent to ${community.name}!`);
          }}
          onError={(err) => { setShowJoinModal(false); showToast(err, true); }}
        />
      )}

      {showAdminModal && (
        <AdminModal
          community={community}
          onClose={() => {
            setShowAdminModal(false);
            fetchCommunityData(); 
          }}
        />
      )}
    </div>
  );
}
