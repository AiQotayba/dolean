# مواصفات محرك الذكاء الاصطناعي (Google Gemini AI Specification)
## استخراج ومعالجة بيانات التدريب آلياً من النصوص والبوسترات في منصة دوليان

---

## 1. الأهداف المعمارية

تتلقى منصة دوليان إعلانات الدورات التدريبية في صورتين أساسيتين:
1. **نصوص غير مهيكلة (Unstructured Text):** منسوخة من رسائل مجموعات الواتساب، منشورات فيسبوك، أو قنوات تيليغرام.
2. **صور وبوسترات دعائية (Announcement Posters / Flyers):** تصاميم غرافيكية تتضمن نصوصاً بتنسيقات مختلفة، خطوطاً عربية متنوعة، وتفاصيل مجدولة عن الشروط والمواعيد.

يهدف هذا المحرك إلى:
- استخراج كافة البيانات بدقة تصل إلى 98% وتنسيقها في بنية كائن JSON قياسي يطابق نموذج قاعدة البيانات `Course`.
- إتاحة واجهة لمعاينة وتعديل البيانات المستخرجة في لوحة تحكم المركز قبل النشر.
- العمل الآمن والموثوق على الخادم (Server-side) باستخدام الحزمة الرسمية `@google/genai` مع تفعيل **المخرجات المهيكلة المضمونة (Structured Outputs)**.

---

## 2. بنية المخرجات المطلوبة (Course Extraction JSON Schema)

```typescript
export interface ExtractedCourseData {
  title: string;
  summary: string;
  context: string; // Markdown description
  providingEntityName: string; // اسم الجهة المقدمة (مثل: جمعية سنبلة)
  locationType: 'online' | 'in_person' | 'hybrid';
  city?: string;
  addressText?: string;
  ageEligibility: {
    start: number;
    end: number;
  };
  nationalities: string[]; // ["Lebanese", "Syrian", "Palestinian", "All"]
  genderEligibility: 'male' | 'female' | 'all';
  isFree: boolean;
  cost: number;
  currency: string;
  stipendProvided: boolean; // هل يوجد بدل مواصلات أو مكافأة
  stipendNote?: string;
  schedule: {
    startDate?: string;
    endDate?: string;
    registrationDeadline?: string;
    durationHours?: number;
    daysOfWeek: string[];
    timeSlot?: string;
  };
  requirements: string[];
  topics: string[];
  keys: string[];
  links: string[];
  certificateProvided: boolean;
  jobOpportunitiesNote?: string;
}
```

---

## 3. التنفيذ البرمجي الكامل لمكتبة Gemini (`src/lib/gemini.ts`)

