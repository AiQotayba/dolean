import fs from 'fs';
import mongoose from 'mongoose';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/dolean';

async function exportJson() {
  await mongoose.connect(LOCAL_URI);
  const db = mongoose.connection.db;

  const orgs = await db.collection('organizations').find({ deleteState: { $ne: true } }).toArray();
  const courses = await db.collection('courses').find({ deleteState: { $ne: true } }).toArray();
  const sliders = await db.collection('sliders').find({ deleteState: { $ne: true } }).toArray();
  const sections = await db.collection('sections').find({ deleteState: { $ne: true } }).toArray();

  const exportData = {
    meta: {
      datasetVersion: '1.1.0',
      datasetName: 'دليل ومستودع تدريبات إدلب والشمال السوري - منصة تلاقي',
      updatedAt: '2026-11-01',
      totalOrganizations: orgs.length,
      totalTrainings: courses.length,
      updateNotes: [
        'فحص وتدقيق كافة روابط الصور والتأكد من عملها بنسبة 100% بدون أي 404.',
        'إضافة فعاليات الأسبوع العالمي لريادة الأعمال – إدلب 2026 (معرض صُناع الريادة، الذكاء الاصطناعي، لينكد إن، ريادة الأعمال النسائية).',
        'إدراج إعلانات مديرية التدريب والتأهيل والمعهد الاستشاري للغات بجامعة إدلب (ICDL C92، Excel Advanced-8، التمريض والإسعاف الأولي C24، مساعد ممرض، ودورات اللغة الإنكليزية).',
        'حفظ كافة صور البوسترات والشعارات محلياً داخل public/images/ لضمان سرعة التحميل والعمل في الشمال السوري دون اعتماد على روابط خارجية.'
      ],
      suggestedImportOrder: ['organizations', 'historicalTrainings', 'seedTrainings', 'sections', 'sliders']
    },
    organizations: orgs,
    historicalTrainings: courses,
    seedTrainings: courses,
    sections: sections,
    sliders: sliders
  };

  const targets = [
    'd:/projects/dolean/docs/dolean_idlib_training_seed_2026_v2.json',
    'd:/projects/dolean/dolean_idlib_training_seed_2026_v2.json'
  ];

  targets.forEach(t => {
    fs.writeFileSync(t, JSON.stringify(exportData, null, 2), 'utf8');
    console.log(`✓ Exported: ${t} (${Math.round(fs.statSync(t).size / 1024)} KB)`);
  });

  await mongoose.disconnect();
}

exportJson().catch(console.error);
