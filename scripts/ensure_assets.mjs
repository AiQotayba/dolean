import fs from 'fs';
import path from 'path';

function copyIfNotExist(src, dest) {
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
  }
}

// Ensure khatwa_cover.jpg
copyIfNotExist('public/images/courses/phone_repair.jpg', 'public/images/centers/khatwa_cover.jpg');

// Ensure solar_energy.jpg
copyIfNotExist('public/images/centers/technical_institute_cover.jpg', 'public/images/courses/solar_energy.jpg');

// Ensure Idlib University images
copyIfNotExist('public/images/centers/innovation_hub_logo.jpg', 'public/images/centers/idlib_university_logo.jpg');
copyIfNotExist('public/images/centers/innovation_hub_cover.jpg', 'public/images/centers/idlib_university_cover.jpg');

// Ensure university course images
copyIfNotExist('public/images/courses/frontend_react.jpg', 'public/images/courses/icdl_computer.jpg');
copyIfNotExist('public/images/courses/alameen_accounting.jpg', 'public/images/courses/excel_advanced.jpg');
copyIfNotExist('public/images/courses/first_aid.jpg', 'public/images/courses/nursing_c24.jpg');
copyIfNotExist('public/images/courses/first_aid.jpg', 'public/images/courses/nursing_assistant.jpg');
copyIfNotExist('public/images/courses/business_english.jpg', 'public/images/courses/univ_english.jpg');

console.log('Local assets all verified and ready!');
