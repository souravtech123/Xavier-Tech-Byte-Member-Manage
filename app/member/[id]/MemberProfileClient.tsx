'use client';

import { useState } from 'react';
import { verifyAndGetMember } from '@/lib/actions';
import { Loader2, Lock, User as UserIcon, Calendar, FileBadge, FolderGit2 } from 'lucide-react';

export default function MemberProfileClient({ id }: { id: string }) {
  const [xtsId, setXtsId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await verifyAndGetMember(id, xtsId);
    if (res.error) {
      setError(res.error);
    } else {
      setData(res.data);
    }
    setLoading(false);
  };

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: 20 }}>
        <div style={{ background: '#1e293b', padding: 40, borderRadius: 20, maxWidth: 400, width: '100%', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#60a5fa' }}>
            <Lock size={28} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Locked Profile</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>Enter your XTS-ID to view your member profile and details.</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input 
              type="text" 
              placeholder="e.g. XTS-1234" 
              value={xtsId}
              onChange={(e) => setXtsId(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontSize: 16, textAlign: 'center' }}
            />
            {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', borderRadius: 12, background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Unlock Profile'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { user, certificates, events, projects } = data;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Profile Card */}
        <div style={{ background: '#1e293b', borderRadius: 20, padding: 30, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            {user.profile_image ? <img src={user.profile_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={40} color="#60a5fa" />}
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{user.name}</h1>
            <p style={{ color: '#94a3b8', fontSize: 16, margin: '0 0 12px' }}>{user.xts_id} | {user.email}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {user.team && <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{user.team} Team</span>}
              {user.course && <span style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>{user.course} {user.semester && `(Sem ${user.semester})`}</span>}
            </div>
          </div>
        </div>

        {/* Certificates */}
        {certificates.length > 0 && (
          <div>
            <h2 style={{ fontSize: 20, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FileBadge color="#fbbf24" size={20} /> Certificates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {certificates.map((c: any) => (
                <a key={c._id} href={c.file_url} target="_blank" rel="noreferrer" style={{ display: 'block', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', padding: 16, borderRadius: 16, textDecoration: 'none' }}>
                  <p style={{ color: '#fbbf24', fontWeight: 600, margin: 0 }}>{c.title}</p>
                  <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>Click to view certificate</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 style={{ fontSize: 20, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FolderGit2 color="#34d399" size={20} /> Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {projects.map((p: any) => (
                <a key={p._id} href={p.link} target="_blank" rel="noreferrer" style={{ display: 'block', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', padding: 16, borderRadius: 16, textDecoration: 'none' }}>
                  <p style={{ color: '#34d399', fontWeight: 600, margin: '0 0 6px' }}>{p.title}</p>
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{p.description}</p>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
