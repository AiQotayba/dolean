import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/Course';
import Organization from '@/models/Organization';
import User from '@/models/User';
import Slider from '@/models/Slider';
import Section from '@/models/Section';
import { hashPassword } from '@/lib/auth';

const SEED_ORGANIZATIONS = [
  {
    name: 'منظمة بنفسج (Violet Organization)',
    legalName: 'Violet Organization for Relief and Development',
    orgType: 'ngo',
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    description: 'منظمة إنسانية تنموية فاعلة في الشمال السوري، تقدم برامج تمكين الشباب وبناء القدرات والتعليم وسُبل العيش.',
    website: 'https://violetsyria.org',
    contactEmail: 'capacity@violetsyria.org',
    contactPhone: '+963951234001',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'شارع الثلاثين',
      street: 'مجمع مراكز بناء القدرات الشبابية',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'أكاديمية تك زون للبرمجة والذكاء الاصطناعي',
    legalName: 'TechZone Programming Academy',
    orgType: 'company',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    description: 'أكاديمية برمجية وتقنية متقدمة تهدف لإعداد مطوري الويب والتطبيقات وتمكينهم من العمل الحر مع الأسواق الإقليمية والدولية.',
    website: 'https://techzone-academy.com',
    contactEmail: 'info@techzone-academy.com',
    contactPhone: '+963966887766',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'الدانا',
      street: 'الشارع الرئيسي - مقابل الحديقة العامة',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'مركز خطوة للتدريب والتطوير المهني',
    legalName: 'Khatwa Vocational Training Center',
    orgType: 'institute',
    logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1597740985671-2a8a3b805337?w=1200&auto=format&fit=crop&q=80',
    description: 'مركز مهني حرفي متخصص في صيانة الهواتف، التمديدات الكهربائية، وصيانة الأجهزة الذكية لتوفير فرص عمل فورية للشباب.',
    website: '',
    contactEmail: 'contact@khatwa-center.org',
    contactPhone: '+963944112233',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'سرمدا',
      street: 'الشارع العام - بجانب ساحة الشهداء',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'منظمة شفق (Shafak Organization)',
    legalName: 'Shafak Organization for Relief and Development',
    orgType: 'ngo',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    description: 'منظمة مجتمع مدني سورية غير ربحية تسعى لتحسين حياة المتضررين عبر التدريب الصحي، الحماية، ودعم التعليم والمجتمعات.',
    website: 'https://shafak.org',
    contactEmail: 'health@shafak.org',
    contactPhone: '+963933221100',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'أريحا',
      street: 'المركز المجتمعي لمنظمة شفق',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'فريق مسار للتأهيل الرقمي',
    legalName: 'Masar Digital Empowerment Team',
    orgType: 'initiative',
    logo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&auto=format&fit=crop&q=80',
    description: 'مبادرة شبابية رائدة تعنى بتأهيل الشباب والطلاب في مهارات الجرافيك، المونتاج، والتسويق الرقمي وبناء الهويات البصرية.',
    website: '',
    contactEmail: 'masar.digital@gmail.com',
    contactPhone: '+963944332211',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'معرة مصرين',
      street: 'مكتب مسار الشبابي - جانب مبنى البريد',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'معهد الرواد للعلوم واللغات',
    legalName: 'Al-Rowad Educational Institute',
    orgType: 'institute',
    logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
    description: 'معهد أكاديمي ومهني يقدم دبلومات تخصصية في المحاسبة المالية، اللغات، وإدارة الأعمال وإعداد الكوادر الإدارية.',
    website: '',
    contactEmail: 'alrowad.idlib@gmail.com',
    contactPhone: '+963951234567',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'شارع الجلاء',
      street: 'مقابل مصرف التسليف - بناء الرواد الطابق الثاني',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'المعهد التقني المهني في إدلب',
    legalName: 'Idlib Vocational & Technical Institute',
    orgType: 'governmental',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    description: 'مؤسسة تعليمية مهنية تعنى بإعداد الفنيين المهرة في مجالات الطاقة البديلة، التمديدات الكهربائية، والتحكم الصناعي.',
    website: '',
    contactEmail: 'tech.inst.idlib@gmail.com',
    contactPhone: '+963949887755',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'حي الثورة',
      street: 'مبنى المعهد التقني - ورشات الطاقة الكهربائية',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'مركز آفاق للغات والترجمة',
    legalName: 'Afaq Language & Translation Center',
    orgType: 'institute',
    logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
    description: 'مركز لغات معتمد يقدم دورات المحادثة باللغة الإنجليزية والتركية وإعداد المتقدمين لمقابلات التوظيف الدولية.',
    website: '',
    contactEmail: 'afaq.languages@gmail.com',
    contactPhone: '+963955667788',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'سرمدا',
      street: 'شارع المصارف - بجانب المجمع التجاري',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'مركز إدلب للابتكار وريادة الأعمال',
    legalName: 'Idlib Innovation and Entrepreneurship Hub',
    orgType: 'initiative',
    logo: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    description: 'مركز تكنولوجي وريادي يدعم الشباب والمبتكرين في الشمال السوري عبر برامج متقدمة في علوم البيانات، الذكاء الاصطناعي، واحتضان المشاريع الناشئة.',
    website: 'https://idlib-innovation.org',
    contactEmail: 'info@idlib-innovation.org',
    contactPhone: '+963951778899',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'إدلب المدينة',
      street: 'شارع المحافظة - بالقرب من دوار الساعة',
    },
    isVerified: true,
    deleteState: false,
  },
];

