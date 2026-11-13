import { GoogleGenAI, Type, Schema } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({
  apiKey: apiKey || '',
});

// قائمة النماذج الفعالة والمدعومة حالياً (استبعاد النماذج القديمة 1.5 و 2.0 الموقوفة)
const envModel = process.env.GEMINI_MODEL?.trim();
const isLegacyModel = (m?: string) =>
  !m || ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'].includes(m);

export const CANDIDATE_MODELS = Array.from(
  new Set([
    envModel && !isLegacyModel(envModel) ? envModel : 'gemini-3.8-flash',
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.6-flash',
    'gemini-3.1-flash-lite',
  ])
);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransientError(err: any): boolean {
  if (!err) return false;
  const status = err.status || err.code || err.statusCode;
  const msg = (typeof err === 'string' ? err : err.message || '').toLowerCase();

  return (
    status === 503 ||
    status === 429 ||
    status === 'UNAVAILABLE' ||
    status === 'RESOURCE_EXHAUSTED' ||
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('high demand') ||
    msg.includes('spikes in demand') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('overloaded') ||
    msg.includes('unavailable')
  );
}

function formatGeminiError(err: any): string {
  if (!err) return 'حدث خطأ غير متوقع أثناء معالجة البيانات بالذكاء الاصطناعي';

  let msg = typeof err === 'string' ? err : err.message || '';

  // Extract nested JSON error message if present
  if (msg.includes('{') && msg.includes('}')) {
    try {
      const match = msg.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed?.error?.message) {
          msg = parsed.error.message;
        }
      }
    } catch {
      // ignore json parse errors
    }
  }

  const lower = msg.toLowerCase();
  if (lower.includes('high demand') || lower.includes('503') || lower.includes('unavailable')) {
    return 'خوادم معالجة الذكاء الاصطناعي تشهد ضغطاً كبيراً مؤقتاً. يرجى المحاولة مرة أخرى بعد بضع ثوانٍ.';
  }
  if (lower.includes('resource_exhausted') || lower.includes('429') || lower.includes('quota')) {
    return 'تم الوصول إلى الحد المسموح به من الطلبات مؤقتاً. يرجى المحاولة بعد دقيقة.';
  }
  if (lower.includes('not found') || lower.includes('404')) {
    return 'نموذج الذكاء الاصطناعي المحدد غير متاح حالياً. يرجى تحديث الإعدادات.';
  }
  if (lower.includes('api_key') || lower.includes('unauthenticated') || lower.includes('401') || lower.includes('403')) {
    return 'مفتاح واجهة الذكاء الاصطناعي GEMINI_API_KEY غير معرّف أو غير صالح.';
  }

  return msg || 'حدث خطأ أثناء معالجة المحتوى بواسطة الذكاء الاصطناعي';
}

