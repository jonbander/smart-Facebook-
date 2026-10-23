import React, { useState } from 'react';
import { X, Sparkles, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { FacebookGroup, MarketplacePost } from '../types';
import { analyzePostWithAI } from '../services/api';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: FacebookGroup[];
  onPostAdded: (newPost: MarketplacePost) => void;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({
  isOpen,
  onClose,
  groups,
  onPostAdded,
}) => {
  const [content, setContent] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || 'grp_01');
  const [authorName, setAuthorName] = useState('أحمد العتيبي');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyzeAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('يرجى لصق نص المنشور أولاً');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const parsedData = await analyzePostWithAI(content);
      const targetGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

      const newPost: MarketplacePost = {
        id: 'post_custom_' + Date.now(),
        facebookPostId: 'fb_post_' + Math.floor(Math.random() * 100000000),
        groupId: targetGroup.id,
        groupName: targetGroup.name,
        author: {
          name: authorName || 'معلن جديد',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        },
        createdAt: new Date().toISOString(),
        rawContent: content.trim(),
        mediaUrls: [
          parsedData.category === 'PHONES' ? 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600' :
          parsedData.category === 'CARS' ? 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600' :
          parsedData.category === 'REAL_ESTATE' ? 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' :
          parsedData.category === 'FURNITURE' ? 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' :
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'
        ],
        parsed: parsedData,
        saved: false,
      };

      onPostAdded(newPost);
      setIsAnalyzing(false);
      onClose();
    } catch (err: any) {
      console.error('Error analyzing post:', err);
      setError('حدث خطأ أثناء تحليل المنشور: ' + err.message);
      setIsAnalyzing(false);
    }
  };

  const handlePasteSample = (type: 'iphone' | 'camry' | 'apt') => {
    if (type === 'iphone') {
      setContent(`للبيع ايفون 14 برو ماكس ذهبي مساحة 256 جيجا
البطارية 94% استخدام راقي جداً خالي من أي خدش
معاه الكرتونة الأصلية والشاحن السريع
السعر المطلوب: 3100 ريال قابل للتفاوض البسيط
الموقع: الرياض - حي الصحافة
للتواصل واتس: 0559988771`);
    } else if (type === 'camry') {
      setContent(`نيسان باترول بلاتينيوم 2021 V8 محرك 400 حصان
عداد 55 ألف كم صيانة بترومين منتظمة
فتحة سقف، رادار، نقط عمياء، 5 كاميرات 360، شاشات خلفية، جلد زعفراني
البودي وكالة فحص كمبيوتر شرط
السعر: 195 ألف ريال
جدة - حي الشاطئ
جوال: 0501234567`);
    } else {
      setContent(`شقة روف راقية للإيجار السنوي في دبي مارينا
مساحة 150 متر 3 غرف وصالة واسعة + بلكونة مطلة على المارينا
مفروشة بالكامل أثاث فندقي مع باركينج خاص وجيم ومسبح
المطلوب: 120 ألف درهم سنوياً على 4 دفعات
للتواصل والمعاينة: 0541122334`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                تحليل وتصنيف منشور فيسبوك جديد
              </h3>
              <p className="text-xs text-slate-500">
                الصق أي منشور خام من مجموعات البيع وسيقوم النظام بتصنيفه آلياً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAnalyzeAndSave} className="p-6 space-y-4 text-right">
          
          {/* Quick Samples */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                اختر نموذجاً جاهزاً للتجربة السريعة:
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePasteSample('iphone')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
              >
                📱 آيفون 14 برو
              </button>
              <button
                type="button"
                onClick={() => handlePasteSample('camry')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
              >
                🚗 سيارة باترول 2021
              </button>
              <button
                type="button"
                onClick={() => handlePasteSample('apt')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              >
                🏠 شقة روف في دبي
              </button>
            </div>
          </div>

          {/* Raw Text Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              نص المنشور كما هو في مجموعة فيسبوك:
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="الصق نص المنشور هنا (بما في ذلك السعر، المواصفات، رقم الهاتف، والمكان)..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Group Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                المجموعة المصدر:
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                اسم الناشر (صاحب الحساب):
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="اسم البائع"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <span className="inline-block animate-pulse">جاري التحليل واستخراج المواصفات...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>تحليل وتصنيف المنشور وإضافته للجدول</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
