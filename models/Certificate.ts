import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
  member_id: mongoose.Types.ObjectId;
  title: string;
  file_url: string;
  date_issued: Date;
}

const CertificateSchema: Schema<ICertificate> = new Schema({
  member_id: 
  {  type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  file_url: { 
    type: String, 
    required: true 
  },
  date_issued: { 
    type: Date, 
    default: Date.now },
});

export const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
