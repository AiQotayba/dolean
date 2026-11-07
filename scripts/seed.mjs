import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Target URIs
const ENV_URI = process.env.MONGODB_URI;
const LOCAL_URI = 'mongodb://127.0.0.1:27017/dolean';

export const ORGANIZATIONS_DATA = [
  {
    name: 'ستارت آب سيريا (Startup Syria)',
    legalName: 'Startup Syria Foundation for Entrepreneurship',
    orgType: 'initiative',
    logo: '/images/events/startup_syria_logo.png',
    coverImage: '/images/events/gew_makers_exhibition.jpg',
    description: 'المظلة والمبادرة الرائدة لدعم بيئة ريادة الأعمال والشركات الناشئة في سوريا، والمُنظم الرسمي لفعاليات الأسبوع العالمي لريادة الأعمال (GEW) في إدلب.',
    website: 'https://startupsyria.org',
    contactEmail: 'info@startupsyria.org',
    contactPhone: '+963951234500',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'إدلب المدينة',
      street: 'شارع الجلاء - مجمع ريادة الأعمال',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'الأسبوع العالمي لريادة الأعمال – سوريا (GEW Syria)',
    legalName: 'Global Entrepreneurship Week Syria',
    orgType: 'initiative',
    logo: '/images/events/gew_syria_logo.png',
    coverImage: '/images/events/gew_syria_entrepreneurship.jpg',
    description: 'الحدث السنوي الأكبر للاحتفاء بالمبتكرين وأصحاب المشاريع والشركات الناشئة، وبناء شراكات حقيقية وتوفير ورشات العمل التطبيقية ومساحات التشبيك في إدلب.',
    website: 'https://startupsyria.org/gew/2026',
    contactEmail: 'gew@startupsyria.org',
    contactPhone: '+963951234501',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'إدلب المدينة',
      street: 'المركز الثقافي في إدلب',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'مديرية التدريب والتأهيل – جامعة إدلب',
    legalName: 'Directorate of Training and Qualification – Idlib University',
    orgType: 'university',
    logo: '/images/centers/idlib_university_logo.jpg',
    coverImage: '/images/centers/idlib_university_cover.jpg',
    description: 'الجهة الأكاديمية الرسمية التابعة لجامعة إدلب المسؤولة عن تنظيم الدورات المهنية والتقنية وبرامج التمريض ورخص قيادة الحاسوب لطلاب الجامعة والمجتمع المحلي.',
    website: 'https://idlib.university/',
    contactEmail: 'training@idlib.university',
    contactPhone: '+963945129218',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'إدلب المدينة',
      street: 'مقر مديرية التدريب - مقابل كلية الهندسة المعلوماتية',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'المعهد الاستشاري للغات – جامعة إدلب',
    legalName: 'Consulting Institute for Languages – Idlib University',
    orgType: 'university',
    logo: '/images/centers/afaq_logo.jpg',
    coverImage: '/images/centers/afaq_cover.jpg',
    description: 'المعهد التخصصي لتعليم اللغات الحية في جامعة إدلب، يقدم دورات اللغة الإنجليزية بمستوياتها المتعددة والترجمة للطلاب والكوادر المهنية.',
    website: 'https://idlib.university/',
    contactEmail: 'languages@idlib.university',
    contactPhone: '+963945129220',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'إدلب المدينة',
      street: 'مبنى المعاهد الجامعية - جامعة إدلب',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'أكشن فور هيومانيتي (Action for Humanity)',
    legalName: 'Action for Humanity Syria',
    orgType: 'ngo',
    logo: '/images/events/action_for_humanity_logo.png',
    coverImage: '/images/centers/violet_cover.jpg',
    description: 'منظمة تنموية إنسانية شريكة في إدلب تعنى ببرامج تمكين الشباب، سبل العيش، ودعم المبادرات والمشاريع الريادية والمجتمعية.',
    website: 'https://actionforhumanity.org',
    contactEmail: 'syria@actionforhumanity.org',
    contactPhone: '+963951234502',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'شارع الثلاثين',
      street: 'المكتب الإقليمي - شارع الثلاثين',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'شؤون الشباب (Youth Affairs)',
    legalName: 'Youth Affairs Directorate - Idlib',
    orgType: 'governmental',
    logo: '/images/events/youth_affairs_logo.png',
    coverImage: '/images/events/gew_makers_exhibition.jpg',
    description: 'الشريك المؤسسي الراعي للمبادرات الشبابية في إدلب، يوفر المساحات والمراكز والورشات لتمكين الشباب وتنمية قدراتهم الريادية.',
    website: '',
    contactEmail: 'youth.idlib@gmail.com',
    contactPhone: '+963951234503',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'إدلب المدينة',
      street: 'بجانب المجمع الثقافي',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'منظمة أنقذوا الأطفال (Save the Children)',
    legalName: 'Save the Children International',
    orgType: 'ngo',
    logo: '/images/events/save_the_children_logo.png',
    coverImage: '/images/centers/shafak_cover.jpg',
    description: 'منظمة دولية رائدة شريكة في إدلب تعمل على برامج حماية وتمكين اليافعين والشباب، وتأهيلهم لسوق العمل والتطوير المهني.',
    website: 'https://savethechildren.org',
    contactEmail: 'syria.info@savethechildren.org',
    contactPhone: '+963951234504',
    address: {
      country: 'سوريا',
      city: 'إدلب',
      district: 'حي الجامعة',
      street: 'المركز المجتمعي لدعم الشباب',
    },
    isVerified: true,
    deleteState: false,
  },
  {
    name: 'منظمة بنفسج (Violet Organization)',
    legalName: 'Violet Organization for Relief and Development',
    orgType: 'ngo',
    logo: '/images/centers/violet_logo.jpg',
    coverImage: '/images/centers/violet_cover.jpg',
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
    logo: '/images/centers/techzone_logo.jpg',
    coverImage: '/images/centers/techzone_cover.jpg',
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
    logo: '/images/centers/khatwa_logo.jpg',
    coverImage: '/images/centers/khatwa_cover.jpg',
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
    logo: '/images/centers/shafak_logo.jpg',
    coverImage: '/images/centers/shafak_cover.jpg',
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
    logo: '/images/centers/masar_logo.jpg',
    coverImage: '/images/centers/masar_cover.jpg',
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
    logo: '/images/centers/rowad_logo.jpg',
    coverImage: '/images/centers/rowad_cover.jpg',
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
    logo: '/images/centers/technical_institute_logo.jpg',
    coverImage: '/images/centers/technical_institute_cover.jpg',
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
    name: 'مركز إدلب للابتكار وريادة الأعمال',
    legalName: 'Idlib Innovation and Entrepreneurship Hub',
    orgType: 'initiative',
    logo: '/images/centers/innovation_hub_logo.jpg',
    coverImage: '/images/centers/innovation_hub_cover.jpg',
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

export const getCoursesData = (orgMap) => [
  // ==========================================
  // 1. فعاليات الأسبوع العالمي لريادة الأعمال – إدلب (بيانات الإعلان الحقيقية)
  // ==========================================
  {
    title: 'معرض صُنّاع الريادة – الأسبوع العالمي لريادة الأعمال في إدلب',
    summary: 'معرض ريادي يضم مشاريع ناشئة ومبتكرة، ومساحة واسعة للتشبيك بين أصحاب المشاريع والمؤسسات الداعمة، وجلسات تفاعلية حية.',
    image: '/images/events/gew_makers_exhibition.jpg',
    location: 'إدلب المدينة - المركز الثقافي',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'مقر المركز الثقافي في إدلب - الصالة الرئيسية',
    },
    providingEntity: {
      organizationId: orgMap['ستارت آب سيريا (Startup Syria)'],
      name: 'ستارت آب سيريا (Startup Syria)',
      logo: '/images/events/startup_syria_logo.png',
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
      stipendNote: 'الدخول وحجز المساحة للمشاريع مجاني بالكامل بدعم من الشركاء',
    },
    ageEligibility: {
      start: 18,
      end: 45,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-01'),
      registrationDeadline: new Date('2026-10-31'),
      durationHours: 8,
      sessionsCount: 1,
      daysOfWeek: ['الأحد'],
      timeSlot: '09:00 ص - 05:00 م',
    },
    topics: [
      'عرض المشاريع الناشئة والابتكارات المحلية في الشمال السوري',
      'مساحة مخصصة للتشبيك مع الصناديق والمؤسسات والجهات الداعمة',
      'جلسات حوارية تفاعلية حول تحويل الأفكار إلى شركات رابحة',
      'فرص الحصول على احتضان وتوجيه وإرشاد أعمال (Mentorship)',
    ],
    requirements: [
      'امتلاك فكرة مشروع ريادي ناشئ أو منتج أولي (MVP)',
      'التسجيل المسبق عبر استمارة المشاريع أو استمارة التشبيك',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تشبيك مباشر مع مستثمرين وحاضنات أعمال وجهات تمويلية.',
    links: [
      'https://startupsyria.org/gew/2026/events/meetup-ffb81680-145d-4c7c-97e8-1fe6e97b6d92',
      'https://docs.google.com/forms/d/e/1FAIpQLSeh4DjOBIAPt6wlJnj_1uFvTx8dpRl6DaVKABmYEW2beVkihA/viewform',
    ],
    keys: ['ريادة أعمال', 'إدلب', 'معرض', 'GEW2026', 'Startup Syria', 'تشبيك', 'مشاريع ناشئة', 'مجاني'],
    context: `### عن معرض صُنّاع الريادة
يمثل معرض صُنّاع الريادة المحطة الأهم لرواد الأعمال والمبتكرين في محافظة إدلب خلال الأسبوع العالمي لريادة الأعمال (GEW). يهدف المعرض إلى إبراز الطاقات الإبداعية لدى الشباب السوري وتوفير جسر تواصل مباشر بينهم وبين الجهات الداعمة والمستثمرين.

---

### مسارات المعرض:
1. **جناح المشاريع الناشئة:** منصات عرض تفاعلية لأصحاب المشاريع لعرض خدماتهم ونماذجهم الأولية.
2. **مساحة التشبيك (Networking Hub):** لقاءات مباشرة مع المؤسسات الإنسانية والتنموية ورجال الأعمال.
3. **الجلسات الحوارية السريعة:** نقاشات مع رواد أعمال نجحوا في الانطلاق من الداخل السوري.`,
    status: 'published',
    deleteState: false,
    viewsCount: 310,
    applicantsCount: 75,
  },
  {
    title: 'الذكاء الاصطناعي لرائد الأعمال – ورشة تطبيقية لإطلاق وتسريع المشاريع',
    summary: 'جلسة تدريبية وتطبيقية حول توظيف أدوات ونماذج الذكاء الاصطناعي في إدارة الأعمال، كتابة خطط العمل، وتطوير المنتجات الرقمية.',
    image: '/images/events/gew_ai_entrepreneurs.jpg',
    location: 'إدلب المدينة - المركز الثقافي',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'المركز الثقافي في إدلب - قاعة التدريب والورشات',
    },
    providingEntity: {
      organizationId: orgMap['ستارت آب سيريا (Startup Syria)'],
      name: 'ستارت آب سيريا (Startup Syria)',
      logo: '/images/events/startup_syria_logo.png',
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
    ageEligibility: {
      start: 18,
      end: 45,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-01'),
      registrationDeadline: new Date('2026-10-31'),
      durationHours: 4,
      sessionsCount: 1,
      daysOfWeek: ['الأحد'],
      timeSlot: '01:00 م - 05:00 م',
    },
    topics: [
      'استخدام النماذج اللغوية (LLMs) في صياغة دراسات الجدوى وخطط العمل',
      'توليد المحتوى التسويقي وبناء الهوية البصرية باستخدام الذكاء الاصطناعي',
      'أتمتة خدمة العملاء والرد الآلي في المتاجر والشركات الناشئة',
      'أدوات توفير التكاليف التشغيلية للمشاريع في بيئات الموارد المحدودة',
    ],
    requirements: [
      'حاسوب محمول أو هاتف ذكي لمتابعة التطبيقات الحية',
      'الاهتمام بتأسيس أو تطوير مشروع ناشئ',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تأهيل الرياديين للعمل بكفاءة وسرعة تنافس الشركات العالمية.',
    links: [
      'https://startupsyria.org/gew/2026/events/meetup-29d2bba7-e155-45e4-8ec0-c970e2dd2b4c',
    ],
    keys: ['ذكاء اصطناعي', 'ريادة أعمال', 'إدلب', 'Startup Syria', 'أتمتة', 'تسويق', 'مجاني'],
    context: `### أهداف الورشة
صُممت هذه الورشة لتمكين رواد الأعمال وأصحاب المشاريع في إدلب من استغلال طفرة الذكاء الاصطناعي التوليدي لتعويض نقص الموارد البشرية والمالية، وإنجاز مهام تتطلب فرق عمل كاملة بكبسة زر وبأعلى احترافية.`,
    status: 'published',
    deleteState: false,
    viewsCount: 280,
    applicantsCount: 64,
  },
  {
    title: 'ريادة الأعمال النسائية: بين الطموح وتحديات الواقع',
    summary: 'جلسة حوارية وتدريبية لتمكين المرأة الريادية في إدلب، استعراض قصص نجاح نسائية رائدة، ومناقشة الحلول العملية للتحديات الاقتصادية.',
    image: '/images/events/gew_women_entrepreneurship.jpg',
    location: 'إدلب المدينة - المركز الثقافي',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'المركز الثقافي في إدلب - قاعة الحوارات',
    },
    providingEntity: {
      organizationId: orgMap['شؤون الشباب (Youth Affairs)'],
      name: 'شؤون الشباب (Youth Affairs)',
      logo: '/images/events/youth_affairs_logo.png',
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
    ageEligibility: {
      start: 18,
      end: 50,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'female',
    schedule: {
      startDate: new Date('2026-11-02'),
      endDate: new Date('2026-11-02'),
      registrationDeadline: new Date('2026-11-01'),
      durationHours: 4,
      sessionsCount: 1,
      daysOfWeek: ['الإثنين'],
      timeSlot: '10:00 ص - 02:00 م',
    },
    topics: [
      'قصص نجاح ملهمة لسيدات سوريات أسسن مشاريع رائدة من إدلب',
      'تحديات الوصول للتمويل وبناء الشبكات المهنية والحلول البديلة',
      'المشاريع المنزلية والرقمية والوصول إلى الأسواق الإقليمية',
      'بناء مسارات دعم وتمكين مستدامة للمرأة في الشمال السوري',
    ],
    requirements: [
      'مفتوح لجميع السيدات والفتيات صاحبات المشاريع أو الأفكار الريادية',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'إتاحة قنوات تواصل مع حاضنات ومبادرات دعم رائدات الأعمال.',
    links: [
      'https://startupsyria.org/gew/2026/events/meetup-0696d7db-eaf8-4992-9367-da2a91f36941',
    ],
    keys: ['ريادة نسائية', 'سيدات أعمال', 'إدلب', 'شؤون الشباب', 'تمكين المرأة', 'مجاني'],
    context: `### محاور الجلسة
جلسة نوعية تناقش بشكل واقعي وصريح التحديات اليومية التي تواجه رائدات الأعمال في إدلب والشمال السوري، وتبحث سبل تذليل العقبات وتوسيع نطاق المشاريع المحلية والمنزلية لتصبح شركات مستدامة ومؤثرة.`,
    status: 'published',
    deleteState: false,
    viewsCount: 240,
    applicantsCount: 52,
  },
  {
    title: 'كيف يصنع رائد الأعمال فرصه عبر LinkedIn؟ ورشة احترافية',
    summary: 'ورشة عملية لاحتراف منصة لينكد إن (LinkedIn)، بناء العلامة التجارية الشخصية، واستقطاب الشراكات والتمويل والفرص المهنية الدولية.',
    image: '/images/events/gew_linkedin_networking.jpg',
    location: 'إدلب المدينة - المركز الثقافي',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'المركز الثقافي في إدلب - مختبر التدريب الرقمي',
    },
    providingEntity: {
      organizationId: orgMap['ستارت آب سيريا (Startup Syria)'],
      name: 'ستارت آب سيريا (Startup Syria)',
      logo: '/images/events/startup_syria_logo.png',
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
    ageEligibility: {
      start: 18,
      end: 45,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-02'),
      endDate: new Date('2026-11-02'),
      registrationDeadline: new Date('2026-11-01'),
      durationHours: 4,
      sessionsCount: 1,
      daysOfWeek: ['الإثنين'],
      timeSlot: '02:00 م - 06:00 م',
    },
    topics: [
      'تهيئة الملف الشخصي (All-Star Profile) للظهور في محركات البحث',
      'كتابة ونشر المحتوى المهني الجذاب وصناعة السمعة الرقمية',
      'استراتيجيات التواصل البارد (Cold Outreach) مع المستثمرين والمؤسسين',
      'استخدام خوارزميات LinkedIn لبناء شبكة علاقات دولية قوية',
    ],
    requirements: [
      'وجود حساب نشط على منصة LinkedIn وحاسوب شخصي أو هاتف ذكي للتطبيق',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'توسيع دائرة العلاقات والوصول إلى عقود ومشاريع عن بُعد.',
    links: [
      'https://startupsyria.org/gew/2026/events/meetup-955fed8b-5f00-4f70-afd6-00d6d0578214',
    ],
    keys: ['لينكد إن', 'LinkedIn', 'ريادة أعمال', 'إدلب', 'علاقات مهنية', 'عمل حر', 'Startup Syria', 'مجاني'],
    context: `### لماذا هذه الورشة؟
تعد منصة LinkedIn النافذة الكبرى لرواد الأعمال في الشمال السوري للوصول إلى العالم الخارجي وتجاوز القيود الجغرافية. تركز هذه الورشة على التطبيق العملي المباشر لتحويل الحسابات الشخصية إلى مغناطيس للفرص والشراكات.`,
    status: 'published',
    deleteState: false,
    viewsCount: 265,
    applicantsCount: 59,
  },
  {
    title: 'ريادة الأعمال في سورية بين الطموح والواقع والأوهام',
    summary: 'جلسة حوارية موسعة في مدرج المركز الثقافي بإدلب تجمع نخبة من الخبراء والمؤسسين لمناقشة واقع بيئة الأعمال وتحديات السوق والفرص المستقبلية.',
    image: '/images/events/gew_syria_entrepreneurship.jpg',
    location: 'إدلب المدينة - مدرج المركز الثقافي',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'مدرج المركز الثقافي الرئيسي بإدلب',
    },
    providingEntity: {
      organizationId: orgMap['الأسبوع العالمي لريادة الأعمال – سوريا (GEW Syria)'],
      name: 'الأسبوع العالمي لريادة الأعمال – سوريا (GEW Syria)',
      logo: '/images/events/gew_syria_logo.png',
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
    ageEligibility: {
      start: 18,
      end: 60,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-03'),
      endDate: new Date('2026-11-03'),
      registrationDeadline: new Date('2026-11-02'),
      durationHours: 4,
      sessionsCount: 1,
      daysOfWeek: ['الثلاثاء'],
      timeSlot: '01:00 م - 05:00 م',
    },
    topics: [
      'تحليل واقع السوق المحلي والقوة الشرائية في الشمال السوري',
      'أوهام ريادة الأعمال الشائعة وفخاخ المشاريع المقلدة',
      'القطاعات الاقتصادية الواعدة ذات الجدوى الحقيقية',
      'رسم خارطة طريق للمنظومة الريادية في سوريا للسنوات القادمة',
    ],
    requirements: [
      'الدعوة عامة لرواد الأعمال، الطلاب، الباحثين، وأصحاب المصالح التجارية',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'توسيع الأفق الاستراتيجي للمشاريع وتفادي التعثر المالي.',
    links: [
      'https://startupsyria.org/gew/2026/events/meetup-2965c37f-a83d-44f0-9819-21c4f505b5cb',
    ],
    keys: ['ريادة أعمال', 'إدلب', 'جلسة حوارية', 'GEW Syria', 'المركز الثقافي', 'اقتصاد', 'مجاني'],
    context: `### الجلسة الختامية لـ GEW إدلب 2026
تضع هذه الجلسة النقاط على الحروف في المشهد الريادي السوري، وتبتعد عن التنظير لتقدم رؤية واقعية وصادقة للمؤسسين حول كيفية الصمود والنمو في ظل الظروف الاستثنائية التي تعيشها المنطقة.`,
    status: 'published',
    deleteState: false,
    viewsCount: 330,
    applicantsCount: 88,
  },

  // ==========================================
  // 2. إعلانات جامعة إدلب الرسمية المعتمدة 2026
  // ==========================================
  {
    title: 'رخصة قيادة الحاسب الآلي ICDL – C92',
    summary: 'دورة تدريبية تأسيسية في مهارات الحاسوب وتطبيقات Office والإنترنت بإشراف مديرية التدريب والتأهيل بجامعة إدلب.',
    image: '/images/courses/icdl_computer.jpg',
    location: 'إدلب المدينة - مقابل كلية الهندسة المعلوماتية',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'مقر مديرية التدريب والتأهيل - مقابل كلية الهندسة المعلوماتية',
    },
    providingEntity: {
      organizationId: orgMap['مديرية التدريب والتأهيل – جامعة إدلب'],
      name: 'مديرية التدريب والتأهيل – جامعة إدلب',
      logo: '/images/centers/idlib_university_logo.jpg',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: false,
      cost: 1,
      currency: 'USD',
      stipendProvided: false,
      stipendNote: '2700 ليرة سورية جديدة + 17 ليرة رسوم طوابع (رسوم رمزية جامعية)',
    },
    ageEligibility: {
      start: 17,
      end: 50,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-05'),
      endDate: new Date('2026-12-10'),
      registrationDeadline: new Date('2026-11-03'),
      durationHours: 40,
      sessionsCount: 15,
      daysOfWeek: ['الأحد', 'الثلاثاء', 'الخميس'],
      timeSlot: '01:00 م - 03:00 م',
    },
    topics: [
      'مفاهيم تقنية المعلومات ونظام التشغيل Windows 10',
      'معالجة النصوص وتنسيق التقارير الرسمية عبر Microsoft Word 2019',
      'الجداول الإلكترونية والحسابات الرياضية بـ Microsoft Excel 2019',
      'تصميم العروض التقديمية بـ Microsoft PowerPoint 2019',
      'استخدام الإنترنت والمراسلات الإلكترونية الآمنة',
    ],
    requirements: [
      'مفتوح للطلاب والخريجين وجميع الراغبين في امتلاك أساسيات الحاسوب والإنترنت',
      'المدرب المعتمد: أ. محمود داكل',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'شهادة ICDL الرسمية المعتمدة من جامعة إدلب تمنح ميزة تنافسية للتقديم للوظائف.',
    links: [
      'https://chat.whatsapp.com/KEH0iBJDPnAKVnFzzMfSWv',
      'https://www.schoolandcollegelistings.com/SY/Idlib/493911341110746/مديرية-التدريب-والتأهيل---جامعة-إدلب',
    ],
    keys: ['ICDL', 'جامعة إدلب', 'حاسوب', 'أوفيس', 'Word', 'Excel', 'إدلب المدينة', 'رخصة حاسب'],
    context: `### الإعلان الرسمي للدورة
تعلن مديرية التدريب والتأهيل في جامعة إدلب عن افتتاح التسجيل في دورة رخصة قيادة الحاسوب الدولية ICDL - الكود C92، والتي تشمل التدريب العملي المباشر في مخابر الجامعة على حزمة أوفيس الحديثة تحت إشراف المدرب أ. محمود داكل. تبدأ الدورة فور اكتمال العدد المقرر.`,
    status: 'published',
    deleteState: false,
    viewsCount: 215,
    applicantsCount: 42,
  },
  {
    title: 'إكسل متقدم Excel Advanced-8 – جامعة إدلب',
    summary: 'تدريب متقدم على تحليل البيانات والدوال المعقدة والجداول المحورية وتصميم التقارير ولوحات المعلومات (Dashboards) باستخدام Excel.',
    image: '/images/courses/excel_advanced.jpg',
    location: 'إدلب المدينة - مقابل كلية الهندسة المعلوماتية',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'مخابر مديرية التدريب والتأهيل - مقابل كلية الهندسة المعلوماتية',
    },
    providingEntity: {
      organizationId: orgMap['مديرية التدريب والتأهيل – جامعة إدلب'],
      name: 'مديرية التدريب والتأهيل – جامعة إدلب',
      logo: '/images/centers/idlib_university_logo.jpg',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: false,
      cost: 1,
      currency: 'USD',
      stipendProvided: false,
      stipendNote: '2500 ليرة سورية جديدة بحسب الإعلان المصور الرسمي',
    },
    ageEligibility: {
      start: 18,
      end: 50,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-08'),
      endDate: new Date('2026-12-12'),
      registrationDeadline: new Date('2026-11-05'),
      durationHours: 40,
      sessionsCount: 15,
      daysOfWeek: ['الأحد', 'الثلاثاء', 'الخميس'],
      timeSlot: '11:00 ص - 01:00 م',
    },
    topics: [
      'مراجعة الأساسيات والدوال الرياضية والإحصائية المتقدمة',
      'دوال البحث والربط (XLOOKUP, VLOOKUP, INDEX & MATCH)',
      'إدارة وتنسيق وتحليل قواعد البيانات الكبيرة وتصفيتها المتقدمة',
      'الجداول والرسوم البيانية المحورية (Pivot Tables & Charts)',
      'تصميم التقارير الإدارية ولوحات المعلومات التفاعلية (Dashboards)',
      'أتمتة الأعمال ومعالجة الأخطاء وتنظيف البيانات',
    ],
    requirements: [
      'معرفة سابقة بأساسيات برنامج Excel والعمليات الحسابية',
      'المدرب المعتمد: م. أحمد زوعة',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تأهيل مباشر للعمل في إدارة البيانات والوظائف الإدارية والمحاسبية في المنظمات.',
    links: [
      'https://chat.whatsapp.com/EVUc7PFlwwD6uaoDVHWPEL',
      'https://www.schoolandcollegelistings.com/SY/Idlib/493911341110746/مديرية-التدريب-والتأهيل---جامعة-إدلب',
    ],
    keys: ['إكسل متقدم', 'Excel Advanced', 'جامعة إدلب', 'تحليل بيانات', 'Pivot Table', 'إدلب المدينة'],
    context: `### تفاصيل التدريب
دورة تخصصية موجهة لطلاب وخريجي الجامعات والكوادر العاملة، يقدمها المهندس أحمد زوعة، للارتقاء بمهارات المتدرب في معالجة وتحليل البيانات الضخمة وبناء التقارير الإدارية والمالية بدقة واحترافية عالية.`,
    status: 'published',
    deleteState: false,
    viewsCount: 230,
    applicantsCount: 46,
  },
  {
    title: 'أساسيات التمريض والإسعاف الأولي C24 – جامعة إدلب',
    summary: 'دورة تجمع بين مبادئ الإسعافات الأولية والمهارات التمريضية التطبيقية بإشراف مديرية التدريب والتأهيل بجامعة إدلب.',
    image: '/images/courses/nursing_c24.jpg',
    location: 'إدلب المدينة - مقابل كلية الهندسة المعلوماتية',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'القاعة التدريبية الطبية بمديرية التدريب والتأهيل بجامعة إدلب',
    },
    providingEntity: {
      organizationId: orgMap['مديرية التدريب والتأهيل – جامعة إدلب'],
      name: 'مديرية التدريب والتأهيل – جامعة إدلب',
      logo: '/images/centers/idlib_university_logo.jpg',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: false,
      cost: 1,
      currency: 'USD',
      stipendProvided: false,
      stipendNote: '2500 ليرة سورية جديدة + 17 ليرة رسوم طوابع',
    },
    ageEligibility: {
      start: 18,
      end: 45,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-06'),
      endDate: new Date('2026-11-28'),
      registrationDeadline: new Date('2026-11-04'),
      durationHours: 25,
      sessionsCount: 10,
      daysOfWeek: ['الأحد', 'الأربعاء', 'الخميس'],
      timeSlot: '11:00 ص - 03:00 م',
    },
    topics: [
      'التعامل مع الصدمة والنزيف الحاد والجروح والحروق والكسور والتسمم',
      'الإنعاش القلبي الرئوي (CPR) والتعامل مع الاختناق وانسداد مجرى الهواء',
      'قياس ومراقبة العلامات الحيوية (الضغط، النبض، الحرارة، الأكسجة)',
      'طرق الحقن المختلفة (عضلي، وريدي، تحت الجلد)',
      'فتح الخطوط الوريدية والتسريب الوريدي وتركيب السيرومات',
      'خياطة الجروح السطحية والضماد العقيم ومبادئ تخطيط القلب ECG',
    ],
    requirements: [
      'متاح لطلاب وخريجي كليات ومعاهد التمريض والعلوم الصحية، والمهتمين بالإسعاف',
      'المدربة المعتمدة: أ. بدور قوصرة',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تأهيل للانخراط في فرق الدعم الصحي الميداني والمشافي والمراكز الصحية.',
    links: [
      'https://chat.whatsapp.com/KknXaYEor7ZFMYlIM4NOio',
      'https://www.schoolandcollegelistings.com/SY/Idlib/493911341110746/مديرية-التدريب-والتأهيل---جامعة-إدلب',
    ],
    keys: ['تمريض', 'إسعافات أولية', 'جامعة إدلب', 'حقن', 'CPR', 'إدلب المدينة', 'صحة'],
    context: `### نبذة عن الدورة
تقدم الأستاذة بدور قوصرة هذا البرنامج التدريبي التفاعلي لإكساب المتدربين المهارات الحركية والسريرية الضرورية في الإسعاف الطارئ والتمريض الأساسي، مع تدريب عملي مباشر على أدوات الحقن وتركيب القساطر الوريدية وتضميد الجروح.`,
    status: 'published',
    deleteState: false,
    viewsCount: 260,
    applicantsCount: 54,
  },
  {
    title: 'التدريب المهني التخصصي في التمريض العام – مساعد ممرض',
    summary: 'إعلان رسمي من جامعة إدلب بالتعاون مع المعهد الطبي لإعداد مساعدي الممرضين وتأهيلهم للعمل في المشافي والمرافق الصحية.',
    image: '/images/courses/nursing_assistant.jpg',
    location: 'إدلب المدينة - المعهد الطبي',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'المعهد الطبي - جامعة إدلب',
    },
    providingEntity: {
      organizationId: orgMap['مديرية التدريب والتأهيل – جامعة إدلب'],
      name: 'مديرية التدريب والتأهيل – جامعة إدلب',
      logo: '/images/centers/idlib_university_logo.jpg',
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
      stipendNote: 'رسوم جامعية مخفضة للطلاب مع إمكانية التقسيط',
    },
    ageEligibility: {
      start: 18,
      end: 35,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-12'),
      endDate: new Date('2027-01-20'),
      registrationDeadline: new Date('2026-11-09'),
      durationHours: 60,
      sessionsCount: 20,
      daysOfWeek: ['السبت', 'الإثنين', 'الأربعاء'],
      timeSlot: '09:00 ص - 12:00 م',
    },
    topics: [
      'مبادئ التمريض السريري والرعاية التمريضية للمرضى المقيمين',
      'إعطاء الأدوية والمحاليل الوريدية ومراقبة الحالات الحرجة',
      'التعقيم ومكافحة العدوى داخل بيئة المشافي والمراكز الجراحية',
      'سحب الدم وإجراء التحاليل السريعة وإعداد غرف العمليات',
    ],
    requirements: [
      'شهادة ثانوية عامة كحد أدنى، والتفرغ لساعات التدريب العملي الميداني',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تأهيل مباشر للتوظيف في المشافي والمستوصفات في إدلب وريفها.',
    links: [
      'https://idlib.university/ealantrining-2/إعلان-رقم-33-تعلن-مديرية-التدريب-والتأهيل-بجامعة/',
    ],
    keys: ['مساعد ممرض', 'تمريض عام', 'جامعة إدلب', 'المعهد الطبي', 'مشافي', 'إدلب المدينة'],
    context: `### الإعلان رقم 33 - جامعة إدلب
تعلن مديرية التدريب والتأهيل بجامعة إدلب بالتعاون مع المعهد الطبي عن فتح باب التسجيل في دبلوم مساعد ممرض، لإعداد كوادر مساعدة قادرة على العمل في أقسام الإسعاف والعناية المركزة والمشافي العامة والخاصة.`,
    status: 'published',
    deleteState: false,
    viewsCount: 245,
    applicantsCount: 48,
  },
  {
    title: 'دورات اللغة الإنكليزية بمختلف مستوياتها – المعهد الاستشاري للغات',
    summary: 'إعلان رسمي عن افتتاح التسجيل في دورات اللغة الإنكليزية لدى المعهد الاستشاري للغات في جامعة إدلب للمحادثة والأكاديميا.',
    image: '/images/courses/univ_english.jpg',
    location: 'إدلب المدينة - مبنى المعاهد',
    locationType: 'in_person',
    locationDetails: {
      country: 'سوريا',
      city: 'إدلب المدينة',
      district: 'إدلب المدينة',
      addressText: 'مبنى المعاهد - جامعة إدلب',
    },
    providingEntity: {
      organizationId: orgMap['المعهد الاستشاري للغات – جامعة إدلب'],
      name: 'المعهد الاستشاري للغات – جامعة إدلب',
      logo: '/images/centers/afaq_logo.jpg',
    },
    publishingEntity: {
      publisherType: 'platform',
      name: 'منصة تلاقي',
    },
    pricing: {
      isFree: false,
      cost: 10,
      currency: 'USD',
      stipendProvided: false,
      stipendNote: 'سعر مدعوم لطلاب جامعة إدلب مع كتاب المنهج المعتمد',
    },
    ageEligibility: {
      start: 17,
      end: 55,
    },
    nationalityEligibility: ['All'],
    genderEligibility: 'all',
    schedule: {
      startDate: new Date('2026-11-15'),
      endDate: new Date('2026-12-25'),
      registrationDeadline: new Date('2026-11-10'),
      durationHours: 36,
      sessionsCount: 12,
      daysOfWeek: ['الأحد', 'الثلاثاء', 'الخميس'],
      timeSlot: '02:00 م - 04:30 م',
    },
    topics: [
      'تحديد المستوى الأكاديمي والالتحاق بالمستوى الملائم (A1 إلى B2)',
      'تطوير مهارات الاستماع والمحادثة في مواقف تفاعلية واقعية',
      'الكتابة الأكاديمية والقراءة الاستيعابية للبحوث والمقالات',
      'التحضير لاختبارات اللغة المعيارية للجامعات والمنح الدراسية',
    ],
    requirements: [
      'إجراء اختبار تحديد المستوى في مقر المعهد قبل بدء الدورة',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'شهادة اجتياز مستوى رسمية صادرة عن المعهد الاستشاري للغات بجامعة إدلب.',
    links: [
      'https://idlib.university/ealanlogat-12/إعلان-المعهد-الاستشاري-للغات-في-جامعة/',
    ],
    keys: ['لغة إنكليزية', 'معهد اللغات', 'جامعة إدلب', 'محادثة', 'English', 'إدلب المدينة'],
    context: `### إعلان المعهد الاستشاري للغات في جامعة إدلب
يعلن المعهد الاستشاري للغات عن فتح باب التسجيل لكافة الراغبين من طلاب وخريجي الجامعة والمجتمع المحلي لتطوير لغتهم الإنجليزية وتأهيلهم لمواصلة دراساتهم العليا أو التقديم على المنظمات والوظائف الإدارية.`,
    status: 'published',
    deleteState: false,
    viewsCount: 220,
    applicantsCount: 40,
  },

  // ==========================================
  // 3. الدورات التخصصية التقنية والمهنية في إدلب (مع صور محلية 100%)
  // ==========================================
  {
    title: 'دبلوم إدارة المشاريع التنموية والإنسانية (Project DPro - PMD Pro)',
    summary: 'تدريب مهني معتمد يركز على تزويد الكوادر الشبابية في إدلب بمهارات إدارة دورة حياة المشروع الإنساني، كتابة المقترحات، ومتابعة المؤشرات الميدانية.',
    image: '/images/courses/pmd_pro.jpg',
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
      logo: '/images/centers/violet_logo.jpg',
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
    ageEligibility: {
      start: 20,
      end: 35,
    },
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
    links: [
      'https://forms.gle/violet-pmd-idlib-2026',
    ],
    keys: ['إدارة مشاريع', 'منظمات', 'بنفسج', 'إدلب', 'PMD Pro', 'MEAL', 'تنموي', 'تدريب مجاني', 'عمل إنساني'],
    context: `### نظرة عامة على الدورة
يهدف برنامج **إدارة المشاريع التنموية والإنسانية (PMD Pro)** إلى تمكين الشباب السوري في محافظة إدلب من اكتساب المعايير المعترف بها عالمياً لإدارة المشاريع غير الربحية بكفاءة وجودة عالية، ومواكبة متطلبات المنظمات الدولية والمحلية العاملة في الميدان.`,
    status: 'published',
    deleteState: false,
    viewsCount: 142,
    applicantsCount: 38,
  },
  {
    title: 'دبلوم تطوير واجهات الويب الحديثة (Frontend Web: React & Next.js)',
    summary: 'مسار عملي مكثف لتأهيل مبرمجي الواجهات وتجهيزهم للعمل عن بعد (Freelancing) مع شركات عربية وعالمية باستخدام React وNext.js وتطبيقات السيرفر.',
    image: '/images/courses/frontend_react.jpg',
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
      logo: '/images/centers/techzone_logo.jpg',
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
    ageEligibility: {
      start: 17,
      end: 38,
    },
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
      'توفر حاسوب محمول (لابتوب) بحالة جيدة للتطبيق العملي',
      'معرفة أساسية سابقة بمفاهيم التصفح والإنترنت',
      'تخصيص 4 ساعات أسبوعياً للمشاريع المنزلية العملية',
    ],
    certificateProvided: true,
    jobOpportunitiesNote: 'تشبيك المتخرجين المتميزين مع مشاريع عمل حر وشركات برمجية ناشئة.',
    links: [
      'https://forms.gle/techzone-frontend-react-2026',
    ],
    keys: ['برمجة', 'ويب', 'React', 'Next.js', 'الدانا', 'إدلب', 'عمل حر', 'فرونت إند', 'تقنية', 'JavaScript'],
    context: `### لماذا هذا الدبلوم؟
يعد مجال تطوير واجهات الويب (Frontend Development) أكثر المجالات طلباً للعمل عن بعد في الشمال السوري. يركز هذا المسار على التدريب العملي المباشر وبناء مشاريع واقعية حقيقية بدلاً من الاقتصار على الجانب النظري.`,
    status: 'published',
    deleteState: false,
    viewsCount: 210,
    applicantsCount: 45,
  },
  {
    title: 'التدريب التخصصي في صيانة وبرمجة الهواتف الذكية (Hardware & Software)',
    summary: 'تدريب مهني متكامل يغطي تشخيص الأعطال الإلكترونية، فك وتبديل الآيسيات والشاشات، ومخططات البورد، إضافة للسوفت وير وفك الحمايات لأجهزة Android وiOS.',
    image: '/images/courses/phone_repair.jpg',
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
      logo: '/images/centers/khatwa_logo.jpg',
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
    ageEligibility: {
      start: 18,
      end: 35,
    },
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
    links: [
      'https://forms.gle/khatwa-phone-repair-idlib-2026',
    ],
    keys: ['صيانة هواتف', 'سرمدا', 'إدلب', 'مهني', 'هاردوير', 'سوفت وير', 'تدريب مهني', 'حرفي', 'إلكترونيات'],
    context: `### فكرة التدريب
تشهد منطقة سرمدا حركة تجارية ضخمة وسوقاً واسعاً للأجهزة الذكية. صُمم هذا البرنامج بهدف إكساب الشباب خبرة حرفية وتطبيقية دقيقة تؤهلهم لدخول سوق العمل بشكل فوري ومستقل.`,
    status: 'published',
    deleteState: false,
    viewsCount: 188,
    applicantsCount: 62,
  },
  {
    title: 'دورة الإسعافات الأولية الميدانية والرعاية الطارئة – منظمة شفق',
    summary: 'ورشة تدريبية متخصصة في الإسعافات الأولية وإنقاذ الأرواح، مخصصة لطلاب الجامعات والمجتمع المحلي للتعامل مع الحوادث والإصابات المنزلية والميدانية.',
    image: '/images/courses/first_aid.jpg',
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
      logo: '/images/centers/shafak_logo.jpg',
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
    ageEligibility: {
      start: 18,
      end: 45,
    },
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
    links: [
      'https://forms.gle/shafak-firstaid-ariha-2026',
    ],
    keys: ['إسعافات أولية', 'شفق', 'أريحا', 'إدلب', 'صحة', 'طبي', 'إنعاش', 'مجاني', 'طوارئ'],
    context: `### أهمية التدريب
في ظل التحديات الإنسانية في شمال غرب سوريا، يشكل امتلاك مهارات الإسعاف الأولي فارقاً حاسماً بين الحياة والموت. تقدم منظمة شفق هذا التدريب المكثف بواسطة كوادر طبية وتمريضية ذات خبرة عالية.`,
    status: 'published',
    deleteState: false,
    viewsCount: 165,
    applicantsCount: 50,
  },
  {
    title: 'دبلوم تصميم الهوية البصرية والجرافيك الإعلاني (Adobe Suite)',
    summary: 'تعلم أسس التصميم الجرافيكي الاحترافي، ابتكار الهويات البصرية للشركات، وتصميم الإعلانات الرقمية ومطبوعات الحملات الإنسانية والتجارية.',
    image: '/images/courses/graphic_design.jpg',
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
      logo: '/images/centers/masar_logo.jpg',
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
    ageEligibility: {
      start: 16,
      end: 32,
    },
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
    links: [
      'https://forms.gle/masar-graphic-idlib-2026',
    ],
    keys: ['تصميم', 'جرافيك', 'فوتوشوب', 'إليستريتور', 'معرة مصرين', 'إدلب', 'هوية بصرية', 'فريلانس', 'أدوبي'],
    context: `### عن الدبلوم
التصميم الجرافيكي لم يعد مجرد هواية، بل هو أحد أكثر المسارات طلباً من قبل المنظمات والشركات التجارية والمطابع في إدلب. صُمم هذا الدبلوم ليأخذ المتدرب من الصفر حتى مرحلة الاحتراف الكامل.`,
    status: 'published',
    deleteState: false,
    viewsCount: 195,
    applicantsCount: 41,
  },
  {
    title: 'الدورة العملية في تركيب وصيانة منظومات الطاقة الشمسية والكهربائية (Solar PV)',
    summary: 'دورة فنية تطبيقية لتأهيل فنيي الطاقة البديلة، حساب استطاعات الألواح والبطاريات والإنفرترات، وتطبيق التوصيلات الآمنة على أنظمة On-Grid وOff-Grid.',
    image: '/images/courses/solar_energy.jpg',
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
      logo: '/images/centers/technical_institute_logo.jpg',
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
    ageEligibility: {
      start: 18,
      end: 40,
    },
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
    links: [
      'https://forms.gle/solar-pv-idlib-technical-2026',
    ],
    keys: ['طاقة شمسية', 'كهرباء', 'إدلب', 'مهني', 'إنفرتر', 'بطاريات ليثيوم', 'تدريب حرفي', 'مجاني', 'طاقة بديلة'],
    context: `### واقع الطاقة في الشمال السوري
تعتمد محافظة إدلب بشكل أساسي على الطاقة الشمسية لتأمين الكهرباء للمنازل، المشافي، والمصالح الزراعية والصناعية. هذا التدريب يركز على تلبية الحاجة الكبيرة لفنيين معتمدين يملكون المعرفة الهندسية السليمة لتفادي الأخطاء الشائعة وحرائق البطاريات.`,
    status: 'published',
    deleteState: false,
    viewsCount: 220,
    applicantsCount: 58,
  },
  {
    title: 'البرنامج التطبيقي في المحاسبة المالية ونظام الأمين للمحاسبة والمستودعات',
    summary: 'تأهيل المحاسبين والخرجين الجدد على الدورة المحاسبية الكاملة، إعداد القيود والتسويات، واستخدام برنامج الأمين للمحاسبة المعتمد في الشركات السورية.',
    image: '/images/courses/alameen_accounting.jpg',
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
      logo: '/images/centers/rowad_logo.jpg',
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
    ageEligibility: {
      start: 19,
      end: 45,
    },
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
    links: [
      'https://forms.gle/alrowad-alameen-idlib-2026',
    ],
    keys: ['محاسبة', 'برنامج الأمين', 'إدلب المدينة', 'الرواد', 'مالية', 'قوائم مالية', 'مستودعات', 'تدريب محاسبي'],
    context: `### أهمية هذا البرنامج
يعد برنامج الأمين للمحاسبة والمستودعات البرنامج الأكثر انتشاراً واعتماداً لدى الشركات والمؤسسات والمنظمات المحلية في سوريا. يربط هذا التدريب بين الفهم النظري للمحاسبة والتطبيق العملي الرقمي المباشر.`,
    status: 'published',
    deleteState: false,
    viewsCount: 172,
    applicantsCount: 34,
  },
  {
    title: 'دبلوم تحليل البيانات والذكاء الاصطناعي للأعمال (Data Analysis & AI with Python & Power BI)',
    summary: 'مسار تأهيلي تطبيقي يجمع بين تحليل البيانات التجارية، تصميم لوحات القيادة التفاعلية بـ Power BI، واستخدام لغة Python وأدوات الذكاء الاصطناعي.',
    image: '/images/courses/data_analysis_ai.jpg',
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
      logo: '/images/centers/innovation_hub_logo.jpg',
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
    ageEligibility: {
      start: 20,
      end: 38,
    },
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
    links: [
      'https://forms.gle/idlib-data-ai-diploma-2026',
    ],
    keys: ['بيانات', 'ذكاء اصطناعي', 'بايثون', 'Power BI', 'إدلب', 'Data Analysis', 'Python', 'منظمات', 'تحليل بيانات', 'مجاني'],
    context: `### لماذا يعتبر هذا الدبلوم الأهم في سوق اليوم؟
يشهد قطاع العمل في إدلب والشمال السوري، سواء لدى المنظمات الدولية أو الشركات التجارية، طلباً غير مسبوق على محللي البيانات ومديري نظم المعلومات (Information Management Officers). صمم هذا البرنامج ليردم الهوة بين النظرية والتطبيق الفعلي.`,
    status: 'published',
    deleteState: false,
    viewsCount: 245,
    applicantsCount: 68,
  },
];

export const SLIDERS_DATA = [
  {
    title: 'فعاليات الأسبوع العالمي لريادة الأعمال – إدلب 2026',
    subtitle: 'انضم إلى معرض صُنّاع الريادة، وجلسات الذكاء الاصطناعي ولينكد إن لرواد الأعمال، واكتشف آفاق الاستثمار والتشبيك في إدلب.',
    image: '/images/events/gew_makers_exhibition.jpg',
    badge: 'حدث ريادي مميز 2026',
    link: '/courses',
    buttonText: 'تصفح فعاليات الأسبوع',
    order: 1,
    isActive: true,
  },
  {
    title: 'بوابتك الأولى للتدريبات والفرص المهنية في إدلب',
    subtitle: 'اكتشف أحدث البرامج التدريبية المدعومة والمجانية في مجالات البرمجة، إدارة المشاريع، والمهن الواعدة في الشمال السوري.',
    image: '/images/sliders/slider_hero.jpg',
    badge: 'فرص تدريبية جديدة 2026',
    link: '/courses',
    buttonText: 'تصفح كل الدورات المتاحة',
    order: 2,
    isActive: true,
  },
  {
    title: 'مسارات البرمجة والذكاء الاصطناعي لسوق العمل الحر',
    subtitle: 'دبلومات احترافية في تطوير الويب الحديث وعلوم البيانات تمكنك من العمل عن بعد مع شركات إقليمية ودولية.',
    image: '/images/sliders/slider_tech.jpg',
    badge: 'مسار تقني متقدم',
    link: '/courses',
    buttonText: 'استكشف الدورات التقنية',
    order: 3,
    isActive: true,
  },
  {
    title: 'شراكات استراتيجية مع كبرى المنظمات والجامعات والمعاهد',
    subtitle: 'بيئة موثوقة تجمع الطلاب والمراكز في إدلب وسرمدا والدانا مع شهادات معتمدة وفرص تدريب ميدانية.',
    image: '/images/sliders/slider_partners.jpg',
    badge: 'شراكات موثوقة',
    link: '/courses',
    buttonText: 'تصفح الدورات المعتمدة',
    order: 4,
    isActive: true,
  },
];

export const SECTIONS_DATA = [
  {
    name: 'ريادة أعمال ومشاريع ناشئة',
    slug: 'entrepreneurship',
    description: 'فعاليات الأسبوع العالمي لريادة الأعمال، احتضان المشاريع، ودراسات الجدوى والتشبيك',
    icon: 'Rocket',
    order: 1,
    isActive: true,
    featured: true,
  },
  {
    name: 'تكنولوجيا وبرمجة',
    slug: 'programming',
    description: 'تطوير واجهات وتطبيقات الويب، لغات البرمجة الحديثة، والذكاء الاصطناعي',
    icon: 'Code',
    order: 2,
    isActive: true,
    featured: true,
  },
  {
    name: 'مهارات الحاسوب وICDL',
    slug: 'computer-skills',
    description: 'رخصة قيادة الحاسوب الدولية، برامج Office، وأساسيات نظم التشغيل',
    icon: 'Monitor',
    order: 3,
    isActive: true,
    featured: true,
  },
  {
    name: 'إدارة مشاريع ومنظمات إنسانية',
    slug: 'project-management',
    description: 'معايير PMD Pro، الرصد والتقييم، وكتابة مقترحات المشاريع التنموية',
    icon: 'Briefcase',
    order: 4,
    isActive: true,
    featured: true,
  },
  {
    name: 'صحة وتمريض وإسعافات أولية',
    slug: 'healthcare',
    description: 'أساسيات التمريض السريري، مساعد ممرض، والإسعافات الأولية الميدانية في إدلب',
    icon: 'HeartPulse',
    order: 5,
    isActive: true,
    featured: true,
  },
  {
    name: 'مهن وحرف تقنية',
    slug: 'vocational',
    description: 'صيانة وبرمجة الهواتف الذكية، الطاقة الشمسية البديلة، والتمديدات الكهربائية',
    icon: 'Wrench',
    order: 6,
    isActive: true,
    featured: true,
  },
  {
    name: 'تحليل بيانات وذكاء اصطناعي',
    slug: 'data-ai',
    description: 'علوم البيانات، لغة Python، وأدوات Microsoft Power BI للأعمال',
    icon: 'BarChart3',
    order: 7,
    isActive: true,
    featured: true,
  },
  {
    name: 'تصميم وفنون رقمية',
    slug: 'design',
    description: 'تصميم الهويات البصرية، الجرافيك الإعلاني، وبرامج Adobe الاحترافية',
    icon: 'Palette',
    order: 8,
    isActive: true,
    featured: true,
  },
  {
    name: 'محاسبة ومالية',
    slug: 'accounting',
    description: 'برنامج الأمين للمحاسبة والمستودعات، مسك الدفاتر، وإعداد القوائم الختامية',
    icon: 'Calculator',
    order: 9,
    isActive: true,
    featured: true,
  },
  {
    name: 'لغات وترجمة',
    slug: 'languages',
    description: 'اللغة الإنجليزية للمحادثة والأعمال، والتحضير لمقابلات التوظيف الدولية',
    icon: 'Languages',
    order: 10,
    isActive: true,
    featured: true,
  },
];

async function seed() {
  console.log('🚀 بدء عملية التغذية المحدثة والشاملة لقواعد البيانات (Database Seed)...');

  let connection;
  try {
    if (ENV_URI) {
      console.log('📡 جاري محاولة الاتصال بقاعدة البيانات عبر MONGODB_URI...');
      connection = await mongoose.connect(ENV_URI, { serverSelectionTimeoutMS: 3002 });
      console.log('✅ تم الاتصال بنجاح بقاعدة البيانات:', mongoose.connection.name);
    }
  } catch (err) {
    console.warn('⚠️ فشل الاتصال بقاعدة البيانات السحابية، التحويل إلى القاعدة المحلية...');
  }

  if (!connection || mongoose.connection.readyState !== 1) {
    console.log(`📡 جاري الاتصال بالقاعدة المحلية: ${LOCAL_URI}...`);
    await mongoose.connect(LOCAL_URI, { serverSelectionTimeoutMS: 4000 });
    console.log('✅ تم الاتصال بنجاح بالقاعدة المحلية:', mongoose.connection.name);
  }

  const db = mongoose.connection.db;

  // 1. Seed / Upsert Organizations
  console.log('\n🏢 جاري تغذية وتحديث المراكز والمنظمات والجامعات في إدلب...');
  const orgCollection = db.collection('organizations');
  const orgMap = {};

  for (const org of ORGANIZATIONS_DATA) {
    const existing = await orgCollection.findOne({ name: org.name });
    if (existing) {
      await orgCollection.updateOne(
        { _id: existing._id },
        { $set: { ...org, updatedAt: new Date() } }
      );
      orgMap[org.name] = existing._id;
      console.log(`   ✓ تم تحديث المركز: ${org.name}`);
    } else {
      const res = await orgCollection.insertOne({
        ...org,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      orgMap[org.name] = res.insertedId;
      console.log(`   + تم إدخال المركز: ${org.name}`);
    }
  }

  // 2. Seed / Upsert Courses
  console.log('\n📚 جاري تغذية وتحديث الدورات التدريبية المعتمدة في إدلب مع كافة بيانات الإعلان الحقيقية...');
  const courseCollection = db.collection('courses');
  const coursesToSeed = getCoursesData(orgMap);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const course of coursesToSeed) {
    const existing = await courseCollection.findOne({ title: course.title });
    if (existing) {
      await courseCollection.updateOne(
        { _id: existing._id },
        { $set: { ...course, updatedAt: new Date() } }
      );
      updatedCount++;
      console.log(`   ✓ تم تحديث الدورة: "${course.title.slice(0, 45)}..."`);
    } else {
      await courseCollection.insertOne({
        ...course,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      insertedCount++;
      console.log(`   + تم إدخال الدورة: "${course.title.slice(0, 45)}..."`);
    }
  }

  // 3. Seed / Upsert Sliders (لوحة التحكم / السلايدرات)
  console.log('\n🎨 جاري تغذية سلايدرات الصفحة الرئيسية (Sliders & Banners)...');
  const sliderCollection = db.collection('sliders');
  for (const slider of SLIDERS_DATA) {
    const existing = await sliderCollection.findOne({ title: slider.title });
    if (existing) {
      await sliderCollection.updateOne(
        { _id: existing._id },
        { $set: { ...slider, updatedAt: new Date() } }
      );
      console.log(`   ✓ تم تحديث السلايدر: "${slider.title.slice(0, 35)}..."`);
    } else {
      await sliderCollection.insertOne({
        ...slider,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   + تم إدخال السلايدر: "${slider.title.slice(0, 35)}..."`);
    }
  }

  // 4. Seed / Upsert Sections (لوحة التحكم / الأقسام والتصنيفات)
  console.log('\n📑 جاري تغذية أقسام وتصنيفات التدريبات (Sections & Categories)...');
  const sectionCollection = db.collection('sections');
  for (const section of SECTIONS_DATA) {
    const existing = await sectionCollection.findOne({ slug: section.slug });
    if (existing) {
      await sectionCollection.updateOne(
        { _id: existing._id },
        { $set: { ...section, updatedAt: new Date() } }
      );
      console.log(`   ✓ تم تحديث القسم: "${section.name}"`);
    } else {
      await sectionCollection.insertOne({
        ...section,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   + تم إدخال القسم: "${section.name}"`);
    }
  }

  // 5. Seed / Upsert Default Admin User
  console.log('\n👤 جاري التأكد من حساب مدير النظام (Admin User)...');
  const userCollection = db.collection('users');
  const adminEmail = 'admin@dolean.com';
  const adminPassword = 'AdminPassword123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await userCollection.findOne({ email: adminEmail });
  if (existingAdmin) {
    await userCollection.updateOne(
      { _id: existingAdmin._id },
      {
        $set: {
          password: hashedPassword,
          roles: ['admin', 'super_admin'],
          role: 'admin',
          isVerified: true,
          deleteState: false,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`   ✓ تم تحديث حساب المسؤول: ${adminEmail}`);
  } else {
    await userCollection.insertOne({
      name: 'مدير المنصة (Admin)',
      email: adminEmail,
      phone: '+963951000000',
      password: hashedPassword,
      roles: ['admin', 'super_admin'],
      role: 'admin',
      isVerified: true,
      deleteState: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`   + تم إنشاء حساب المسؤول: ${adminEmail}`);
  }

  // Also seed a student user
  const studentEmail = 'student@talaqi.app';
  const existingStudent = await userCollection.findOne({ email: studentEmail });
  if (!existingStudent) {
    await userCollection.insertOne({
      name: 'طالب تجريبي',
      email: studentEmail,
      phone: '+963955445566',
      password: hashedPassword,
      roles: ['student'],
      role: 'student',
      isVerified: true,
      deleteState: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`   + تم إنشاء حساب طالب تجريبي: ${studentEmail}`);
  }

  const totalCourses = await courseCollection.countDocuments({ deleteState: { $ne: true } });
  const totalOrgs = await orgCollection.countDocuments({ deleteState: { $ne: true } });
  const totalUsers = await userCollection.countDocuments({ deleteState: { $ne: true } });
  const totalSliders = await sliderCollection.countDocuments({ deleteState: { $ne: true } });
  const totalSections = await sectionCollection.countDocuments({ deleteState: { $ne: true } });

  console.log('\n=============================================');
  console.log(`🎉 اكتملت عملية الـ Seed بنجاح تام!`);
  console.log(`   - إجمالي المراكز والجهات في إدلب: ${totalOrgs}`);
  console.log(`   - إجمالي الدورات والفعاليات النشطة في إدلب: ${totalCourses}`);
  console.log(`   - إجمالي السلايدرات الفعالة: ${totalSliders}`);
  console.log(`   - إجمالي أقسام وتصنيفات الدورات: ${totalSections}`);
  console.log(`   - إجمالي المستخدمين في النظام: ${totalUsers}`);
  console.log('=============================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ خطأ أثناء الـ Seed:', err);
  process.exit(1);
});