function safeParseJson(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith('```')) {
    const unquoted = trimmed
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```$/, '')
      .trim();
    return JSON.parse(unquoted);
  }
  return JSON.parse(trimmed);
}

async function generateWithFallback<T>(
  actionName: string,
  execute: (model: string) => Promise<T>
): Promise<T> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    // Attempt up to 2 times for transient errors per model
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await execute(model);
      } catch (err: any) {
        lastError = err;
        const transient = isTransientError(err);
        console.warn(`[Gemini AI] ${actionName} failed on model ${model} (attempt ${attempt}/2):`, err?.message || err);

        if (transient && attempt < 2) {
          await sleep(1500);
          continue;
        }

        // If not transient or attempts exhausted, fail over to next model candidate
        break;
      }
    }
  }

  const friendlyMsg = formatGeminiError(lastError);
  console.error(`[Gemini AI] All candidate models failed for ${actionName}:`, lastError);
  throw new Error(friendlyMsg);
}

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
 * استخراج بيانات الدورة من نص غير مهيكل مع دعم التبديل التلقائي بين النماذج وإعادة المحاولة
 */
export async function extractCourseFromText(rawText: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('لم يتم إعداد GEMINI_API_KEY في ملف البيئة .env');
  }

  return generateWithFallback('extractCourseFromText', async (model) => {
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
    if (!content) {
      throw new Error('لم يُرجع نموذج الذكاء الاصطناعي أي استجابة');
    }

    return safeParseJson(content);
  });
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

  return generateWithFallback('extractCourseFromImage', async (model) => {
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
    if (!content) {
      throw new Error('لم يُرجع نموذج الذكاء الاصطناعي أي استجابة لتحليل الصورة');
    }

    return safeParseJson(content);
  });
}

const keywordsOutputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'الكلمات المفتاحية والتخصصات والمجالات التدريبية ذات الصلة التي قد يبحث عنها الطلاب',
    },
    suggestedMessage: {
      type: Type.STRING,
      description: 'مسودة رسالة إعلان مهنية للواتساب تحتوي على المتغيرات {{name}} و {{title}} و {{link}}',
    },
  },
  required: ['keywords', 'suggestedMessage'],
};

/**
 * توليد واقتراح كلمات مفتاحية ذكية ورسالة واتساب بناءً على تفاصيل التدريب
 */
export async function suggestTrainingKeywords(trainingInfo: {
  title: string;
  summary?: string;
  context?: string;
}): Promise<{ keywords: string[]; suggestedMessage: string }> {
  // Fallback if no title or no API key
  const defaultFallback = {
    keywords: [
      trainingInfo.title,
      ...trainingInfo.title.split(/\s+/).filter((w) => w.length > 2),
    ].slice(0, 8),
    suggestedMessage: `السلام عليكم ورحمة الله وبركاته يا {{name}}
معك فريق منصة تلاقي
لأنك مسجل معنا وتبحث عن فرصة تطوّر فيها مهاراتك، يسعدنا جداً إعلامك بفتح باب التسجيل في:

*{{title}}*

للاطلاع على كامل التفاصيل والشروط والتسجيل مباشرة:
{{link}}

*ملاحظة تهمنا:*
* في حال تم قبولك بالتدريب، لا تنسى تبشّرنا لنسعد معك ونحدّث ملفك للمستوى القادم!
* وإذا كنت ببالك تدريب آخر أو حابب نساعدك بمهارات ثانية، فيك تسجل طلبك دائماً عبر المنصة:
https://talaqi.vercel.app/apply

كل التوفيق والبركة في مسيرتك العلمية والمهنية`,
  };

  if (!process.env.GEMINI_API_KEY || !trainingInfo.title?.trim()) {
    return defaultFallback;
  }

  const prompt = `أنت خبير في منصة "تلاقي" المعنية بفرص التدريب والتأهيل المهني في إدلب والشمال السوري.
لدينا إعلان تدريب جديد:
- العنوان: ${trainingInfo.title}
- الملخص: ${trainingInfo.summary || 'غير محدد'}
- التفاصيل: ${trainingInfo.context ? trainingInfo.context.slice(0, 1000) : 'غير محدد'}

المطلوب:
1. استخراج 6-12 كلمة مفتاحية وتخصصات ومصطلحات مرادفة باللغة العربية والإنجليزية، بحيث تمثل بدقة ما قد يكتبه الطالب في استمارة التسجيل عند التعبير عن اهتماماته (مثل: "برمجة، تطوير ويب، React، هندسة برمجيات" أو "إسعافات أولية، تمريض، رعاية صحية").
2. صياغة مسودة رسالة واتساب أنيقة ومباشرة ومطابقة لهذا النمط تماماً بدون استخدام أي إيموجي (لتجنب تشوه الرموز في واتساب):
السلام عليكم ورحمة الله وبركاته يا {{name}}
معك فريق منصة تلاقي
لأنك مسجل معنا وتبحث عن فرصة تطوّر فيها مهاراتك، يسعدنا جداً إعلامك بفتح باب التسجيل في:

*{{title}}*

للاطلاع على كامل التفاصيل والشروط والتسجيل مباشرة:
{{link}}

*ملاحظة تهمنا:*
* في حال تم قبولك بالتدريب، لا تنسى تبشّرنا لنسعد معك ونحدّث ملفك للمستوى القادم!
* وإذا كنت ببالك تدريب آخر أو حابب نساعدك بمهارات ثانية، فيك تسجل طلبك دائماً عبر المنصة:
https://talaqi.vercel.app/apply

كل التوفيق والبركة في مسيرتك العلمية والمهنية

تحتوي الرسالة حرفياً على المتغيرات:
{{name}}
{{title}}
{{link}}
ويمنع منعاً باتاً وضع أي إيموجي.`;

  try {
    return await generateWithFallback('suggestTrainingKeywords', async (model) => {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: keywordsOutputSchema,
          temperature: 0.2,
        },
      });

      const content = response.text;
      if (!content) throw new Error('فارغ');
      const parsed = safeParseJson(content);
      if (Array.isArray(parsed.keywords) && parsed.keywords.length > 0) {
        return {
          keywords: parsed.keywords.map((k: string) => k.trim()).filter(Boolean),
          suggestedMessage: parsed.suggestedMessage || defaultFallback.suggestedMessage,
        };
      }
      throw new Error('بيانات الكلمات المفتاحية غير مكتملة');
    });
  } catch (err: any) {
    console.warn('[Gemini AI] Keywords generation fallback triggered:', err.message);
    return defaultFallback;
  }
}
