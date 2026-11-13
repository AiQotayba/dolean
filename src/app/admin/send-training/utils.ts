export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return "";
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

export function generatePersonalizedMessage({
  template,
  studentName,
  courseTitle,
  courseLink,
  studentInterest,
}: {
  template: string;
  studentName: string;
  courseTitle: string;
  courseLink: string;
  studentInterest?: string;
}): string {
  let msg = template || DEFAULT_WHATSAPP_TEMPLATE;
  msg = msg.replaceAll("{{name}}", (studentName || "عزيزنا الطالب").trim());
  msg = msg.replaceAll("{{title}}", (courseTitle || "التدريب المتاح").trim());
  msg = msg.replaceAll("{{link}}", (courseLink || "").trim());
  msg = msg.replaceAll("{{interest}}", (studentInterest || "التدريب والتأهيل").trim());

  // تنظيف أي رموز تالفة أو محارف \uFFFD ناتجة عن مشاكل الترميز
  msg = msg.replace(/\uFFFD/g, "");

  return msg.trim();
}

export const DEFAULT_WHATSAPP_TEMPLATE = `السلام عليكم ورحمة الله وبركاته يا {{name}}
معك فريق منصة تلاقي
لأنك مسجل معنا وتبحث عن فرصة تطوّر فيها مهاراتك، يسعدنا جداً إعلامك بفتح باب التسجيل في:

*{{title}}*

للاطلاع على كامل التفاصيل والشروط والتسجيل مباشرة:
{{link}}

*ملاحظة تهمنا:*
* في حال تم قبولك بالتدريب، لا تنسى تبشّرنا لنسعد معك ونحدّث ملفك للمستوى القادم!
* وإذا كنت ببالك تدريب آخر أو حابب نساعدك بمهارات ثانية، فيك تسجل طلبك دائماً عبر المنصة:
https://talaqi.vercel.app/apply

كل التوفيق والبركة في مسيرتك العلمية والمهنية`;
