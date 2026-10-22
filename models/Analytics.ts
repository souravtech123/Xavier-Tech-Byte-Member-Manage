import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsSession extends Document {
  visitorId: string;
  path: string;
  device: 'mobile' | 'desktop' | 'tablet';
  isStandalone: boolean;
  installedApp: boolean;
  installedAt?: Date;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSessionSchema: Schema<IAnalyticsSession> = new Schema(
  {
    visitorId: { type: String, required: true, index: true },
    path: { type: String, default: '/' },
    device: { type: String, enum: ['mobile', 'desktop', 'tablet'], default: 'desktop' },
    isStandalone: { type: Boolean, default: false },
    installedApp: { type: Boolean, default: false, index: true },
    installedAt: { type: Date },
    lastActive: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

delete mongoose.models.AnalyticsSession;
export const AnalyticsSession: Model<IAnalyticsSession> =
  mongoose.models.AnalyticsSession ||
  mongoose.model<IAnalyticsSession>('AnalyticsSession', AnalyticsSessionSchema);

export interface IAnalyticsEvent extends Document {
  type: 'app_install' | 'visit';
  visitorId: string;
  platform?: string;
  createdAt: Date;
}

const AnalyticsEventSchema: Schema<IAnalyticsEvent> = new Schema({
  type: { type: String, enum: ['app_install', 'visit'], required: true, index: true },
  visitorId: { type: String, required: true },
  platform: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },
});

delete mongoose.models.AnalyticsEvent;
export const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
