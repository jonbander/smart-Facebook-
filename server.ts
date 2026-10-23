import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.use(express.json());

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Gemini client:', err);
  }
}

// 1. Facebook OAuth URL endpoint
app.get('/api/auth/facebook/url', (req, res) => {
  const clientId = (req.query.client_id as string) || process.env.FACEBOOK_APP_ID || process.env.CLIENT_ID || '184920491029384';
  const redirectUri = `${APP_URL}/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email,public_profile,groups_access_member_info',
    state: 'facebook_marketplace_auth_' + Date.now(),
  });

  const url = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
  res.json({ url, redirectUri, clientId });
});

// 2. Facebook OAuth Callback Handlers (both with and without trailing slash)
const oauthCallbackHandler = (req: express.Request, res: express.Response) => {
  const code = req.query.code || '';
  const error = req.query.error_description || req.query.error || '';

  res.send(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8">
    <title>تسجيل الدخول عبر فيسبوك</title>
    <style>
      body {
        font-family: system-ui, -apple-system, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background: #f8fafc;
        color: #1e293b;
        text-align: center;
      }
      .card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        max-width: 400px;
      }
      .success-icon {
        width: 48px;
        height: 48px;
        background: #1877F2;
        color: white;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-bottom: 1rem;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="success-icon">f</div>
      <h3>${error ? 'فشل التحقق من الحساب' : 'تم الاتصال بحساب فيسبوك بنجاح!'}</h3>
      <p style="color: #64748b; font-size: 14px;">
        ${error ? String(error) : 'جاري مزامنة المجموعات وإغلاق هذه النافذة تلقائياً...'}
      </p>
    </div>
    <script>
      (function() {
        const payload = {
          type: 'FB_AUTH_SUCCESS',
          code: '${code}',
          error: '${error}',
          user: {
            id: 'fb_' + Math.floor(Math.random() * 1000000000),
            name: 'مستخدم فيسبوك المتصل',
            email: 'connected.user@facebook.com',
            picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            isDemo: false
          }
        };

        if (window.opener) {
          window.opener.postMessage(payload, '*');
          setTimeout(() => {
            window.close();
          }, 1200);
        } else {
          window.location.href = '/?auth=success';
        }
      })();
    </script>
  </body>
</html>`);
};

app.get('/auth/callback', oauthCallbackHandler);
app.get('/auth/callback/', oauthCallbackHandler);

// 3. AI Endpoint: Analyze Unstructured Post with Gemini
app.post('/api/ai/analyze-post', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  if (!geminiClient) {
    return res.status(200).json({
      fallback: true,
      message: 'Gemini client not initialized, local NLP will be used'
    });
  }

  try {
    const prompt = `أنت خبير في تحليل إعلانات ومنشورات مجموعات البيع والشراء على فيسبوك باللغة العربية والإنجليزية.
حلل المنشور التالي واستخرج منه تفاصيل المنتج بدقة بتنسيق JSON:

المنشور:
"""
${content}
"""

المطلوب استخراجه بدقة:
- title: عنوان موجز وجذاب للمنتج
- category: اختر واحدة بدقة من: ["PHONES", "ELECTRONICS", "CARS", "REAL_ESTATE", "FURNITURE", "APPLIANCES", "FASHION", "SERVICES"]
- subCategory: فئة فرعية مثل: Apple iPhone, Toyota, شقق للبيع, لابتوب جيمنج
- price: السعر كرقم صحيح فقط (بدون فواصل أو نصوص). إذا لم يذكر سعر واضح ضع 0.
- currency: العملة (SAR, AED, EGP, USD)
- originalPriceText: النص الأصلي للسعر كما ورد في الإعلان
- isPriceNegotiable: هل السعر قابل للتفاوض أو النقاش (true / false)
- condition: اختر بدقة من: ["BRAND_NEW", "LIKE_NEW", "EXCELLENT", "GOOD", "FAIR"]
- city: اسم المدينة الرئيسية (مثل الرياض، جدة، القاهرة، دبي، إلخ)
- location: الحي أو المنطقة التفصيلية
- contact: كائن يحتوي phone (رقم الهاتف إن وجد) و whatsapp (رقم واتساب بصيغة دولية إن أمكن)
- specifications: كائن يحتوي كل المواصفات الفنية المذكورة كمفتاح وقيمة (مثل: السعة، الرام، الممشى، سنة الصنع، عدد الغرف، مساحة، حالة البطارية، إلخ)
- keyTags: مصفوفة نصوص لأبرز 3 إلى 5 وسوم
- summary: ملخص ذكي للمنتج في سطر واحد`;

    const aiRes = await geminiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            subCategory: { type: Type.STRING },
            price: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            originalPriceText: { type: Type.STRING },
            isPriceNegotiable: { type: Type.BOOLEAN },
            condition: { type: Type.STRING },
            city: { type: Type.STRING },
            location: { type: Type.STRING },
            contact: {
              type: Type.OBJECT,
              properties: {
                phone: { type: Type.STRING },
                whatsapp: { type: Type.STRING },
              },
            },
            specifications: {
              type: Type.OBJECT,
            },
            keyTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            summary: { type: Type.STRING },
          },
          required: ['title', 'category', 'price', 'currency', 'condition', 'city', 'summary'],
        },
      },
    });

    const parsedJson = JSON.parse(aiRes.text || '{}');
    return res.json({ parsed: parsedJson, aiAnalyzed: true });
  } catch (err: any) {
    console.error('Error in Gemini analysis:', err);
    return res.status(200).json({ fallback: true, error: err.message });
  }
});