const createCourses = (orgMap: Record<string, any>) => [
  {
    title: 'دبلوم إدارة المشاريع التنموية والإنسانية (Project DPro - PMD Pro)',
    summary: 'تدريب مهني معتمد يركز على تزويد الكوادر الشبابية في إدلب بمهارات إدارة دورة حياة المشروع الإنساني، كتابة المقترحات، ومتابعة المؤشرات الميدانية.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب المدينة - شارع الثلاثين',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'شارع الثلاثين',
      addressText: 'مركز تمكين وبناء قدرات الشباب - شارع الثلاثين',
    },
    providingEntity: {
      organizationId: orgMap['منظمة بنفسج (Violet Organization)'],
      name: 'منظمة بنفسج (Violet Organization)',
      logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: true,
      cost: 0,
      currency: 'USD',
      stipendProvided: false,
      stipendNote: 'يشمل التدريب حقيبة تدريبية وشهادة حضور معتمدة مجاناً',
    },
    ageEligibility: { start: 20, end: 35 },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-10'),
      endDate: new Date('2026-12-05'),
      registrationDeadline: new Date('2026-11-05'),
      durationHours: 40,
      sessionsCount: 10,
      daysOfWeek: ['السبت', 'الإثنين', 'الأربعاء'],
      timeSlot: '10:00 ص - 02:00 م',
    },
    topics: [
      'مقدمة في إدارة المشاريع ومعايير PMD Pro الدولية',
      'تحديد الاحتياجات وصياغة شجرة المشكلات والأهداف',
      'بناء مصفوفة الإطار المنطقي (Logical Framework Matrix)',
      'تخطيط الموارد وجدولة الأنشطة وإدارة المخاطر',
      'مبادئ الرصد والتقييم والمساءلة والتعلم (MEAL)',
      'إغلاق المشروع والدروس المستفادة والتقارير المانحة',
    ],
    requirements: [
      'شهادة جامعية أو طالب في السنة الأخيرة من المرحلة الجامعية',
      'التفرغ التام لأيام وساعات التدريب بنسبة حضور لا تقل عن 90%',
      'الرغبة في العمل الميداني أو التطوع في القطاع الإنساني بإدلب',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'يمنح المتميزون أولوية الترشيح لفرص تدريب عملي (Internship) لدى مشاريع المنظمة.',
    links: ['https://forms.gle/violet-pmd-idlib-2026'],
    keys: ['إدارة مشاريع', 'منظمات', 'بنفسج', 'إدلب', 'PMD Pro', 'MEAL', 'تنموي', 'تدريب مجاني', 'عمل إنساني'],
    context: `### نظرة عامة على الدورة\nيهدف برنامج **إدارة المشاريع التنموية والإنسانية (PMD Pro)** إلى تمكين الشباب السوري في محافظة إدلب من اكتساب المعايير المعترف بها عالمياً لإدارة المشاريع غير الربحية بكفاءة وجودة عالية، ومواكبة متطلبات المنظمات الدولية والمحلية العاملة في الميدان.\n\n---\n\n### محاور التدريب التفصيلية\n* **المرحلة الأولى:** مدخل عام إلى السياق الإنساني ومراحل دورة حياة المشروع.\n* **المرحلة الثانية:** تقييم الاحتياجات الشامل وتحليل أصحاب المصلحة.\n* **المرحلة الثالثة:** تصميم المشروعات وصياغة المؤشرات الذكية (SMART Indicators).\n* **المرحلة الرابعة:** خطط العمل، الموازنات التقديرية، واللوجستيات والمشتريات.\n* **المرحلة الخامسة:** أنظمة الرصد والمتابعة وإدارة التغيير والمخاطر.\n\n---\n\n### مخرجات التدريب\n1. القدرة الكاملة على قراءة وصياغة وثيقة مقترح مشروع إنساني متكامل.\n2. فهم المعايير الأساسية للشراكة مع المانحين وآليات التوثيق.\n3. الحصول على شهادة إتمام تدريب صادرة عن المنظمة.`,
    status: 'published',
    deleteState: false,
    viewsCount: 142,
    applicantsCount: 38,
  },
  {
    title: 'دبلوم تطوير واجهات الويب الحديثة (Frontend Web: React & Next.js)',
    summary: 'مسار عملي مكثف لتأهيل مبرمجي الواجهات وتجهيزهم للعمل عن بعد (Freelancing) مع شركات عربية وعالمية باستخدام React وNext.js وتطبيقات السيرفر.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب - الدانا',
    locationType: 'hybrid',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'الدانا',
      addressText: 'أكاديمية تك زون - مقابل الحديقة العامة',
    },
    providingEntity: {
      organizationId: orgMap['أكاديمية تك زون للبرمجة والذكاء الاصطناعي'],
      name: 'أكاديمية تك زون للبرمجة والذكاء الاصطناعي',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: false,
      cost: 35,
      currency: 'USD',
      stipendProvided: false,
      stipendNote: 'سعر مدعوم للشباب مع إمكانية التقسيط على دفعتين',
    },
    ageEligibility: { start: 17, end: 38 },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-15'),
      endDate: new Date('2027-01-10'),
      registrationDeadline: new Date('2026-11-12'),
      durationHours: 60,
      sessionsCount: 20,
      daysOfWeek: ['الأحد', 'الثلاثاء', 'الخميس'],
      timeSlot: '04:00 م - 07:00 م',
    },
    topics: [
      'أساسيات HTML5 الدلالية والتجاوب مع الشاشات',
      'إتقان Tailwind CSS وتصميم واجهات أنيقة وعصرية',
      'مفاهيم JavaScript الحديثة (ES6+, Async/Await, Fetch API)',
      'مكتبة React.js (Components, Hooks, State Management)',
      'إطار العمل Next.js والـ App Router وServer Actions',
      'بناء واجهات متصلة بقواعد البيانات والـ REST APIs',
      'تجهيز البورتفوليو وإستراتيجيات العمل الحر على Upwork ومستقل',
    ],
    requirements: [
      'توفر حاسوب محمول (لابتوب) بحالة جيدة للمتطبيق العملي',
      'معرفة أساسية سابقة بمفاهيم التصفح والإنترنت',
      'تخصيص 4 ساعات أسبوعياً للمشاريع المنزلية العملية',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تشبيك المتخرجين المتميزين مع مشاريع عمل حر وشركات برمجية ناشئة.',
    links: ['https://forms.gle/techzone-frontend-react-2026'],
    keys: ['برمجة', 'ويب', 'React', 'Next.js', 'الدانا', 'إدلب', 'عمل حر', 'فرونت إند', 'تقنية', 'JavaScript'],
    context: `### لماذا هذا الدبلوم؟\nيعد مجال تطوير واجهات الويب (Frontend Development) أكثر المجالات طلباً للعمل عن بعد في الشمال السوري. يركز هذا المسار على التدريب العملي المباشر وبناء مشاريع واقعية حقيقية بدلاً من الاقتصار على الجانب النظري.\n\n---\n\n### المشاريع العملية التي ستنجزها خلال الدورة:\n1. **موقع شخصي (Portfolio):** متجاوب وسريع لعرض أعمالك وخبراتك.\n2. **منصة تجارة إلكترونية مبسطة:** بنظام سلة مشتريات وتصفية منتجات حية.\n3. **لوحة تحكم إدارية (Dashboard):** متصلة بـ Backend حقيقي مع رسوم بيانية ومصادقة مستخدمين.\n\n---\n\n### نظام الدوام\nيجمع التدريب بين الحضور العملي في مقر الأكاديمية بالدانا، مع بث ومتابعة كود أونلاين عبر مجتمع Discord خاص بالدورة لمراجعة الأكواد البرمجية يومياً.`,
    status: 'published',
    deleteState: false,
    viewsCount: 210,
    applicantsCount: 45,
  },
  {
    title: 'التدريب التخصصي في صيانة وبرمجة الهواتف الذكية (Hardware & Software)',
    summary: 'تدريب مهني متكامل يغطي تشخيص الأعطال الإلكترونية، فك وتبديل الآيسيات والشاشات، ومخططات البورد، إضافة للسوفت وير وفك الحمايات لأجهزة Android وiOS.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب - سرمدا',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'سرمدا',
      addressText: 'مركز خطوة - الشارع العام بجانب ساحة الشهداء',
    },
    providingEntity: {
      organizationId: orgMap['مركز خطوة للتدريب والتطوير المهني'],
      name: 'مركز خطوة للتدريب والتطوير المهني',
      logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: true,
      cost: 0,
      currency: 'USD',
      stipendProvided: true,
      stipendNote: 'يمنح الخريجون الثلاثة الأوائل حقيبة أدوات صيانة إلكترونية متكاملة كهدية تشجيعية',
    },
    ageEligibility: { start: 18, end: 35 },
    nationalityEligibility: ['All'],
    genderEligibility: 'male',
    schedule: {
      startDate: new Date('2026-11-08'),
      endDate: new Date('2026-12-20'),
      registrationDeadline: new Date('2026-11-04'),
      durationHours: 50,
      sessionsCount: 15,
      daysOfWeek: ['السبت', 'الإثنين', 'الأربعاء'],
      timeSlot: '09:00 ص - 12:30 م',
    },
    topics: [
      'مبادئ الإلكترونيات الأساسية والقياس باستخدام الأفوميتر',
      'قراءة المخططات الإلكترونية وتتبع مسارات الشحن والباور',
      'تقنيات اللحام والفك والتركيب الآمن للقطع الدقيقة وكونكترات الشحن',
      'استبدال آيسيات الشحن والباور وطرق الشبلنة الاحترافية',
      'صيانة الشاشات والباغات وأجهزة فصل الزجاج الحراري',
      'تفليش الهواتف وتنزيل الرومات الرسمية واستعادة الـ IMEI',
      'تخطي حسابات FRP وMi Account وحل مشاكل الإقلاع المتكرر Bootloop',
    ],
    requirements: [
      'الجدية التامة والرغبة في تأسيس ورشة صيانة أو العمل بمحل هواتف',
      'الالتزام بالحضور الصباحي الكامل لمقر الورشة في سرمدا',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تأهيل وتوجيه مباشر نحو سوق العمل في محلات صيانة الهواتف الذكية المنتشرة في سرمدا والدانا.',
    links: ['https://forms.gle/khatwa-phone-repair-idlib-2026'],
    keys: ['صيانة هواتف', 'سرمدا', 'إدلب', 'مهني', 'هاردوير', 'سوفت وير', 'تدريب مهني', 'حرفي', 'إلكترونيات'],
    context: `### فكرة التدريب\nتشهد منطقة سرمدا حركة تجارية ضخمة وسوقاً واسعاً للأجهزة الذكية. صُمم هذا البرنامج بهدف إكساب الشباب خبرة حرفية وتطبيقية دقيقة تؤهلهم لدخول سوق العمل بشكل فوري ومستقل.\n\n---\n\n### تجهيزات قاعة التدريب\n* ورش مجهزة بمحطات هوت إير وكاويات دقيقة (Soldering Stations).\n* ميكروسكوبات إلكترونية عالية التكبير لفحص البوردات.\n* بوكسات ودناجل برمجية متطورة لتفليش مختلف أنواع الموديلات الحديثة.\n\n---\n\n### الشروط ومعايير القبول\nيخضع المتقدمون لمقابلة قصيرة لتحديد دافع الالتحاق، مع إعطاء الأولوية للباحثين عن فرصة عمل حقيقية في مجال الصيانة.`,
    status: 'published',
    deleteState: false,
    viewsCount: 188,
    applicantsCount: 62,
  },
  {
    title: 'دورة الإسعافات الأولية الميدانية والرعاية الطارئة',
    summary: 'ورشة تدريبية متخصصة في الإسعافات الأولية وإنقاذ الأرواح، مخصصة لطلاب الجامعات والمجتمع المحلي للتعامل مع الحوادث والإصابات المنزلية والميدانية.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب - أريحا',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'أريحا',
      addressText: 'المركز المجتمعي لمنظمة شفق - أريحا',
    },
    providingEntity: {
      organizationId: orgMap['منظمة شفق (Shafak Organization)'],
      name: 'منظمة شفق (Shafak Organization)',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: true,
      cost: 0,
      currency: 'USD',
      stipendProvided: false,
    },
    ageEligibility: { start: 18, end: 45 },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-12'),
      endDate: new Date('2026-11-18'),
      registrationDeadline: new Date('2026-11-08'),
      durationHours: 25,
      sessionsCount: 5,
      daysOfWeek: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      timeSlot: '01:00 م - 05:00 م',
    },
    topics: [
      'فحص العلامات الحيوية وتقييم مسرح الحادث الآمن',
      'الإنعاش القلبي الرئوي (CPR) واستخدام جهاز الصدمات الآلي AED',
      'إيقاف النزف الحاد، استخدام الضمادات الضاغطة والتورنيكيت',
      'التعامل مع الكسور وتثبيت العمود الفقري ونقاط التثبيت',
      'إسعاف الحروق، الصدمة التحسسية، والاختناقات التنفسية',
      'إجراءات فرز المصابين أثناء حوادث الطوارئ (Triage)',
    ],
    requirements: [
      'لا يشترط وجود خلفية طبية مسبقة، التدريب متاح لجميع شرائح المجتمع',
      'الالتزام بحضور كافة الساعات التدريبية وتطبيق المحاكاة العملية',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'إمكانية الانضمام للفرق التطوعية الصحية والإسعافية في المنطقة.',
    links: ['https://forms.gle/shafak-firstaid-ariha-2026'],
    keys: ['إسعافات أولية', 'شفق', 'أريحا', 'إدلب', 'صحة', 'طبي', 'إنعاش', 'مجاني', 'طوارئ'],
    context: `### أهمية التدريب\nفي ظل التحديات الإنسانية في شمال غرب سوريا، يشكل امتلاك مهارات الإسعاف الأولي فارقاً حاسماً بين الحياة والموت. تقدم منظمة شفق هذا التدريب المكثف بواسطة كوادر طبية وتمريضية ذات خبرة عالية.\n\n---\n\n### المحاكاة السريرية والتطبيق\nيتضمن التدريب تدريباً واقعياً على دمى محاكاة طبية، واستخدام أدوات الإسعاف السريع، والتعامل مع سيناريوهات طوارئ ميدانية تحاكي الواقع بالكامل.\n\n---\n\n### الفئات المستهدفة\n* المعلمون والكوادر التربوية.\n* المتطوعون في المنظمات الإنسانية والمجتمعية.\n* أرباب الأسر والشباب الراغبون في تعزيز مهارات السلامة العامة.`,
    status: 'published',
    deleteState: false,
    viewsCount: 165,
    applicantsCount: 50,
  },
  {
    title: 'دبلوم تصميم الهوية البصرية والجرافيك الإعلاني (Adobe Illustrator & Photoshop)',
    summary: 'تعلم أسس التصميم الجرافيكي الاحترافي، ابتكار الهويات البصرية للشركات، وتصميم الإعلانات الرقمية ومطبوعات الحملات الإنسانية والتجارية.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب - معرة مصرين',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'معرة مصرين',
      addressText: 'مكتب مسار الشبابي - جانب مبنى البريد',
    },
    providingEntity: {
      organizationId: orgMap['فريق مسار للتأهيل الرقمي'],
      name: 'فريق مسار للتأهيل الرقمي',
      logo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: false,
      cost: 20,
      currency: 'USD',
      stipendProvided: false,
    },
    ageEligibility: { start: 16, end: 32 },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-18'),
      endDate: new Date('2026-12-28'),
      registrationDeadline: new Date('2026-11-14'),
      durationHours: 45,
      sessionsCount: 15,
      daysOfWeek: ['السبت', 'الإثنين', 'الأربعاء'],
      timeSlot: '02:00 م - 05:00 م',
    },
    topics: [
      'مبادئ التصميم الأكاديمية ونظرية الألوان والخطوط (Typography)',
      'Adobe Illustrator: رسم الشعارات والرسومات المتجهية بدقة',
      'Adobe Photoshop: المعالجة المتقدمة للصور والدمج السريالي',
      'تصميم بوسترات السوشيال ميديا وحملات التوعية',
      'صناعة أدلة الهوية البصرية الكاملة (Brand Book)',
      'تجهيز التصاميم للطباعة الفنية والأوفست والمطبوعات التجارية',
      'بناء بروفايل احترافي على موقع Behance لتسويق الخدمات',
    ],
    requirements: [
      'حاسوب محمول بمواصفات متوسطة لتشغيل حزمة Adobe',
      'حس فني وشغف بالعمل الإبداعي والتصميم',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'توجيه المستفيدين لكيفية الحصول على أول عميل عبر منصات العمل الحر والتواصل الاجتماعي.',
    links: ['https://forms.gle/masar-graphic-idlib-2026'],
    keys: ['تصميم', 'جرافيك', 'فوتوشوب', 'إليستريتور', 'معرة مصرين', 'إدلب', 'هوية بصرية', 'فريلانس', 'أدوبي'],
    context: `### عن الدبلوم\nالتصميم الجرافيكي لم يعد مجرد هواية، بل هو أحد أكثر المسارات طلباً من قبل المنظمات والشركات التجارية والمطابع في إدلب. صُمم هذا الدبلوم ليأخذ المتدرب من الصفر حتى مرحلة الاحتراف الكامل.\n\n---\n\n### ماذا ستتعلم في الجانب العملي؟\n* ابتكار أفكار الشعارات (Brainstorming & Sketching).\n* تحويل الرسومات اليدوية إلى شعارات رقمية متكاملة.\n* تطبيق التصاميم على موك اب (Mockups) واقعية لعرضها على العملاء.\n* تسعير خدمات التصميم وكتابة العقود البسيطة مع العملاء.`,
    status: 'published',
    deleteState: false,
    viewsCount: 195,
    applicantsCount: 41,
  },
  {
    title: 'البرنامج التطبيقي في المحاسبة المالية ونظام الأمين للمحاسبة والمستودعات',
    summary: 'تأهيل المحاسبين والخرجين الجدد على الدورة المحاسبية الكاملة، إعداد القيود والتسويات، واستخدام برنامج الأمين للمحاسبة المعتمد في الشركات والمؤسسات السورية.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب المدينة - شارع الجلاء',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'شارع الجلاء',
      addressText: 'معهد الرواد - مقابل مصرف التسليف - بناء الرواد الطابق الثاني',
    },
    providingEntity: {
      organizationId: orgMap['معهد الرواد للعلوم واللغات'],
      name: 'معهد الرواد للعلوم واللغات',
      logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: false,
      cost: 25,
      currency: 'USD',
      stipendProvided: false,
    },
    ageEligibility: { start: 19, end: 45 },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-16'),
      endDate: new Date('2026-12-20'),
      registrationDeadline: new Date('2026-11-12'),
      durationHours: 36,
      sessionsCount: 12,
      daysOfWeek: ['الأحد', 'الثلاثاء', 'الخميس'],
      timeSlot: '11:00 ص - 02:00 م',
    },
    topics: [
      'مراجعة القيود المحاسبية المعيارية وميزان المراجعة',
      'إنشاء الملف المالي وشجرة الحسابات على نظام الأمين',
      'حركات الصناديق والمصارف والقيود الافتتاحية والختامية',
      'إدارة المستودعات، الجرد الدوري والمستمر، وبطاقات المواد',
      'إعداد القوائم الختامية، الأرباح والخسائر، وقائمة المركز المالي',
      'التطبيقات العملية على شركات تجارية وخدمية حقيقية',
    ],
    requirements: [
      'خريج أو طالب في كليات الاقتصاد، التجارة، أو المعاهد المصرفية والإدارية',
      'الإلمام بمبادئ العمل على الحاسوب وبرنامج Microsoft Excel',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تزكية المتدربين المتفوقين للمؤسسات والشركات التجارية الراغبة في توظيف محاسبين.',
    links: ['https://forms.gle/alrowad-alameen-idlib-2026'],
    keys: ['محاسبة', 'برنامج الأمين', 'إدلب المدينة', 'الرواد', 'مالية', 'قوائم مالية', 'مستودعات', 'تدريب محاسبي'],
    context: `### أهمية هذا البرنامج\nيعد برنامج الأمين للمحاسبة والمستودعات البرنامج الأكثر انتشاراً واعتماداً لدى الشركات والمؤسسات والمنظمات المحلية في سوريا. يربط هذا التدريب بين الفهم النظري للمحاسبة والتطبيق العملي الرقمي المباشر.\n\n---\n\n### منهجية التعليم\nيقضي المتدرب أكثر من 80% من وقت الدورة في إدخال فواتير حقيقية، مطابقة كشوف حسابات بنكية، وإجراء الجرد، مما يمنحه ثقة فورية عند استلام أي وظيفة محاسبية.`,
    status: 'published',
    deleteState: false,
    viewsCount: 172,
    applicantsCount: 34,
  },
  {
    title: 'الدورة العملية في تركيب وصيانة منظومات الطاقة الشمسية والكهربائية (Solar PV)',
    summary: 'دورة فنية تطبيقية لتأهيل فنيي الطاقة البديلة، حساب استطاعات الألواح والبطاريات والإنفرترات، وتطبيق التوصيلات الآمنة على أنظمة On-Grid وOff-Grid.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب المدينة - حي الثورة',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'حي الثورة',
      addressText: 'المعهد التقني المهني - ورشة الكهرباء والطاقة',
    },
    providingEntity: {
      organizationId: orgMap['المعهد التقني المهني في إدلب'],
      name: 'المعهد التقني المهني في إدلب',
      logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: true,
      cost: 0,
      currency: 'USD',
      stipendProvided: false,
    },
    ageEligibility: { start: 18, end: 40 },
    nationalityEligibility: ['All'],
    genderEligibility: 'male',
    schedule: {
      startDate: new Date('2026-11-20'),
      endDate: new Date('2026-12-18'),
      registrationDeadline: new Date('2026-11-15'),
      durationHours: 40,
      sessionsCount: 10,
      daysOfWeek: ['السبت', 'الإثنين', 'الأربعاء'],
      timeSlot: '08:30 ص - 12:30 م',
    },
    topics: [
      'الإشعاع الشمسي وحساب زوايا ميل الألواح واتجاه الشمال والجنوب',
      'أنواع الألواح الشمسية ومواصفاتها الفنية (Mono vs Poly)',
      'الإنفرترات الشمسية الهجينة وضبط إعدادات الشحن MPPT',
      'توصيل وإدارة بطاريات الجل والأنظمة الحديثة لبطاريات الليثيوم LiFePO4',
      'حساب مقاطع الكابلات وحساب هبوط الجهد ومعاملات الأمان',
      'تأريض المنظومات وحمايتها من الصواعق وارتفاع الجهد',
      'فحص وكشف الأعطال وصيانة الأنظمة القائمة',
    ],
    requirements: [
      'معرفة أولية بأساسيات الكهرباء العامة والتيار المتناوب والمستمر',
      'الالتزام بقواعد السلامة المهنية وارتداء أحذية العمل العازلة أثناء الورشة',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تأهيل سريع للعمل الحر في تركيب المنظومات المنزلية والمزارع ومشاريع الآبار الارتوازية.',
    links: ['https://forms.gle/solar-pv-idlib-technical-2026'],
    keys: ['طاقة شمسية', 'كهرباء', 'إدلب', 'مهني', 'إنفرتر', 'بطاريات ليثيوم', 'تدريب حرفي', 'مجاني', 'طاقة بديلة'],
    context: `### واقع الطاقة في الشمال السوري\nتعتمد محافظة إدلب بشكل أساسي على الطاقة الشمسية لتأمين الكهرباء للمنازل، المشافي، والمصالح الزراعية والصناعية. هذا التدريب يركز على تلبية الحاجة الكبيرة لفنيين معتمدين يملكون المعرفة الهندسية السليمة لتفادي الأخطاء الشائعة وحرائق البطاريات.\n\n---\n\n### الجانب التطبيقي\n* تركيب هيكل معدني متكامل وتثبيت الألواح بالزوايا الصحيحة.\n* برمجة شاشات الإنفرتر ومطابقتها مع مواصفات بطاريات الليثيوم.\n* محاكاة أعطال وإجراء القياسات الميدانية.`,
    status: 'published',
    deleteState: false,
    viewsCount: 220,
    applicantsCount: 58,
  },
  {
    title: 'دورة اللغة الإنجليزية للمحادثة والأعمال (Business & Conversational English)',
    summary: 'برنامج تفاعلي لكسر حاجز الخوف من التحدث بالإنجليزية، إتقان صياغة الإيميلات والتقارير المهنية، وتدريب مكثف على أسئلة ومقابلات التوظيف لدى الوكالات الدولية.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب - سرمدا',
    locationType: 'hybrid',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'سرمدا',
      addressText: 'مركز آفاق للغات - شارع المصارف - بجانب المجمع التجاري',
    },
    providingEntity: {
      organizationId: orgMap['مركز آفاق للغات والترجمة'],
      name: 'مركز آفاق للغات والترجمة',
      logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: false,
      cost: 15,
      currency: 'USD',
      stipendProvided: false,
    },
    ageEligibility: { start: 18, end: 50 },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-22'),
      endDate: new Date('2026-12-25'),
      registrationDeadline: new Date('2026-11-18'),
      durationHours: 30,
      sessionsCount: 12,
      daysOfWeek: ['الأحد', 'الثلاثاء', 'الخميس'],
      timeSlot: '05:30 م - 07:30 م',
    },
    topics: [
      'كسر حاجز الخجل والحديث بطلاقة في مواضيع يومية ومهنية',
      'إتقان النطق السليم والقواعد الوظيفية في سياق الكلام',
      'كتابة المراسلات الرسمية والإيميلات الاحترافية (Professional Email Etiquette)',
      'المصطلحات الشائعة في بيئة المنظمات الدولية والمشاريع الإنسانية',
      'تقنية STAR للإجابة على الأسئلة السلوكية في مقابلات العمل',
      'محاكاة مقابلات عمل فردية وجماعية مع تقديم تقييم مباشر',
    ],
    requirements: [
      'مستوى ما قبل المتوسط (Pre-Intermediate / B1) كحد أدنى',
      'الاستعداد للمشاركة الفعالة في الحوارات والنقاشات الجماعية',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تطوير السيرة الذاتية (CV) باللغة الإنجليزية وتجهيز المتقدمين للمنافسة على الشواغر الوظيفية.',
    links: ['https://forms.gle/afaq-english-business-idlib-2026'],
    keys: ['لغة إنجليزية', 'محادثة', 'منظمات', 'مقابلات عمل', 'سرمدا', 'إدلب', 'آفاق', 'Business English', 'وظائف'],
    context: `### لماذا هذه الدورة؟\nتعد اللغة الإنجليزية الشرط الأساسي الأول للقبول في أكثر من 85% من الوظائف الشاغرة لدى المنظمات والجهات الإنسانية والدولية في إدلب. صممت هذه الدورة خصيصاً لتجاوز الجانب الأكاديمي والتركيز على لغة المحادثة وسوق العمل الفعلي.\n\n---\n\n### نظام الحصص\nتعتمد الجلسات على أسلوب الطاولة المستديرة (Round-Table Discussion)، وتبادل الأدوار (Role-Playing)، ونماذج مقابلات وظائف حقيقية تُجرى أسبوعياً.`,
    status: 'published',
    deleteState: false,
    viewsCount: 205,
    applicantsCount: 48,
  },
  {
    title: 'دبلوم تحليل البيانات والذكاء الاصطناعي للأعمال (Data Analysis & AI with Python & Power BI)',
    summary: 'مسار تأهيلي تطبيقي يجمع بين تحليل البيانات التجارية، تصميم لوحات القيادة التفاعلية بـ Power BI، واستخدام لغة Python وأدوات الذكاء الاصطناعي لاتخاذ القرارات الاستراتيجية في الشركات والمنظمات.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    location: 'إدلب المدينة - بالقرب من دوار الساعة',
    locationType: 'hybrid',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'شارع المحافظة',
      addressText: 'مركز إدلب للابتكار - بالقرب من دوار الساعة',
    },
    providingEntity: {
      organizationId: orgMap['مركز إدلب للابتكار وريادة الأعمال'],
      name: 'مركز إدلب للابتكار وريادة الأعمال',
      logo: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=200&auto=format&fit=crop&q=80',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: true,
      cost: 0,
      currency: 'USD',
      stipendProvided: true,
      stipendNote: 'منحة مجانية كاملة ممولة للشباب مع تقديم حزم إنترنت للمشاريع التطبيقية',
    },
    ageEligibility: { start: 20, end: 38 },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-25'),
      endDate: new Date('2027-01-15'),
      registrationDeadline: new Date('2026-11-20'),
      durationHours: 60,
      sessionsCount: 20,
      daysOfWeek: ['الأحد', 'الثلاثاء', 'الخميس'],
      timeSlot: '03:00 م - 06:00 م',
    },
    topics: [
      'أساسيات لغة Python وتحليل البيانات ومكتبات Pandas وNumPy',
      'تنظيف وتجهيز البيانات المعقدة (Data Cleaning & Wrangling)',
      'تصور البيانات المتقدم ورسم المخططات البيانية بـ Matplotlib وSeaborn',
      'بناء داشبوردات وتقارير تفاعلية على Microsoft Power BI',
      'تطبيقات ونماذج الذكاء الاصطناعي التوليدي في تحليل وتلخيص البيانات',
      'كتابة استعلامات SQL لاستخراج وتحليل بيانات قواعد البيانات العلائقية',
      'إنجاز مشروع تخرج حقيقي على بيانات إنسانية واقتصادية واقعية',
    ],
    requirements: [
      'معرفة جيدة بمفاهيم برنامج Microsoft Excel والتعامل مع الجداول',
      'حاسوب شخصي بمواصفات جيدة لتثبيت بيئات العمل وأدوات التحليل',
      'الالتزام بالحضور وتقديم التكاليف الأسبوعية بنسبة 85% كحد أدنى',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'توصية مباشرة لخريجي البرنامج لدى أقسام إدارة البيانات (IM) وتقييم المشروعات (MEAL) بالمنظمات والشركات.',
    links: ['https://forms.gle/idlib-data-ai-diploma-2026'],
    keys: ['بيانات', 'ذكاء اصطناعي', 'بايثون', 'Power BI', 'إدلب', 'Data Analysis', 'Python', 'منظمات', 'تحليل بيانات', 'مجاني'],
    context: `### لماذا يعتبر هذا الدبلوم الأهم في سوق اليوم؟\nيشهد قطاع العمل في إدلب والشمال السوري، سواء لدى المنظمات الدولية أو الشركات التجارية، طلباً غير مسبوق على محللي البيانات ومديري نظم المعلومات (Information Management Officers). صمم هذا البرنامج ليردم الهوة بين النظرية والتطبيق الفعلي.\n\n---\n\n### البيئة التطبيقية والأدوات المستخدمة:\n* **Python & Jupyter Notebooks:** لمعالجة كميات البيانات الضخمة وأتمتة المهام المتكررة.\n* **Microsoft Power BI:** لإنشاء لوحات قيادة بصرية تفاعلية تفيد صانعي القرار.\n* **نماذج الذكاء الاصطناعي:** لكتابة الأكواد والتحليل الإحصائي السريع واستخلاص النتائج.\n\n---\n\n### نظام التدريب والدعم المستمر\nيقام التدريب بنظام هجين (حضور في قاعة مجهزة بأجهزة حديثة في مركز إدلب للابتكار + جلسات دعم فني أونلاين عبر مجتمع Slack مخصص للمشاركين للإجابة على الأسئلة على مدار الأسبوع).`,
    status: 'published',
    deleteState: false,
    viewsCount: 245,
    applicantsCount: 68,
  },
];

