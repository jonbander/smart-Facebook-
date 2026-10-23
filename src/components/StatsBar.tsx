import React from 'react';
import { Layers, ShoppingCart, MessageCircle, DollarSign, CheckCircle2, TrendingUp } from 'lucide-react';
import { MarketplacePost } from '../types';

interface StatsBarProps {
  posts: MarketplacePost[];
  totalGroupsCount: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ posts, totalGroupsCount }) => {
  const postsWithWhatsapp = posts.filter(p => p.parsed.contact.whatsapp).length;
  const negotiablePosts = posts.filter(p => p.parsed.isPriceNegotiable).length;
  const pricedPosts = posts.filter(p => p.parsed.price > 0);
  const avgPrice = pricedPosts.length > 0 
    ? Math.round(pricedPosts.reduce((acc, p) => acc + p.parsed.price, 0) / pricedPosts.length)
    : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Metric 1 */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {posts.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            منشور معروض ومجدول
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {postsWithWhatsapp}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            تواصل مباشر بالواتساب
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {totalGroupsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            مجموعات بيع مرصودة
          </div>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
            {negotiablePosts}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            عروض قابلة للتفاوض
          </div>
        </div>
      </div>
    </div>
  );
};
