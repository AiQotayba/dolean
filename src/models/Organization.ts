import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrgType = 'ngo' | 'institute' | 'university' | 'company' | 'governmental' | 'initiative';

export interface IOrganization extends Document {
  name: string;
  legalName?: string;
  orgType: OrgType;
  logo?: string;
  coverImage?: string;
  description?: string;
  website?: string;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  address: {
    country: string;
    city: string;
    district?: string;
    street?: string;
  };
  isVerified: boolean;
  verifiedAt?: Date;
  deleteState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    legalName: { type: String, trim: true },
    orgType: {
      type: String,
      enum: ['ngo', 'institute', 'university', 'company', 'governmental', 'initiative'],
      default: 'ngo',
    },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    socialMedia: {
      facebook: String,
      instagram: String,
      linkedin: String,
      whatsapp: String,
    },
    address: {
      country: { type: String, default: 'سوريا' },
      city: { type: String, default: '' },
      district: String,
      street: String,
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    deleteState: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Organization: Model<IOrganization> =
  mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);
export default Organization;
