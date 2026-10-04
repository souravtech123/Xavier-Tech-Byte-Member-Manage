'use client';

import { QRCodeSVG } from 'qrcode.react';

import { useState } from 'react';
import {
  createMember, createCertificate, createEvent, createProject,
  updateMember, deleteMember, approveResignation, rejectResignation
} from '@/lib/actions';
import {
  Users, FileBadge, Calendar, FolderGit2, Plus, Loader2, QrCode,
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
  const [qrMember, setQrMember] = useState<string | null>(null);
  const [addPreview, setAddPreview] = useState<string | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
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
              <form action={(f) => handleAction(createMember, f)} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
                
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <label style={{ width: 100, height: 100, borderRadius: 12, border: '2px dashed rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}>
                    <input type="file" name="profile_image" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      if (e.target.files?.[0]) setAddPreview(URL.createObjectURL(e.target.files[0]));
                    }} />
                    {addPreview ? <img src={addPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ textAlign: 'center', color: '#94a3b8' }}><Plus style={{ margin: '0 auto' }} /><span style={{ fontSize: 10, display: 'block', marginTop: 2 }}>Photo</span></div>}
                  </label>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Full Name</label>
                      <input name="name" required className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Email</label>
                      <input name="email" type="email" required className={inputCls} style={inputStyle} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { name: 'xts_id', label: 'XTS ID', req: true, placeholder: 'XTS-XXXX' },
                    { name: 'phone', label: 'Phone' },
                    { name: 'course', label: 'Course' },
                    { name: 'team', label: 'Team' },
                    { name: 'semester', label: 'Semester' },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{f.label}</label>
                      <input name={f.name} type={f.type || 'text'} required={!!f.req} placeholder={f.placeholder} className={inputCls} style={inputStyle} />
                    </div>
                  ))}
                </div>
                
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', fontWeight: 600, fontSize: 14, marginTop: 4 }}>
                  {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : <><Plus style={{ width: 15, height: 15 }} /> Add Member</>}
                </button>
              </form>
            </div>
          )}

          {/* ── VIEW MEMBERS ───────────────── */}
          {activeTab === 'view_members' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Members ({members.length})</h2>
                <button
                  onClick={() => {
                    const headers = ['Name', 'XTS ID', 'Email', 'Phone', 'Course', 'Semester', 'Team'];
                    const rows = members.map((m: any) => [
                      m.name || '',
                      m.xts_id || '',
                      m.email || '',
                      m.phone || '',
                      m.course || '',
                      m.semester || '',
                      m.team || '',
                    ]);
                    const csvContent = [headers, ...rows].map(e => e.map(item => `"${(item||'').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `members_export.csv`;
                    link.click();
                  }}
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                >
                  Export to Excel (CSV)
                </button>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>Member</th>
                        <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>XTS ID</th>
                        <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>Contact</th>
                        <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>Details</th>
                        <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m: any) => (
                        <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ height: 80, width: 80, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                                {m.profile_image ? <img src={m.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users style={{ width: 28, height: 28, color: '#60a5fa' }} />}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{m.name}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{m.xts_id}</td>
                          <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                            <div>{m.email}</div>
                            <div style={{ color: '#64748b', fontSize: 11 }}>{m.phone}</div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                            <div>{m.course} {m.semester && `(Sem ${m.semester})`}</div>
                            {m.team && <div style={{ color: '#60a5fa', fontSize: 11 }}>{m.team} Team</div>}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button onClick={() => setQrMember(m._id)} title="Show QR Code" style={{ padding: '6px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}><QrCode style={{ width: 14, height: 14 }} /></button>
                              <button onClick={() => setEditingMember(m)} title="Edit" style={{ padding: '6px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}><Pencil style={{ width: 14, height: 14 }} /></button>
                              <button onClick={() => handleDelete(m._id)} title="Delete" style={{ padding: '6px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(248,113,113,0.1)', color: '#f87171' }}><Trash2 style={{ width: 14, height: 14 }} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
              <button onClick={() => { setEditingMember(null); setEditPreview(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X style={{ width: 20, height: 20 }} /></button>
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
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <label style={{ width: 90, height: 90, borderRadius: 12, border: '2px dashed rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}>
                  <input type="file" name="profile_image" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    if (e.target.files?.[0]) setEditPreview(URL.createObjectURL(e.target.files[0]));
                  }} />
                  {(editPreview || editingMember.profile_image) ? <img src={editPreview || editingMember.profile_image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ textAlign: 'center', color: '#94a3b8' }}><Pencil style={{ margin: '0 auto', width: 14, height: 14 }} /><span style={{ fontSize: 10, display: 'block', marginTop: 2 }}>Photo</span></div>}
                </label>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 5 }}>Full Name</label>
                    <input name="name" defaultValue={editingMember.name} required className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 5 }}>Email</label>
                    <input name="email" type="email" defaultValue={editingMember.email} required className={inputCls} style={inputStyle} />
                  </div>
                </div>
              </div>

              {[
                { name: 'xts_id', label: 'XTS ID', val: editingMember.xts_id, req: true },
                { name: 'phone', label: 'Phone', val: editingMember.phone },
                { name: 'course', label: 'Course', val: editingMember.course },
                { name: 'team', label: 'Team', val: editingMember.team },
                { name: 'semester', label: 'Semester', val: editingMember.semester },
                { name: 'id_card_url', label: 'ID Card Image (Upload)', type: 'file' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 5 }}>
                    {f.name === 'id_card_url' && <CreditCard style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />}
                    {f.label}
                  </label>
                  <input name={f.name} type={f.type || 'text'} {...(f.type !== 'file' ? { defaultValue: f.val || '' } : {})} required={!!f.req} placeholder={f.placeholder} className={inputCls} style={inputStyle} accept={f.type === 'file' ? 'image/*' : undefined} />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', fontWeight: 600, fontSize: 14, marginTop: 4 }}>
                {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    
      {/* QR Code Modal */}
      {qrMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 28, width: '100%', maxWidth: 350, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Member QR Code</h2>
              <button onClick={() => setQrMember(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X style={{ width: 20, height: 20 }} /></button>
            </div>
            <div style={{ background: '#fff', padding: 20, borderRadius: 12, display: 'inline-block', marginBottom: 20 }}>
              <QRCodeSVG value={`${window.location.origin}/member/${qrMember}`} size={200} />
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
              Scan this QR to view the member's profile.<br />Requires their XTS ID to unlock.
            </p>
          </div>
        </div>
      )}
</div>
  );
}
