import { GoogleGenAI, Type, Schema } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({
  apiKey: apiKey || '',
});

export const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

const courseOutputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'عنوان الدورة التدريبية الرئيسي' },
    summary: { type: Type.STRING, description: 'ملخص موجز عن الدورة وأهدافها' },
    context: { type: Type.STRING, description: 'تفاصيل ومحتوى الدورة منسقة بصيغة Markdown' },
    providingEntityName: { type: Type.STRING, description: 'اسم الجهة أو الجمعية أو المركز المنفذ للتدريب' },
    locationType: {
      type: Type.STRING,
      enum: ['online', 'in_person', 'hybrid'],
      description: 'طبيعة الحضور: online أو in_person أو hybrid',
    },
    city: { type: Type.STRING, description: 'المدينة إن وجدت' },
    addressText: { type: Type.STRING, description: 'العنوان التفصيلي إن وجد' },
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
      description: 'الجنسيات المقبولة، مثلاً: ["Syrian", "Lebanese"] أو ["All"]',
    },
    genderEligibility: {
      type: Type.STRING,
      enum: ['male', 'female', 'all'],
      description: 'الجنس المستهدف',
    },
    isFree: { type: Type.BOOLEAN, description: 'هل الدورة مجانية بالكامل؟' },
    cost: { type: Type.NUMBER, description: 'سعر الدورة، 0 إذا كانت مجانية' },
    currency: { type: Type.STRING, description: 'العملة (USD, SYP)' },
    stipendProvided: { type: Type.BOOLEAN, description: 'هل تتوفر منحة أو حوافز مالية؟' },
    stipendNote: { type: Type.STRING, description: 'تفاصيل المنحة أو الحافز' },
    schedule: {
      type: Type.OBJECT,
      properties: {
        startDate: { type: Type.STRING, description: 'تاريخ بدء التدريب إن وجد (YYYY-MM-DD)' },
        endDate: { type: Type.STRING, description: 'تاريخ انتهاء التدريب إن وجد' },
        registrationDeadline: { type: Type.STRING, description: 'آخر مهلة للتسجيل' },
        durationHours: { type: Type.INTEGER, description: 'عدد الساعات الكلية' },
        daysOfWeek: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'أيام التدريب في الأسبوع',
        },
        timeSlot: { type: Type.STRING, description: 'فترة التدريب اليومية' },
      },
      required: ['daysOfWeek'],
    },
    requirements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'شروط القبول والالتحاق',
    },
    topics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'المحاور والمهارات المكتسبة',
    },
    keys: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'الكلمات المفتاحية والتصنيفات',
    },
    links: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'روابط التسجيل والاستمارات',
    },
    certificateProvided: { type: Type.BOOLEAN, description: 'هل توجد شهادة إتمام؟' },
    jobOpportunitiesNote: { type: Type.STRING, description: 'فرص العمل أو التدريب بعد الانتهاء' },
  },
  required: [
    'title',
    'context',
    'providingEntityName',
    'locationType',
    'ageEligibility',
    'genderEligibility',
    'isFree',
    'requirements',
    'topics',
    'keys',
  ],
};

const SYSTEM_INSTRUCTION = `
أنت خبير ذكاء اصطناعي متخصص في تحليل إعلانات الدورات التدريبية والفرص المهنية للجمعيات والمراكز التعليمية في منصة "تلاقي".
مهمتك استخراج كافة تفاصيل الفرصة التدريبية من النص أو الصورة بدقة وأمانة:
1. استخرج اسم الجهة المنظمة للتدريب في حقل providingEntityName.
2. إذا ذكر الإعلان منحة أو حافزاً تدريبياً، اجعل stipendProvided = true واذكر التفاصيل في stipendNote.
3. إذا ذكرت فئة عمرية (مثل 18-35)، املأ start=18 و end=35.
4. نسق محتوى الدورة في context بصيغة Markdown أنيقة وسهلة القراءة.
5. استخرج كافة روابط التقديم (Google Forms, Websites) في مصفوفة links.
6. الإخراج حصراً بصيغة JSON مطابقة للمخطط المحدد.
`;

/**
 * استخراج بيانات الدورة من نص غير مهيكل مع دعم التبديل التلقائي بين النماذج
 */
export async function extractCourseFromText(rawText: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('لم يتم إعداد GEMINI_API_KEY في ملف البيئة .env');
  }

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
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
          temperature: 0.1,
        },
      });

      const content = response.text;
      if (content) {
        return JSON.parse(content);
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next candidate...`, err.message);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || 'لم يتم استخراج أي بيانات من النص بواسطة نماذج الذكاء الاصطناعي');
}

/**
 * استخراج بيانات الدورة من صورة بوستر تدريبي (Multimodal OCR & Vision)
 */
export async function extractCourseFromImage(imageBuffer: Buffer, mimeType: string, additionalNotes?: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('لم يتم إعداد GEMINI_API_KEY في ملف البيئة .env');
  }

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

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: courseOutputSchema,
          temperature: 0.1,
        },
      });

      const content = response.text;
      if (content) {
        return JSON.parse(content);
      }
    } catch (err: any) {
      console.warn(`Model ${model} image OCR failed, trying next candidate...`, err.message);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || 'فشل استخراج البيانات من الصورة بواسطة نماذج الذكاء الاصطناعي');
}
