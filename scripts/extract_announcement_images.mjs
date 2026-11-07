import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('C:/Users/USER/Downloads/فعاليات الأسبوع العالمي لريادة الأعمال _ إدلب 2026 (6).html', 'utf8');

const outputDir = 'd:/projects/dolean/public/images/events';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find all <img> tags with alt and src
const imgRegex = /<img[^>]+src=["'](data:image\/([^;]+);base64,([^"']+))["'][^>]*alt=["']([^"']*)["']|<img[^>]+alt=["']([^"']*)["'][^>]+src=["'](data:image\/([^;]+);base64,([^"']+))["']/gis;

let match;
let index = 0;

const extracted = [];

// Also regex for any data:image in html with its surrounding alt or context
const allDataImages = [...html.matchAll(/<img([^>]+)>/gis)];

for (const tagMatch of allDataImages) {
  const tag = tagMatch[1];
  const srcMatch = tag.match(/src=["']data:image\/([a-zA-Z0-9+]+);base64,([^"']+)["']/i);
  const altMatch = tag.match(/alt=["']([^"']*)["']/i);
  
  if (srcMatch) {
    const ext = srcMatch[1] === 'jpeg' ? 'jpg' : srcMatch[1];
    const base64Data = srcMatch[2];
    const alt = altMatch ? altMatch[1].trim() : `image_${index}`;
    
    // Create safe filename
    const safeName = alt
      .replace(/[^\u0600-\u06FF\w\-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 40) || `img_${index}`;
    
    const filename = `${index + 1}_${safeName}.${ext}`;
    const filePath = path.join(outputDir, filename);
    
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    console.log(`Saved: ${filename} (alt: "${alt}", size: ${base64Data.length} chars)`);
    extracted.push({ filename, alt, relativePath: `/images/events/${filename}` });
    index++;
  }
}

console.log(`\nSuccessfully extracted ${extracted.length} images to ${outputDir}`);
fs.writeFileSync('d:/projects/dolean/scripts/extracted_images_manifest.json', JSON.stringify(extracted, null, 2), 'utf8');