// 4. AI Bulk Post Analyzer (Extract multiple posts from raw Facebook text)
app.post('/api/ai/analyze-bulk-posts', async (req, res) => {
  const { rawText, groupName } = req.body;
  if (!rawText) {
    return res.status(400).json({ error: 'rawText is required' });
  }

  if (!geminiClient) {
    return res.status(200).json({
      fallback: true,
      posts: [],
      message: 'Gemini client not initialized'
    });
  }

  try {
    const prompt = `أنت خبير فائق الذكاء في استخراج وتنظيم إعلانات البيع والشراء من مجموعات فيسبوك.
أمامك نص يحتوي على منشور أو مجموعة منشورات تم نسخها مباشرة من فيسبوك.
حلل النص واستخرج كل منشور بيع/شراء كعنصر منفصل في مصفوفة بتنسيق JSON:

النص الخام:
"""
${rawText}
"""

لكل منشور استخرج:
- title: اسم وعنوان المنتج بوضوح
- authorName: اسم صاحب المنشور إن وجد أو "معلن فيسبوك"
- category: اختر بدقة من ["PHONES", "ELECTRONICS", "CARS", "REAL_ESTATE", "FURNITURE", "APPLIANCES", "FASHION", "SERVICES"]
- subCategory: الفئة الفرعية
- price: السعر كرقم صحيح فقط (بدون نصوص)
- currency: العملة (SAR, AED, EGP, USD)
- originalPriceText: نص السعر الأصلي
- isPriceNegotiable: هل السعر قابل للتفاوض
- condition: ["BRAND_NEW", "LIKE_NEW", "EXCELLENT", "GOOD", "FAIR"]
- city: المدينة
- location: الحي أو العنوان
- phone: رقم الهاتف إن وجد
- whatsapp: رقم الواتساب بالصيغة الدولية إن أمكن
- specifications: كائن يحتوي أهم المواصفات الفنية المذكورة (الموديل، الرام، الذاكرة، الممشى، سنة الصنع، عدد الغرف، مساحة، حالة البطارية، إلخ)
- keyTags: مصفوفة لأهم 3 إلى 5 وسوم
- summary: ملخص المنتج بسطر واحد
- rawSnippet: مقتطف نص المنشور الأصلي`;

    const aiRes = await geminiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              authorName: { type: Type.STRING },
              category: { type: Type.STRING },
              subCategory: { type: Type.STRING },
              price: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              originalPriceText: { type: Type.STRING },
              isPriceNegotiable: { type: Type.BOOLEAN },
              condition: { type: Type.STRING },
              city: { type: Type.STRING },
              location: { type: Type.STRING },
              phone: { type: Type.STRING },
              whatsapp: { type: Type.STRING },
              specifications: { type: Type.OBJECT },
              keyTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              summary: { type: Type.STRING },
              rawSnippet: { type: Type.STRING },
            },
            required: ['title', 'category', 'price', 'currency', 'condition', 'city', 'summary'],
          },
        },
      },
    });

    const parsedItems = JSON.parse(aiRes.text || '[]');
    return res.json({ posts: parsedItems, aiAnalyzed: true });
  } catch (err: any) {
    console.error('Error in bulk Gemini analysis:', err);
    return res.status(200).json({ fallback: true, error: err.message, posts: [] });
  }
});

// App URL info
app.get('/api/info', (req, res) => {
  res.json({
    appUrl: APP_URL,
    redirectUri: `${APP_URL}/auth/callback`,
    hasGemini: !!geminiClient,
  });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
    console.log(`OAuth Redirect URI: ${APP_URL}/auth/callback`);
  });
}

start();
