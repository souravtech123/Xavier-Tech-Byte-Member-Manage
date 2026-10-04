import sys

with open('lib/actions.ts', 'r') as f:
    content = f.read()

helper = """import { promises as fs } from 'fs';
import path from 'path';

async function saveFile(file: File | null): Promise<string | undefined> {
  if (!file || typeof file === 'string' || file.size === 0) return undefined;
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/\\s+/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error saving file:', error);
    return undefined;
  }
}
"""

# Insert imports and helper after use server
content = content.replace("'use server';", "'use server';\n\n" + helper)

# Update createMember
old_create = """    const semester = formData.get('semester') as string;
    const profile_image = formData.get('profile_image') as string;

    if (!name || !email || !xts_id) return { error: 'Name, Email, and XTS ID are required' };

    const newMember = await User.create({ name, email, xts_id, phone, course, team, semester, profile_image, role: 'member' });"""

new_create = """    const semester = formData.get('semester') as string;
    const profileImageFile = formData.get('profile_image') as File | null;

    if (!name || !email || !xts_id) return { error: 'Name, Email, and XTS ID are required' };

    const profile_image = await saveFile(profileImageFile) || '';

    const newMember = await User.create({ name, email, xts_id, phone, course, team, semester, profile_image, role: 'member' });"""
content = content.replace(old_create, new_create)

# Update updateMember
old_update = """    const semester = formData.get('semester') as string;
    const profile_image = formData.get('profile_image') as string;
    const id_card_url = formData.get('id_card_url') as string;

    if (!name || !email || !xts_id) return { error: 'Name, Email, and XTS ID are required' };

    const updatedMember = await User.findByIdAndUpdate(
      member_id,
      { name, email, xts_id, phone, course, team, semester, profile_image, id_card_url },
      { new: true }
    );"""

new_update = """    const semester = formData.get('semester') as string;
    const profileImageFile = formData.get('profile_image') as File | null;
    const idCardFile = formData.get('id_card_url') as File | null;

    if (!name || !email || !xts_id) return { error: 'Name, Email, and XTS ID are required' };

    const updateData: any = { name, email, xts_id, phone, course, team, semester };
    
    const savedProfileImage = await saveFile(profileImageFile);
    if (savedProfileImage) updateData.profile_image = savedProfileImage;
    
    const savedIdCard = await saveFile(idCardFile);
    if (savedIdCard) updateData.id_card_url = savedIdCard;

    const updatedMember = await User.findByIdAndUpdate(
      member_id,
      updateData,
      { new: true }
    );"""
content = content.replace(old_update, new_update)

with open('lib/actions.ts', 'w') as f:
    f.write(content)
