# خارطة طريق الهجرة والتنفيذ العملي (Migration & Execution Roadmap)
## نقل منصة دوليان (Dolean) إلى تطبيق Next.js موحد في جذر المشروع

---

## 1. ملخص خطة الهجرة (Migration Overview)

تهدف الخطة إلى تحويل البنية الحالية المعقدة والمشتتة إلى بنية قياسية حديثة بالكامل وفق المراحل التالية:

```
[الحالة الحالية]                                                    [الحالة المستهدفة]
├── client/ (Vite React قديم) ------------> [إلغاء وأرشفة]           dolean/
├── microservices/ (خدمات غير مستخدمة) ----> [إلغاء وأرشفة]           ├── docs/
├── server/ (Express.js) -----------------> [نقل إلى app/api/]       ├── public/
└── web/ (Next.js 14 في مجلد فرعي) -------> [ترقية ونقل إلى Root]     ├── src/
                                                                     │   ├── app/
                                                                     │   ├── components/
                                                                     │   ├── lib/
                                                                     │   └── models/
                                                                     └── package.json (Next.js 16 Unified via pnpm)
```

---

## 2. جدول المراحل التنفيذية (Phased Execution Plan)

### المرحلة الأولى: التجهيز وترقية بيئة العمل (Preparation & Setup)
- [x] إنشاء توثيق المشروع الشامل والمخططات المعمارية في مجلد `docs/`.
- [x] إنشاء نسخة احتياطية (Git Branch: `app2026`) لحفظ الكود القديم لكل من `client`, `server`, `microservices`.
- [x] إعداد `package.json` الرئيسي في جذر المشروع لدعم **Next.js 16** مع تثبيت الحزم عبر **`pnpm`**:
  - `@google/genai` (محرك Gemini AI)
  - `mongoose` (الاتصال المجمع بقاعدة بيانات MongoDB)
  - `zod` و `react-hook-form` (إدارة والتحقق من النماذج)
  - `lucide-react` (أيقونات حديثة خفيفة)
  - `jose` أو `jsonwebtoken` + `bcryptjs` (المصادقة والأمان)
  - `tailwindcss` و `clsx` و `tailwind-merge`.

---

### المرحلة الثانية: إرساء طبقة البيانات ومحرك الاتصال (Database & Data Models Layer)
- [x] إنشاء موصل قاعدة البيانات الآمن `src/lib/db.ts` لضمان عدم تسريب اتصالات MongoDB أثناء التشغيل السريع لـ Next.js.
- [x] نقل وترقية نماذج Mongoose إلى `src/models/`:
  - نقل وترقية `User.ts` ليدعم الأدوار المتعددة `roles: ['student', 'center_admin', 'publisher', 'super_admin']`.
  - إنشاء نموذج `Organization.ts` لتمثيل المراكز والجمعيات (مثل جمعية سنبلة).
  - تطوير نموذج `Course.ts` ليفصل بدقة بين **الجهة المقدمة للتدريب** و**الجهة الناشرة له**.
  - تطوير نموذج `UserDetails.ts` ليتوافق تماماً مع شروط الاستحقاق للفرص التدريبية ومطابقة الطلاب.
  - الحفاظ على نموذج `DefCourse.ts` كمسودات إعلانات بانتظار الاعتماد.

---

### المرحلة الثالثة: نقل مسارات Express إلى مسارات Next.js Route Handlers
تحويل جميع مسارات Express من `server/routes/` إلى مسارات `src/app/api/` ✅ (تم بنجاح).

