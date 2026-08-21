import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  xts_id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  password?: string; // Only for admin
  profile_image?: string;
  id_card_url?: string; // XTS ID card uploaded by admin
  phone?: string;
  course?: string;
  team?: string;
  semester?: string;
  createdAt: Date;
  createdBy?: mongoose.Types.ObjectId;
  // Reference to the user who created this user
}

const UserSchema: Schema<IUser> = new Schema({
  xts_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  password: { type: String }, // For admin login
  profile_image: { type: String },
  id_card_url: { type: String }, // XTS ID card uploaded by admin
  phone: { type: String },
  course: { type: String },
  team: { type: String },
  semester: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Prevent Mongoose from using the old cached schema without the new fields
delete mongoose.models.User;

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
