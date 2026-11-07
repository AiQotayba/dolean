import fs from 'fs';

const files = [
  'C:/Users/USER/Downloads/التحدي الريادي — GEW إدلب 2026.html',
  'C:/Users/USER/Downloads/Founder Mentor — مرشد المؤسس (1).html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const headings = [...content.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log('File:', f);
    console.log('Title:', titleMatch ? titleMatch[1] : 'None');
    console.log('Headings:', headings.slice(0, 10));
    console.log('-------------------------');
  }
});
