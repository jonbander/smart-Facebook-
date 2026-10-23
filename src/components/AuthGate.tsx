import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Table, 
  Search, 
  MessageCircle, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Key,
  UserCheck,
  Plus
} from 'lucide-react';
import { FacebookUser } from '../types';
import { DEMO_USER } from '../data/mockData';

interface AuthGateProps {
  onLoginSuccess: (user: FacebookUser) => void;
  onOpenOAuthGuide: () => void;
  onOpenBulkImport?: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  onLoginSuccess,
  onOpenOAuthGuide,
  onOpenBulkImport,
}) => {
  const [activeMode, setActiveMode] = useState<'options' | 'direct_form'>('options');
  const [profileName, setProfileName] = useState('');
  const [profileUrlOrUsername, setProfileUrlOrUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [avatarPreset, setAvatarPreset] = useState('blue');
  const [customGroupInput, setCustomGroupInput] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    'حراج ومزاد السيارات الحديثة والمستعملة 🚗',
    'سوق الإلكترونيات والهواتف الذكية (كسر زيرو) 📱',
    'سوق العقارات والشقق للبيع والإيجار المباشر 🏠'
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const avatarPresets: Record<string, string> = {
    blue: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    gold: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    emerald: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    purple: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  };

  const handleAddGroup = () => {
    if (customGroupInput.trim() && !selectedGroups.includes(customGroupInput.trim())) {
      setSelectedGroups([...selectedGroups, customGroupInput.trim()]);
      setCustomGroupInput('');
    }
  };

  const handleRemoveGroup = (name: string) => {
    setSelectedGroups(selectedGroups.filter(g => g !== name));
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
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
    }, 400);
  };

  const handleDemoAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(DEMO_USER);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 text-center space-y-6">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1877F2] via-blue-600 to-indigo-600 text-white flex items-center justify-center text-5xl font-black shadow-xl shadow-blue-500/25 ring-8 ring-blue-50 dark:ring-blue-950/40">
            f
          </div>
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              ربط الحساب ومجموعات البيع والشراء
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              سوق فيسبوك الذكي
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              اربط حسابك بسهولة لاستعراض منشورات المجموعات وتصنيفها آلياً في جداول منظمة مع البحث بالمواصفات والأسعار
            </p>
          </div>
        </div>

        {/* Explain the Meta Developer restriction transparently */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3 text-right">
          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
            ℹ️
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-100 block">
              لا حاجة لحساب مطورين أو App ID:
            </span>
            <span className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              بسبب قيود شركة Meta التي تشترط مراجعة مطورين معقدة، وفرنا لك <strong>طريقة الربط المباشر الآمنة</strong> لإدخال حسابك واختيار مجموعاتك واستعراض بوستاتها فوراً دون أي أخطاء.
            </span>
          </div>
        </div>

        {/* MODE 1: Selection Buttons */}
        {activeMode === 'options' ? (
          <div className="space-y-3.5 max-w-md mx-auto">
            
            {/* 1. Main Button: Direct Profile & Groups Linking (No API required) */}
            <button
              onClick={() => setActiveMode('direct_form')}
              className="w-full py-4 px-6 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <UserCheck className="w-5 h-5" />
              <span>ربط حسابي ومجموعاتي مباشرة (بدون مطورين)</span>
            </button>

            {/* 2. Direct Real Posts Bulk Import */}
            {onOpenBulkImport && (
              <button
                onClick={onOpenBulkImport}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>📥 جلب وجدولة منشورات حقيقية من مجموعتك الآن</span>
              </button>
            )}

            {/* 3. Instant Demo Mode */}
            <button
              onClick={handleDemoAccess}
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>تصفح بحساب تاجر تجريبي مسبق التجهيز (للمعاينة فقط)</span>
            </button>

          </div>
        ) : (
          /* MODE 2: Direct Form */
          <form onSubmit={handleDirectSubmit} className="space-y-4 text-right max-w-lg mx-auto animate-in fade-in">
            
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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رابط حسابك على فيسبوك أو اسم المستخدم أو البريد:
              </label>
              <input
                type="text"
                value={profileUrlOrUsername}
                onChange={(e) => setProfileUrlOrUsername(e.target.value)}
                placeholder="مثال: facebook.com/jonbander أو jonbander183@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Avatar choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اختر الصورة الشخصية:
              </label>
              <div className="flex items-center gap-3">
                {Object.entries(avatarPresets).map(([key, imgUrl]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAvatarPreset(key)}
                    className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      avatarPreset === key ? 'border-blue-600 ring-2 ring-blue-300 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={key} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Groups */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                مجموعات البيع والشراء التي تشترك بها:
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customGroupInput}
                  onChange={(e) => setCustomGroupInput(e.target.value)}
                  placeholder="أدخل اسم مجموعة أو رابطها على فيسبوك..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedGroups.map((grp, idx) => (
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

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>ربط الحساب واستعراض الجدول الآن</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('options')}
                className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50"
              >
                رجوع
              </button>
            </div>

          </form>
        )}

        {/* Feature Grid: What you get after connecting */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Table className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
              جدولة وتصنيف المنشورات
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              تحويل البوستات العشوائية إلى جداول منظمة بالأسعار، الفئات، وحالة المنتج.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
              بحث دقيق بالمواصفات
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              فلترة بالذاكرة، الممشى، الموديل، سنة الصنع، نطاق السعر، والمدينة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
              تواصل واتساب فوري
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              رسائل جاهزة بنقرة واحدة للبائع مباشرة بخصوص المنتج وسعره.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
