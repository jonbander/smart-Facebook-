import React, { useState } from 'react';
import { X, Sparkles, Upload, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { MarketplacePost } from '../types';
import { analyzeBulkPostsWithAI } from '../services/api';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkImportSuccess: (newPosts: MarketplacePost[], replaceExisting: boolean) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onBulkImportSuccess,
}) => {
  const [groupName, setGroupName] = useState('مجموعتي الخاصة للبيع والشراء');
  const [rawText, setRawText] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setError('يرجى لصق نص المنشورات أولاً');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const posts = await analyzeBulkPostsWithAI(rawText, groupName.trim());
      if (posts.length === 0) {
        setError('لم نتمكن من استخراج منتجات من النص. تأكد من أن النص يحتوي على تفاصيل بيع أو أسعار.');
        setIsProcessing(false);
        return;
      }

      onBulkImportSuccess(posts, replaceExisting);
      setIsProcessing(false);
      onClose();
    } catch (err: any) {
      setError('حدث خطأ أثناء المعالجة: ' + err.message);
      setIsProcessing(false);
    }
  };

  const handlePasteRealSample = () => {
    setGroupName('حراج الرياض للسيارات والإلكترونيات');
    setRawText(`للبيع تيسلا موديل 3 موديل 2023 Long Range
الممشى 22 ألف كم فقط شحن سريع أوتوبايلوت مفعل
اللون رمادي مطفي بطارية سليمة 100% مع الشاحن المنزلي
مطلوب 135 ألف ريال نهائي
الرياض - حي الياسمين
واتس: 0551239876
---
معروض للبيع آيفون 15 برو أزرق 128 جيجا
بطارية 96% نظيف جدا مع الكرتونة
السعر 3300 ريال
الرياض
للتواصل: 0544556677
---
للإيجار شقة فاخرة عوائل حي النرجس بالرياض
3 غرف وصالة ودورتين مياه ومطبخ راكب ومكيفات سبليت راكبة
الإيجار السنوي 48,000 ريال دفعتين
للمعاينة اتصال: 0509871234`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">استيراد منشورات مجموعتك الحقيقية من فيسبوك</h3>
              <p className="text-xs text-blue-100">
                الصق أي منشورات نسختها من مجموعتك ليتم تصنيفها وجدولتها فوراً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-right">
          
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>كيف تعمل هذه الأداة؟</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              ادخل على مجموعتك في فيسبوك، حدد وانسخ منشور أو عدة منشورات (سواء كانت سيارات، أجهزة، عقارات، هواتف)، والصقها في المربع أدناه. سيقوم الذكاء الاصطناعي بتفكيك كل إعلان واستخراج عنوانه، سعره، مواصفاته، ورقم الواتساب الخاص بالبائع وجدولتها في جدولك!
            </p>
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم مجموعة فيسبوك المصدر:
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="مثال: حراج السيارات بالرياض أو سوق المستعمل"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Raw Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                الصق نصوص منشورات المجموعة هنا (يمكنك لصق عدة منشورات معاً): <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handlePasteRealSample}
                className="text-[11px] text-blue-600 font-bold hover:underline"
              >
                جرب بنموذج منشورات حقيقي
              </button>
            </div>
            <textarea
              rows={8}
              required
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="الصق هنا المنشورات التي قمت بنسخها من فيسبوك..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-sans focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Replace Mock Data Option */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-amber-900 dark:text-amber-200">
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>مسح المنشورات التجريبية الافتراضية والاحتفاظ ببيانات مجموعتي فقط</span>
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {isProcessing ? (
              <span className="inline-block animate-pulse">جاري التحليل واستخراج المنتجات بالذكاء الاصطناعي...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>بدء الاستخراج وجدولة منشورات مجموعتي في الجدول</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};
