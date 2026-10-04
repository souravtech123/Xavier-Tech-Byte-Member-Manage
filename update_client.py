import sys

with open('app/admin/AdminClient.tsx', 'r') as f:
    content = f.read()

# Update create form
content = content.replace(
    "{ name: 'profile_image', label: 'Photo URL', placeholder: 'https://...', cols: 2 },",
    "{ name: 'profile_image', label: 'Profile Photo (Upload)', type: 'file', cols: 2 },"
)

# Update update form
content = content.replace(
    "{ name: 'profile_image', label: 'Profile Photo URL', val: editingMember.profile_image, placeholder: 'https://...' },",
    "{ name: 'profile_image', label: 'Profile Photo (Upload)', type: 'file' },"
)
content = content.replace(
    "{ name: 'id_card_url', label: 'ID Card URL', val: editingMember.id_card_url, placeholder: 'https://... (image of ID card)' },",
    "{ name: 'id_card_url', label: 'ID Card Image (Upload)', type: 'file' },"
)

# Update the generic form input generator for create form
old_input = """                    <input name={f.name} type={f.type || 'text'} required={!!f.req} placeholder={f.placeholder}
                      className={inputCls} style={inputStyle} />"""
new_input = """                    <input name={f.name} type={f.type || 'text'} required={!!f.req} placeholder={f.placeholder}
                      className={inputCls} style={inputStyle} accept={f.type === 'file' ? 'image/*' : undefined} />"""
content = content.replace(old_input, new_input)

# Update the generic form input generator for edit form
old_edit_input = """                  <input name={f.name} type={f.type || 'text'} defaultValue={f.val || ''} required={!!f.req} placeholder={f.placeholder} className={inputCls} style={inputStyle} />"""
new_edit_input = """                  <input name={f.name} type={f.type || 'text'} {...(f.type !== 'file' ? { defaultValue: f.val || '' } : {})} required={!!f.req} placeholder={f.placeholder} className={inputCls} style={inputStyle} accept={f.type === 'file' ? 'image/*' : undefined} />"""
content = content.replace(old_edit_input, new_edit_input)

# Update viewing elements (add download / view links)
# Need to replace the empty space after member rendering to include these links
old_view = """                      {m.course && <p style={{ margin: 0 }}>{m.course} {m.semester && `• Sem ${m.semester}`}</p>}
                    </div>


                  </div>"""
new_view = """                      {m.course && <p style={{ margin: 0 }}>{m.course} {m.semester && `• Sem ${m.semester}`}</p>}
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
                  </div>"""
content = content.replace(old_view, new_view)


with open('app/admin/AdminClient.tsx', 'w') as f:
    f.write(content)

