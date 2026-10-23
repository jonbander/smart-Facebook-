import React from 'react';
import { 
  Share2, 
  RefreshCw, 
  Download, 
  Plus, 
  Sparkles, 
  HelpCircle,
  LogOut,
  SlidersHorizontal,
  Table,
  Grid,
  Bookmark
} from 'lucide-react';
import { FacebookUser } from '../types';

interface HeaderProps {
  user: FacebookUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenAddPost: () => void;
  onOpenOAuthGuide: () => void;
  onExportCSV: () => void;
  onRefreshPosts: () => void;
  isRefreshing: boolean;
  totalPosts: number;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  showSavedOnly: boolean;
  setShowSavedOnly: (show: boolean) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenLogin,
  onLogout,
  onOpenAddPost,
  onOpenOAuthGuide,
  onExportCSV,
  onRefreshPosts,
  isRefreshing,
  totalPosts,
  viewMode,
  setViewMode,
  showSavedOnly,
  setShowSavedOnly,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <span className="font-bold text-2xl tracking-tighter">f</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  سوق فيسبوك الذكي
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-3 h-3" />
                  محلل المجموعات AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                جدولة وتصنيف منشورات البيع والشراء مع فلترة دقيقة بالمواصفات والأسعار
              </p>
            </div>
          </div>

          {/* Controls: View Switcher, Actions, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                title="عرض جدولي منظم"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden md:inline">جدول منظم</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="عرض بطاقات"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">بطاقات</span>
              </button>
            </div>

            {/* Saved Bookmarks Filter */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showSavedOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="عرض المحفوظات"
            >
              <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden lg:inline">المحفوظات</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefreshPosts}
              disabled={isRefreshing}
              title="تحديث ومزامنة المنشورات"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Add Post to Parse */}
            <button
              onClick={onOpenAddPost}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>تحليل منشور جديد</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              title="تصدير النتائج إلى Excel / CSV"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xl:inline">تصدير CSV</span>
            </button>

            {/* OAuth Guide Modal Trigger */}
            <button
              onClick={onOpenOAuthGuide}
              title="دليل ربط تطبيق فيسبوك للمطورين"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Login / Profile Badge */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-blue-400"
                />
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                    {user.name}
                    {user.isDemo && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                        تجريبي
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    متصل بالمجموعات
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="تسجيل الخروج أو تبديل الحساب"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-sm transition-all"
              >
                <span className="font-black text-sm">f</span>
                <span>تسجيل الدخول بفيسبوك</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
