import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Globe, 
  Lock, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ShieldAlert,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { MarketplacePost } from '../types';
import { autoFetchGroupPosts } from '../services/api';

interface AutoScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrapeSuccess: (posts: MarketplacePost[], replaceExisting: boolean) => void;
}

export const AutoScraperModal: React.FC<AutoScraperModalProps> = ({
  isOpen,
  onClose,
  onScrapeSuccess,
}) => {
  const [groupUrl, setGroupUrl] = useState('https://www.facebook.com/groups/riyadh.marketplace');
  const [groupName, setGroupName] = useState('حراج الرياض للسيارات والأجهزة');
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [showCookiesSection, setShowCookiesSection] = useState(false);
  const [cUser, setCUser] = useState('');
  const [xsToken, setXsToken] = useState('');
  
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingStep, setScrapingStep] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartAutoScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupUrl.trim()) return;

    setIsScraping(true);
    setError(null);
    setLogs([]);

    const addLog = (msg: string) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('ar-EG')}] ${msg}`]);
    };

    addLog('بدء فحص وتجهيز الاتصال بفيسبوك (Unofficial Mobile Crawler)...');
    setScrapingStep('الاتصال بخوادم فيسبوك...');

    try {
      setTimeout(() => addLog(`استهداف المجموعة: ${groupUrl.trim()}`), 400);
      setTimeout(() => addLog('تجاوز جدران الحماية وتحليل محتوى المجموعة بالذكاء الاصطناعي...'), 1000);

      const res = await autoFetchGroupPosts(
        groupUrl.trim(),
        groupName.trim() || undefined,
        cUser.trim() || undefined,
        xsToken.trim() || undefined
      );

      if (res.success && res.posts.length > 0) {
        addLog(`تم استخراج وتصنيف ${res.posts.length} منشورات بيع وشراء بنجاح!`);
        setScrapingStep('اكتملت العملية!');
        setTimeout(() => {
          onScrapeSuccess(res.posts, replaceExisting);
          setIsScraping(false);
          onClose();
        }, 800);
      } else {
        addLog(`تنبيه: ${res.message}`);
        if (res.hitLoginWall && !cUser) {
          setError('المجموعة تتطلب تسجيل دخول للمشاهدة. يمكنك وضع كوكيز الجلسة c_user و xs بالأسفل لجلب المنشورات تلقائياً دون أي قيود.');
          setShowCookiesSection(true);
        } else {
          setError(res.message || 'تعذر استخراج منشورات حالياً.');
        }
        setIsScraping(false);
      }
    } catch (err: any) {
      addLog(`خطأ: ${err.message}`);
      setError('حدث خطأ أثناء الزحف التلقائي: ' + err.message);
      setIsScraping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>الجلب التلقائي المباشر لمجموعات فيسبوك</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
                  Auto Scraper
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                جلب وجدولة المنشورات آلياً برابط المجموعة بدون API وبدون نسخ يدوي
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

        {/* Form Body */}
        <form onSubmit={handleStartAutoScrape} className="p-6 overflow-y-auto space-y-4 text-right">
          
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>كيف يعمل الجلب التلقائي غير النظامي (Direct Scraper)؟</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              يقوم الخادم بمحاكاة متصفح هاتف (Mobile Crawler) والاتصال برابط مجموعة فيسبوك مباشرة لقراءة المنشورات، ثم يقوم الذكاء الاصطناعي باستخراج الأسعار، أرقام الواتساب، والمدن والمواصفات وجدولتها في جدولك فوراً!
            </p>
          </div>

          {/* Group URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رابط مجموعة فيسبوك (Facebook Group URL): <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={groupUrl}
                onChange={(e) => setGroupUrl(e.target.value)}
                placeholder="https://www.facebook.com/groups/اسم-المجموعة-أو-الرقم"
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white dir-ltr text-right"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم المجموعة (للعرض في الجدول):
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="مثال: حراج الرياض للسيارات والأجهزة"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
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
              <span>مسح البيانات التجريبية وعرض منشورات هذه المجموعة فقط في الجدول</span>
            </label>
          </div>

          {/* Optional: Session Cookies (For Private/Secret Groups) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowCookiesSection(!showCookiesSection)}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{showCookiesSection ? 'إخفاء إعدادات كوكيز الجلسة' : 'خيارات متقدمة: إضافة كوكيز الجلسة لجلب المجموعات المغلقة / الخاصة'}</span>
            </button>

            {showCookiesSection && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  إذا كانت المجموعة مغلقة ولا تظهر إلا للأعضاء، يمكنك استخراج كوكيز الجلسة بسهولة من متصفحك (F12 ثم Application ثم Cookies ثم facebook.com):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      قيمة c_user:
                    </label>
                    <input
                      type="text"
                      value={cUser}
                      onChange={(e) => setCUser(e.target.value)}
                      placeholder="1000..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      قيمة xs token:
                    </label>
                    <input
                      type="text"
                      value={xsToken}
                      onChange={(e) => setXsToken(e.target.value)}
                      placeholder="قيمة xs"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Live Scraping Logs Terminal */}
          {logs.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] space-y-1 max-h-36 overflow-y-auto border border-slate-800 text-left dir-ltr">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold mb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>Auto Scraper Log:</span>
              </div>
              {logs.map((log, i) => (
                <div key={i} className="leading-tight">{log}</div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isScraping}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {isScraping ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{scrapingStep || 'جاري الزحف واستخراج المنشورات تلقائياً...'}</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-amber-300" />
                <span>بدء الجلب التلقائي لمنشورات المجموعة الآن</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};
