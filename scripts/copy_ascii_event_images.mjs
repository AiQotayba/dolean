import fs from 'fs';
import path from 'path';

const eventsDir = 'd:/projects/dolean/public/images/events';

const mapping = [
  { src: '1_Startup_Syria.png', dest: 'startup_syria_logo.png' },
  { src: '2_Global_Entrepreneurship_Week_Syria.png', dest: 'gew_syria_logo.png' },
  { src: '3_معرض_صُنّاع_الريادة.jpg', dest: 'gew_makers_exhibition.jpg' },
  { src: '4_الذكاء_الاصطناعي_لرائد_الأعمال.jpg', dest: 'gew_ai_entrepreneurs.jpg' },
  { src: '5_ريادة_الأعمال_النسائية_بين_الطموح_وتحديا.jpg', dest: 'gew_women_entrepreneurship.jpg' },
  { src: '6_كيف_يصنع_رائد_الأعمال_فرصه_عبر_LinkedIn؟.jpg', dest: 'gew_linkedin_networking.jpg' },
  { src: '7_ريادة_الأعمال_في_سورية_بين_الطموح_والواق.jpg', dest: 'gew_syria_entrepreneurship.jpg' },
  { src: '8_Action_for_Humanity.png', dest: 'action_for_humanity_logo.png' },
  { src: '9_شؤون_الشباب_Youth_Affairs.png', dest: 'youth_affairs_logo.png' },
  { src: '10_Save_the_Children.png', dest: 'save_the_children_logo.png' }
];

mapping.forEach(m => {
  const srcPath = path.join(eventsDir, m.src);
  const destPath = path.join(eventsDir, m.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${m.src} -> ${m.dest}`);
  }
});
