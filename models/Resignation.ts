import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResignation extends Document {
  member_id: mongoose.Types.ObjectId;
  member_name: string;
  member_xts_id: string;
  letter: string;
  status: 'pending' | 'approved';
  submittedAt: Date;
}

const ResignationSchema = new Schema<IResignation>({
  member_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  member_name: { type: String, required: true },
  member_xts_id: { type: String, required: true },
  letter: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
});

delete mongoose.models.Resignation;
export const Resignation: Model<IResignation> =
  mongoose.models.Resignation || mongoose.model<IResignation>('Resignation', ResignationSchema);
