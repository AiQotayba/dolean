import { parsePhoneNumber } from "react-phone-number-input";

export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return "";

  try {
    const parsed = parsePhoneNumber(phone, "SY");
    if (parsed && parsed.number) {
      return parsed.number.replace("+", "");
    }
  } catch (e) {
    // Fallback if parsing fails
  }

  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("00")) clean = clean.substring(2);
  // Syrian phone: 09XXXXXXXX -> 9639XXXXXXXX
  if (clean.startsWith("09") && clean.length === 10) clean = "963" + clean.substring(1);
  if (clean.startsWith("9") && clean.length === 9) clean = "963" + clean;
  // Turkish phone: 05XXXXXXXXX -> 905XXXXXXXXX
  if (clean.startsWith("05") && clean.length === 11) clean = "90" + clean.substring(1);
  if (clean.startsWith("5") && clean.length === 10) clean = "90" + clean;
  return clean;
}

export function isLikelyFemaleName(fullName: string): boolean {
  if (!fullName) return false;
  const firstName = fullName.trim().split(/\s+/)[0].replace(/^(ال)/, "");

  // Explicit male names ending in ة or ه
  const maleWithTaMarbuta = new Set([
    "حمزة", "أسامة", "اسامة", "طلحة", "عكرمة", "حذيفة", "قتيبة", "قتادة",
    "معاوية", "عبيدة", "عمارة", "سلامة", "عروة", "ربيعة", "شيبة"
  ]);
  if (maleWithTaMarbuta.has(firstName)) return false;

  // Well known Arabic female names
  const knownFemaleNames = new Set([
    "آية", "اية", "مريم", "نور", "شهد", "ريم", "ياسمين", "رزان", "رهف", "رغد",
    "تسنيم", "بيان", "جنى", "رؤى", "روى", "هديل", "أمل", "امل", "سحر", "منار",
    "غيداء", "مرح", "فرح", "حنين", "سندس", "كوثر", "إكرام", "اكرام", "إيمان", "ايمان",
    "رنا", "ديما", "ديمة", "هلا", "شذى", "تقى", "جنات", "ريماس", "ليان", "تالين",
    "جود", "رند", "سارة", "ساره", "هبة", "دانية", "روعة", "سمية", "خولة", "صفية",
    "حفصة", "سميرة", "لمياء", "شيماء", "أسماء", "اسماء", "إسراء", "اسراء", "دعاء",
    "هناء", "نجلاء", "علياء", "وفاء", "صفاء", "سناء", "حسناء", "ولاء", "منى", "لبنى",
    "سلمى", "نجوى", "سلوى", "ضحى", "سها", "علا", "شروق", "إسعاد", "فاتن", "فاتنة",
    "بشرى", "بسمة", "ابتسام", "خلود", "زينب", "رقية", "فاطمة", "عائشة", "خديجة",
    "مروة", "سماح", "أروى", "اروى", "روان", "براء", "لجين", "وئام", "سهام", "أحلام",
    "احلام", "غرام", "أنسام", "ريام", "سوزان", "نسرين", "نيفين", "سيرين"
  ]);
  if (knownFemaleNames.has(firstName)) return true;

  // Female endings in Arabic (ة / ـة)
  if (firstName.endsWith("ة") || firstName.endsWith("ه")) return true;

  return false;
}

