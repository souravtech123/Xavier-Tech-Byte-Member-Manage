import sys

# Remove from actions.ts
with open('lib/actions.ts', 'r') as f:
    actions_content = f.read()

old_action_check = """  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`File ${file.name} exceeds the 5MB size limit.`);
  }
"""
actions_content = actions_content.replace(old_action_check, "")

with open('lib/actions.ts', 'w') as f:
    f.write(actions_content)

# Remove from AdminClient.tsx
with open('app/admin/AdminClient.tsx', 'r') as f:
    client_content = f.read()

# 1. Add form
old_add_check = """                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size exceeds 5MB limit. Please select a smaller image.');
                        e.target.value = '';
                        setAddPreview(null);
                        return;
                      }
"""
client_content = client_content.replace(old_add_check, "")

# 2. Edit form
old_edit_check = """                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size exceeds 5MB limit. Please select a smaller image.');
                        e.target.value = '';
                        setEditPreview(null);
                        return;
                      }
"""
client_content = client_content.replace(old_edit_check, "")

# 3. id_card_url check
old_id_check = """                      if (e.target.files[0].size > 5 * 1024 * 1024) {
                        alert('File size exceeds 5MB limit. Please select a smaller file.');
                        e.target.value = '';
                      }
"""
client_content = client_content.replace(old_id_check, "")

# Add encType to forms just in case
client_content = client_content.replace(
    "<form action={(f) => handleAction(createMember, f)} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>",
    "<form action={(f) => handleAction(createMember, f)} encType=\"multipart/form-data\" style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>"
)
client_content = client_content.replace(
    "<form\n              action={async (f) => {",
    "<form\n              encType=\"multipart/form-data\"\n              action={async (f) => {"
)

with open('app/admin/AdminClient.tsx', 'w') as f:
    f.write(client_content)
