import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISection extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  featured: boolean;
  deleteState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<ISection>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Compass' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: true },
    deleteState: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Section: Model<ISection> =
  mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);

export default Section;