const SEED_SLIDERS = [
  {
    title: 'بوابتك الأولى للتدريبات والفرص المهنية في إدلب',
    subtitle: 'اكتشف أحدث البرامج التدريبية المدعومة والمجانية في مجالات البرمجة، إدارة المشاريع، والمهن الواعدة في الشمال السوري.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
    badge: 'فرص تدريبية جديدة 2026',
    link: '/courses',
    buttonText: 'تصفح كل الدورات المتاحة',
    order: 1,
    isActive: true,
  },
  {
    title: 'مسارات البرمجة والذكاء الاصطناعي لسوق العمل الحر',
    subtitle: 'دبلومات احترافية في تطوير الويب الحديث وعلوم البيانات تمكنك من العمل عن بعد مع شركات إقليمية ودولية.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&auto=format&fit=crop&q=80',
    badge: 'مسار تقني متقدم',
    link: '/courses',
    buttonText: 'استكشف الدورات التقنية',
    order: 2,
    isActive: true,
  },
  {
    title: 'شراكات استراتيجية مع كبرى المنظمات والمعاهد المعتمدة',
    subtitle: 'نوفر بيئة موثوقة تجمع الطلاب والمراكز في إدلب وسرمدا والدانا مع شهادات معتمدة وفرص تدريب ميدانية.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80',
    badge: 'شراكات موثوقة',
    link: '/center',
    buttonText: 'دليل المراكز الشريكة',
    order: 3,
    isActive: true,
  },
];

