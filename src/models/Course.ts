import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  summary: string;
  context: string;
  image?: string;
  links: string[];
  keys: string[];

  // الجهة المقدمة للتدريب (من يقدم التدريب الفعلي)
  providingEntity: {
    organizationId?: mongoose.Types.ObjectId;
    name: string;
    logo?: string;
  };

  // الجهة الناشرة (من أدخل الإعلان على المنصة)
  publishingEntity: {
    publisherType: 'platform' | 'organization' | 'external_editor';
    publisherId?: mongoose.Types.ObjectId;
    name: string;
  };

  location?: string;
  locationType: 'online' | 'in_person' | 'hybrid';
  locationDetails?: {
    country?: string;
    city?: string;
    district?: string;
    addressText?: string;
  };

  ageEligibility: {
    start: number;
    end: number;
  };

  nationalityEligibility: string[];
  genderEligibility: 'male' | 'female' | 'all';

  pricing: {
    isFree: boolean;
    cost: number;
    currency: string;
    stipendProvided: boolean;
    stipendNote?: string;
  };

  schedule: {
    startDate?: Date;
    endDate?: Date;
    registrationDeadline?: Date;
    durationHours?: number;
    sessionsCount?: number;
    daysOfWeek?: string[];
    timeSlot?: string;
  };

  requirements: string[];
  topics: string[];
  certificateProvided: boolean;
  jobOpportunitiesNote?: string;

  status: 'draft' | 'published' | 'expired' | 'archived';
  viewsCount: number;
  applicantsCount: number;
  deleteState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },
    context: { type: String, required: true },
    image: { type: String, default: '' },
    links: { type: [String], default: [] },
    keys: { type: [String], default: [] },

    providingEntity: {
      organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
      name: { type: String, required: true },
      logo: { type: String, default: '' },
    },

    publishingEntity: {
      publisherType: {
        type: String,
        enum: ['platform', 'organization', 'external_editor'],
        default: 'platform',
      },
      publisherId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      name: { type: String, default: 'منصة تلاقي' },
    },

    location: { type: String, default: '' },
    locationType: {
      type: String,
      enum: ['online', 'in_person', 'hybrid'],
      default: 'online',
    },
    locationDetails: {
      country: { type: String, default: 'سوريا' },
      city: String,
      district: String,
      addressText: String,
    },

    ageEligibility: {
      start: { type: Number, default: 0 },
      end: { type: Number, default: 100 },
    },

    nationalityEligibility: { type: [String], default: ['All'] },
    genderEligibility: {
      type: String,
      enum: ['male', 'female', 'all'],
      default: 'all',
    },

    pricing: {
      isFree: { type: Boolean, default: true },
      cost: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      stipendProvided: { type: Boolean, default: false },
      stipendNote: String,
    },

    schedule: {
      startDate: Date,
      endDate: Date,
      registrationDeadline: Date,
      durationHours: Number,
      sessionsCount: Number,
      daysOfWeek: [String],
      timeSlot: String,
    },

    requirements: { type: [String], default: [] },
    topics: { type: [String], default: [] },
    certificateProvided: { type: Boolean, default: true },
    jobOpportunitiesNote: String,

    status: {
      type: String,
      enum: ['draft', 'published', 'expired', 'archived'],
      default: 'published',
    },
    viewsCount: { type: Number, default: 0 },
    applicantsCount: { type: Number, default: 0 },
    deleteState: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CourseSchema.index({ 'providingEntity.name': 'text', title: 'text', keys: 'text' });
CourseSchema.index({ status: 1, deleteState: 1 });
CourseSchema.index({ 'ageEligibility.start': 1, 'ageEligibility.end': 1 });

export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export default Course;
