import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeeting extends Document {
  meeting_id: string; // Unique public ID, e.g. MTG-XXXX
  title: string;
  purpose?: string;
  description?: string;
  agenda?: string;
  date: Date;
  startTime: string; // e.g. "14:00"
  endTime: string;   // e.g. "15:30"
  type: 'online' | 'offline' | 'hybrid';
  link?: string;     // Online meeting URL (Google Meet / Zoom / etc)
  venue?: string;    // Physical room or location
  inviteAll: boolean;
  participants: mongoose.Types.ObjectId[];
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema: Schema<IMeeting> = new Schema(
  {
    meeting_id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    purpose: { type: String, default: '' },
    description: { type: String, default: '' },
    agenda: { type: String, default: '' },
    date: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'offline' },
    link: { type: String, default: '' },
    venue: { type: String, default: '' },
    inviteAll: { type: Boolean, default: false },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming', index: true },
  },
  {
    timestamps: true,
  }
);

// Prevent Mongoose from using cached stale schema in dev reload
delete (mongoose.models as any).Meeting;

export const Meeting: Model<IMeeting> =
  mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);
