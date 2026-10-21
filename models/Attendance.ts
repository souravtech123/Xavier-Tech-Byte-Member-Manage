import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendanceAudit {
  previousStatus: string;
  updatedStatus: string;
  modifiedBy: string; // Admin name or ID
  modifiedAt: Date;
  remarks?: string;
}

export interface IAttendance extends Document {
  meeting_id: mongoose.Types.ObjectId;
  member_id: mongoose.Types.ObjectId;
  status: 'present' | 'absent' | 'excused' | 'not_recorded';
  recordedAt: Date;
  auditLogs: IAttendanceAudit[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceAuditSchema = new Schema<IAttendanceAudit>({
  previousStatus: { type: String, required: true },
  updatedStatus: { type: String, required: true },
  modifiedBy: { type: String, required: true },
  modifiedAt: { type: Date, default: Date.now },
  remarks: { type: String, default: '' },
}, { _id: false });

const AttendanceSchema: Schema<IAttendance> = new Schema(
  {
    meeting_id: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true },
    member_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'excused', 'not_recorded'],
      default: 'not_recorded',
      index: true,
    },
    recordedAt: { type: Date, default: Date.now },
    auditLogs: [AttendanceAuditSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance records for the same member in the same meeting
AttendanceSchema.index({ meeting_id: 1, member_id: 1 }, { unique: true });

// Prevent Mongoose from using cached stale schema in dev reload
delete (mongoose.models as any).Attendance;

export const Attendance: Model<IAttendance> =
  mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
