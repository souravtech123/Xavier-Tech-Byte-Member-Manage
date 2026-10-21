import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  recipient_id: mongoose.Types.ObjectId | null; // null = all members (broadcast)
  type: 'event_new' | 'event_updated' | 'event_deleted' | 'project_new' | 'project_updated' | 'project_deleted' | 'welcome' | 'general';
  title: string;
  message: string;
  read_by: mongoose.Types.ObjectId[];  // members who have read it
  createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema({
  recipient_id: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // null = broadcast
  type: {
    type: String,
    enum: ['event_new', 'event_updated', 'event_deleted', 'project_new', 'project_updated', 'project_deleted', 'welcome', 'general'],
    default: 'general',
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

delete mongoose.models.Notification;

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
