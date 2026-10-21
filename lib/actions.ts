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
import { Meeting } from '@/models/Meeting';
import { Attendance } from '@/models/Attendance';
import { Notification } from '@/models/Notification';
import { cookies } from 'next/headers';
import { verifyToken } from './auth';
import { revalidatePath } from 'next/cache';

// ─── Notification Helpers ─────────────────────────────────────────────────────

async function broadcastNotification(type: INotificationCreate['type'], title: string, message: string) {
  try {
    await Notification.create({ recipient_id: null, type, title, message, read_by: [] });
  } catch (e) {
    console.error('broadcastNotification error:', e);
  }
}

interface INotificationCreate {
  type: 'event_new' | 'event_updated' | 'event_deleted' | 'project_new' | 'project_updated' | 'project_deleted' | 'welcome' | 'general';
  title: string;
  message: string;
  recipient_id?: string | null;
}

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

    // Welcome notification — personal to this member
    await Notification.create({
      recipient_id: newMember._id,
      type: 'welcome',
      title: `Welcome to XTS, ${name}! 🎉`,
      message: `Hi ${name}, your Xavier Tech Byte Society membership is active. Explore events, projects, and your member dashboard. We're glad you're here!`,
      read_by: [],
    });

    revalidatePath('/admin');
    return { success: true, member: JSON.parse(JSON.stringify(newMember)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateMember(formData: FormData) {
  try {
    await connectToDatabase();
    const member_id = formData.get('member_id') as string;
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
    await broadcastNotification(
      'event_new',
      `📅 New Event: ${title}`,
      `A new official XTS event has been announced — "${title}" on ${new Date(date).toLocaleDateString()}. Head to the Events section for details!`
    );
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true, event: JSON.parse(JSON.stringify(newEvent)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateEvent(formData: FormData) {
  try {
    await connectToDatabase();
    const event_id = formData.get('event_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;

    if (!event_id || !title || !description || !date) {
      return { error: 'All fields are required' };
    }

    const updated = await Event.findByIdAndUpdate(
      event_id,
      { title, description, date: new Date(date) },
      { new: true }
    );
    if (!updated) return { error: 'Event not found' };

    await broadcastNotification(
      'event_updated',
      `🔄 Event Updated: ${title}`,
      `Details for "${title}" have been updated. Date is set to ${new Date(date).toLocaleDateString()}. Check your dashboard for latest updates.`
    );
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true, event: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteEvent(event_id: string) {
  try {
    await connectToDatabase();
    const deleted = await Event.findByIdAndDelete(event_id);
    if (!deleted) return { error: 'Event not found' };

    await broadcastNotification(
      'event_deleted',
      `🗑️ Event Removed`,
      `An event has been concluded or removed from the XTS calendar.`
    );
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
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
    await broadcastNotification(
      'project_new',
      `🚀 New Project: ${title}`,
      `A new XTS project has been published — "${title}". Check it out in your Projects section!`
    );
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true, project: JSON.parse(JSON.stringify(newProject)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProject(formData: FormData) {
  try {
    await connectToDatabase();
    const project_id = formData.get('project_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;

    if (!project_id || !title || !description || !link) {
      return { error: 'All fields are required' };
    }

    const updated = await Project.findByIdAndUpdate(
      project_id,
      { title, description, link },
      { new: true }
    );
    if (!updated) return { error: 'Project not found' };

    await broadcastNotification(
      'project_updated',
      `✏️ Project Updated: ${title}`,
      `The project "${title}" has been updated with new information. Visit your Projects tab to see the changes.`
    );
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true, project: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProject(project_id: string) {
  try {
    await connectToDatabase();
    const deleted = await Project.findByIdAndDelete(project_id);
    if (!deleted) return { error: 'Project not found' };

    await broadcastNotification(
      'project_deleted',
      `🗂️ Project Removed`,
      `A project has been removed from the XTS portfolio. Check the Projects section for the current lineup.`
    );
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getLandingPageData() {
  try {
    await connectToDatabase();
    const [events, projects] = await Promise.all([
      Event.find().sort({ date: 1 }).lean(),
      Project.find().lean(),
    ]);
    return {
      events: JSON.parse(JSON.stringify(events)),
      projects: JSON.parse(JSON.stringify(projects)),
    };
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return { events: [], projects: [] };
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token) as any;
}

// ─── Meeting Management Actions (Admin) ──────────────────────────────────────

export async function createMeeting(data: {
  title: string;
  purpose?: string;
  description?: string;
  agenda?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'online' | 'offline' | 'hybrid';
  link?: string;
  venue?: string;
  inviteAll: boolean;
  participantIds?: string[];
}) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return { error: 'Unauthorized: Admin privileges required' };
    }

    await connectToDatabase();

    const { title, purpose, description, agenda, date, startTime, endTime, type, link, venue, inviteAll, participantIds } = data;
    if (!title || !date || !startTime || !endTime) {
      return { error: 'Title, Date, Start Time, and End Time are required' };
    }

    // Generate unique human-readable Meeting ID
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const meeting_id = `MTG-${new Date(date).getFullYear()}-${randomSuffix}`;

    // Resolve participants
    let assignedParticipantIds: any[] = [];
    if (inviteAll) {
      const allMembers = await User.find({ role: 'member' }).select('_id').lean();
      assignedParticipantIds = allMembers.map((m: any) => m._id);
    } else if (participantIds && Array.isArray(participantIds)) {
      assignedParticipantIds = participantIds;
    }

    const newMeeting = await Meeting.create({
      meeting_id,
      title: title.trim(),
      purpose: (purpose || '').trim(),
      description: (description || '').trim(),
      agenda: (agenda || '').trim(),
      date: new Date(date),
      startTime,
      endTime,
      type,
      link: (link || '').trim(),
      venue: (venue || '').trim(),
      inviteAll: !!inviteAll,
      participants: assignedParticipantIds,
      status: 'upcoming',
    });

    // Populate initial 'not_recorded' attendance for each participant
    if (assignedParticipantIds.length > 0) {
      const attendanceDocs = assignedParticipantIds.map(member_id => ({
        meeting_id: newMeeting._id,
        member_id,
        status: 'not_recorded',
        auditLogs: [],
      }));
      await Attendance.insertMany(attendanceDocs, { ordered: false }).catch(() => {
        // Ignore any unexpected duplicate errors
      });
    }

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, meeting: JSON.parse(JSON.stringify(newMeeting)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateMeeting(data: {
  meetingId: string;
  title: string;
  purpose?: string;
  description?: string;
  agenda?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'online' | 'offline' | 'hybrid';
  link?: string;
  venue?: string;
  inviteAll: boolean;
  participantIds?: string[];
  status?: 'upcoming' | 'completed' | 'cancelled';
}) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return { error: 'Unauthorized: Admin privileges required' };
    }

    await connectToDatabase();

    const meeting = await Meeting.findById(data.meetingId);
    if (!meeting) return { error: 'Meeting not found' };

    let assignedParticipantIds = meeting.participants;
    if (data.inviteAll) {
      const allMembers = await User.find({ role: 'member' }).select('_id').lean();
      assignedParticipantIds = allMembers.map((m: any) => m._id);
    } else if (data.participantIds && Array.isArray(data.participantIds)) {
      assignedParticipantIds = data.participantIds.map(id => id as any);
    }

    // Preserve historical attendance while adding attendance for newly assigned members
    if (assignedParticipantIds && assignedParticipantIds.length > 0) {
      const existingAttendance = await Attendance.find({ meeting_id: meeting._id }).select('member_id').lean();
      const existingMemberIdSet = new Set(existingAttendance.map((a: any) => a.member_id.toString()));

      const newParticipants = assignedParticipantIds.filter(
        id => !existingMemberIdSet.has(id.toString())
      );

      if (newParticipants.length > 0) {
        const newAttendanceDocs = newParticipants.map(member_id => ({
          meeting_id: meeting._id,
          member_id,
          status: 'not_recorded',
          auditLogs: [],
        }));
        await Attendance.insertMany(newAttendanceDocs, { ordered: false }).catch(() => {});
      }
    }

    meeting.title = data.title.trim();
    meeting.purpose = (data.purpose || '').trim();
    meeting.description = (data.description || '').trim();
    meeting.agenda = (data.agenda || '').trim();
    meeting.date = new Date(data.date);
    meeting.startTime = data.startTime;
    meeting.endTime = data.endTime;
    meeting.type = data.type;
    meeting.link = (data.link || '').trim();
    meeting.venue = (data.venue || '').trim();
    meeting.inviteAll = !!data.inviteAll;
    meeting.participants = assignedParticipantIds;
    if (data.status) meeting.status = data.status;

    await meeting.save();

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, meeting: JSON.parse(JSON.stringify(meeting)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function cancelMeeting(meetingId: string) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return { error: 'Unauthorized: Admin privileges required' };
    }

    await connectToDatabase();
    const meeting = await Meeting.findByIdAndUpdate(meetingId, { status: 'cancelled' }, { new: true });
    if (!meeting) return { error: 'Meeting not found' };

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, meeting: JSON.parse(JSON.stringify(meeting)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteMeeting(meetingId: string) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return { error: 'Unauthorized: Admin privileges required' };
    }

    await connectToDatabase();
    await Meeting.findByIdAndDelete(meetingId);
    await Attendance.deleteMany({ meeting_id: meetingId });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ─── Attendance Recording & Correction Actions ───────────────────────────────

export async function recordAttendance(data: {
  meetingId: string;
  memberId: string;
  status: 'present' | 'absent' | 'excused' | 'not_recorded';
  remarks?: string;
}) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return { error: 'Unauthorized: Admin privileges required to record attendance' };
    }

    await connectToDatabase();

    const meeting = await Meeting.findById(data.meetingId);
    if (!meeting) return { error: 'Meeting not found' };

    if (meeting.status === 'cancelled') {
      return { error: 'Cannot record attendance for a cancelled meeting' };
    }

    // Check if participant is assigned
    const isAssigned = meeting.inviteAll || meeting.participants.some(p => p.toString() === data.memberId);
    if (!isAssigned) {
      return { error: 'Member is not an assigned participant of this meeting' };
    }

    let record = await Attendance.findOne({ meeting_id: data.meetingId, member_id: data.memberId });
    const previousStatus = record ? record.status : 'not_recorded';

    if (previousStatus === data.status) {
      return { success: true, record: JSON.parse(JSON.stringify(record)) };
    }

    const adminName = authUser.name || authUser.email || 'Admin';

    if (!record) {
      record = new Attendance({
        meeting_id: data.meetingId,
        member_id: data.memberId,
        status: data.status,
        recordedAt: new Date(),
        auditLogs: [{
          previousStatus: 'not_recorded',
          updatedStatus: data.status,
          modifiedBy: adminName,
          modifiedAt: new Date(),
          remarks: (data.remarks || '').trim(),
        }],
      });
    } else {
      record.auditLogs.push({
        previousStatus,
        updatedStatus: data.status,
        modifiedBy: adminName,
        modifiedAt: new Date(),
        remarks: (data.remarks || '').trim(),
      });
      record.status = data.status;
      record.recordedAt = new Date();
    }

    await record.save();

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, record: JSON.parse(JSON.stringify(record)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function bulkRecordAttendance(data: {
  meetingId: string;
  records: Array<{ memberId: string; status: 'present' | 'absent' | 'excused' | 'not_recorded' }>;
  remarks?: string;
}) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return { error: 'Unauthorized: Admin privileges required' };
    }

    await connectToDatabase();

    const meeting = await Meeting.findById(data.meetingId);
    if (!meeting) return { error: 'Meeting not found' };

    if (meeting.status === 'cancelled') {
      return { error: 'Cannot record attendance for a cancelled meeting' };
    }

    const adminName = authUser.name || authUser.email || 'Admin';

    for (const item of data.records) {
      let rec = await Attendance.findOne({ meeting_id: data.meetingId, member_id: item.memberId });
      const previousStatus = rec ? rec.status : 'not_recorded';
      if (previousStatus === item.status) continue;

      if (!rec) {
        rec = new Attendance({
          meeting_id: data.meetingId,
          member_id: item.memberId,
          status: item.status,
          recordedAt: new Date(),
          auditLogs: [{
            previousStatus: 'not_recorded',
            updatedStatus: item.status,
            modifiedBy: adminName,
            modifiedAt: new Date(),
            remarks: (data.remarks || '').trim(),
          }],
        });
      } else {
        rec.auditLogs.push({
          previousStatus,
          updatedStatus: item.status,
          modifiedBy: adminName,
          modifiedAt: new Date(),
          remarks: (data.remarks || '').trim(),
        });
        rec.status = item.status;
        rec.recordedAt = new Date();
      }
      await rec.save();
    }

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getMeetingAttendanceRegister(meetingId: string) {
  try {
    await connectToDatabase();
    const meeting = await Meeting.findById(meetingId).lean();
    if (!meeting) return { error: 'Meeting not found' };

    // Get participants
    let participantUsers: any[] = [];
    if (meeting.inviteAll) {
      participantUsers = await User.find({ role: 'member' }).sort({ name: 1 }).lean();
    } else {
      participantUsers = await User.find({ _id: { $in: meeting.participants } }).sort({ name: 1 }).lean();
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find({ meeting_id: meetingId }).lean();
    const attendanceMap = new Map();
    for (const att of attendanceRecords) {
      attendanceMap.set((att as any).member_id.toString(), att);
    }

    // Combine
    const roster = participantUsers.map(member => {
      const att = attendanceMap.get(member._id.toString());
      return {
        member: {
          _id: member._id.toString(),
          name: member.name,
          xts_id: member.xts_id,
          email: member.email,
          course: member.course,
          team: member.team,
          semester: member.semester,
          profile_image: member.profile_image,
        },
        status: att ? att.status : 'not_recorded',
        recordedAt: att ? att.recordedAt : null,
        auditLogs: att ? att.auditLogs || [] : [],
      };
    });

    return {
      success: true,
      meeting: JSON.parse(JSON.stringify(meeting)),
      roster: JSON.parse(JSON.stringify(roster)),
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ─── Getters ─────────────────────────────────────────────────────────────────

export async function getMemberData(xts_id: string) {
  await connectToDatabase();
  const user = await User.findOne({ xts_id }).lean();
  if (!user) return null;

  const memberId = (user as any)._id;

  const [certificates, events, projects, resignation, allMeetings, memberAttendances, rawNotifications] = await Promise.all([
    Certificate.find({ member_id: memberId }).lean(),
    Event.find().sort({ date: 1 }).lean(),
    Project.find().lean(),
    Resignation.findOne({ member_id: memberId, status: 'pending' }).lean(),
    // Eligible meetings: where user is in participants or inviteAll is true
    Meeting.find({
      $or: [
        { inviteAll: true },
        { participants: memberId },
      ],
    }).sort({ date: -1, startTime: -1 }).lean(),
    Attendance.find({ member_id: memberId }).lean(),
    Notification.find({
      $or: [
        { recipient_id: null },
        { recipient_id: memberId },
      ],
    }).sort({ createdAt: -1 }).limit(30).lean(),
  ]);

  let notificationsList = [...rawNotifications];
  const hasWelcome = notificationsList.some((n: any) => n.type === 'welcome');
  if (!hasWelcome) {
    const welcomeNotif = await Notification.create({
      recipient_id: memberId,
      type: 'welcome',
      title: `Welcome to XTS, ${user.name}! 🎉`,
      message: `Hi ${user.name}, your Xavier Tech Byte Society membership is active. Explore events, projects, and your member dashboard. We're glad you're here!`,
      read_by: [],
    });
    notificationsList.unshift(JSON.parse(JSON.stringify(welcomeNotif)));
  }

  const memberIdStr = memberId.toString();
  const formattedNotifications = notificationsList.map((n: any) => ({
    _id: n._id.toString(),
    type: n.type,
    title: n.title,
    message: n.message,
    createdAt: n.createdAt,
    isRead: Array.isArray(n.read_by) && n.read_by.some((r: any) => r.toString() === memberIdStr),
  }));

  const attendanceByMeetingId = new Map();
  for (const att of memberAttendances) {
    attendanceByMeetingId.set((att as any).meeting_id.toString(), att);
  }

  // Calculate dynamic attendance stats adhering to business rules:
  // - Only assigned participants count toward attendance.
  // - Cancelled meetings must NOT count toward attendance.
  // - Future unrecorded meetings must NOT count as absent.
  // - Not Recorded must NOT be treated as absent.
  // - Formula: Attendance Percentage = (Attended / Eligible Meetings) × 100
  //   Where Eligible Meetings = Meetings concluded with recorded status ('present' or 'absent').
  let eligibleMeetingsCount = 0;
  let attendedCount = 0;
  let absentCount = 0;
  let excusedCount = 0;

  const meetingsWithAttendance = allMeetings.map((m: any) => {
    const meetingIdStr = m._id.toString();
    const att = attendanceByMeetingId.get(meetingIdStr);
    const status = att ? att.status : 'not_recorded';

    if (m.status !== 'cancelled') {
      if (status === 'present') {
        attendedCount++;
        eligibleMeetingsCount++;
      } else if (status === 'absent') {
        absentCount++;
        eligibleMeetingsCount++;
      } else if (status === 'excused') {
        excusedCount++;
        // Excused absences do not penalize attendance denominator
      }
    }

    return {
      ...m,
      myAttendance: {
        status,
        recordedAt: att?.recordedAt || null,
        auditLogs: att?.auditLogs || [],
      },
    };
  });

  const attendancePercentage = eligibleMeetingsCount > 0
    ? Math.round((attendedCount / eligibleMeetingsCount) * 100)
    : 100; // If no eligible recorded meetings yet, default clean 100%

  return {
    user: JSON.parse(JSON.stringify(user)),
    certificates: JSON.parse(JSON.stringify(certificates)),
    events: JSON.parse(JSON.stringify(events)),
    projects: JSON.parse(JSON.stringify(projects)),
    notifications: JSON.parse(JSON.stringify(formattedNotifications)),
    resignationPending: !!resignation,
    meetings: JSON.parse(JSON.stringify(meetingsWithAttendance)),
    attendanceStats: {
      eligibleMeetings: eligibleMeetingsCount,
      attended: attendedCount,
      absent: absentCount,
      excused: excusedCount,
      percentage: attendancePercentage,
    },
  };
}

export async function getAllDataForAdmin() {
  await connectToDatabase();

  const [members, certificates, events, projects, resignations, meetings, attendances] = await Promise.all([
    User.find({ role: 'member' }).sort({ name: 1 }).lean(),
    Certificate.find().populate('member_id').lean(),
    Event.find().sort({ date: 1 }).lean(),
    Project.find().lean(),
    Resignation.find().sort({ submittedAt: -1 }).lean(),
    Meeting.find().sort({ date: -1, startTime: -1 }).lean(),
    Attendance.find().lean(),
  ]);

  // Compute summary stats for each meeting
  const attendanceCountsByMeeting: { [key: string]: { present: number; absent: number; excused: number; total: number } } = {};
  for (const att of attendances) {
    const mid = (att as any).meeting_id.toString();
    if (!attendanceCountsByMeeting[mid]) {
      attendanceCountsByMeeting[mid] = { present: 0, absent: 0, excused: 0, total: 0 };
    }
    attendanceCountsByMeeting[mid].total++;
    if (att.status === 'present') attendanceCountsByMeeting[mid].present++;
    if (att.status === 'absent') attendanceCountsByMeeting[mid].absent++;
    if (att.status === 'excused') attendanceCountsByMeeting[mid].excused++;
  }

  const enrichedMeetings = meetings.map((m: any) => ({
    ...m,
    attendanceSummary: attendanceCountsByMeeting[m._id.toString()] || { present: 0, absent: 0, excused: 0, total: 0 },
  }));

  return JSON.parse(JSON.stringify({
    members,
    certificates,
    events,
    projects,
    resignations,
    meetings: enrichedMeetings,
  }));
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

// ─── Notification Actions ───────────────────────────────────────────────────

export async function markNotificationAsRead(notificationId: string, xts_id: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ xts_id }).lean();
    if (!user) return { error: 'User not found' };

    await Notification.findByIdAndUpdate(notificationId, {
      $addToSet: { read_by: (user as any)._id },
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function markAllNotificationsAsRead(xts_id: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ xts_id }).lean();
    if (!user) return { error: 'User not found' };

    const memberId = (user as any)._id;
    await Notification.updateMany(
      {
        $or: [
          { recipient_id: null },
          { recipient_id: memberId },
        ],
      },
      {
        $addToSet: { read_by: memberId },
      }
    );
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}


