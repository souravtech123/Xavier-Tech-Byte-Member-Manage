import sys

with open('app/admin/AdminClient.tsx', 'r') as f:
    content = f.read()

# Add QrCode to lucide-react imports if not there
if 'QrCode' not in content:
    content = content.replace("Users, FileBadge, Calendar, FolderGit2, Plus, Loader2,", "Users, FileBadge, Calendar, FolderGit2, Plus, Loader2, QrCode,")

# Add import QRCodeSVG
if 'QRCodeSVG' not in content:
    content = content.replace("'use client';", "'use client';\n\nimport { QRCodeSVG } from 'qrcode.react';")

# Add state for qrMember
if 'const [qrMember, setQrMember] = useState' not in content:
    content = content.replace("const [editingMember, setEditingMember] = useState<any>(null);", "const [editingMember, setEditingMember] = useState<any>(null);\n  const [qrMember, setQrMember] = useState<string | null>(null);")

# Update view_members
old_view_members = """          {/* ── VIEW MEMBERS ───────────────── */}
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

                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      {m.profile_image && (
                        <a href={m.profile_image} target="_blank" download style={{ fontSize: 11, color: '#3b82f6', textDecoration: 'none', background: 'rgba(59,130,246,0.1)', padding: '4px 8px', borderRadius: 4 }}>
                          View/Download Photo
                        </a>
                      )}
                      {m.id_card_url && (
                        <a href={m.id_card_url} target="_blank" download style={{ fontSize: 11, color: '#10b981', textDecoration: 'none', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 4 }}>
                          View/Download ID
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}"""

new_view_members = """          {/* ── VIEW MEMBERS ───────────────── */}
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
                    const csvContent = [headers, ...rows].map(e => e.map(item => `"${(item||'').toString().replace(/"/g, '""')}"`).join(',')).join('\\n');
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
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ height: 32, width: 32, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                {m.profile_image ? <img src={m.profile_image} alt="" style={{ width: 32, height: 32, objectFit: 'cover' }} /> : <Users style={{ width: 14, height: 14, color: '#60a5fa' }} />}
                              </div>
                              <span style={{ color: '#fff', fontWeight: 600 }}>{m.name}</span>
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
          )}"""

content = content.replace(old_view_members, new_view_members)

# Add the QR modal at the bottom just before the last </div>
qr_modal = """
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
"""
last_div_index = content.rfind("</div>\n  );\n}")
if last_div_index != -1:
    content = content[:last_div_index] + qr_modal + content[last_div_index:]

with open('app/admin/AdminClient.tsx', 'w') as f:
    f.write(content)