export function generatePersonalizedMessage({
  template,
  studentName,
  courseTitle,
  courseLink,
  studentInterest,
  gender = "auto",
}: {
  template: string;
  studentName: string;
  courseTitle: string;
  courseLink: string;
  studentInterest?: string;
  gender?: "female" | "male" | "auto";
}): string {
  let msg = template || DEFAULT_WHATSAPP_TEMPLATE;
  const name = (studentName || "عزيزنا الطالب").trim();
  const title = (courseTitle || "التدريب المتاح").trim();
  const link = (courseLink || "").trim();

  const isFemale =
    gender === "female" ? true : gender === "male" ? false : isLikelyFemaleName(name);

  // If the student is male, adapt the feminine default template to masculine phrasing
  if (!isFemale) {
    msg = msg
      .replaceAll("إذا حابة تشاركي، اطلعي على التفاصيل وشروط التسجيل وقدّمي طلبك من هون", "إذا حابب تشارك، اطلع على التفاصيل وشروط التسجيل وقدّم طلبك من هون")
      .replaceAll("إذا حابة تشاركي", "إذا حابب تشارك")
      .replaceAll("اطلعي على التفاصيل وشروط التسجيل وقدّمي طلبك", "اطلع على التفاصيل وشروط التسجيل وقدّم طلبك")
      .replaceAll("بتساعدك توصلي", "بتساعدك توصل")
      .replaceAll("إذا انقبلتي بالتدريب، لا تنسي تبشرينا لنفرح معك ونتابع رحلتك!", "إذا انقبلت بالتدريب، لا تنسى تبشرنا لنفرح معك ونتابع رحلتك!")
      .replaceAll("إذا انقبلتي بالتدريب، لا تنسي تبشرينا", "إذا انقبلت بالتدريب، لا تنسى تبشرنا")
      .replaceAll("عم تدوري على تدريب أو مهارة تانية؟ سجّلي طلبك من هون، ومنساعدك تلاقي الفرصة المناسبة:", "عم تدور على تدريب أو مهارة تانية؟ سجّل طلبك من هون، ومنساعدك تلاقي الفرصة المناسبة:")
      .replaceAll("عم تدوري على تدريب أو مهارة تانية؟ سجّلي طلبك", "عم تدور على تدريب أو مهارة تانية؟ سجّل طلبك");
  }

  // Replace standard variables
  msg = msg.replaceAll("{{name}}", name);
  msg = msg.replaceAll("{{title}}", title);
  msg = msg.replaceAll("{{link}}", link);
  msg = msg.replaceAll("{{interest}}", (studentInterest || "التدريب والتأهيل").trim());

  // WhatsApp bold formatting: convert **bold** markdown to WhatsApp *bold*
  msg = msg.replace(/\*\*([^*]+)\*\*/g, "*$1*");

  // Clean any stray \uFFFD characters
  msg = msg.replace(/\uFFFD/g, "");

  return msg.trim();
}

export const DEFAULT_WHATSAPP_TEMPLATE = `السلام عليكم {{name}}🌿

حابين نخبرك إنه فتح التسجيل في:
📢 **{{title}}**
إذا حابة تشاركي، اطلعي على التفاصيل وشروط التسجيل وقدّمي طلبك من هون 👇
{{link}}
ــــــــــــــــــــ
💚 **معك فريق منصة تلاقي**

تلاقي منصة بتساعدك توصلي للفرص التدريبية والتعليمية المناسبة لاهتماماتك.
* إذا انقبلتي بالتدريب، لا تنسي تبشرينا لنفرح معك ونتابع رحلتك!
* عم تدوري على تدريب أو مهارة تانية؟ سجّلي طلبك من هون، ومنساعدك تلاقي الفرصة المناسبة:
https://talaqi.vercel.app/apply

بالتوفيق دائماً 💚`;

export const DEFAULT_WHATSAPP_TEMPLATE_MALE = `السلام عليكم {{name}}🌿

حابين نخبرك إنه فتح التسجيل في:
📢 **{{title}}**
إذا حابب تشارك، اطلع على التفاصيل وشروط التسجيل وقدّم طلبك من هون 👇
{{link}}
ــــــــــــــــــــ
💚 **معك فريق منصة تلاقي**

تلاقي منصة بتساعدك توصل للفرص التدريبية والتعليمية المناسبة لاهتماماتك.
* إذا انقبلت بالتدريب، لا تنسى تبشرنا لنفرح معك ونتابع رحلتك!
* عم تدور على تدريب أو مهارة تانية؟ سجّل طلبك من هون، ومنساعدك تلاقي الفرصة المناسبة:
https://talaqi.vercel.app/apply

بالتوفيق دائماً 💚`;
