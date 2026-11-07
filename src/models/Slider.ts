import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlider extends Document {
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  link: string;
  buttonText?: string;
  order: number;
  isActive: boolean;
  deleteState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SliderSchema = new Schema<ISlider>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    image: { type: String, required: true },
    badge: { type: String, default: 'مميز' },
    link: { type: String, default: '/courses' },
    buttonText: { type: String, default: 'استكشف الفرصة' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    deleteState: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Slider: Model<ISlider> =
  mongoose.models.Slider || mongoose.model<ISlider>('Slider', SliderSchema);

export default Slider;
