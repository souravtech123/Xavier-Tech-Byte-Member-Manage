'use server';

import { promises as fs } from 'fs';
import path from 'path';

async function saveFile(file: File | null): Promise<string | undefined> {
  if (!file || typeof file === 'string' || file.size === 0) return undefined;
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
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


import connectToDatabase from './mongodb';
import { User } from '@/models/User';
import { Certificate } from '@/models/Certificate';
import { Event } from '@/models/Event';
import { Project } from '@/models/Project';
import { Resignation } from '@/models/Resignation';
import { revalidatePath } from 'next/cache';

export async function createMember(formData: FormData) {
  try {
    await connectToDatabase();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const xts_id = formData.get('xts_id') as string;
    const phone = formData.get('phone') as string;
    const course = formData.get('course') as string;
    const team = formData.get('team') as string;
    const semester = formData.get('semester') as string;
    const profileImageFile = formData.get('profile_image') as File | null;

    if (!name || !email || !xts_id) return { error: 'Name, Email, and XTS ID are required' };

    const profile_image = await saveFile(profileImageFile) || '';

    const newMember = await User.create({ name, email, xts_id, phone, course, team, semester, profile_image, role: 'member' });
    revalidatePath('/admin');
    return { success: true, member: JSON.parse(JSON.stringify(newMember)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateMember(member_id: string, formData: FormData) {
  try {
    await connectToDatabase();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const xts_id = formData.get('xts_id') as string;
    const phone = formData.get('phone') as string;
    const course = formData.get('course') as string;
    const team = formData.get('team') as string;
    const semester = formData.get('semester') as string;
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
    );

    if (!updatedMember) return { error: 'Member not found' };

    revalidatePath('/admin');
    return { success: true, member: JSON.parse(JSON.stringify(updatedMember)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteMember(member_id: string) {
  try {
    await connectToDatabase();
    const deleted = await User.findByIdAndDelete(member_id);
    if (!deleted) return { error: 'Member not found' };
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createCertificate(formData: FormData) {
  try {
    await connectToDatabase();
    const member_id = formData.get('member_id') as string;
    const title = formData.get('title') as string;
    const file_url = formData.get('file_url') as string;

    if (!member_id || !title || !file_url) return { error: 'All fields are required' };

    const newCert = await Certificate.create({ member_id, title, file_url });
    revalidatePath('/admin');
    return { success: true, certificate: JSON.parse(JSON.stringify(newCert)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createEvent(formData: FormData) {
  try {
    await connectToDatabase();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;

    if (!title || !description || !date) return { error: 'All fields are required' };

    const newEvent = await Event.create({ title, description, date: new Date(date) });
    revalidatePath('/admin');
    return { success: true, event: JSON.parse(JSON.stringify(newEvent)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createProject(formData: FormData) {
  try {
    await connectToDatabase();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;

    if (!title || !description || !link) return { error: 'All fields are required' };

    const newProject = await Project.create({ title, description, link });
    revalidatePath('/admin');
    return { success: true, project: JSON.parse(JSON.stringify(newProject)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ─── Resignation Actions ────────────────────────────────────────────────────

export async function submitResignation(member_id: string, member_name: string, member_xts_id: string, letter: string) {
  try {
    await connectToDatabase();

    // Check if already submitted pending
    const existing = await Resignation.findOne({ member_id, status: 'pending' });
    if (existing) return { error: 'You already have a pending resignation request.' };

    await Resignation.create({ member_id, member_name, member_xts_id, letter });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function approveResignation(resignation_id: string) {
  try {
    await connectToDatabase();

    const resignation = await Resignation.findById(resignation_id);
    if (!resignation) return { error: 'Resignation not found' };

    // Delete the member account
    await User.findByIdAndDelete(resignation.member_id);

    // Mark resignation as approved
    await Resignation.findByIdAndUpdate(resignation_id, { status: 'approved' });

    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function rejectResignation(resignation_id: string) {
  try {
    await connectToDatabase();
    await Resignation.findByIdAndDelete(resignation_id);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ─── Getters ─────────────────────────────────────────────────────────────────

export async function getMemberData(xts_id: string) {
  await connectToDatabase();
  const user = await User.findOne({ xts_id }).lean();
  if (!user) return null;

  const certificates = await Certificate.find({ member_id: (user as any)._id }).lean();
  const events = await Event.find().sort({ date: 1 }).lean();
  const projects = await Project.find().lean();
  const resignation = await Resignation.findOne({ member_id: (user as any)._id, status: 'pending' }).lean();

  return {
    user: JSON.parse(JSON.stringify(user)),
    certificates: JSON.parse(JSON.stringify(certificates)),
    events: JSON.parse(JSON.stringify(events)),
    projects: JSON.parse(JSON.stringify(projects)),
    resignationPending: !!resignation,
  };
}

export async function getAllDataForAdmin() {
  await connectToDatabase();

  // Run all queries in parallel — total wait = slowest single query, not the sum.
  const [members, certificates, events, projects, resignations] = await Promise.all([
    User.find({ role: 'member' }).lean(),
    Certificate.find().populate('member_id').lean(),
    Event.find().sort({ date: 1 }).lean(),
    Project.find().lean(),
    Resignation.find().sort({ submittedAt: -1 }).lean(),
  ]);

  return JSON.parse(JSON.stringify({ members, certificates, events, projects, resignations }));
}

export async function verifyAndGetMember(id: string, xts_id: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ _id: id, xts_id }).lean();
    if (!user) return { error: 'Invalid XTS-ID' };

    const certificates = await Certificate.find({ member_id: id }).lean();
    const events = await Event.find().sort({ date: 1 }).lean();
    const projects = await Project.find().lean();
    
    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        certificates: JSON.parse(JSON.stringify(certificates)),
        events: JSON.parse(JSON.stringify(events)),
        projects: JSON.parse(JSON.stringify(projects))
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
