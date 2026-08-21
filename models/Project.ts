import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;

  description: string;

  link: string;
}

const ProjectSchema: Schema<IProject> = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  link: {
     type: String 
    },
});

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
