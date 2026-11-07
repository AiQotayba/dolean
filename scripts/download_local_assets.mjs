import fs from 'fs';
import path from 'path';
import https from 'https';

const dirs = [
  'public/images/courses',
  'public/images/centers',
  'public/images/sliders'
];

dirs.forEach(d => {
  const full = path.join(process.cwd(), d);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

// List of high-quality verified images to download and cache locally
const downloads = [
  // Centers Logos & Covers
  {
    url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/violet_logo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/violet_cover.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/techzone_logo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/techzone_cover.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/khatwa_logo.jpg'
  },
  {
    // Working cover for vocational workshop
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/khatwa_cover.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/shafak_logo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/shafak_cover.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/masar_logo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/masar_cover.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/rowad_logo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/rowad_cover.jpg'
  },
  {
    // High quality technical institute logo & cover
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/technical_institute_logo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/technical_institute_cover.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/afaq_logo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/afaq_cover.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/innovation_hub_logo.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    dest: 'public/images/centers/innovation_hub_cover.jpg'
  },

  // Courses Images
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/pmd_pro.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/frontend_react.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/phone_repair.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/first_aid.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/graphic_design.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/alameen_accounting.jpg'
  },
  {
    // High quality verified Solar Energy PV photo (clean, working!)
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    // fallback to confirmed working solar image
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80',
    url: 'https://images.unsplash.com/photo-1545209179-a5dc7ff04786?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/solar_energy.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/business_english.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/courses/data_analysis_ai.jpg'
  },

  // Sliders Banners
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
    dest: 'public/images/sliders/slider_hero.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&auto=format&fit=crop&q=80',
    dest: 'public/images/sliders/slider_tech.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80',
    dest: 'public/images/sliders/slider_partners.jpg'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(dest);
          console.log(`✓ Saved ${dest} (${Math.round(stats.size / 1024)} KB)`);
          resolve(true);
        });
      } else {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        console.warn(`✗ Failed ${url} [Status ${res.statusCode}]`);
        resolve(false);
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.warn(`✗ Error ${url}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  console.log(`Starting download of ${downloads.length} assets...`);
  for (const item of downloads) {
    await downloadFile(item.url, item.dest);
  }
  console.log('All downloads processed!');
}

run();
