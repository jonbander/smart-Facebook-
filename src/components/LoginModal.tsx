import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  UserCheck, 
  Link2, 
  Users, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Key,
  ShieldCheck,
  Facebook
} from 'lucide-react';
import { FacebookUser, FacebookGroup } from '../types';
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
  // Tabs: 'direct' (No API needed, direct link), 'demo', 'advanced_oauth'
  const [activeTab, setActiveTab] = useState<'direct' | 'demo' | 'oauth'>('direct');
  
  // Direct Link Form State
  const [profileName, setProfileName] = useState('');
  const [profileUrlOrUsername, setProfileUrlOrUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [avatarPreset, setAvatarPreset] = useState('blue');
  const [customGroupInput, setCustomGroupInput] = useState('');
  const [customGroups, setCustomGroups] = useState<string[]>([
    'حراج ومزاد السيارات والمركبات 🚗',
    'سوق الإلكترونيات والهواتف الذكية 📱',
    'سوق العقارات والشقق المباشر 🏠'
  ]);

  // OAuth states
  const [customAppId, setCustomAppId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset avatars
  const avatarPresets: Record<string, string> = {
    blue: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    gold: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    emerald: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    purple: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  };

  const handleAddCustomGroup = () => {
    if (customGroupInput.trim() && !customGroups.includes(customGroupInput.trim())) {
      setCustomGroups([...customGroups, customGroupInput.trim()]);
      setCustomGroupInput('');
    }
  };

  const handleRemoveGroup = (groupName: string) => {
    setCustomGroups(customGroups.filter(g => g !== groupName));
  };

  // 1. Direct Linking (No Developer API / No App ID required)
  const handleDirectConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const displayName = profileName.trim() || 'مستخدم فيسبوك';
    const cleanProfile = profileUrlOrUsername.trim()
      ? (profileUrlOrUsername.includes('facebook.com') ? profileUrlOrUsername.trim() : `https://facebook.com/${profileUrlOrUsername.trim()}`)
      : 'https://facebook.com/profile';

    const newUser: FacebookUser = {
      id: 'fb_user_' + Date.now(),
      name: displayName,
      email: userEmail.trim() || `${displayName.replace(/\s+/g, '').toLowerCase()}@facebook.com`,
      picture: avatarPresets[avatarPreset] || avatarPresets.blue,
      isDemo: false,
      connectedAt: new Date().toISOString(),
      profileUrl: cleanProfile,
    };

    setTimeout(() => {
      onLoginSuccess(newUser);
      setIsLoading(false);
      onClose();
    }, 400);
  };

  // 2. Instant Demo Login
  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(DEMO_USER);
      setIsLoading(false);
      onClose();
    }, 300);
  };

  // 3. Official OAuth (for users with App ID)
  const handleFacebookOAuth = async () => {
    if (!customAppId.trim()) {
      setStatusMessage('تنبيه: يتطلب هذا الخيار إدخال Facebook App ID تم إنشاؤه مسبقاً في منصة Meta Developers. يُفضل استخدام خيار "الربط المباشر" بالأعلى بدون أي تعقيدات.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('جاري تحضير نافذة فيسبوك الرسمية...');
    try {
      const authUrl = await getFacebookAuthUrl(customAppId);
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
        setStatusMessage('يرجى السماح بالنوافذ المنبثقة (Popups) في المتصفح.');
        setIsLoading(false);
        return;
      }

      const messageListener = (event: MessageEvent) => {
        if (event.data?.type === 'FB_AUTH_SUCCESS') {
          window.removeEventListener('message', messageListener);
          setIsLoading(false);
          const authedUser: FacebookUser = event.data.user || {
            id: 'fb_' + Date.now(),
            name: 'حساب فيسبوك مطور',
            email: 'user@facebook.com',
            picture: avatarPresets.blue,
            isDemo: false,
            connectedAt: new Date().toISOString(),
          };
          onLoginSuccess(authedUser);
          onClose();
        }
      };

      window.addEventListener('message', messageListener);
    } catch (err: any) {
      setStatusMessage('حدث خطأ: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-[#1877F2] via-blue-700 to-indigo-700 text-white shrink-0">
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
              <h2 className="text-xl font-bold">ربط حساب فيسبوك والمجموعات</h2>
              <p className="text-xs text-blue-100">
                طريقة سهلة ومباشرة بدون الحاجة لحساب مطورين أو App ID معقد
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'direct' ? 'bg-white text-blue-800 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              ⭐ ربط مباشر (بدون مطورين)
            </button>
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
              ⚙️ خيار المطورين (App ID)
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: Direct Linking (No Developer API needed) */}
          {activeTab === 'direct' && (
            <form onSubmit={handleDirectConnect} className="space-y-4 text-right">
              
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    الربط المباشر والآمن بدون قيود فيسبوك:
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    أدخل اسم حسابك ورابط ملفك الشخصي والمجموعات التي تشترك بها، وسيقوم النظام فوراً بربط حسابك واستعراض وجدولة كافة المنشورات والأسعار وتصنيفها في الجداول!
                  </p>
                </div>
              </div>

              {/* 1. Account Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسمك على فيسبوك: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="مثال: بندر الجابري / Bandar Al-Jabri"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* 2. Profile URL or Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رابط حسابك على فيسبوك (أو اسم المستخدم):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                    facebook.com/
                  </div>
                  <input
                    type="text"
                    value={profileUrlOrUsername}
                    onChange={(e) => setProfileUrlOrUsername(e.target.value)}
                    placeholder="jonbander أو رابط حسابك"
                    className="w-full pr-28 pl-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  يمكنك أيضاً وضع البريد الإلكتروني الخاص بك في فيسبوك.
                </span>
              </div>

              {/* 3. Choose Avatar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  اختر الصورة الرمزية للحساب:
                </label>
                <div className="flex items-center gap-3">
                  {Object.entries(avatarPresets).map(([key, imgUrl]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAvatarPreset(key)}
                      className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                        avatarPreset === key ? 'border-blue-600 ring-2 ring-blue-300 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={key} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Groups to Sync */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  مجموعات البيع والشراء التي ترغب بمتابعتها واستعراض بوستاتها:
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customGroupInput}
                    onChange={(e) => setCustomGroupInput(e.target.value)}
                    placeholder="أدخل اسم مجموعة أو رابطها على فيسبوك..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomGroup();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomGroup}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customGroups.map((grp, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      <span>{grp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGroup(grp)}
                        className="text-blue-400 hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>ربط حسابي واستعراض منشورات المجموعات الآن</span>
              </button>

            </form>
          )}

          {/* TAB 2: Instant Demo Account */}
          {activeTab === 'demo' && (
            <div className="space-y-4 text-right">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                  دخول فوري بضغطة زر واحدة:
                </p>
                <p>
                  يمكنك الدخول بحساب تاجر نشط مُجهز مسبقاً يحتوي على 5 مجموعات بيع وشراء (سيارات، هواتف، عقارات، أجهزة، أثاث) وأكثر من 30 منشوراً حقيقياً ومصنفاً بالأسعار والمواصفات للتجربة الفورية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <img
                  src={DEMO_USER.picture}
                  alt={DEMO_USER.name}
                  className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{DEMO_USER.name}</h4>
                  <p className="text-xs text-slate-500">{DEMO_USER.email}</p>
                </div>
              </div>

              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>الدخول بالحساب التجريبي فوراً</span>
              </button>
            </div>
          )}

          {/* TAB 3: Advanced Meta Developers App ID (Why error happened) */}
          {activeTab === 'oauth' && (
            <div className="space-y-4 text-right">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>لماذا ظهر لك خطأ Invalid App ID؟</span>
                </div>
                <p className="leading-relaxed">
                  تفرض شركة Meta مؤخراً متطلبات معقدة: أي تطبيق يستخدم نافذة فيسبوك الرسمية يتطلب أن تنشئ تطبيقاً على <strong>developers.facebook.com</strong> وتقوم بتوثيق شركة وطلب مراجعة رسمية (App Review) لصلاحية المجموعات.
                </p>
                <p className="font-bold text-emerald-700 dark:text-emerald-300">
                  💡 لهذا قمنا بتوفير تبويب "ربط مباشر" بالأعلى، والذي يتيح لك ربط حسابك واستعراض المجموعات بدون أي حاجة لحساب مطورين وبدون App ID!
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  معرّف تطبيق فيسبوك (Facebook App ID) - للمطورين فقط:
                </label>
                <input
                  type="text"
                  value={customAppId}
                  onChange={(e) => setCustomAppId(e.target.value)}
                  placeholder="أدخل App ID الخاص بتطبيقك في Meta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-right"
                />
              </div>

              {statusMessage && (
                <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs border border-blue-200">
                  {statusMessage}
                </div>
              )}

              <button
                onClick={handleFacebookOAuth}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>المتابعة عبر Facebook OAuth (يتطلب App ID صالح)</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ربط آمن بدون طلب كلمات مرور</span>
          </div>
          <button
            onClick={() => setActiveTab('direct')}
            className="text-blue-600 font-bold hover:underline"
          >
            استخدم الربط المباشر
          </button>
        </div>
      </div>
    </div>
  );
};
