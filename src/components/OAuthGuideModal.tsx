import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, HelpCircle, Shield, Key } from 'lucide-react';

interface OAuthGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OAuthGuideModal: React.FC<OAuthGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const devCallback = 'https://ais-dev-7mwdqwy45kg2y7tttdbwcq-459152364529.us-east5.run.app/auth/callback';
  const sharedCallback = 'https://ais-pre-7mwdqwy45kg2y7tttdbwcq-459152364529.us-east5.run.app/auth/callback';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">دليل إعداد تطبيق فيسبوك (Meta Developers)</h3>
              <p className="text-xs text-blue-100">
                خطوات الربط الحقيقي مع Facebook Graph API ومجموعات البيع والشراء
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-right text-xs text-slate-700 dark:text-slate-300">
          
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
              <span>إنشاء تطبيق على منصة مطوري ميتا (Meta for Developers):</span>
            </h4>
            <p className="pr-8 text-slate-600 dark:text-slate-400">
              ادخل على <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">منصة مطوري فيسبوك <ExternalLink className="w-3 h-3" /></a> ثم أنشئ تطبيقاً جديداً من نوع <strong>Consumer</strong> أو <strong>Business</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
              <span>إضافة منتج تسجيل الدخول بفيسبوك (Facebook Login):</span>
            </h4>
            <p className="pr-8 text-slate-600 dark:text-slate-400">
              من القائمة الجانبية أضف منتج <strong>Facebook Login for Business</strong>، ثم في إعدادات <strong>Settings</strong> ضع روابط إعادة التوجيه المعتمدة (Valid OAuth Redirect URIs) التالية:
            </p>

            {/* Callback URL 1: Dev */}
            <div className="pr-8 space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate dir-ltr select-all">
                  {devCallback}
                </span>
                <button
                  onClick={() => copyToClipboard(devCallback, 'dev')}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center gap-1 shrink-0"
                >
                  {copiedKey === 'dev' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>نسخ الرابط</span>
                </button>
              </div>

              {/* Callback URL 2: Shared */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate dir-ltr select-all">
                  {sharedCallback}
                </span>
                <button
                  onClick={() => copyToClipboard(sharedCallback, 'shared')}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 shrink-0"
                >
                  {copiedKey === 'shared' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>نسخ رابط المشاركة</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
              <span>الصلاحيات المطلوبة (Permissions):</span>
            </h4>
            <div className="pr-8 space-y-1.5">
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <code className="font-bold text-blue-700 dark:text-blue-300">public_profile</code> & <code className="font-bold text-blue-700 dark:text-blue-300">email</code>: لقراءة اسم المستخدم والصورة الشخصية.
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
                <code className="font-bold text-indigo-700 dark:text-indigo-300">groups_access_member_info</code>: للوصول إلى معلومات المنشورات في المجموعات التي اشترك بها المستخدم.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">4</span>
              <span>التجربة الفورية بدون انتظار موافقة فيسبوك:</span>
            </h4>
            <p className="pr-8 text-slate-600 dark:text-slate-400 leading-relaxed">
              نظراً لأن شركة Meta تتطلب مراجعة رسمية (App Review) للصلاحيات المتقدمة، يوفر هذا التطبيق وضع <strong>الحساب التجريبي الفوري</strong> المحاكي الذي يحتوي على 5 مجموعات وأكثر من 30 منشوراً حقيقياً ومحدثاً بمواصفات وأسعار قابلة للفلترة والبحث المباشر.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            فهمت ذلك، إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
