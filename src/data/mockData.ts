import { FacebookGroup, MarketplacePost, FacebookUser, CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'ALL', label: 'جميع الفئات', iconName: 'LayoutGrid', color: 'text-indigo-600', bgLight: 'bg-indigo-50 dark:bg-indigo-950/40' },
  { id: 'PHONES', label: 'هواتف وأجهزة ذكية', iconName: 'Smartphone', color: 'text-blue-600', bgLight: 'bg-blue-50 dark:bg-blue-950/40' },
  { id: 'ELECTRONICS', label: 'إلكترونيات ولابتوبات', iconName: 'Laptop', color: 'text-cyan-600', bgLight: 'bg-cyan-50 dark:bg-cyan-950/40' },
  { id: 'CARS', label: 'سيارات ومركبات', iconName: 'Car', color: 'text-amber-600', bgLight: 'bg-amber-50 dark:bg-amber-950/40' },
  { id: 'REAL_ESTATE', label: 'عقارات وشقق', iconName: 'Home', color: 'text-emerald-600', bgLight: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'FURNITURE', label: 'أثاث ومفروشات', iconName: 'Armchair', color: 'text-purple-600', bgLight: 'bg-purple-50 dark:bg-purple-950/40' },
  { id: 'APPLIANCES', label: 'أجهزة منزلية', iconName: 'Tv', color: 'text-rose-600', bgLight: 'bg-rose-50 dark:bg-rose-950/40' },
  { id: 'FASHION', label: 'موضة وساعات', iconName: 'Watch', color: 'text-pink-600', bgLight: 'bg-pink-50 dark:bg-pink-950/40' },
  { id: 'SERVICES', label: 'خدمات وأعمال', iconName: 'Briefcase', color: 'text-teal-600', bgLight: 'bg-teal-50 dark:bg-teal-950/40' },
];

export const DEMO_USER: FacebookUser = {
  id: 'fb_1092837465928',
  name: 'أحمد الشريف (تاجر نشط)',
  email: 'ahmed.elsherif.demo@facebook.com',
  picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isDemo: true,
  connectedAt: new Date().toISOString(),
};

export const INITIAL_GROUPS: FacebookGroup[] = [
  {
    id: 'grp_01',
    name: 'حراج ومزاد السيارات الحديثة والمستعملة 🚗',
    category: 'سيارات ومركبات',
    memberCount: 245000,
    isBuyAndSell: true,
    location: 'الرياض، جدة، المنطقة الشرقية',
    avatarUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&auto=format&fit=crop&q=80',
    privacy: 'PUBLIC',
    syncedPostsCount: 142,
    lastSync: 'منذ 5 دقائق',
  },
  {
    id: 'grp_02',
    name: 'سوق الإلكترونيات والهواتف الذكية (كسر زيرو) 📱',
    category: 'إلكترونيات وهواتف',
    memberCount: 380000,
    isBuyAndSell: true,
    location: 'القاهرة، الجيزة، الإسكندرية',
    avatarUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=80',
    privacy: 'PUBLIC',
    syncedPostsCount: 218,
    lastSync: 'منذ دقيقتين',
  },
  {
    id: 'grp_03',
    name: 'سوق العقارات والشقق للبيع والإيجار المباشر 🏠',
    category: 'عقارات',
    memberCount: 190000,
    isBuyAndSell: true,
    location: 'دبي، أبوظبي، الشارقة',
    avatarUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80',
    privacy: 'PUBLIC',
    syncedPostsCount: 89,
    lastSync: 'منذ 12 دقيقة',
  },
  {
    id: 'grp_04',
    name: 'أثاث ومستلزمات منزلية راقية مستعمل وجديد 🛋️',
    category: 'أثاث وديكور',
    memberCount: 115000,
    isBuyAndSell: true,
    location: 'الرياض، مكة، المدينة',
    avatarUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=80',
    privacy: 'PUBLIC',
    syncedPostsCount: 64,
    lastSync: 'منذ نصف ساعة',
  },
  {
    id: 'grp_05',
    name: 'سوق اللابتوبات وأجهزة الجيمنج الاحترافية 💻',
    category: 'كمبيوتر ولابتوب',
    memberCount: 165000,
    isBuyAndSell: true,
    location: 'جميع المدن (شحن متاح)',
    avatarUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150&auto=format&fit=crop&q=80',
    privacy: 'PUBLIC',
    syncedPostsCount: 95,
    lastSync: 'منذ 8 دقائق',
  },
];

