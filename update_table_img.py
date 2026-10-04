import sys

with open('app/admin/AdminClient.tsx', 'r') as f:
    content = f.read()

old_block = """                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ height: 32, width: 32, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                {m.profile_image ? <img src={m.profile_image} alt="" style={{ width: 32, height: 32, objectFit: 'cover' }} /> : <Users style={{ width: 14, height: 14, color: '#60a5fa' }} />}
                              </div>
                              <span style={{ color: '#fff', fontWeight: 600 }}>{m.name}</span>
                            </div>
                          </td>"""

new_block = """                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ height: 80, width: 80, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                                {m.profile_image ? <img src={m.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users style={{ width: 28, height: 28, color: '#60a5fa' }} />}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{m.name}</span>
                              </div>
                            </div>
                          </td>"""

content = content.replace(old_block, new_block)

with open('app/admin/AdminClient.tsx', 'w') as f:
    f.write(content)
