# وثائق مشروع دوليان (Dolean) - البنية المعمارية الموحدة

مرحباً بك في مجلد التوثيق الرسمي لمشروع **دوليان (Dolean)** بعد قرار إعادة الهيكلة الشاملة والتحول إلى تطبيق موحد بالكامل بنظام **Next.js 16 (App Router)** ومدير الحزم **pnpm** في جذر المشروع (Root).

---

## 📚 محتويات التوثيق (Documentation Index)

1. **[وثيقة متطلبات ومعمارية المنتج (Product Requirements Document - PRD)](./PRD.md)** ⭐
   - العنوان، الرؤية، والجمهور المستهدف.
   - المكدس التقني الكامل (Tech Stack).
   - الشجرة التفصيلية لبنية الملفات (File Structure).
   - مخطط نماذج قاعدة البيانات (ER Diagram & Schemas).
   - قواعد الأمان والحماية والصلاحيات (Security & RBAC).
   - معمارية الحاويات والنشر الموحد (Docker Architecture).

2. **[الورقة البحثية والمخطط المعماري الشامل (Architecture Blueprint)](./ARCHITECTURE_BLUEPRINT.md)**
   - الرؤية والأهداف الاستراتيجية.
   - التحول المعماري من الأنظمة المتفرقة (Poly-repo/Multi-folder) إلى المعمارية الموحدة (Unified Monolith).
   - مخطط تدفق البيانات والبنية التحتية.

2. **[مخطط ونماذج قاعدة البيانات MongoDB (Database Schema Specification)](./DATABASE_SCHEMA.md)**
   - نماذج البيانات المحدثة لدعم الأدوار المتعددة (`roles: string[]`).
   - الفصل الدقيق بين **الجهة المقدمة للتدريب (Providing Entity)** و**الجهة الناشرة (Publishing Entity)**.
   - إدارة اتصالات MongoDB في بيئة Next.js Serverless بدون استنزاف الموارد (Singleton Connection Pattern).

3. **[محرك الذكاء الاصطناعي مع Google Gemini (Gemini AI Specification)](./GEMINI_AI_SPECIFICATION.md)**
   - معالجة النصوص غير المهيكلة وتحويلها إلى كائنات JSON محددة البنية (Structured Outputs).
   - معالجة صور وبوسترات الدورات عبر الرؤية الحاسوبية متعددة الوسائط (Multimodal OCR & Vision).
   - كود التنفيذ المعتمد باستخدام مكتبة `@google/genai` ونماذج `gemini-2.5-flash`.

4. **[خطة الهجرة والتنفيذ خطوة بخطوة (Migration & Execution Roadmap)](./MIGRATION_ROADMAP.md)**
   - خطوات نقل خادم Express (`server/`) بالكامل إلى مسارات Next.js (`src/app/api/`).
   - آلية الاستغناء الآمن عن المجلدات القديمة (`client/`, `microservices/`).
   - توحيد التطبيق في جذر المشروع مع الحفاظ على الأمان وسلامة البيانات.
