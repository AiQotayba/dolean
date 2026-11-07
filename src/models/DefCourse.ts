import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDefCourse extends Document {
  title?: string;
  context?: string;
  rawText?: string;
  image?: string;
  Source?: string;
  sourceUrl?: string;
  location?: string;
  organizationName?: string;
  processedByAi: boolean;
  aiExtractedData?: Record<string, any>;
  submittedBy?: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  deleteState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DefCourseSchema = new Schema<IDefCourse>(
  {
    title: { type: String, default: '' },
    context: { type: String, default: '' },
    rawText: { type: String, default: '' },
    image: { type: String, default: '' },
    Source: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    organizationName: { type: String, default: '' },
    processedByAi: { type: Boolean, default: false },
    aiExtractedData: { type: Schema.Types.Mixed, default: null },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    deleteState: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DefCourse: Model<IDefCourse> =
  mongoose.models.DefCourse || mongoose.model<IDefCourse>('DefCourse', DefCourseSchema);
export default DefCourse;