| مسار Express القديم | مسار Next.js الجديد | الوظيفة |
| :--- | :--- | :--- |
| `POST /api/auth/login` | `POST /api/auth/login/route.ts` | تسجيل الدخول وتوليد HttpOnly Cookie أو JWT |
| `POST /api/auth/signup` | `POST /api/auth/signup/route.ts` | تسجيل حساب جديد مع تحديد الدور الأولي |
| `GET /api/auth` | `GET /api/auth/route.ts` | التحقق من المستخدم وتجديد الجلسة |
| `GET/POST /api/admin/courses` | `GET/POST /api/admin/courses/route.ts` | إدارة الدورات واسترجاعها مع دعم الفلترة |
| `GET /api/student/courses` | `GET /api/student/courses/route.ts` | استعراض الدورات المتاحة للطلاب |
| `POST /api/student/details` | `POST /api/student/details/route.ts` | حفظ وتعديل بيانات ملف الطالب والتأهيل |
| `POST /api/admin/wa` | `POST /api/admin/wa/route.ts` | إرسال الإشعارات الجماعية للطلاب المطابقين |
| `GET /api/admin/def-courses/preprocess` | `POST /api/ai/parse-text/route.ts` | استبدال محرك Nemotron القديم بـ Gemini 2.5 Flash |
| *(جديد)* | `POST /api/ai/parse-image/route.ts` | استخراج بيانات البوستر التدريبي عبر الرؤية الحاسوبية |
| *(جديد)* | `GET/POST /api/centers/route.ts` | إدارة مراكز التدريب والجمعيات الشريكة |

---

### المرحلة الرابعة: تطوير لوحة تحكم المراكز والجمعيات (Center Dashboard) ✅ (تم بنجاح)
بناء واجهة مخصصة للمراكز والجمعيات التدريبية (`src/app/center/page.tsx`):
1. **ساحر إضافة الدورات الذكي (Smart AI Course Wizard):**
   - خيار إدخال نص خام (نسخ ولصق إعلان واتساب).
   - خيار رفع صورة البوستر التدريبي مع معاينة فورية (Multimodal Vision OCR).
   - زر "تحليل بالذكاء الاصطناعي عبر Gemini" يملأ جميع الحقول تلقائياً في ثوانٍ.
   - مراجعة الحقول وتعديلها (العنوان، الشروط، المواعيد، بدل المواصلات) قبل الاعتماد.
2. **إدارة دورات المركز والناشرين.**
3. **الملف التعريفي للمركز.**

---

### المرحلة الخامسة: تنظيف جذر المشروع وحذف الملفات المتقادمة (Consolidation & Cleanup) ✅ (تم بنجاح)
1. [x] حذف مجلد `client/` بعد التأكد من عدم وجود أي منطق مفقود.
2. [x] حذف مجلد `microservices/` (خدمات غير مطلوبة حالياً).
3. [x] نقل ملفات تطبيق `web/` بالكامل إلى جذر المشروع (`./`) لتصبح هي التطبيق الرئيسي الوحيد.
4. [x] حذف مجلد `server/` القديم بالكامل بعد نجاح كافة الـ Route Handlers في Next.js.
5. [x] اعتماد `pnpm` حصراً كمدير الحزم للمشروع.

---

### المرحلة السادسة: الاختبار والتحقق الشامل (Quality Assurance & Validation)
- [x] التحقق من توافق مسارات Next.js 16 (فك Promise لـ headers, cookies, params).
- [x] اختبار كفاءة محرك Gemini في معالجة النصوص والصور.
- [x] اختبار الأداء وبناء الإنتاج الكامل بنجاح تام عبر `pnpm build` (35 صفحة ومسار API).

---

## 3. إعدادات النشر على المنصات المختلفة (Deployment Strategies)

### الخيار 1: Vercel (الأسهل والأسرع)
- ربط مستودع GitHub مباشرة.
- إضافة متغيرات البيئة: `MONGODB_URI`, `GEMINI_API_KEY`, `JWT_SECRET`, `NEXTAUTH_URL`.
- النشر التلقائي مع كل push لفرع `main`.

### الخيار 2: VPS أو استضافة Hostinger Node.js
- تشغيل التطبيق عبر PM2:
  ```bash
  pnpm build
  pm2 start pnpm --name "dolean-app" -- start
  ```
- إعداد Nginx كـ Reverse Proxy لتوجيه المنفذ 3000 مع تفعيل شهادة SSL مجانية عبر Let's Encrypt.
