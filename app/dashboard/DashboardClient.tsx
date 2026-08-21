'use client';

import { useState } from 'react';
import { submitResignation } from '@/lib/actions';
import {
  User, Calendar, FileBadge, FolderGit2, CreditCard,
  LogOut, Loader2, Award, ChevronRight, AlertTriangle,
  CheckCircle2, Clock, Menu, X
} from 'lucide-react';

const NAV = [
  { id: 'profile',      label: 'My Profile',    icon: User,        color: '#60a5fa' },
  { id: 'events',       label: 'Events',         icon: Calendar,    color: '#a78bfa' },
  { id: 'projects',     label: 'Projects',       icon: FolderGit2,  color: '#34d399' },
  { id: 'certificates', label: 'Certificates',   icon: Award,       color: '#fbbf24' },
  { id: 'idcard',       label: 'My ID Card',     icon: CreditCard,  color: '#38bdf8' },
  { id: 'resign',       label: 'Resign',         icon: LogOut,      color: '#f87171' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 14, outline: 'none',
};

export default function DashboardClient({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resignLetter, setResignLetter] = useState('');
  const [resignLoading, setResignLoading] = useState(false);
  const [resignMsg, setResignMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const { user, certificates, events, projects, resignationPending } = data;

  const handleResign = async () => {
    if (!resignLetter.trim()) { setResignMsg({ type: 'err', text: 'Please write your resignation letter.' }); return; }
    if (!confirm('Are you sure you want to submit your resignation? This cannot be undone once approved.')) return;
    setResignLoading(true);
    setResignMsg(null);
    const res = await submitResignation(user._id, user.name, user.xts_id, resignLetter);
    if (res.error) setResignMsg({ type: 'err', text: res.error });
    else { setResignMsg({ type: 'ok', text: 'Your resignation letter has been submitted. The admin will review it.' }); setResignLetter(''); }
    setResignLoading(false);
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
  };

  const sectionHeader = (icon: React.ReactNode, label: string, color: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ height: 36, width: 36, borderRadius: 10, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>{label}</h2>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Mobile overlay — sits above main content, below sidebar */}
      <div
        className="mobile-overlay"
        onClick={() => setSidebarOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 45,
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: 'rgba(15,23,42,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          padding: '24px 12px',
          flexDirection: 'column',
          gap: 4,
          zIndex: 40,
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        className="hidden sm:flex"
      >
        {/* Profile mini */}
        <div style={{ padding: '12px 8px', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 40, width: 40, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', border: '1.5px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {user.profile_image
                ? <img src={user.profile_image} alt="avatar" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                : <User style={{ width: 18, height: 18, color: '#60a5fa' }} />
              }
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
              <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>{user.xts_id}</p>
            </div>
          </div>
        </div>

        {NAV.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? `${item.color}18` : 'transparent',
                borderLeft: active ? `2px solid ${item.color}` : '2px solid transparent',
                color: active ? item.color : '#94a3b8',
                fontWeight: active ? 600 : 400, fontSize: 14, width: '100%', textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {item.label}
              {item.id === 'resign' && resignationPending && (
                <span style={{ marginLeft: 'auto', fontSize: 10, background: '#f87171', color: '#fff', borderRadius: 6, padding: '1px 6px' }}>Pending</span>
              )}
            </button>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <form action="/api/auth/logout" method="POST" style={{ width: '100%' }}>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#64748b', fontSize: 13, width: '100%', transition: 'all 0.15s' }}>
              <LogOut style={{ width: 15, height: 15 }} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR (slide-in drawer) ─────────── */}
      {/* Controlled purely by transform — no display:none so transition works */}
      <style>{`@media (min-width: 640px) { .mobile-sidebar, .mobile-overlay { display: none !important; } }`}</style>
      <aside
        className="mobile-sidebar"
        style={{
          width: 200,
          background: 'rgba(10,15,30,0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.09)',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          padding: '20px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: sidebarOpen ? '6px 0 40px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            alignSelf: 'flex-end',
            marginBottom: 8,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '6px 10px',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
          }}
        >
          <X style={{ width: 14, height: 14 }} /> Close
        </button>

        {/* Profile mini */}
        <div style={{ padding: '10px 8px', marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ height: 36, width: 36, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', border: '1.5px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {user.profile_image
                ? <img src={user.profile_image} alt="avatar" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                : <User style={{ width: 16, height: 16, color: '#60a5fa' }} />
              }
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
              <p style={{ color: '#64748b', fontSize: 10, margin: 0 }}>{user.xts_id}</p>
            </div>
          </div>
        </div>

        {NAV.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? `${item.color}18` : 'transparent',
                borderLeft: active ? `2px solid ${item.color}` : '2px solid transparent',
                color: active ? item.color : '#94a3b8',
                fontWeight: active ? 600 : 400, fontSize: 13, width: '100%', textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {item.label}
              {item.id === 'resign' && resignationPending && (
                <span style={{ marginLeft: 'auto', fontSize: 9, background: '#f87171', color: '#fff', borderRadius: 6, padding: '1px 5px' }}>Pending</span>
              )}
            </button>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <form action="/api/auth/logout" method="POST" style={{ width: '100%' }}>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 10px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#64748b', fontSize: 12, width: '100%', transition: 'all 0.15s' }}>
              <LogOut style={{ width: 14, height: 14 }} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '24px 12px', overflowY: 'auto', minWidth: 0 }}>

        {/* Mobile nav toggle button */}
        <div className="sm:hidden" style={{ marginBottom: 20 }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '8px 14px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <Menu style={{ width: 16, height: 16 }} /> Menu
          </button>
        </div>

        {/* ── PROFILE ────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 680, width: '100%' }}>
            {sectionHeader(<User style={{ width: 18, height: 18, color: '#60a5fa' }} />, 'My Profile', '#60a5fa')}

            <div style={{ ...cardStyle, padding: '20px 16px' }}>
              {/* Avatar + Name — wraps on small screens */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ height: 72, width: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.3))', border: '2px solid rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, boxShadow: '0 0 20px rgba(59,130,246,0.2)' }}>
                  {user.profile_image
                    ? <img src={user.profile_image} alt="Profile" style={{ width: 72, height: 72, objectFit: 'cover' }} />
                    : <User style={{ width: 32, height: 32, color: '#60a5fa' }} />
                  }
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 6px', wordBreak: 'break-word' }}>{user.name}</h1>
                  {user.team && (
                    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                      {user.team} Team
                    </span>
                  )}
                </div>
              </div>

              {/* Detail fields — auto-fit: 2 col on desktop, 1 col on tiny screens */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                {[
                  { label: 'XTS ID', value: user.xts_id },
                  { label: 'Email', value: user.email },
                  { label: 'Phone', value: user.phone || '—' },
                  { label: 'Course', value: user.course || '—' },
                  { label: 'Semester', value: user.semester ? `Sem ${user.semester}` : '—' },
                  { label: 'Team', value: user.team || 'Unassigned' },
                ].map(f => (
                  <div key={f.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px', minWidth: 0, overflow: 'hidden' }}>
                    <p style={{ color: '#64748b', fontSize: 10, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{f.label}</p>
                    <p style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500, margin: 0, wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
                {[
                  { label: 'Certs',    count: certificates.length, color: '#fbbf24' },
                  { label: 'Events',   count: events.length,       color: '#a78bfa' },
                  { label: 'Projects', count: projects.length,     color: '#34d399' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', background: `${s.color}12`, border: `1px solid ${s.color}30`, borderRadius: 12, padding: '12px 6px' }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: 0 }}>{s.count}</p>
                    <p style={{ fontSize: 10, color: '#94a3b8', margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EVENTS ─────────────────────────────────── */}
        {activeTab === 'events' && (
          <div style={{ maxWidth: 680 }}>
            {sectionHeader(<Calendar style={{ width: 18, height: 18, color: '#a78bfa' }} />, 'Upcoming Events', '#a78bfa')}
            {events.length === 0
              ? <p style={{ color: '#64748b' }}>No upcoming events.</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {events.map((ev: any) => (
                    <div key={ev._id} style={{ ...cardStyle, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <div>
                        <p style={{ color: '#fff', fontWeight: 600, margin: '0 0 6px', fontSize: 15 }}>{ev.title}</p>
                        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>{ev.description}</p>
                      </div>
                      <span style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                        {new Date(ev.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── PROJECTS ───────────────────────────────── */}
        {activeTab === 'projects' && (
          <div style={{ maxWidth: 680 }}>
            {sectionHeader(<FolderGit2 style={{ width: 18, height: 18, color: '#34d399' }} />, 'Projects', '#34d399')}
            {projects.length === 0
              ? <p style={{ color: '#64748b' }}>No projects available.</p>
              : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {projects.map((p: any) => (
                    <div key={p._id} style={{ ...cardStyle, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{p.title}</p>
                      <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>{p.description}</p>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', fontSize: 13, marginTop: 4 }}>View Project →</a>}
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── CERTIFICATES ────────────────────────────── */}
        {activeTab === 'certificates' && (
          <div style={{ maxWidth: 680 }}>
            {sectionHeader(<Award style={{ width: 18, height: 18, color: '#fbbf24' }} />, 'My Certificates', '#fbbf24')}
            {certificates.length === 0
              ? <p style={{ color: '#64748b' }}>No certificates uploaded yet.</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {certificates.map((cert: any) => (
                    <a key={cert._id} href={cert.file_url} target="_blank" rel="noopener noreferrer"
                      style={{ ...cardStyle, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'border 0.2s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.border = '1px solid rgba(251,191,36,0.4)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)')}
                    >
                      <div style={{ height: 40, width: 40, borderRadius: 10, background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileBadge style={{ width: 20, height: 20, color: '#fbbf24' }} />
                      </div>
                      <div>
                        <p style={{ color: '#fff', fontWeight: 500, margin: 0, fontSize: 14 }}>{cert.title}</p>
                        <p style={{ color: '#64748b', fontSize: 12, margin: '3px 0 0' }}>Issued: {new Date(cert.date_issued).toLocaleDateString()}</p>
                      </div>
                      <ChevronRight style={{ width: 16, height: 16, color: '#64748b', marginLeft: 'auto' }} />
                    </a>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── ID CARD ─────────────────────────────────── */}
        {activeTab === 'idcard' && (
          <div style={{ maxWidth: 480 }}>
            {sectionHeader(<CreditCard style={{ width: 18, height: 18, color: '#38bdf8' }} />, 'My XTS ID Card', '#38bdf8')}
            {user.id_card_url ? (
              <div style={{ ...cardStyle, padding: 20 }}>
                <img
                  src={user.id_card_url}
                  alt="XTS ID Card"
                  style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(56,189,248,0.2)', boxShadow: '0 8px 32px rgba(56,189,248,0.1)' }}
                />
                <a
                  href={user.id_card_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', marginTop: 14, padding: '10px', borderRadius: 10, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
                >
                  Open Full Size →
                </a>
              </div>
            ) : (
              <div style={{ ...cardStyle, padding: 40, textAlign: 'center' }}>
                <CreditCard style={{ width: 48, height: 48, color: '#334155', margin: '0 auto 12px' }} />
                <p style={{ color: '#64748b', margin: 0 }}>Your ID card has not been uploaded yet.</p>
                <p style={{ color: '#475569', fontSize: 12, marginTop: 6 }}>Please contact your admin.</p>
              </div>
            )}
          </div>
        )}

        {/* ── RESIGN ─────────────────────────────────── */}
        {activeTab === 'resign' && (
          <div style={{ maxWidth: 580 }}>
            {sectionHeader(<LogOut style={{ width: 18, height: 18, color: '#f87171' }} />, 'Resign from XTS', '#f87171')}

            {resignationPending ? (
              <div style={{ ...cardStyle, padding: 28, textAlign: 'center' }}>
                <Clock style={{ width: 44, height: 44, color: '#fbbf24', margin: '0 auto 12px' }} />
                <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: 16, margin: '0 0 6px' }}>Resignation Pending</p>
                <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Your resignation letter has been submitted and is under review by the admin. You will be notified once a decision is made.</p>
              </div>
            ) : (
              <div style={{ ...cardStyle, padding: 28 }}>
                <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
                  <AlertTriangle style={{ width: 18, height: 18, color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ color: '#fca5a5', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                    Once the admin approves your resignation, your account will be <strong>permanently deleted</strong>. This action cannot be reversed.
                  </p>
                </div>

                {resignMsg && (
                  <div style={{ background: resignMsg.type === 'ok' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)', border: `1px solid ${resignMsg.type === 'ok' ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                    {resignMsg.type === 'ok'
                      ? <CheckCircle2 style={{ width: 16, height: 16, color: '#34d399', flexShrink: 0 }} />
                      : <X style={{ width: 16, height: 16, color: '#f87171', flexShrink: 0 }} />
                    }
                    <p style={{ color: resignMsg.type === 'ok' ? '#34d399' : '#f87171', fontSize: 13, margin: 0 }}>{resignMsg.text}</p>
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 8 }}>
                    Resignation Letter <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <textarea
                    value={resignLetter}
                    onChange={e => setResignLetter(e.target.value)}
                    rows={7}
                    placeholder="Write your resignation letter here. Explain your reason for leaving XTS..."
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>

                <button
                  onClick={handleResign}
                  disabled={resignLoading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: resignLoading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontWeight: 600, fontSize: 14, opacity: resignLoading ? 0.6 : 1 }}
                >
                  {resignLoading ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : <LogOut style={{ width: 16, height: 16 }} />}
                  Submit Resignation Letter
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
