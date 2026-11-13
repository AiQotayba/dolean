import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserDetails extends Document {
  user_id?: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  email?: string;
  births: number;
  District?: string;
  city?: string;
  nationality?: string;
  interests?: string;
  educationLevel?: string;
  specialization?: string;
  classes?: string;
  graduationYear?: number;
  englishLevel?: string;
  computerUsage?: string;
  freeCourses?: boolean;
  paidCourses?: boolean;
  paidCoursesLimit?: number;
  requiredCourses: string[];
  work?: string;
  deleteState: boolean;
  create_at: Date;
}

const UserDetailsSchema = new Schema<IUserDetails>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    fullName: { type: String, default: 'طالب مهتم' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    births: { type: Number, default: 2000 },
    District: { type: String, default: 'إدلب' },
    city: { type: String, default: '' },
    nationality: { type: String, default: '' },
    interests: { type: String, default: '' },
    educationLevel: {
      type: String,
      enum: ['Primary', 'Intermediate', 'Secondary', 'Bachelors', 'Masters', 'PhD', 'Diploma', 'Institute', 'Other'],
      default: 'Secondary',
    },
    specialization: { type: String, default: '' },
    classes: { type: String, default: '' },
    graduationYear: { type: Number },
    englishLevel: { type: String, default: '' },
    computerUsage: { type: String, default: '' },
    freeCourses: { type: Boolean, default: true },
    paidCourses: { type: Boolean, default: false },
    paidCoursesLimit: { type: Number, default: 0 },
    requiredCourses: { type: [String], default: [] },
    work: { type: String, default: '' },
    deleteState: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserDetails: Model<IUserDetails> =
  mongoose.models.UserDetails || mongoose.model<IUserDetails>('UserDetails', UserDetailsSchema);
export default UserDetails;
