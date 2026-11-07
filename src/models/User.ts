import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'student' | 'center_admin' | 'publisher' | 'super_admin' | 'user' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  roles: UserRole[];
  organizationId?: mongoose.Types.ObjectId;
  isVerified: boolean;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  deleteState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: ['student', 'center_admin', 'publisher', 'super_admin', 'user', 'admin'],
      default: ['student'],
    },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    deleteState: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ phone: 1 });
UserSchema.index({ roles: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
