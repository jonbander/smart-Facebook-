import { MarketplaceCategory, ProductCondition, ParsedProductData } from '../types';

export function parseRawFacebookPost(rawText: string): ParsedProductData {
  const text = rawText || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || 'منتج معروض للبيع';

  // 1. Category Detection
  let category: MarketplaceCategory = 'ELECTRONICS';
  const lower = text.toLowerCase();

  if (
    /ايفون|آيفون|iphone|سامسونج|samsung|شاومي|xiaomi|هاتف|جوال|موبايل|ساعة أبل|apple watch|برو ماكس|pro max/i.test(text)
  ) {
    category = 'PHONES';
  } else if (
    /تويوتا|كامري|هيونداي|توسان|نيسان|مرسيدس|بي ام|bmw|سيارة|سيارات|ممشى|قير|موديل 20|سلندر|شاص/i.test(text)
  ) {
    category = 'CARS';
  } else if (
    /شقة|شقق|فيلا|روف|عقار|أرض|ايجار|إيجار|للبيع شقة|متر مربع|غرف نوم|دبي مارينا|التجمع|كمبوند/i.test(text)
  ) {
    category = 'REAL_ESTATE';
  } else if (
    /كنب|طقم|صالون|غرفة نوم|طاولة|أثاث|سفرة|دولاب|مخمل|زان|مجلس/i.test(text)
  ) {
    category = 'FURNITURE';
  } else if (
    /ثلاجة|غسالة|شاشة tv|مكيف|سبليت|فرن|ميكروويف|lg|سامسونج tv/i.test(text)
  ) {
    category = 'APPLIANCES';
  } else if (
    /لابتوب|كمبيوتر|pc|بلايستيشن|ps5|ps4|rtx|معالج|رام|ram|ssd|macbook|ماك بوك|جيمنج|شاشة 240/i.test(text)
  ) {
    category = 'ELECTRONICS';
  } else if (
    /ساعة|رولكس|عطر|شنطة|فستان|بدلة|ذهب|موضة|حذاء/i.test(text)
  ) {
    category = 'FASHION';
  }

  // 2. Price Detection
  let price = 0;
  let currency = 'SAR';
  let originalPriceText = '';

  const priceMatch = text.match(/(?:سعر|مطلوب|بـ|السعر|بمبلغ|المبلغ)\s*:?\s*([0-9,]+)\s*(ريال|درهم|جنيه|دولار|\$|sar|aed|egp|usd)?/i)
    || text.match(/([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,7})\s*(ريال|درهم|جنيه|دولار|\$|sar|aed|egp|usd)/i);

  if (priceMatch) {
    const rawNum = priceMatch[1].replace(/,/g, '');
    price = parseInt(rawNum, 10) || 0;
    const currStr = (priceMatch[2] || '').toLowerCase();
    if (currStr.includes('درهم') || currStr.includes('aed')) currency = 'AED';
    else if (currStr.includes('جنيه') || currStr.includes('egp')) currency = 'EGP';
    else if (currStr.includes('دولار') || currStr.includes('$') || currStr.includes('usd')) currency = 'USD';
    else currency = 'SAR';
    originalPriceText = `${price.toLocaleString()} ${currency}`;
  }

  // 3. Negotiability
  const isPriceNegotiable = /قابل للتفاوض|قابل للنقاش|للتفاوض|سمح|على السوم|سوم/i.test(text) && !/نهائي|غير قابل/i.test(text);

  // 4. Condition
  let condition: ProductCondition = 'GOOD';
  if (/جديد بالكرتون|بقراطيسه|جديد تماما|لم يستخدم|زيرو|وكالة/i.test(text)) {
    condition = 'BRAND_NEW';
  } else if (/كسر زيرو|شبه جديد|استخدام أسبوع|استخدام خفيف|شبه وكالة/i.test(text)) {
    condition = 'LIKE_NEW';
  } else if (/ممتاز|نظيف جدا|على الشرط|بدون خدوش/i.test(text)) {
    condition = 'EXCELLENT';
  }

  // 5. City and Location
  let city = 'الرياض';
  let location = 'غير محدد';
  const cities = [
    'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'القاهرة', 'الجيزة',
    'الإسكندرية', 'دبي', 'أبوظبي', 'الشارقة', 'التجمع الخامس', 'المنامة', 'الكويت'
  ];
  for (const c of cities) {
    if (text.includes(c)) {
      city = c;
      break;
    }
  }

  const locMatch = text.match(/(?:المكان|الموقع|العنوان|في|حي)\s*:?\s*([^\n.,]{3,35})/i);
  if (locMatch) {
    location = locMatch[1].trim();
  } else {
    location = city;
  }

  // 6. Phone / Contact Extraction
  let phone = '';
  let whatsapp = '';
  const phoneMatch = text.match(/(?:00|\+)?(966|971|20|965)?[0-9]{9,11}/);
  if (phoneMatch) {
    phone = phoneMatch[0];
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('05')) clean = '966' + clean.slice(1);
    else if (clean.startsWith('01')) clean = '20' + clean.slice(1);
    whatsapp = clean;
  }

  // 7. Specifications
  const specifications: Record<string, string> = {};
  const keyTags: string[] = [];

  // Memory/Storage
  const storageMatch = text.match(/([0-9]{2,4})\s*(?:جيجا|تيرابايت|ترا|تيرابايت|gb|tb)/i);
  if (storageMatch) {
    const val = storageMatch[0].toUpperCase();
    specifications['السعة التخزينية'] = val;
    keyTags.push(val);
  }

  // Battery health
  const battMatch = text.match(/(?:بطارية|صحة البطارية)\s*:?\s*([0-9]{2,3}%?)/i);
  if (battMatch) {
    const val = battMatch[1].includes('%') ? battMatch[1] : `${battMatch[1]}%`;
    specifications['البطارية'] = val;
    keyTags.push(`بطارية ${val}`);
  }

  // Year/Model for cars
  const yearMatch = text.match(/(?:موديل|سنة)\s*:?\s*(20[12][0-9])/i);
  if (yearMatch) {
    specifications['سنة الموديل'] = yearMatch[1];
    keyTags.push(`موديل ${yearMatch[1]}`);
  }

  // Mileage
  const kmMatch = text.match(/([0-9,]{2,7})\s*(?:ألف كم|كم|كيلو|km)/i);
  if (kmMatch) {
    specifications['الممشى'] = `${kmMatch[1]} كم`;
    keyTags.push(`${kmMatch[1]} كم`);
  }

  // Area for Real Estate
  const areaMatch = text.match(/([0-9]{2,4})\s*(?:متر|م2|متر مربع|قدم)/i);
  if (areaMatch) {
    specifications['المساحة'] = areaMatch[0];
    keyTags.push(areaMatch[0]);
  }

  // Generate Title from first line or extracted keywords
  let title = firstLine.replace(/^(للبيع|معروض|عرض|ما شاء الله|فرصة)\s*:?/i, '').trim();
  if (title.length > 60) {
    title = title.substring(0, 58) + '...';
  }
  if (!title || title.length < 5) {
    title = `معروض للبيع في ${city}`;
  }

  return {
    title,
    category,
    price,
    currency,
    originalPriceText: originalPriceText || (price > 0 ? `${price} ${currency}` : 'على السوم'),
    isPriceNegotiable,
    condition,
    location,
    city,
    contact: {
      phone: phone || undefined,
      whatsapp: whatsapp || undefined,
    },
    specifications,
    keyTags: keyTags.length ? keyTags : [city, category],
    summary: text.slice(0, 120) + (text.length > 120 ? '...' : ''),
    aiAnalyzed: false,
  };
}
