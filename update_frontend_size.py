import sys

with open('app/admin/AdminClient.tsx', 'r') as f:
    content = f.read()

# 1. Add Member profile image
old_add_img = """<input type="file" name="profile_image" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      if (e.target.files?.[0]) setAddPreview(URL.createObjectURL(e.target.files[0]));
                    }} />"""

new_add_img = """<input type="file" name="profile_image" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size exceeds 5MB limit. Please select a smaller image.');
                          e.target.value = '';
                          setAddPreview(null);
                          return;
                        }
                        setAddPreview(URL.createObjectURL(file));
                      }
                    }} />"""

content = content.replace(old_add_img, new_add_img)

# 2. Edit Member profile image
old_edit_img = """<input type="file" name="profile_image" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    if (e.target.files?.[0]) setEditPreview(URL.createObjectURL(e.target.files[0]));
                  }} />"""

new_edit_img = """<input type="file" name="profile_image" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size exceeds 5MB limit. Please select a smaller image.');
                        e.target.value = '';
                        setEditPreview(null);
                        return;
                      }
                      setEditPreview(URL.createObjectURL(file));
                    }
                  }} />"""

content = content.replace(old_edit_img, new_edit_img)


# 3. Edit Member mapped array
old_mapped = """<input name={f.name} type={f.type || 'text'} {...(f.type !== 'file' ? { defaultValue: f.val || '' } : {})} required={!!f.req} placeholder={f.placeholder} className={inputCls} style={inputStyle} accept={f.type === 'file' ? 'image/*' : undefined} />"""

new_mapped = """<input name={f.name} type={f.type || 'text'} {...(f.type !== 'file' ? { defaultValue: f.val || '' } : {})} required={!!f.req} placeholder={f.placeholder} className={inputCls} style={inputStyle} accept={f.type === 'file' ? 'image/*' : undefined} onChange={(e) => {
                    if (f.type === 'file' && e.target.files?.[0]) {
                      if (e.target.files[0].size > 5 * 1024 * 1024) {
                        alert('File size exceeds 5MB limit. Please select a smaller file.');
                        e.target.value = '';
                      }
                    }
                  }} />"""

content = content.replace(old_mapped, new_mapped)


with open('app/admin/AdminClient.tsx', 'w') as f:
    f.write(content)

