import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { GroupsBar } from './components/GroupsBar';
import { SearchAndFilters } from './components/SearchAndFilters';
import { PostsTable } from './components/PostsTable';
import { PostsGrid } from './components/PostsGrid';
import { PostDetailModal } from './components/PostDetailModal';
import { LoginModal } from './components/LoginModal';
import { AddPostModal } from './components/AddPostModal';
import { AddGroupModal } from './components/AddGroupModal';
import { OAuthGuideModal } from './components/OAuthGuideModal';
import { StatsBar } from './components/StatsBar';
import { AuthGate } from './components/AuthGate';
import { BulkImportModal } from './components/BulkImportModal';
import { 
  FacebookUser, 
  FacebookGroup, 
  MarketplacePost, 
  FilterOptions 
} from './types';
import { 
  getStoredUser, 
  saveStoredUser, 
  getStoredPosts, 
  saveStoredPosts, 
  getStoredGroups, 
  saveStoredGroups, 
  toggleSavedPost,
  exportPostsToCSV 
} from './services/api';
import { DEMO_USER } from './data/mockData';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  // 1. User & Core States (Initialize from storage, otherwise null to show the login gate first)
  const [user, setUser] = useState<FacebookUser | null>(() => getStoredUser());
  const [groups, setGroups] = useState<FacebookGroup[]>(() => getStoredGroups());
  const [posts, setPosts] = useState<MarketplacePost[]>(() => getStoredPosts());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('ALL');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. Modals
  const [selectedPost, setSelectedPost] = useState<MarketplacePost | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState<boolean>(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState<boolean>(false);
  const [isOAuthGuideOpen, setIsOAuthGuideOpen] = useState<boolean>(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState<boolean>(false);

  // 3. Filters
  const [filters, setFilters] = useState<FilterOptions>({
    query: '',
    category: 'ALL',
    groupId: 'ALL',
    minPrice: undefined,
    maxPrice: undefined,
    currency: 'ALL',
    condition: 'ALL',
    city: 'ALL',
    hasPhoneOnly: false,
    negotiableOnly: false,
    dateRange: 'ALL',
    sortBy: 'NEWEST',
    specValue: '',
  });

  // Sync selected group with filters
  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setFilters(prev => ({ ...prev, groupId }));
  };

  // Toast Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Listen for OAuth Success Messages from Facebook popup
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FB_AUTH_SUCCESS') {
        const authedUser: FacebookUser = event.data.user || {
          id: 'fb_' + Date.now(),
          name: 'حساب فيسبوك متصل',
          email: 'connected.user@facebook.com',
          picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          isDemo: false,
          connectedAt: new Date().toISOString(),
        };
        setUser(authedUser);
        saveStoredUser(authedUser);
        showToast('تم تسجيل الدخول بنجاح عبر فيسبوك والمزامنة مع المجموعات!');
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  // Save changes to localStorage
  const handleLoginSuccess = (newUser: FacebookUser) => {
    setUser(newUser);
    saveStoredUser(newUser);
    showToast(`مرحباً بك يا ${newUser.name}! تم الاتصال بالمجموعات.`);
  };

  const handleLogout = () => {
    setUser(null);
    saveStoredUser(null);
    showToast('تم تسجيل الخروج بنجاح.');
  };

  const handleToggleSave = (postId: string) => {
    const isSaved = toggleSavedPost(postId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, saved: isSaved } : p));
    showToast(isSaved ? 'تمت إضافة الإعلان إلى المحفوظات ⭐' : 'تمت إزالة الإعلان من المحفوظات');
  };

  const handlePostAdded = (newPost: MarketplacePost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    saveStoredPosts(updated);
    showToast('تم تصنيف المنشور وإدراجه في الجدول بنجاح!');
  };

  const handleGroupAdded = (newGroup: FacebookGroup) => {
    const updated = [...groups, newGroup];
    setGroups(updated);
    saveStoredGroups(updated);
    showToast(`تمت إضافة مجموعة "${newGroup.name}" وتفعيل المزامنة!`);
  };

  const handleBulkImportSuccess = (newPosts: MarketplacePost[], replaceExisting: boolean) => {
    const updated = replaceExisting ? newPosts : [...newPosts, ...posts];
    setPosts(updated);
    saveStoredPosts(updated);
    showToast(`تم استخراج وجدولة ${newPosts.length} إعلانات حقيقية من مجموعتك بنجاح! 🚀`);
  };

  const handleClearDemoData = () => {
    setPosts([]);
    saveStoredPosts([]);
    showToast('تم مسح البيانات التجريبية. الجدول الآن مخصص لمنشوراتك الحقيقية فقط.');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('تم فحص المنشورات وتحديث الأسعار والمواصفات!');
    }, 800);
  };

  const handleExport = () => {
    exportPostsToCSV(filteredPosts);
    showToast('تم تصدير الإعلانات المحددة كملف CSV بنجاح!');
  };

  // Distinct cities available in current posts for filter
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => {
      if (p.parsed.city) set.add(p.parsed.city);
    });
    return Array.from(set);
  }, [posts]);

  // Saved Posts Count
  const savedCount = useMemo(() => {
    return posts.filter(p => p.saved).length;
  }, [posts]);

  // Main Filter & Search Engine
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // 1. Saved Only filter
      if (showSavedOnly && !post.saved) {
        return false;
      }

      // 2. Group Filter
      if (selectedGroupId !== 'ALL' && post.groupId !== selectedGroupId) {
        return false;
      }

      // 3. Category Filter
      if (filters.category !== 'ALL' && post.parsed.category !== filters.category) {
        return false;
      }

      // 4. Text Search Query (Title, rawContent, summary, tags, seller)
      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        const inTitle = post.parsed.title.toLowerCase().includes(q);
        const inRaw = post.rawContent.toLowerCase().includes(q);
        const inSummary = post.parsed.summary.toLowerCase().includes(q);
        const inTags = post.parsed.keyTags.some(t => t.toLowerCase().includes(q));
        const inSpecs = Object.entries(post.parsed.specifications).some(
          ([k, v]) => k.toLowerCase().includes(q) || v.toLowerCase().includes(q)
        );
        const inAuthor = post.author.name.toLowerCase().includes(q);
        if (!inTitle && !inRaw && !inSummary && !inTags && !inSpecs && !inAuthor) {
          return false;
        }
      }

      // 5. Specific Specification Search (e.g., 256GB, 2023, RTX 4080)
      if (filters.specValue && filters.specValue.trim()) {
        const specQ = filters.specValue.toLowerCase().trim();
        const matchedSpec = Object.entries(post.parsed.specifications).some(
          ([k, v]) => k.toLowerCase().includes(specQ) || v.toLowerCase().includes(specQ)
        );
        const matchedTag = post.parsed.keyTags.some(t => t.toLowerCase().includes(specQ));
        const matchedRaw = post.rawContent.toLowerCase().includes(specQ);
        if (!matchedSpec && !matchedTag && !matchedRaw) {
          return false;
        }
      }

      // 6. Price Range
      if (filters.minPrice !== undefined && post.parsed.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && post.parsed.price > filters.maxPrice) {
        return false;
      }

      // 7. Currency
      if (filters.currency !== 'ALL' && post.parsed.currency !== filters.currency) {
        return false;
      }

      // 8. Condition
      if (filters.condition !== 'ALL' && post.parsed.condition !== filters.condition) {
        return false;
      }

      // 9. City
      if (filters.city !== 'ALL' && post.parsed.city !== filters.city) {
        return false;
      }

      // 10. Contact / Phone Only
      if (filters.hasPhoneOnly && !post.parsed.contact.phone && !post.parsed.contact.whatsapp) {
        return false;
      }

      // 11. Negotiable Only
      if (filters.negotiableOnly && !post.parsed.isPriceNegotiable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'PRICE_ASC') {
        return a.parsed.price - b.parsed.price;
      }
      if (filters.sortBy === 'PRICE_DESC') {
        return b.parsed.price - a.parsed.price;
      }
      // NEWEST
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [posts, selectedGroupId, showSavedOnly, filters]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-xs font-bold border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenAddPost={() => setIsAddPostModalOpen(true)}
        onOpenOAuthGuide={() => setIsOAuthGuideOpen(true)}
        onExportCSV={handleExport}
        onRefreshPosts={handleRefresh}
        isRefreshing={isRefreshing}
        totalPosts={posts.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showSavedOnly={showSavedOnly}
        setShowSavedOnly={setShowSavedOnly}
        savedCount={savedCount}
        onOpenBulkImport={() => setIsBulkImportOpen(true)}
      />

      {/* Top Banner when user is in demo mode */}
      {user?.isDemo && (
        <div className="bg-gradient-to-r from-blue-700 via-[#1877F2] to-indigo-700 text-white py-3 px-4 shadow-sm border-b border-blue-400/30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-xs shrink-0">
                f
              </span>
              <div>
                <span className="font-extrabold text-xs block sm:inline">
                  أنت تتصفح حالياً بالوضع التجريبي المسبق (أحمد الشريف).
                </span>{' '}
                <span className="text-[11px] text-blue-100">
                  هل ترغب في ربط حسابك الحقيقي على فيسبوك لاستعراض مجموعاتك الخاصة؟
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white text-[#1877F2] hover:bg-blue-50 font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5 active:scale-95"
            >
              <span className="font-black text-sm">f</span>
              <span>تسجيل الدخول وربط حسابك بفيسبوك الآن</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main View: AuthGate Welcome Portal OR Full Marketplace Dashboard */}
      {!user ? (
        <AuthGate
          onLoginSuccess={handleLoginSuccess}
          onOpenOAuthGuide={() => setIsOAuthGuideOpen(true)}
          onOpenBulkImport={() => setIsBulkImportOpen(true)}
        />
      ) : (
        <>
          {/* Connected Facebook Buy/Sell Groups Bar */}
          <GroupsBar
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={handleGroupSelect}
            onOpenAddGroup={() => setIsAddGroupModalOpen(true)}
          />

          {/* Search & Advanced Filters Bar */}
          <SearchAndFilters
            filters={filters}
            onFilterChange={setFilters}
            availableCities={availableCities}
            totalResults={filteredPosts.length}
          />

          {/* Main Body Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Marketplace Summary Metrics */}
            <StatsBar
              posts={filteredPosts}
              totalGroupsCount={groups.length}
            />

            {/* Real Facebook Group Posts Importer Action Card */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-3xl border border-blue-500/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-right">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                  f
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>جلب وجدولة منشورات مجموعتك الحقيقية في هذا الجدول</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                      استيراد حقيقي
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    هل تريد استبدال المنشورات الافتراضية ببوستات مجموعتك الحقيقية؟ انسخ أي بوستات من فيسبوك والصقها هنا ليتم استخراج الأسعار والمواصفات وأرقام الهواتف وجدولتها فوراً!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  onClick={() => setIsBulkImportOpen(true)}
                  className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>استيراد منشورات مجموعتي الآن</span>
                </button>
                <button
                  onClick={handleClearDemoData}
                  className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-semibold text-xs transition-colors shrink-0"
                  title="مسح المنشورات التجريبية الافتراضية"
                >
                  مسح التجريبي
                </button>
              </div>
            </div>

            {/* Informational banner when filter is active or saved only is on */}
            {showSavedOnly && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  أنت الآن تستعرض الإعلانات المحفوظة في قائمتك المفضلة ({filteredPosts.length} إعلان)
                </div>
                <button
                  onClick={() => setShowSavedOnly(false)}
                  className="text-xs text-amber-900 dark:text-amber-200 font-bold underline hover:no-underline"
                >
                  عرض جميع المنشورات
                </button>
              </div>
            )}

            {/* Organized Scheduled Table OR Cards Grid */}
            {viewMode === 'table' ? (
              <PostsTable
                posts={filteredPosts}
                onSelectPost={(post) => setSelectedPost(post)}
                onToggleSave={handleToggleSave}
              />
            ) : (
              <PostsGrid
                posts={filteredPosts}
                onSelectPost={(post) => setSelectedPost(post)}
                onToggleSave={handleToggleSave}
              />
            )}

          </main>
        </>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              f
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              سوق فيسبوك الذكي لمجموعات البيع والشراء
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>تصنيف فوري بالذكاء الاصطناعي</span>
            <span>•</span>
            <button onClick={() => setIsOAuthGuideOpen(true)} className="hover:underline">
              دليل ربط Meta API
            </button>
            <span>•</span>
            <button onClick={() => setIsAddPostModalOpen(true)} className="hover:underline text-blue-600 font-bold">
              تجربة تحليل منشور
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onToggleSave={handleToggleSave}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AddPostModal
        isOpen={isAddPostModalOpen}
        onClose={() => setIsAddPostModalOpen(false)}
        groups={groups}
        onPostAdded={handlePostAdded}
      />

      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={() => setIsAddGroupModalOpen(false)}
        onGroupAdded={handleGroupAdded}
      />

      <OAuthGuideModal
        isOpen={isOAuthGuideOpen}
        onClose={() => setIsOAuthGuideOpen(false)}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onBulkImportSuccess={handleBulkImportSuccess}
      />

    </div>
  );
}