```typescript
import { GoogleGenAI, Type, Schema } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ تحذير: لم يتم تعيين متغير البيئة GEMINI_API_KEY');
}

export const ai = new GoogleGenAI({
  apiKey: apiKey || '',
});

export const GEMINI_MODEL = 'gemini-3.8-flash';
export const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];

// تعريف المخطط الصارم لضمان مطابقة الرد لمخطط قاعدة البيانات
const courseOutputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'عنوان الدورة التدريبية الرئيسي بشكل واضح وجذاب' },
    summary: { type: Type.STRING, description: 'ملخص موجز في سطرين عن الدورة وأهدافها' },
    context: { type: Type.STRING, description: 'تفاصيل الدورة التدريبية الكاملة منسقة بصيغة Markdown' },
    providingEntityName: { type: Type.STRING, description: 'اسم الجهة أو الجمعية أو المركز المنفذ للتدريب' },
    locationType: {
      type: Type.STRING,
      enum: ['online', 'in_person', 'hybrid'],
      description: 'طبيعة الحضور: عن بعد، حضوري، أو مدمج',
    },
    city: { type: Type.STRING, description: 'المدينة التي يقام فيها التدريب إن وجد (مثل بيروت، صيدا، طرابلس)' },
    addressText: { type: Type.STRING, description: 'العنوان التفصيلي للمركز أو القاعة' },
    ageEligibility: {
      type: Type.OBJECT,
      properties: {
        start: { type: Type.INTEGER, description: 'أدنى عمر مقبول، 0 إن لم يحدد' },
        end: { type: Type.INTEGER, description: 'أقصى عمر مقبول، 100 إن لم يحدد' },
      },
      required: ['start', 'end'],
    },
    nationalities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'الجنسيات المستهدفة، مثلاً: ["Lebanese", "Syrian", "Palestinian"] أو ["All"]',
    },
    genderEligibility: {
      type: Type.STRING,
      enum: ['male', 'female', 'all'],
      description: 'الجنس المستهدف (ذكور فقط، إناث فقط، أو الجميع)',
    },
    isFree: { type: Type.BOOLEAN, description: 'هل الدورة مجانية بالكامل؟' },
    cost: { type: Type.NUMBER, description: 'سعر الدورة، 0 إذا كانت مجانية' },
    currency: { type: Type.STRING, description: 'العملة (USD, LBP, etc.)' },
    stipendProvided: { type: Type.BOOLEAN, description: 'هل تتوفر بدلات مواصلات أو حوافز مالية للمتدربين؟' },
    stipendNote: { type: Type.STRING, description: 'تفاصيل بدل المواصلات إن وجدت' },
    schedule: {
      type: Type.OBJECT,
      properties: {
        startDate: { type: Type.STRING, description: 'تاريخ بدء التدريب إن وجد (YYYY-MM-DD)' },
        endDate: { type: Type.STRING, description: 'تاريخ انتهاء التدريب إن وجد' },
        registrationDeadline: { type: Type.STRING, description: 'آخر مهلة للتسجيل' },
        durationHours: { type: Type.INTEGER, description: 'عدد الساعات التدريبية الكلية' },
        daysOfWeek: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'أيام التدريب في الأسبوع (مثال: ["الاثنين", "الأربعاء"])',
        },
        timeSlot: { type: Type.STRING, description: 'فترة التدريب (مثال: من 10 صباحاً إلى 2 ظهراً)' },
      },
      required: ['daysOfWeek'],
    },
    requirements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'شروط القبول والالتحاق (مثل امتلاك لابتوب، اجتياز المقابلة)',
    },
    topics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'المحاور والمهارات التي سيتم تعلمها في التدريب',
    },
    keys: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'الكلمات المفتاحية والتصنيفات (مثلاً: برمجة، تصميم، لغات)',
    },
    links: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'أي روابط تسجيل استمارة Google Forms أو مواقع مرفقة',
    },
    certificateProvided: { type: Type.BOOLEAN, description: 'هل يحصل المتدرب على شهادة إتمام؟' },
    jobOpportunitiesNote: { type: Type.STRING, description: 'هل هناك فرص تشبيك أو وظائف بعد التدريب؟' },
  },
  required: [
    'title',
    'context',
    'providingEntityName',
    'locationType',
    'ageEligibility',
    'nationalities',
    'genderEligibility',
    'isFree',
    'requirements',
    'topics',
    'keys',
  ],
};

const SYSTEM_INSTRUCTION = `
أنت خبير تحليل بيانات متخصص في إعلانات التدريب والتمكين المهني والفرص التعليمية للمنظمات غير الحكومية والجمعيات في منصة "دوليان".
مهمتك استخراج كافة تفاصيل الدورة أو الفرصة التدريبية بدقة واحترافية من النص أو الصورة المقدمة.
قواعد استخراج صارمة:
1. استخرج اسم الجهة المنظمة للتدريب بدقة في حقل providingEntityName.
2. إذا ذكر الإعلان بدل مواصلات (مثل: "يوجد بدل مواصلات" أو "المواصلات مؤمنة")، اجعل stipendProvided = true واذكر التفاصيل في stipendNote.
3. إذا ذكر الإعلان فئة عمرية (مثل 18-30)، املأ start=18 و end=30.
4. نسق محتوى الدورة في حقل context بصيغة Markdown أنيقة تشمل مقدمة وعناوين فرعية ونقاط نقطية واضحة.
5. استخرج روابط استمارات التقديم (Google Forms, Jotform, Website links) وضعها في مصفوفة links.
6. تأكد من إرجاع كائن JSON حصراً مطابق للمخطط المرفق.
`;

/**
 * معالجة الإعلان من نص غير مهيكل
 */
export async function extractCourseFromText(rawText: string) {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: `يرجى تحليل إعلان الدورة التدريبية التالي واستخراج بياناته بشكل منظم:\n\n${rawText}` },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: courseOutputSchema,
      temperature: 0.1, // دقة عالية وعدم ابتكار معلومات غير موجودة
    },
  });

  const content = response.text;
  if (!content) throw new Error('فشل استخراج البيانات من النص');
  return JSON.parse(content);
}

/**
 * معالجة الإعلان من بوستر أو صورة (Multimodal Vision OCR)
 */
export async function extractCourseFromImage(imageBuffer: Buffer, mimeType: string, additionalNotes?: string) {
  const base64Data = imageBuffer.toString('base64');

  const parts: any[] = [
    {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    },
    {
      text: additionalNotes
        ? `يرجى قراءة نصوص وتفاصيل هذا البوستر الإعلاني بدقة مع مراعاة هذه الملاحظات الإضافية:\n${additionalNotes}`
        : 'يرجى قراءة نصوص وتفاصيل هذا البوستر الإعلاني بدقة واستخراج كافة تفاصيل الدورة التدريبية في كائن JSON.',
    },
  ];

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: 'user', parts }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: courseOutputSchema,
      temperature: 0.1,
    },
  });

  const content = response.text;
  if (!content) throw new Error('فشل استخراج البيانات من الصورة');
  return JSON.parse(content);
}
```

---

## 4. مسارات API المخصصة لخدمة الذكاء الاصطناعي في Next.js

### مسار معالجة النص: `src/app/api/ai/parse-text/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { extractCourseFromText } from '@/lib/gemini';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // التحقق من صلاحية المستخدم (ناشر، مركز، أو مسؤول)
    const user = await requireAuth(req, ['center_admin', 'publisher', 'super_admin']);
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح لك باستخدام هذه الخدمة' }, { status: 403 });
    }

    const { rawText } = await req.json();
    if (!rawText || rawText.trim().length < 20) {
      return NextResponse.json({ error: 'النص المدخل قصير جداً ولا يكفي للاستخراج' }, { status: 400 });
    }

    const extracted = await extractCourseFromText(rawText);
    return NextResponse.json({ success: true, data: extracted });
  } catch (error: any) {
    console.error('AI Text Extraction Error:', error);
    return NextResponse.json({ error: error.message || 'حدث خطأ أثناء معالجة النص' }, { status: 500 });
  }
}
```

### مسار معالجة الصور: `src/app/api/ai/parse-image/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { extractCourseFromImage } from '@/lib/gemini';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['center_admin', 'publisher', 'super_admin']);
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const additionalNotes = (formData.get('notes') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'يرجى إرفاق صورة البوستر' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'image/jpeg';

    const extracted = await extractCourseFromImage(buffer, mimeType, additionalNotes);
    return NextResponse.json({ success: true, data: extracted });
  } catch (error: any) {
    console.error('AI Image Extraction Error:', error);
    return NextResponse.json({ error: error.message || 'حدث خطأ أثناء قراءة الصورة' }, { status: 500 });
  }
}
```