export const INITIAL_POSTS: MarketplacePost[] = [
  {
    id: 'post_01',
    facebookPostId: 'fb_post_892716382',
    groupId: 'grp_02',
    groupName: 'سوق الإلكترونيات والهواتف الذكية (كسر زيرو) 📱',
    author: {
      name: 'محمود عبد الرحمن',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      profileUrl: 'https://facebook.com/profile.php?id=1000123982',
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    rawContent: `للبيع السريع كسر زيرو آيفون 15 برو ماكس (iPhone 15 Pro Max) لون تيتانيوم طبيعي مساحة 256 جيجا.
الجهاز استخدام أسبوعين فقط بطارية 100% دورات شحن 14 مرة.
معاه العلبة كاملة بكافة مشتملاتها الأصلية مع فاتورة الشراء وضمان أبل ساري 11 شهر.
مطلوب: 4,400 ريال نهائي غير قابل للبدل.
المكان: الرياض - حي الملقا مع إمكانية التوصيل.
للتواصل واتساب أو اتصال: 0551234890`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1695048132903-888981df5df4?w=600&auto=format&fit=crop&q=80'
    ],
    parsed: {
      title: 'آيفون 15 برو ماكس 256 جيجابايت تيتانيوم طبيعي',
      category: 'PHONES',
      subCategory: 'Apple iPhone',
      price: 4400,
      currency: 'SAR',
      originalPriceText: '4,400 ريال نهائي',
      isPriceNegotiable: false,
      condition: 'LIKE_NEW',
      location: 'الرياض - حي الملقا',
      city: 'الرياض',
      contact: {
        phone: '0551234890',
        whatsapp: '966551234890',
      },
      specifications: {
        'الموديل': 'iPhone 15 Pro Max',
        'السعة التخزينية': '256GB',
        'صحة البطارية': '100%',
        'اللون': 'تيتانيوم طبيعي Natural Titanium',
        'حالة الضمان': 'ضمان أبل 11 شهر + الفاتورة',
        'الملحقات': 'العلبة كاملة مع السلك الأصلي',
      },
      keyTags: ['آبل', '256GB', 'بطارية 100%', 'تيتانيوم', 'ضمان ساري'],
      summary: 'جهاز كالجديد استخدام أسبوعين فقط مع العلبة والضمان وفاتورة الشراء.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_02',
    facebookPostId: 'fb_post_449102837',
    groupId: 'grp_01',
    groupName: 'حراج ومزاد السيارات الحديثة والمستعملة 🚗',
    author: {
      name: 'أبو فهد القحطاني',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      profileUrl: 'https://facebook.com/profile.php?id=1000982341',
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    rawContent: `ما شاء الله تبارك الله..
للبيع تويوتا كامري موديل 2023 فئة GLE فل كامل.
اللون أبيض لؤلؤي، العداد 38 ألف كم حقيقي قابل للزيادة البسيطة.
المواصفات: فتحة سقف، شاشة، كاميرا خلفية، حساسات، مقاعد جلد بيج، تشغيل بصمة ودخول ذكي.
البودي وكالة خالي تماماً من الرش والسمكرة، قير وماكينة وشاسيه على الشرط والفحص.
السعر المطلوب: 88,000 ريال (قابل للتفاوض البسيط للجادين بعد المعاينة).
الموقع: جدة - حي الروضة.
رقم الجوال: 0509876543`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=80'
    ],
    parsed: {
      title: 'تويوتا كامري 2023 GLE فل كامل - بودي وكالة',
      category: 'CARS',
      subCategory: 'Toyota Camry',
      price: 88000,
      currency: 'SAR',
      originalPriceText: '88,000 ريال (قابل للتفاوض البسيط)',
      isPriceNegotiable: true,
      condition: 'EXCELLENT',
      location: 'جدة - حي الروضة',
      city: 'جدة',
      contact: {
        phone: '0509876543',
        whatsapp: '966509876543',
      },
      specifications: {
        'الشركة والموديل': 'Toyota Camry GLE',
        'سنة الصنع': '2023',
        'الممشى': '38,000 كم',
        'ناقل الحركة': 'أوتوماتيك',
        'الوقود': 'بنزين اقتصادي',
        'حالة البودي': 'وكالة شرط بدون حوادث أو رش',
        'المواصفات': 'فتحة سقف، شاشة، بصمة، حساسات، كاميرا',
      },
      keyTags: ['تويوتا كامري', '2023', 'فل كامل', '38 الف كم', 'بودي وكالة', 'قابل للتفاوض'],
      summary: 'كامري 2023 فل كامل بممشى منخفض وفحص شرط خالية من الرش والسمكرة.',
      aiAnalyzed: true,
    },
    saved: true,
  },
  {
    id: 'post_03',
    facebookPostId: 'fb_post_772183941',
    groupId: 'grp_05',
    groupName: 'سوق اللابتوبات وأجهزة الجيمنج الاحترافية 💻',
    author: {
      name: 'كريم المهندس',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    rawContent: `عرض جيمرز ومونتاج قوي جداً:
لابتوب ASUS ROG Zephyrus G16 (2024)
المواصفات العالية:
- المعالج: Intel Core Ultra 9 185H (16 Cores)
- كارت الشاشة: NVIDIA RTX 4080 VRAM 12GB TGP 145W
- الرامات: 32GB LPDDR5X 7467MHz
- التخزين: 1TB NVMe Gen4 SSD سريع جداً
- الشاشة: 16 بوصة OLED 2.5K بتردد 240Hz زمن استجابة 0.2ms
الجهاز كالجديد تماماً مع العلبة والشاحن الأصلي، شغال بدون أي عيب.
السعر المطلوب: 8,700 ريال أو ما يعادله بالدولار (نهائي).
الموقع: الدمام - حي الشاطئ / شحن سريع لكافة المدن.
واتس للتفاصيل: 0544112233`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80'
    ],
    parsed: {
      title: 'لابتوب ألعاب ASUS ROG Zephyrus G16 - RTX 4080 / Ultra 9',
      category: 'ELECTRONICS',
      subCategory: 'Gaming Laptops',
      price: 8700,
      currency: 'SAR',
      originalPriceText: '8,700 ريال نهائي',
      isPriceNegotiable: false,
      condition: 'LIKE_NEW',
      location: 'الدمام - حي الشاطئ',
      city: 'الدمام',
      contact: {
        phone: '0544112233',
        whatsapp: '966544112233',
      },
      specifications: {
        'المعالج CPU': 'Intel Core Ultra 9 185H',
        'كارت الشاشة GPU': 'NVIDIA GeForce RTX 4080 (12GB)',
        'الذاكرة العشوائية RAM': '32GB LPDDR5X',
        'وحدة التخزين': '1TB NVMe M.2 SSD',
        'الشاشة': '16" OLED 2.5K 240Hz 0.2ms',
        'الوزن والسمك': 'نحيف وخفيف معدني',
      },
      keyTags: ['ASUS ROG', 'RTX 4080', 'Ultra 9', '32GB RAM', 'OLED 240Hz', 'شحن متاح'],
      summary: 'وحش جيمنج ومونتاج فائق المواصفات بشاشة OLED 240Hz وكارت RTX 4080.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_04',
    facebookPostId: 'fb_post_551928374',
    groupId: 'grp_03',
    groupName: 'سوق العقارات والشقق للبيع والإيجار المباشر 🏠',
    author: {
      name: 'سارة المنصوري',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    rawContent: `فرصة استثمارية وسكنية مباشرة من المالك بدون عمولة وسيط:
شقة فندقية للبيع في دبي مارينا (Dubai Marina) مطلة على الواجهة البحرية واليخوت.
المساحة: 110 متر مربع (1,180 قدم).
تتكون من: 2 غرف نوم ماستر + صالة واسعة + مطبخ مفتوح مجهز بالكامل بأجهزة Bosch + بلكونة بانورامية كبيرة + 2 حمام وموقف سيارة خاص مغطى.
المبنى به مسبح إنفينيتي وصالة ألعاب جيم وساونا وأمن 24 ساعة.
سعر البيع المطلوب: 1,850,000 درهم إماراتي (قابل للنقاش المعقول للدفع كاش).
جاهزة للسكن أو التأجير بعائد استثماري يتجاوز 8.5% سنوياً.
للتواصل والمعاينة: 0529988776 واتساب متاح.`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80'
    ],
    parsed: {
      title: 'شقة فاخرة غرفتين ماستر بإطلالة بحرية - دبي مارينا',
      category: 'REAL_ESTATE',
      subCategory: 'شقق سكنية للبيع',
      price: 1850000,
      currency: 'AED',
      originalPriceText: '1,850,000 درهم (قابل للنقاش)',
      isPriceNegotiable: true,
      condition: 'BRAND_NEW',
      location: 'دبي - دبي مارينا (Dubai Marina)',
      city: 'دبي',
      contact: {
        phone: '0529988776',
        whatsapp: '971529988776',
      },
      specifications: {
        'نوع العقار': 'شقة فندقية فاخرة',
        'عدد الغرف': '2 غرف نوم ماستر + صالة + 2 حمام',
        'المساحة': '110 متر مربع (1180 قدم)',
        'الإطلالة': 'بانورامية مباشرة على البحر واليخوت',
        'المرافق': 'مسبح إنفينيتي، جيم، ساونا، موقف سيارة',
        'عائد الاستثمار': 'متوقع 8.5% سنوياً',
      },
      keyTags: ['دبي مارينا', 'إطلالة بحرية', 'غرفتين ماستر', 'مسبح وجيم', 'من المالك مباشرة', 'عائد 8.5%'],
      summary: 'شقة بإطلالة ساحرة في دبي مارينا مجهزة بأجهزة Bosch ومرافق فندقية بدون عمولة.',
      aiAnalyzed: true,
    },
    saved: true,
  },
  {
    id: 'post_05',
    facebookPostId: 'fb_post_663920194',
    groupId: 'grp_04',
    groupName: 'أثاث ومستلزمات منزلية راقية مستعمل وجديد 🛋️',
    author: {
      name: 'أم عبد العزيز',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    rawContent: `بداعي السفر النهائي ونقل العفش:
طقم كنب تركي فاخر مودرن يتسع لـ 9 أشخاص (كنبة ثلاثية + كنبة ثنائية + 4 فوتيه منفرد + طاولة وسط رخامية كبيرة مع 4 طاولات خدمة جانبية).
القماش مخمل أصلي ضد البقع لون بيج مع كحلي، الخشب زان طبيعي ثقيل ممتاز بدون أي هبوط بالإسفنج.
الاستخدام خفيف جداً في مجلس الضيوف ونظيف جداً كالجديد.
سعر الشراء كان بـ 12,500 ريال.
المطلوب للبيع السريع: 3,500 ريال فقط نهائي.
الموقع: الرياض - حي الصحافة.
الرجاء الجادين فقط التواصل: 0567788990`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80'
    ],
    parsed: {
      title: 'طقم كنب تركي مودرن 9 أشخاص + طاولات رخام - زان طبيعي',
      category: 'FURNITURE',
      subCategory: 'أطقم كنب ومجالس',
      price: 3500,
      currency: 'SAR',
      originalPriceText: '3,500 ريال نهائي (سعر الشراء 12,500)',
      isPriceNegotiable: false,
      condition: 'EXCELLENT',
      location: 'الرياض - حي الصحافة',
      city: 'الرياض',
      contact: {
        phone: '0567788990',
        whatsapp: '966567788990',
      },
      specifications: {
        'النوع والمنشأ': 'طقم كنب تركي فاخر',
        'سعة الجلوس': '9 مقاعد (3+2+4 فوتيه)',
        'نوع الخشب': 'خشب زان طبيعي',
        'نوع القماش': 'مخمل تركي مقاوم للبقع',
        'الملحقات': 'طاولة وسط رخام + 4 طاولات خدمة',
        'سبب البيع': 'داعي السفر النهائي',
      },
      keyTags: ['كنب تركي', '9 مقاعد', 'خشب زان', 'طاولة رخام', 'حي الصحافة', 'فرصة سفر'],
      summary: 'طقم كنب راقي من خشب الزان مع طاولات رخامية بحالة ممتازة وبأقل من ثلث سعره الأصلي.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_06',
    facebookPostId: 'fb_post_918273645',
    groupId: 'grp_02',
    groupName: 'سوق الإلكترونيات والهواتف الذكية (كسر زيرو) 📱',
    author: {
      name: 'عمر التميمي',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    rawContent: `للبيع سامسونج جالاكسي إس 24 ألترا (Samsung Galaxy S24 Ultra) النسخة العالمية 5G.
المساحة: 512 جيجابايت مع رام 12GB.
اللون: رمادي تيتانيوم (Titanium Gray).
الجهاز مفتوح فقط للتجربة خالي من أي خدش ومركب عليه حماية شاشة وكفر أصلي.
يدعم مزايا الذكاء الاصطناعي Galaxy AI باللغة العربية بالكامل، مع القلم S-Pen الأصلي.
السعر المطلوب: 3,950 ريال (سعر السوق 5,399 ريال).
المكان: مكة المكرمة - العوالي.
للتواصل واتس أو اتصال: 0533221199`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
    ],
    parsed: {
      title: 'سامسونج Galaxy S24 Ultra مساحة 512GB تيتانيوم رمادي',
      category: 'PHONES',
      subCategory: 'Samsung Galaxy',
      price: 3950,
      currency: 'SAR',
      originalPriceText: '3,950 ريال',
      isPriceNegotiable: true,
      condition: 'LIKE_NEW',
      location: 'مكة المكرمة - حي العوالي',
      city: 'مكة المكرمة',
      contact: {
        phone: '0533221199',
        whatsapp: '966533221199',
      },
      specifications: {
        'الموديل': 'Samsung Galaxy S24 Ultra',
        'سعة التخزين': '512GB',
        'الرام RAM': '12GB',
        'اللون': 'تيتانيوم رمادي Titanium Gray',
        'الكاميرا': '200 ميجابكسل مع زوم 100x',
        'القلم': 'S-Pen مدمج أصلي',
        'ميزات الذكاء': 'Galaxy AI مفعل بالكامل',
      },
      keyTags: ['سامسونج', 'S24 Ultra', '512GB', 'Galaxy AI', 'S-Pen', 'تيتانيوم'],
      summary: 'إس 24 ألترا نسخة 512 جيجا كسر زيرو خالي تماماً من الخدوش مع القلم والملحقات.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_07',
    facebookPostId: 'fb_post_339182745',
    groupId: 'grp_01',
    groupName: 'حراج ومزاد السيارات الحديثة والمستعملة 🚗',
    author: {
      name: 'سلطان الحربي',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    rawContent: `هيونداي توسان (Hyundai Tucson) موديل 2021 سمارت بلس.
ممشى حقيقي 62,000 كم فقط، صيانة منتظمة بالوكالة مع سجل كامل.
ماكينة 2.0 لتر 4 سلندر موفرة جداً، جير أوتوماتيك 6 سرعات.
شاشة معلومات لمس تدعم Apple CarPlay و Android Auto، كاميرا خلفية، مثبت سرعة، جنوط سبور 18 بوصة.
السيارة خالية من الصدمات والدهان وكالة عدا تعديل بدون بوية في الرفرف الخلفي.
السعر: 64,000 ريال (قابل للتفاوض البسيط بعد الفحص).
الموقع: الخبر - الشرقية.
للتواصل الجاد: 0558899001`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    ],
    parsed: {
      title: 'هيونداي توسان 2021 سمارت بلس - ممشى 62 ألف كم',
      category: 'CARS',
      subCategory: 'Hyundai Tucson',
      price: 64000,
      currency: 'SAR',
      originalPriceText: '64,000 ريال (قابل للتفاوض)',
      isPriceNegotiable: true,
      condition: 'EXCELLENT',
      location: 'الخبر - المنطقة الشرقية',
      city: 'الخبر',
      contact: {
        phone: '0558899001',
        whatsapp: '966558899001',
      },
      specifications: {
        'الشركة والموديل': 'Hyundai Tucson Smart Plus',
        'سنة الصنع': '2021',
        'الممشى': '62,000 كم',
        'المحرك': '2.0L 4 سلندر',
        'ناقل الحركة': 'أوتوماتيك',
        'الأنظمة': 'Apple CarPlay, كاميرا, مثبت سرعة',
      },
      keyTags: ['هيونداي توسان', '2021', 'صيانة وكالة', 'ممشى 62 الف', 'شاشة وكاميرا'],
      summary: 'سيارة دفع رباعي عائلية ممتازة بصيانة منتظمة وممشى منخفض وسعر منافس.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_08',
    facebookPostId: 'fb_post_110293847',
    groupId: 'grp_05',
    groupName: 'سوق اللابتوبات وأجهزة الجيمنج الاحترافية 💻',
    author: {
      name: 'مروان البكري',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    rawContent: `للبيع بلايستيشن 5 سليم (PlayStation 5 Slim Digital Edition) النسخة الرقمية الجديدة مساحة 1 تيرابايت.
الجهاز تم شراؤه منذ شهرين، استخدام معدود ومعه:
- 2 يد تحكم أصلية DualSense (واحدة بيضاء وواحدة سوداء)
- قاعدة شحن الأيدي الأصلية من سوني
- حساب به اشتراك بلايستيشن بلس مفعل لمدة 6 أشهر مع ألعاب محملة مثل FC 24 و Spider-Man 2
السعر المطلوب: 1,650 ريال نهائي.
المكان: الرياض - حي النرجس.
رقم الواتساب: 0549988112`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    ],
    parsed: {
      title: 'بلايستيشن 5 سليم 1TB + 2 يد تحكم + قاعدة شحن وحساب ألعاب',
      category: 'ELECTRONICS',
      subCategory: 'Gaming Consoles',
      price: 1650,
      currency: 'SAR',
      originalPriceText: '1,650 ريال نهائي',
      isPriceNegotiable: false,
      condition: 'LIKE_NEW',
      location: 'الرياض - حي النرجس',
      city: 'الرياض',
      contact: {
        phone: '0549988112',
        whatsapp: '966549988112',
      },
      specifications: {
        'النوع': 'Sony PlayStation 5 Slim Digital',
        'سعة التخزين': '1TB SSD فائقة السرعة',
        'الملحقات المرفقة': '2 يد تحكم DualSense + قاعدة شحن أصلية',
        'حالة الجهاز': 'استخدام شهرين كسر زيرو بالكرتونة',
        'ميزات إضافية': 'حساب به ألعاب مفعلة وPS Plus 6 أشهر',
      },
      keyTags: ['PS5 Slim', '1TB', '2 يد تحكم', 'سوني', 'العاب محملة', 'حي النرجس'],
      summary: 'جهاز PS5 سليم رقمي مع يدين تحكم وقاعدة شحن واشتراك ألعاب جاهز للعب مباشرة.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_09',
    facebookPostId: 'fb_post_883920112',
    groupId: 'grp_03',
    groupName: 'سوق العقارات والشقق للبيع والإيجار المباشر 🏠',
    author: {
      name: 'المهندس طارق السعيد',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    rawContent: `شقة للبيع بالتجمع الخامس - القاهرة الجديدة (حي اللوتس الشمالية أمام التسعين الشمالي مباشرة).
المساحة: 175 متر مربع - الدور الثالث بحري صريح غير مجروحة بفيو حديقة كبيرة.
التقسيم الداخلي:
- 3 غرف نوم كبيرة (منهم غرفة ماستر بدريسنج وحمام)
- ريسيبشن 3 قطع واسع
- 2 حمام إضافي + مطبخ واسع
- تشطيب ألترا سوبر لوكس (أرضيات بورسلين إسباني، سباكة جروهي مع ضمان مدى الحياة، ديكورات جبسوم بورد وإضاءات LED).
العمارة بها أسانسير مستورد، حصة بالأرض والجراج، وأمن وحراسة.
السعر الإجمالي كاش: 3,450,000 جنيه مصري (متاح إمكانية تقسيط بسيط على سنة).
للتواصل المباشر مع المالك: 01012345678 واتس ومكالمات.`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
    ],
    parsed: {
      title: 'شقة 175م التجمع الخامس اللوتس تشطيب ألترا سوبر لوكس بحري',
      category: 'REAL_ESTATE',
      subCategory: 'شقق للبيع',
      price: 3450000,
      currency: 'EGP',
      originalPriceText: '3,450,000 جنيه كاش (متاح تسهيلات)',
      isPriceNegotiable: true,
      condition: 'BRAND_NEW',
      location: 'القاهرة الجديدة - التجمع الخامس (حي اللوتس)',
      city: 'القاهرة',
      contact: {
        phone: '01012345678',
        whatsapp: '201012345678',
      },
      specifications: {
        'المساحة': '175 متر مربع',
        'الدور': 'الدور الثالث (يوجد أسانسير)',
        'عدد الغرف': '3 غرف نوم (غرفة ماستر)',
        'الحمامات': '3 حمامات تشطيب جروهي',
        'مستوى التشطيب': 'ألترا سوبر لوكس بورسلين إسباني',
        'الموقع والفيو': 'بحري صريح غير مجروحة إطلالة حديقة',
      },
      keyTags: ['التجمع الخامس', '175 متر', '3 غرف', 'التشطيب سوبر لوكس', 'حصة جراج', 'القاهرة الجديدة'],
      summary: 'شقة فاخرة جاهزة للسكن فوراً بموقع استراتيجي بالتجمع الخامس وتشطيب فندقي.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_10',
    facebookPostId: 'fb_post_229103847',
    groupId: 'grp_04',
    groupName: 'أثاث ومستلزمات منزلية راقية مستعمل وجديد 🛋️',
    author: {
      name: 'خالد السبيعي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    rawContent: `للبيع ثلاجة إل جي LG إنفيرتر سمارت ديجيتال بابين دولابي (Door-in-Door) سعة 26 قدم (650 لتر).
اللون ستانلس ستيل رمادي فاخر مضاد للبصمات.
خاصية Hygiene Fresh لتعقيم الهواء، صانع ثلج وموزع مياه خارجي، شاشة لمس وواي فاي للتحكم من تطبيق ThinQ.
توفير ممتاز للكهرباء A+++، تبريد سريع فائق الهدوء.
حالة الجهاز ممتازة جداً ونظيفة، استخدام سنة وشهرين فقط.
السعر المطلوب: 3,800 ريال (سعرها جديدة بالصندوق فوق 7,500 ريال).
الموقع: جدة - حي السامر.
للتواصل عبر الواتساب: 0503344556`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    ],
    parsed: {
      title: 'ثلاجة إل جي LG إنفرتر دولابي 26 قدم سمارت واي فاي',
      category: 'APPLIANCES',
      subCategory: 'ثلاجات وفريزر',
      price: 3800,
      currency: 'SAR',
      originalPriceText: '3,800 ريال (سعر الشراء 7,500+)',
      isPriceNegotiable: true,
      condition: 'EXCELLENT',
      location: 'جدة - حي السامر',
      city: 'جدة',
      contact: {
        phone: '0503344556',
        whatsapp: '966503344556',
      },
      specifications: {
        'الماركة': 'LG Smart Inverter',
        'السعة والحجم': '26 قدم (650 لتر)',
        'التصميم': 'بابين دولابي Door-in-Door ستانلس ستيل',
        'الميزات': 'موزع مياه وثلج، Hygiene Fresh، واي فاي ThinQ',
        'استهلاك الطاقة': 'إنفيرتر توفير كهرباء A+++',
        'مدة الاستخدام': 'سنة وشهرين فقط',
      },
      keyTags: ['ثلاجة LG', '26 قدم', 'إنفيرتر', 'دولابي', 'موزع ثلج', 'جدة'],
      summary: 'ثلاجة LG ذكية موفرة للطاقة بموزع ماء وثلج وشاشة لمس بحالة كالجديدة.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_11',
    facebookPostId: 'fb_post_667281920',
    groupId: 'grp_02',
    groupName: 'سوق الإلكترونيات والهواتف الذكية (كسر زيرو) 📱',
    author: {
      name: 'زياد السعيد',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    rawContent: `ساعة أبل واتش ألترا الجيل الثاني Apple Watch Ultra 2 مقاس 49mm الأصلية تيتانيوم.
مع السوار البرتقالي Ocean Band + سوار إضافي Trail Loop هدية.
الساعة شبه جديدة، استخدام مناسبات قليلة جداً، بطارية 100%.
مقاومة للماء حتى عمق 100 متر، بطارية تدوم 3 أيام، شاشة 3000 شمعة ساطعة تحت الشمس.
مع العلبة الأصلية والشاحن المغناطيسي السريع.
المطلوب: 2,550 ريال.
الموقع: الرياض أو شحن سمسا.
للتواصل واتس: 0557766554`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    ],
    parsed: {
      title: 'ساعة أبل واتش ألترا 2 تيتانيوم 49 مم بطارية 100%',
      category: 'PHONES',
      subCategory: 'ساعات ذكية Smart Watches',
      price: 2550,
      currency: 'SAR',
      originalPriceText: '2,550 ريال',
      isPriceNegotiable: false,
      condition: 'LIKE_NEW',
      location: 'الرياض',
      city: 'الرياض',
      contact: {
        phone: '0557766554',
        whatsapp: '966557766554',
      },
      specifications: {
        'الموديل': 'Apple Watch Ultra 2 (49mm)',
        'المادة': 'تيتانيوم خفيف متين تيتانيوم أسود/طبيعي',
        'صحة البطارية': '100% تدوم حتى 72 ساعة',
        'الأساور المرفقة': 'Ocean Band برتقالي + Trail Loop هدية',
        'مقاومة الماء': '100 متر معتمدة للغوص',
      },
      keyTags: ['ابل واتش الترا 2', '49mm', 'تيتانيوم', 'بطارية 100%', 'سوارين'],
      summary: 'ساعة Apple Ultra 2 تيتانيوم بحالة الوكالة وبطارية 100% مع كامل ملحقاتها.',
      aiAnalyzed: true,
    },
    saved: false,
  },
  {
    id: 'post_12',
    facebookPostId: 'fb_post_991827465',
    groupId: 'grp_05',
    groupName: 'سوق اللابتوبات وأجهزة الجيمنج الاحترافية 💻',
    author: {
      name: 'يوسف الحلواني',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    rawContent: `جهاز لابتوب ماك بوك برو Apple MacBook Pro 16 بوصة معالج M2 Max الخارق.
- الرام: 32 جيجابايت موحدة Unified Memory
- التخزين: 1 تيرابايت SSD
- الشاشة: Liquid Retina XDR بتردد 120Hz ProMotion
- البطارية: 97% مع 32 دورة شحن فقط
الجهاز وارد دبي، كيبورد عربي وإنجليزي أصلي، بدون أي خدش إطلاقاً.
مطلوب: 9,200 درهم أو ما يعادلها 9,400 ريال.
الموقع: دبي - البرشاء / والتسليم يد بيد بعد الفحص.
رقم المالك: 0501122334 واتساب.`,
    mediaUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    ],
    parsed: {
      title: 'ماك بوك برو 16 بوصة M2 Max رام 32GB مساحة 1TB SSD',
      category: 'ELECTRONICS',
      subCategory: 'Apple MacBooks',
      price: 9200,
      currency: 'AED',
      originalPriceText: '9,200 درهم',
      isPriceNegotiable: true,
      condition: 'LIKE_NEW',
      location: 'دبي - البرشاء',
      city: 'دبي',
      contact: {
        phone: '0501122334',
        whatsapp: '971501122334',
      },
      specifications: {
        'المعالج': 'Apple Silicon M2 Max (12-Core CPU, 38-Core GPU)',
        'الرام RAM': '32GB Unified Memory',
        'سعة التخزين': '1TB SSD فائقة السرعة',
        'الشاشة': '16.2" Liquid Retina XDR 120Hz',
        'حالة البطارية': '97% مع 32 دورة شحن فقط',
        'الكيبورد': 'عربي/إنجليزي أصلي وكالة',
      },
      keyTags: ['MacBook Pro', 'M2 Max', '16 بوصة', '32GB RAM', '1TB SSD', 'دبي'],
      summary: 'ماك بوك برو 16 بوصة M2 Max للمحترفين والمصممين بمواصفات جبارة وحالة وكالة.',
      aiAnalyzed: true,
    },
    saved: true,
  }
];
