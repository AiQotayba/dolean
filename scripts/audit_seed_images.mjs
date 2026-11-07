import fs from 'fs';
import https from 'https';
import http from 'http';

const seedContent = fs.readFileSync('scripts/seed.mjs', 'utf8');

// Find all URLs ending with image extensions or unsplash
const urlRegex = /(https?:\/\/[^\s"',]+)/g;
const matches = [...new Set(seedContent.match(urlRegex) || [])];

console.log(`Found ${matches.length} unique URLs in seed.mjs`);

// Filter only image-like URLs (unsplash, png, jpg, etc.)
const imageUrls = matches.filter(url => 
  url.includes('images.unsplash.com') || 
  url.includes('.png') || 
  url.includes('.jpg') || 
  url.includes('.jpeg') || 
  url.includes('.webp') ||
  url.includes('.svg')
);

console.log(`Found ${imageUrls.length} image URLs to check`);

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
        resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
      });
      req.on('error', (err) => resolve({ url, status: 'ERROR: ' + err.message, ok: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ url, status: 'TIMEOUT', ok: false });
      });
      req.end();
    } catch (e) {
      resolve({ url, status: 'EXCEPTION: ' + e.message, ok: false });
    }
  });
}

async function run() {
  const results = [];
  for (const url of imageUrls) {
    const res = await checkUrl(url);
    results.push(res);
    console.log(`${res.ok ? '✓' : '✗'} [${res.status}] ${url.slice(0, 80)}`);
  }

  const failures = results.filter(r => !r.ok);
  console.log(`\nSummary: ${results.length - failures.length} OK, ${failures.length} FAILED`);
  if (failures.length > 0) {
    console.log('Failed URLs:');
    failures.forEach(f => console.log(` - [${f.status}] ${f.url}`));
  }
}

run();
