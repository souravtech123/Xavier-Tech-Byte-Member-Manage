'use client';

import { useState } from 'react';
import {
  createMember, createCertificate, createEvent, createProject,
  updateMember, deleteMember, approveResignation, rejectResignation
} from '@/lib/actions';
import {
  Users, FileBadge, Calendar, FolderGit2, Plus, Loader2,
  Pencil, Trash2, X, LogOut, CheckCircle2, XCircle, Clock, CreditCard
} from 'lucide-react';

const NAV = [
  { id: 'members',      label: 'Add Member',    icon: Plus,        color: '#60a5fa' },
  { id: 'view_members', label: 'Members',        icon: Users,       color: '#38bdf8' },
  { id: 'certificates', label: 'Certificates',   icon: FileBadge,   color: '#fbbf24' },
  { id: 'events',       label: 'Events',         icon: Calendar,    color: '#a78bfa' },
  { id: 'projects',     label: 'Projects',       icon: FolderGit2,  color: '#34d399' },
  { id: 'resignations', label: 'Resignations',   icon: LogOut,      color: '#f87171' },
];

const inputCls = 'w-full rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all';
const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' } as const;

export default function AdminClient({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState('members');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingMember, setEditingMember] = useState<any>(null);
  const [resLoading, setResLoading] = useState<string | null>(null);

  const { members, certificates, events, projects, resignations } = initialData;
  const pendingCount = (resignations || []).filter((r: any) => r.status === 'pending').length;

  const handleAction = async (action: Function, formData: FormData) => {
    setLoading(true); setMessage('');
    const res = await action(formData);
    setMessage(res.error ? `Error: ${res.error}` : 'Success!');
    if (!res.error) window.location.reload();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member?')) return;
    setLoading(true);
    const res = await deleteMember(id);
    setMessage(res.error ? `Error: ${res.error}` : 'Member deleted.');
    if (!res.error) window.location.reload();
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve resignation? The member account will be permanently deleted.')) return;
    setResLoading(id);
    const res = await approveResignation(id);
    if (res.error) setMessage(`Error: ${res.error}`);
    else window.location.reload();
    setResLoading(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject and remove this resignation request?')) return;
    setResLoading(id);
    const res = await rejectResignation(id);
    if (res.error) setMessage(`Error: ${res.error}`);
    else window.location.reload();
    setResLoading(null);
  };

  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 } as const;

  return (
    <div style={{ display: 'flex', gap: 24 }}>

      {/* Sidebar */}
      <aside style={{ width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px',
                borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: active ? `${item.color}18` : 'transparent',
                borderLeft: active ? `2px solid ${item.color}` : '2px solid transparent',
                color: active ? item.color : '#94a3b8',
                fontWeight: active ? 600 : 400, fontSize: 13, width: '100%',
                transition: 'all 0.15s',
              }}
            >
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {item.label}
              {item.id === 'resignations' && pendingCount > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 10, background: '#f87171', color: '#fff', borderRadius: 6, padding: '1px 6px' }}>{pendingCount}</span>
              )}
            </button>
          );
        })}
      </aside>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {message && (
          <div style={{ padding: '10px 16px', marginBottom: 16, borderRadius: 10, fontSize: 13, background: message.startsWith('Error') ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)', border: `1px solid ${message.startsWith('Error') ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}`, color: message.startsWith('Error') ? '#f87171' : '#34d399' }}>
            {message}
          </div>
        )}

        <div style={{ ...cardStyle, padding: 24 }}>

          {/* ── ADD MEMBER ─────────────────── */}
          {activeTab === 'members' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Add New Member</h2>
              <form action={(f) => handleAction(createMember, f)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 560 }}>
                {[
                  { name: 'name', label: 'Full Name', req: true, cols: 2 },
                  { name: 'email', label: 'Email', type: 'email', req: true, cols: 2 },
                  { name: 'xts_id', label: 'XTS ID', req: true, placeholder: 'XTS-XXXX' },
                  { name: 'phone', label: 'Phone' },
                  { name: 'course', label: 'Course' },
                  { name: 'team', label: 'Team' },
                  { name: 'semester', label: 'Semester' },
                  { name: 'profile_image', label: 'Photo URL', placeholder: 'https://...', cols: 2 },
                ].map(f => (
                  <div key={f.name} style={{ gridColumn: f.cols === 2 ? 'span 2' : undefined }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{f.label}</label>
                    <input name={f.name} type={f.type || 'text'} required={!!f.req} placeholder={f.placeholder}
                      className={inputCls} style={inputStyle} />
                  </div>
                ))}
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', fontWeight: 600, fontSize: 14 }}>
                    {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : <><Plus style={{ width: 15, height: 15 }} /> Add Member</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── VIEW MEMBERS ───────────────── */}
          {activeTab === 'view_members' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Members ({members.length})</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {members.map((m: any) => (
                  <div key={m._id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ height: 42, width: 42, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        {m.profile_image ? <img src={m.profile_image} alt="" style={{ width: 42, height: 42, objectFit: 'cover' }} /> : <Users style={{ width: 18, height: 18, color: '#60a5fa' }} />}
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                        <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>{m.xts_id}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setEditingMember(m)} title="Edit" style={{ padding: '6px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}><Pencil style={{ width: 13, height: 13 }} /></button>
                        <button onClick={() => handleDelete(m._id)} title="Delete" style={{ padding: '6px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(248,113,113,0.1)', color: '#f87171' }}><Trash2 style={{ width: 13, height: 13 }} /></button>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <p style={{ margin: 0 }}>{m.email}</p>
                      {m.team && <span style={{ display: 'inline-block', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', borderRadius: 6, padding: '1px 8px', fontSize: 11 }}>{m.team} Team</span>}
                      {m.course && <p style={{ margin: 0 }}>{m.course} {m.semester && `• Sem ${m.semester}`}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CERTIFICATES ───────────────── */}
          {activeTab === 'certificates' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Upload Certificate</h2>
              <form action={(f) => handleAction(createCertificate, f)} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Select Member</label>
                  <select name="member_id" required className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="">-- Select Member --</option>
                    {members.map((m: any) => <option key={m._id} value={m._id}>{m.name} ({m.xts_id})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Certificate Title</label>
                  <input name="title" required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>File URL</label>
                  <input name="file_url" required placeholder="https://..." className={inputCls} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #d97706, #b45309)', color: '#fff', fontWeight: 600, fontSize: 14 }}>
                  {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : <><Plus style={{ width: 15, height: 15 }} /> Upload Certificate</>}
                </button>
              </form>
            </div>
          )}

          {/* ── EVENTS ─────────────────────── */}
          {activeTab === 'events' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Create Event</h2>
              <form action={(f) => handleAction(createEvent, f)} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Event Title</label>
                  <input name="title" required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Date</label>
                  <input name="date" type="date" required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Description</label>
                  <textarea name="description" required rows={3} className={inputCls} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 600, fontSize: 14 }}>
                  {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : <><Plus style={{ width: 15, height: 15 }} /> Add Event</>}
                </button>
              </form>
            </div>
          )}

          {/* ── PROJECTS ───────────────────── */}
          {activeTab === 'projects' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Add Project</h2>
              <form action={(f) => handleAction(createProject, f)} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Project Title</label>
                  <input name="title" required className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Project Link</label>
                  <input name="link" required placeholder="https://github.com/..." className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Description</label>
                  <textarea name="description" required rows={3} className={inputCls} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', fontWeight: 600, fontSize: 14 }}>
                  {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : <><Plus style={{ width: 15, height: 15 }} /> Add Project</>}
                </button>
              </form>
            </div>
          )}

          {/* ── RESIGNATIONS ───────────────── */}
          {activeTab === 'resignations' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>
                Resignation Requests
                {pendingCount > 0 && <span style={{ marginLeft: 10, fontSize: 12, background: '#f87171', color: '#fff', borderRadius: 8, padding: '2px 10px' }}>{pendingCount} Pending</span>}
              </h2>

              {(!resignations || resignations.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <LogOut style={{ width: 40, height: 40, color: '#334155', margin: '0 auto 12px' }} />
                  <p style={{ color: '#64748b' }}>No resignation requests yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {resignations.map((r: any) => (
                    <div key={r._id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${r.status === 'pending' ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.15)'}`, borderRadius: 14, padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <p style={{ color: '#fff', fontWeight: 600, margin: '0 0 3px' }}>{r.member_name}</p>
                          <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>{r.member_xts_id} &bull; {new Date(r.submittedAt).toLocaleDateString()}</p>
                        </div>
                        {r.status === 'pending'
                          ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 20, padding: '3px 10px' }}><Clock style={{ width: 11, height: 11 }} /> Pending</span>
                          : <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 20, padding: '3px 10px' }}><CheckCircle2 style={{ width: 11, height: 11 }} /> Approved</span>
                        }
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', marginBottom: r.status === 'pending' ? 14 : 0 }}>
                        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{r.letter}</p>
                      </div>

                      {r.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            onClick={() => handleApprove(r._id)}
                            disabled={resLoading === r._id}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontWeight: 600, fontSize: 13, opacity: resLoading === r._id ? 0.6 : 1 }}
                          >
                            {resLoading === r._id ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> : <CheckCircle2 style={{ width: 14, height: 14 }} />}
                            Approve & Remove Member
                          </button>
                          <button
                            onClick={() => handleReject(r._id)}
                            disabled={resLoading === r._id}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 600, fontSize: 13 }}
                          >
                            <XCircle style={{ width: 14, height: 14 }} />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 28, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Edit Member</h2>
              <button onClick={() => setEditingMember(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X style={{ width: 20, height: 20 }} /></button>
            </div>
            <form
              action={async (f) => {
                setLoading(true);
                const res = await updateMember(editingMember._id, f);
                if (res.error) setMessage(`Error: ${res.error}`);
                else { setEditingMember(null); window.location.reload(); }
                setLoading(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {[
                { name: 'name', label: 'Full Name', val: editingMember.name, req: true },
                { name: 'email', label: 'Email', type: 'email', val: editingMember.email, req: true },
                { name: 'xts_id', label: 'XTS ID', val: editingMember.xts_id, req: true },
                { name: 'phone', label: 'Phone', val: editingMember.phone },
                { name: 'course', label: 'Course', val: editingMember.course },
                { name: 'team', label: 'Team', val: editingMember.team },
                { name: 'semester', label: 'Semester', val: editingMember.semester },
                { name: 'profile_image', label: 'Profile Photo URL', val: editingMember.profile_image, placeholder: 'https://...' },
                { name: 'id_card_url', label: 'ID Card URL', val: editingMember.id_card_url, placeholder: 'https://... (image of ID card)' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 5 }}>
                    {f.name === 'id_card_url' && <CreditCard style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />}
                    {f.label}
                  </label>
                  <input name={f.name} type={f.type || 'text'} defaultValue={f.val || ''} required={!!f.req} placeholder={f.placeholder} className={inputCls} style={inputStyle} />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', fontWeight: 600, fontSize: 14, marginTop: 4 }}>
                {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
