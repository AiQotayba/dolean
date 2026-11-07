import fs from 'fs';

const filePath = 'C:/Users/USER/Downloads/فعاليات الأسبوع العالمي لريادة الأعمال _ إدلب 2026 (6).html';
const html = fs.readFileSync(filePath, 'utf8');

// Let's parse the event cards and partners
// Let's print out text around each heading
const headings = ['معرض صُنّاع الريادة', 'الذكاء الاصطناعي لرائد الأعمال', 'ريادة الأعمال النسائية', 'LinkedIn', 'ريادة الأعمال في سورية', 'الشركاء المحليون'];

headings.forEach(h => {
  const idx = html.indexOf(h);
  if (idx !== -1) {
    console.log('==============================');
    console.log('HEADING:', h);
    console.log('==============================');
    console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 1200)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  }
});
