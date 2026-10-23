import React from 'react';
import { 
  Bookmark, 
  MapPin, 
  Sparkles, 
  Calendar, 
  MessageCircle, 
  Phone, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { MarketplacePost, ProductCondition } from '../types';
import { CATEGORIES } from '../data/mockData';

interface PostsGridProps {
  posts: MarketplacePost[];
  onSelectPost: (post: MarketplacePost) => void;
  onToggleSave: (postId: string) => void;
}

export const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  onSelectPost,
  onToggleSave,
}) => {
  // Helper for Category label & style
  const getCategoryMeta = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  };

  const renderConditionBadge = (condition: ProductCondition) => {
    switch (condition) {
      case 'BRAND_NEW':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">جديد بالكرتونة</span>;
      case 'LIKE_NEW':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">كسر زيرو ✨</span>;
      case 'EXCELLENT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">مستعمل ممتاز</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">مستعمل</span>;
    }
  };

  const formatArabicTime = (dateStr: string) => {
    const diffMin = Math.round((Date.now() - new Date(dateStr).getTime()) / (1000 * 60));
    if (diffMin < 60) return `منذ ${diffMin} د`;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return `منذ ${diffHours} س`;
    const diffDays = Math.round(diffHours / 24);
    return `منذ ${diffDays} يوم`;
  };

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
        <Tag className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">لا توجد منتجات مطابقة للبحث</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {posts.map((post) => {
        const catMeta = getCategoryMeta(post.parsed.category);
        const whatsappUrl = post.parsed.contact.whatsapp
          ? `https://wa.me/${post.parsed.contact.whatsapp}?text=${encodeURIComponent(
              `مرحباً، بخصوص إعلانك عن "${post.parsed.title}" بسعر ${post.parsed.price} ${post.parsed.currency}..`
            )}`
          : null;

        return (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col cursor-pointer"
          >
            {/* Image Preview & Badges */}
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {post.mediaUrls[0] ? (
                <img
                  src={post.mediaUrls[0]}
                  alt={post.parsed.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  f
                </div>
              )}

              {/* Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(post.id);
                }}
                className="absolute top-3 left-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-600 hover:text-amber-500 shadow-xs transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>

              {/* Category Pill */}
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${catMeta.bgLight} ${catMeta.color} shadow-xs backdrop-blur-xs`}>
                  {catMeta.label}
                </span>
              </div>

              {/* Condition Badge */}
              <div className="absolute bottom-3 right-3">
                {renderConditionBadge(post.parsed.condition)}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                {/* Title */}
                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.parsed.title}
                </h4>

                {/* Location and Group */}
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{post.parsed.city}</span>
                  <span>•</span>
                  <span className="truncate">{post.groupName}</span>
                </div>

                {/* Extracted Specifications Chips */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {post.parsed.keyTags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer: Price and Quick Contact */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {post.parsed.price > 0 ? (
                      <>
                        {post.parsed.price.toLocaleString()}{' '}
                        <span className="text-xs text-slate-500 font-semibold">{post.parsed.currency}</span>
                      </>
                    ) : (
                      <span className="text-amber-600 text-sm">على السوم</span>
                    )}
                  </div>
                  {post.parsed.isPriceNegotiable && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      قابل للتفاوض
                    </span>
                  )}
                </div>

                {/* WhatsApp & Call Buttons */}
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-colors"
                      title="واتساب مباشر"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  {post.parsed.contact.phone && (
                    <a
                      href={`tel:${post.parsed.contact.phone}`}
                      className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-xs transition-colors"
                      title="اتصال هاتفي"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};
