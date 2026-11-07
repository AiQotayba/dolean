import fs from 'fs';

const filePath = 'C:/Users/USER/Downloads/فعاليات الأسبوع العالمي لريادة الأعمال _ إدلب 2026 (6).html';
const html = fs.readFileSync(filePath, 'utf8');

// Replace base64 data URIs so we can see all HTML structure and text
const strippedHtml = html.replace(/data:image\/[^;]+;base64,[^"']+/g, '[BASE64_IMAGE]');

fs.writeFileSync('d:/projects/dolean/scripts/stripped_announcement.html', strippedHtml, 'utf8');
console.log('Stripped file written. Length:', strippedHtml.length);
