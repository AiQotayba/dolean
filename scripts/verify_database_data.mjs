import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/dolean';

async function checkUrl(url) {
  if (url.startsWith('/')) {
    // Local public asset
    const localPath = path.join(process.cwd(), 'public', url);
    const exists = fs.existsSync(localPath);
    if (!exists) return { ok: false, type: 'local', status: 'FILE_NOT_FOUND', path: localPath };
    const stat = fs.statSync(localPath);
    return { ok: stat.size > 0, type: 'local', size: stat.size, status: '200 OK' };
  } else if (url.startsWith('http')) {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method: 'HEAD', timeout: 4000 }, (res) => {
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, type: 'remote', status: res.statusCode });
      });
      req.on('error', (err) => resolve({ ok: false, type: 'remote', status: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, type: 'remote', status: 'TIMEOUT' });
      });
      req.end();
    });
  }
  return { ok: false, type: 'unknown', status: 'INVALID_URL' };
}

async function verifyAll() {
  console.log('🔍 بدء الفحص الشامل لجميع بيانات الـ Database والصور...\n');
  await mongoose.connect(LOCAL_URI);
  const db = mongoose.connection.db;

  const courses = await db.collection('courses').find({ deleteState: { $ne: true } }).toArray();
  const orgs = await db.collection('organizations').find({ deleteState: { $ne: true } }).toArray();
  const sliders = await db.collection('sliders').find({ deleteState: { $ne: true } }).toArray();

  console.log(`📊 الإحصائيات:`);
  console.log(`   - عدد الدورات في القاعدة: ${courses.length}`);
  console.log(`   - عدد المراكز والمنظمات: ${orgs.length}`);
  console.log(`   - عدد السلايدرات: ${sliders.length}\n`);

  let errorsCount = 0;

  // 1. Audit Courses Images
  console.log('📌 1. فحص صور الدورات:');
  for (const c of courses) {
    if (!c.image) {
      console.log(`   ⚠️ [NO_IMAGE] دورة بلا صورة: "${c.title}"`);
      errorsCount++;
      continue;
    }
    const res = await checkUrl(c.image);
    if (!res.ok) {
      console.log(`   ❌ [BROKEN] "${c.title}" -> ${c.image} (${res.status})`);
      errorsCount++;
    } else {
      console.log(`   ✅ [OK] "${c.title.slice(0, 40)}..." -> ${res.status} (${res.type})`);
    }
  }

  // 2. Audit Organizations Logos and Covers
  console.log('\n📌 2. فحص شعارات وأغلفة المراكز والمنظمات:');
  for (const o of orgs) {
    if (o.logo) {
      const resLogo = await checkUrl(o.logo);
      if (!resLogo.ok) {
        console.log(`   ❌ [BROKEN LOGO] "${o.name}" -> ${o.logo} (${resLogo.status})`);
        errorsCount++;
      } else {
        console.log(`   ✅ [LOGO OK] "${o.name.slice(0, 30)}..." -> ${resLogo.status}`);
      }
    }
    if (o.coverImage) {
      const resCover = await checkUrl(o.coverImage);
      if (!resCover.ok) {
        console.log(`   ❌ [BROKEN COVER] "${o.name}" -> ${o.coverImage} (${resCover.status})`);
        errorsCount++;
      }
    }
  }

  // 3. Audit Sliders
  console.log('\n📌 3. فحص صور السلايدرات:');
  for (const s of sliders) {
    const res = await checkUrl(s.image);
    if (!res.ok) {
      console.log(`   ❌ [BROKEN SLIDER] "${s.title}" -> ${s.image} (${res.status})`);
      errorsCount++;
    } else {
      console.log(`   ✅ [SLIDER OK] "${s.title.slice(0, 35)}..." -> ${res.status}`);
    }
  }

  console.log('\n=============================================');
  if (errorsCount === 0) {
    console.log('🎉 نتيجة الفحص: 100% سليم! جميع الصور والبيانات تعمل بنجاح ودون أي خطأ!');
  } else {
    console.log(`⚠️ تم اكتشاف ${errorsCount} مشكلة بحاجة إلى معالجة.`);
  }
  console.log('=============================================\n');

  await mongoose.disconnect();
}

verifyAll();
