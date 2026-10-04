import sys

with open('app/admin/AdminClient.tsx', 'r') as f:
    content = f.read()

# Add states for previews
if 'const [addPreview, setAddPreview] = useState' not in content:
    content = content.replace("const [qrMember, setQrMember] = useState<string | null>(null);", "const [qrMember, setQrMember] = useState<string | null>(null);\n  const [addPreview, setAddPreview] = useState<string | null>(null);\n  const [editPreview, setEditPreview] = useState<string | null>(null);")

# Also when closing the edit modal, reset the editPreview
content = content.replace(
    "<button onClick={() => setEditingMember(null)}",
    "<button onClick={() => { setEditingMember(null); setEditPreview(null); }}"
)

# Update the ADD MEMBER section
import re
add_member_pattern = re.compile(r"\{\/\* ── ADD MEMBER ─────────────────── \*\/\}.*?\{\/\* ── VIEW MEMBERS ───────────────── \*\/\}", re.DOTALL)
new_add_member = """{/* ── ADD MEMBER ─────────────────── */}
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

          {/* ── VIEW MEMBERS ───────────────── */}"""
content = add_member_pattern.sub(new_add_member, content)

# Update the Edit Member form array
edit_form_pattern = re.compile(r"\{\[\s*\{\s*name:\s*'name',.*?\].map\(f => \(", re.DOTALL)
new_edit_form = """<div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
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
              ].map(f => ("""
content = edit_form_pattern.sub(new_edit_form, content)

with open('app/admin/AdminClient.tsx', 'w') as f:
    f.write(content)

