# توثيق نماذج وقواعد البيانات (MongoDB Schema Specification)
## مشروع دوليان (Dolean) - البنية المعمارية لقاعدة البيانات

---

## 1. نموذج الاتصال الآمن مع Next.js (Singleton DB Connection)

في بيئات Next.js التي تعتمد على Serverless أو Hot Reloading أثناء التطوير، فتح اتصال جديد مع كل طلب يؤدي سريعاً إلى خطأ `Too many connections` واستنزاف موارد MongoDB.
لذا يتم استخدام نمط **المخزن العام للاتصال (Global Cached Singleton Connection)**:

### `src/lib/db.ts`
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dolean';

if (!MONGODB_URI) {
  throw new Error('يرجى تحديد متغير البيئة MONGODB_URI في ملف .env');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح.');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
```

---

## 2. النماذج والمخططات (Data Models)

### 2.1 نموذج المستخدم والأدوار المتعددة (`User.ts`)
يدعم النموذج امتلاك المستخدم لأكثر من دور واحد في نفس الوقت (`roles: string[]`)، مع ربطه بمركز أو جهة إن وجد:

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'student' | 'center_admin' | 'publisher' | 'super_admin';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  roles: UserRole[];
  organizationId?: mongoose.Types.ObjectId; // ربط بالمركز إذا كان ممثلاً لجهة
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
      enum: ['student', 'center_admin', 'publisher', 'super_admin'],
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

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ roles: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```

---

### 2.2 نموذج المراكز والمنظمات (`Organization.ts`)
يخزن تفاصيل الجهات التدريبية ومراكز التأهيل والجمعيات:

```typescript
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
  isVerified: boolean; // هل تم التحقق من اعتماد المركز من قبل دوليان
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
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    socialMedia: {
      facebook: String,
      instagram: String,
      linkedin: String,
      whatsapp: String,
    },
    address: {
      country: { type: String, default: 'لبنان' },
      city: { type: String, required: true },
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
```

---

### 2.3 نموذج الدورات التدريبية (`Course.ts`) مع التمييز بين الجهة المقدمة والناشرة

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  summary: string;
  context: string; // Markdown formatted description
  image?: string;
  links: string[]; // روابط التسجيل الرسمية أو منصات التدريب
  keys: string[]; // الكلمات الدلالية والتصنيفات (Frontend, Graphic Design, etc.)
  
  // الجهة المقدمة للتدريب (من ينفذ التدريب ويعطي الشهادة)
  providingEntity: {
    organizationId?: mongoose.Types.ObjectId; // مرجع إن كانت مسجلة في النظام
    name: string;                            // مثال: جمعية سنبلة
    logo?: string;
  };

  // الجهة الناشرة (من أدخل الإعلان على منصة دوليان)
  publishingEntity: {
    publisherType: 'platform' | 'organization' | 'external_editor';
    publisherId: mongoose.Types.ObjectId;   // المعرف الخاص بالمستخدم أو المسؤول
    name: string;                           // مثال: منصة دوليان أو ممثل المركز
  };

  locationType: 'online' | 'in_person' | 'hybrid';
  locationDetails?: {
    country?: string;
    city?: string;
    district?: string;
    addressText?: string;
  };

  ageEligibility: {
    start: number; // أدنى عمر مقبول (افتراضي 0)
    end: number;   // أقصى عمر مقبول (افتراضي 100)
  };

  nationalityEligibility: string[]; // الجنسيات المقبولة: ["Lebanese", "Syrian", "Palestinian", "All"]
  genderEligibility: 'male' | 'female' | 'all';
  
  pricing: {
    isFree: boolean;
    cost: number;
    currency: string;
    stipendProvided: boolean; // هل يوجد بدل مواصلات أو مكافأة
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

  requirements: string[]; // الشروط والمتطلبات
  topics: string[];       // المحاور الرئيسية
  certificateProvided: boolean;
  jobOpportunitiesNote?: string; // فرص العمل أو التدريب بعد الانتهاء

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
      publisherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
    },

    locationType: {
      type: String,
      enum: ['online', 'in_person', 'hybrid'],
      default: 'online',
    },
    locationDetails: {
      country: String,
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
```

---

### 2.4 نموذج مسودات الإعلانات قبل المعالجة (`DefCourse.ts`)
مخصص لاستقبال الإعلانات الخام (سواء رُفعت كنص أو كصورة) قبل اعتمادها من قبل المركز أو الذكاء الاصطناعي:

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDefCourse extends Document {
  title?: string;
  rawText?: string;
  image?: string;
  sourceUrl?: string;
  organizationName?: string;
  processedByAi: boolean;
  aiExtractedData?: Record<string, any>;
  submittedBy: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  deleteState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DefCourseSchema = new Schema<IDefCourse>(
  {
    title: { type: String, default: '' },
    rawText: { type: String, default: '' },
    image: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
    organizationName: { type: String, default: '' },
    processedByAi: { type: Boolean, default: false },
    aiExtractedData: { type: Schema.Types.Mixed, default: null },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    deleteState: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DefCourse: Model<IDefCourse> =
  mongoose.models.DefCourse || mongoose.model<IDefCourse>('DefCourse', DefCourseSchema);
```

---

### 2.5 نموذج الملف الشخصي للطالب والتأهيل (`StudentProfile.ts`)

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  birthYear: number;
  gender: 'male' | 'female';
  nationality: string;
  country: string;
  city: string;
  district?: string;
  interests: string[]; // اهتمامات الطالب (برمجة، تسويق، إدارة...)
  educationLevel: 'Primary' | 'Intermediate' | 'Secondary' | 'Bachelors' | 'Masters' | 'PhD' | 'Diploma' | 'Institute' | 'Other';
  specialization?: string;
  graduationYear?: number;
  englishLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent';
  computerProficiency?: 'Basic' | 'Intermediate' | 'Advanced';
  interestedInFreeCourses: boolean;
  interestedInPaidCourses: boolean;
  maxAffordablePrice?: number;
  employmentStatus?: string;
  receiveWhatsappNotifications: boolean;
  deleteState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    birthYear: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    nationality: { type: String, required: true },
    country: { type: String, default: 'لبنان' },
    city: { type: String, required: true },
    district: String,
    interests: { type: [String], default: [] },
    educationLevel: {
      type: String,
      enum: ['Primary', 'Intermediate', 'Secondary', 'Bachelors', 'Masters', 'PhD', 'Diploma', 'Institute', 'Other'],
      default: 'Secondary',
    },
    specialization: String,
    graduationYear: Number,
    englishLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Fluent'], default: 'Intermediate' },
    computerProficiency: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    interestedInFreeCourses: { type: Boolean, default: true },
    interestedInPaidCourses: { type: Boolean, default: false },
    maxAffordablePrice: { type: Number, default: 0 },
    employmentStatus: String,
    receiveWhatsappNotifications: { type: Boolean, default: true },
    deleteState: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const StudentProfile: Model<IStudentProfile> =
  mongoose.models.StudentProfile || mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
```
