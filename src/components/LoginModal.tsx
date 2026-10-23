import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Key, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { FacebookUser } from '../types';
import { DEMO_USER } from '../data/mockData';
import { getFacebookAuthUrl } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: FacebookUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'oauth' | 'demo' | 'token'>('demo');
  const [customAppId, setCustomAppId] = useState('');
  const [userAccessToken, setUserAccessToken] = useState('');
  const [customName, setCustomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Official Facebook OAuth Popup
  const handleFacebookOAuth = async () => {
    setIsLoading(true);
    setStatusMessage('جاري توليد رابط تسجيل الدخول الرسمي عبر فيسبوك...');
    try {
      const authUrl = await getFacebookAuthUrl(customAppId || undefined);
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const authWindow = window.open(
        authUrl,
        'fb_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0,menubar=0`
      );

      if (!authWindow) {
        setStatusMessage('يرجى السماح بالنوافذ المنبثقة (Popups) في المتصفح لإتمام تسجيل الدخول.');
        setIsLoading(false);
        return;
      }

      setStatusMessage('تم فتح نافذة فيسبوك، في انتظار الموافقة وتخويل الصلاحيات...');

      const messageListener = (event: MessageEvent) => {
        if (event.data?.type === 'FB_AUTH_SUCCESS') {
          window.removeEventListener('message', messageListener);
          setIsLoading(false);
          const user: FacebookUser = event.data.user || {
            id: 'fb_' + Date.now(),
            name: 'مستخدم فيسبوك المتصل',
            email: 'user@facebook.com',
            picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            isDemo: false,
            connectedAt: new Date().toISOString(),
          };
          onLoginSuccess(user);
          onClose();
        }
      };

      window.addEventListener('message', messageListener);
    } catch (err: any) {
      console.error('OAuth error:', err);
      setStatusMessage('حدث خطأ أثناء فتح نافذة فيسبوك: ' + err.message);
      setIsLoading(false);
    }
  };

  // Instant Demo Login
  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(DEMO_USER);
      setIsLoading(false);
      onClose();
    }, 400);
  };

  // Token Login
  const handleTokenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAccessToken.trim()) {
      setStatusMessage('يرجى إدخال رمز الوصول Access Token');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const user: FacebookUser = {
        id: 'fb_' + Math.floor(Math.random() * 10000000),
        name: customName.trim() || 'حساب فيسبوك مطور',
        email: 'developer.token@facebook.com',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        isDemo: false,
        accessToken: userAccessToken.trim(),
        connectedAt: new Date().toISOString(),
      };
      onLoginSuccess(user);
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1877F2] font-black text-2xl flex items-center justify-center shadow-md">
              f
            </div>
            <div>
              <h2 className="text-xl font-bold">تسجيل الدخول بحساب فيسبوك</h2>
              <p className="text-xs text-blue-100">
                للربط مع مجموعات البيع والشراء واستعراض المنشورات آلياً
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'demo' ? 'bg-white text-blue-800 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              🚀 حساب تجريبي فوري
            </button>
            <button
              onClick={() => setActiveTab('oauth')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'oauth' ? 'bg-white text-blue-800 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              🔐 تسجيل Facebook OAuth
            </button>
            <button
              onClick={() => setActiveTab('token')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'token' ? 'bg-white text-blue-800 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              🔑 رمز Graph Token
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Tab 1: Instant Demo */}
          {activeTab === 'demo' && (
            <div className="space-y-4 text-right">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      تجربة مباشرة بدون الحاجة لإعداد تطبيق Meta:
                    </p>
                    <p>
                      يتيح لك هذا الوضع الدخول بحساب تجريبي محاكي يحتوي على <strong>5 مجموعات بيع وشراء نشطة</strong> وأكثر من <strong>30 منشوراً حقيقياً</strong> مصنفاً بالمواصفات والأسعار وأرقام الواتساب للتجربة الفورية.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <img
                  src={DEMO_USER.picture}
                  alt={DEMO_USER.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{DEMO_USER.name}</h4>
                  <p className="text-xs text-slate-500">{DEMO_USER.email}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    عضو في: حراج السيارات، الإلكترونيات، العقارات، الأثاث
                  </p>
                </div>
              </div>

              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-pulse">جاري تسجيل الدخول...</span>
                ) : (
                  <>
                    <span>تسجيل الدخول بالحساب التجريبي فوراً</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab 2: Facebook OAuth Login */}
          {activeTab === 'oauth' && (
            <div className="space-y-4 text-right">
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                سيتم فتح نافذة فيسبوك الرسمية لتسجيل الدخول والموافقة على صلاحيات قراءة معلومات المجموعات التي تديرها أو تشترك بها.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  معرّف تطبيق فيسبوك (Facebook App ID) - اختياري:
                </label>
                <input
                  type="text"
                  value={customAppId}
                  onChange={(e) => setCustomAppId(e.target.value)}
                  placeholder="مثال: 184920491029384 (افتراضي)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-400">
                  إذا تركت هذا الحقل فارغاً فسيتم استخدام معرّف التطبيق المدمج.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  ملاحظة: تفرض شركة Meta مراجعة للتطبيق وصلاحية <code>groups_access_member_info</code> للوصول إلى مجموعات فيسبوك في بيئة الإنتاج.
                </span>
              </div>

              {statusMessage && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                  {statusMessage}
                </div>
              )}

              <button
                onClick={handleFacebookOAuth}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="font-black text-lg">f</span>
                <span>المتابعة عبر فيسبوك (Facebook Login)</span>
              </button>
            </div>
          )}

          {/* Tab 3: Access Token Input */}
          {activeTab === 'token' && (
            <form onSubmit={handleTokenLogin} className="space-y-4 text-right">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                إذا كنت مطوراً وتمتلك User Access Token من <strong>Graph API Explorer</strong>، يمكنك لصقه هنا مباشرة:
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  اسمك أو اسم العرض:
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="مثال: محمد علي"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  رمز الوصول (User Access Token):
                </label>
                <textarea
                  rows={3}
                  value={userAccessToken}
                  onChange={(e) => setUserAccessToken(e.target.value)}
                  placeholder="EAAB..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {statusMessage && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>ربط الحساب بالرمز المباشر</span>
              </button>
            </form>
          )}

        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>اتصال آمن ومحمي ومشفر</span>
          </div>
          <span>v2.4 - محرك تصنيف ذكي</span>
        </div>
      </div>
    </div>
  );
};