const SEED_SECTIONS = [
  {
    name: 'تكنولوجيا وبرمجة',
    slug: 'programming',
    description: 'تطوير واجهات وتطبيقات الويب، لغات البرمجة الحديثة، والذكاء الاصطناعي',
    icon: 'Code',
    order: 1,
    isActive: true,
    featured: true,
  },
  {
    name: 'إدارة مشاريع ومنظمات إنسانية',
    slug: 'project-management',
    description: 'معايير PMD Pro، الرصد والتقييم، وكتابة مقترحات المشاريع التنموية',
    icon: 'Briefcase',
    order: 2,
    isActive: true,
    featured: true,
  },
  {
    name: 'مهن وحرف تقنية',
    slug: 'vocational',
    description: 'صيانة وبرمجة الهواتف الذكية، الطاقة الشمسية البديلة، والتمديدات الكهربائية',
    icon: 'Wrench',
    order: 3,
    isActive: true,
    featured: true,
  },
  {
    name: 'تحليل بيانات وذكاء اصطناعي',
    slug: 'data-ai',
    description: 'علوم البيانات، لغة Python، وأدوات Microsoft Power BI للأعمال',
    icon: 'BarChart3',
    order: 4,
    isActive: true,
    featured: true,
  },
  {
    name: 'تصميم وفنون رقمية',
    slug: 'design',
    description: 'تصميم الهويات البصرية، الجرافيك الإعلاني، وبرامج Adobe الاحترافية',
    icon: 'Palette',
    order: 5,
    isActive: true,
    featured: true,
  },
  {
    name: 'محاسبة ومالية',
    slug: 'accounting',
    description: 'برنامج الأمين للمحاسبة والمستودعات، مسك الدفاتر، وإعداد القوائم الختامية',
    icon: 'Calculator',
    order: 6,
    isActive: true,
    featured: true,
  },
  {
    name: 'لغات وترجمة',
    slug: 'languages',
    description: 'اللغة الإنجليزية للمحادثة والأعمال، والتحضير لمقابلات التوظيف الدولية',
    icon: 'Languages',
    order: 7,
    isActive: true,
    featured: true,
  },
  {
    name: 'صحة وإسعافات أولية',
    slug: 'healthcare',
    description: 'الإسعافات الأولية الميدانية، إنقاذ الأرواح، والتثقيف الصحي المجتمعي',
    icon: 'HeartPulse',
    order: 8,
    isActive: true,
    featured: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const orgMap: Record<string, any> = {};
    for (const org of SEED_ORGANIZATIONS) {
      const existing = await Organization.findOne({ name: org.name });
      if (existing) {
        await Organization.updateOne({ _id: existing._id }, { $set: org });
        orgMap[org.name] = existing._id;
      } else {
        const created = await Organization.create(org);
        orgMap[org.name] = created._id;
      }
    }

    const coursesList = createCourses(orgMap);
    let seededCount = 0;

    for (const course of coursesList) {
      const existing = await Course.findOne({ title: course.title });
      if (existing) {
        await Course.updateOne({ _id: existing._id }, { $set: course });
      } else {
        await Course.create(course);
      }
      seededCount++;
    }

    // Seed Sliders
    for (const slider of SEED_SLIDERS) {
      const existing = await Slider.findOne({ title: slider.title });
      if (existing) {
        await Slider.updateOne({ _id: existing._id }, { $set: slider });
      } else {
        await Slider.create(slider);
      }
    }

    // Seed Sections
    for (const section of SEED_SECTIONS) {
      const existing = await Section.findOne({ slug: section.slug });
      if (existing) {
        await Section.updateOne({ _id: existing._id }, { $set: section });
      } else {
        await Section.create(section);
      }
    }

    // Seed Admin User
    const adminEmail = 'admin@dolean.com';
    const adminPassword = 'AdminPassword123';
    const hashedPassword = await hashPassword(adminPassword);

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      await User.updateOne(
        { _id: existingAdmin._id },
        {
          $set: {
            password: hashedPassword,
            roles: ['admin', 'super_admin'],
            role: 'admin',
            isVerified: true,
            deleteState: false,
          },
        }
      );
    } else {
      await User.create({
        name: 'مدير المنصة (Admin)',
        email: adminEmail,
        phone: '+963951000000',
        password: hashedPassword,
        roles: ['admin', 'super_admin'],
        role: 'admin',
        isVerified: true,
        deleteState: false,
      });
    }

    const totalCourses = await Course.countDocuments({ deleteState: { $ne: true } });
    const totalOrgs = await Organization.countDocuments({ deleteState: { $ne: true } });
    const totalUsers = await User.countDocuments({ deleteState: { $ne: true } });
    const totalSliders = await Slider.countDocuments({ deleteState: { $ne: true } });
    const totalSections = await Section.countDocuments({ deleteState: { $ne: true } });

    return NextResponse.json({
      success: true,
      message: 'تم إدخال وتحديث تدريبات ومراكز وسلايدرات وأقسام وحساب إدارة إدلب بنجاح',
      seededCount,
      totalCoursesInDB: totalCourses,
      totalOrgsInDB: totalOrgs,
      totalSlidersInDB: totalSliders,
      totalSectionsInDB: totalSections,
      totalUsersInDB: totalUsers,
      adminCredentials: {
        email: adminEmail,
        password: adminPassword,
      },
    });
  } catch (error: any) {
    console.error('Seed API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'فشلت عملية الـ Seed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

