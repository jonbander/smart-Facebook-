import React from 'react';
import { 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  Bookmark, 
  BookmarkCheck, 
  Eye, 
  Sparkles, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { MarketplacePost, ProductCondition } from '../types';
import { CATEGORIES } from '../data/mockData';

interface PostsTableProps {
  posts: MarketplacePost[];
  onSelectPost: (post: MarketplacePost) => void;
  onToggleSave: (postId: string) => void;
}

export const PostsTable: React.FC<PostsTableProps> = ({
  posts,
  onSelectPost,
  onToggleSave,
}) => {
  // Helper for condition badge
  const renderConditionBadge = (condition: ProductCondition) => {
    switch (condition) {
      case 'BRAND_NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            جديد بالكرتونة
          </span>
        );
      case 'LIKE_NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
            كسر زيرو ✨
          </span>
        );
      case 'EXCELLENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
            مستعمل ممتاز
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            مستعمل
          </span>
        );
    }
  };

  // Helper for Category label & style
  const getCategoryMeta = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  };

  // Helper for relative time in Arabic
  const formatArabicTime = (dateStr: string) => {
    const diffMin = Math.round((Date.now() - new Date(dateStr).getTime()) / (1000 * 60));
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    const diffDays = Math.round(diffHours / 24);
    return `منذ ${diffDays} يوم`;
  };

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <Tag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
          لا توجد نتائج مطابقة لبحثك
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          جرب تغيير الكلمات المفتاحية، أو توسيع نطاق السعر، أو اختيار فئة أخرى من قائمة الفئات أعلاه.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4 min-w-[280px]">المنتج وتفاصيله</th>
              <th className="py-3.5 px-4 min-w-[140px]">الفئة والتصنيف</th>
              <th className="py-3.5 px-4 min-w-[130px]">السعر والعملة</th>
              <th className="py-3.5 px-4 min-w-[110px]">الحالة</th>
              <th className="py-3.5 px-4 min-w-[120px]">المدينة والموقع</th>
              <th className="py-3.5 px-4 min-w-[220px]">أبرز المواصفات الفنية</th>
              <th className="py-3.5 px-4 min-w-[180px]">المجموعة الناشرة</th>
              <th className="py-3.5 px-4 min-w-[130px] text-center">التواصل السريع</th>
              <th className="py-3.5 px-4 w-20 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {posts.map((post, index) => {
              const catMeta = getCategoryMeta(post.parsed.category);
              const whatsappUrl = post.parsed.contact.whatsapp
                ? `https://wa.me/${post.parsed.contact.whatsapp}?text=${encodeURIComponent(
                    `مرحباً، بخصوص إعلانك في فيسبوك عن: "${post.parsed.title}" المعروض بسعر ${post.parsed.price} ${post.parsed.currency}.. هل ما زال متاحاً؟`
                  )}`
                : null;

              return (
                <tr
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  
                  {/* Row Index & Bookmark */}
                  <td className="py-4 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleSave(post.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        post.saved
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title={post.saved ? 'محفوظ في المفضلة' : 'حفظ في المفضلة'}
                    >
                      <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-amber-500' : ''}`} />
                    </button>
                  </td>

                  {/* Product Title, Image Preview, Subcategory */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
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
                        {post.parsed.aiAnalyzed && (
                          <span className="absolute bottom-0 right-0 p-0.5 bg-blue-600 text-white rounded-tl-sm text-[9px]" title="مصنف بالذكاء الاصطناعي">
                            <Sparkles className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors text-sm">
                          {post.parsed.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {post.parsed.summary}
                        </p>
                        {post.parsed.subCategory && (
                          <span className="inline-block mt-1 text-[10px] text-slate-400">
                            {post.parsed.subCategory}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${catMeta.bgLight} ${catMeta.color} border border-slate-200/60 dark:border-slate-700/60`}>
                      {catMeta.label}
                    </span>
                  </td>

                  {/* Price & Currency */}
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {post.parsed.price > 0 ? (
                        <>
                          <span className="text-base text-blue-600 dark:text-blue-400">
                            {post.parsed.price.toLocaleString()}
                          </span>{' '}
                          <span className="text-xs text-slate-500 font-semibold">
                            {post.parsed.currency}
                          </span>
                        </>
                      ) : (
                        <span className="text-amber-600 font-bold">على السوم</span>
                      )}
                    </div>
                    {post.parsed.isPriceNegotiable ? (
                      <span className="inline-block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        ✓ قابل للتفاوض
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] text-slate-400 mt-0.5">
                        سعر نهائي
                      </span>
                    )}
                  </td>

                  {/* Condition */}
                  <td className="py-4 px-4">
                    {renderConditionBadge(post.parsed.condition)}
                  </td>

                  {/* Location & City */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{post.parsed.city}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 block">
                      {post.parsed.location}
                    </span>
                  </td>

                  {/* Specifications Badges */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                      {post.parsed.keyTags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.parsed.keyTags.length > 3 && (
                        <span className="text-[10px] text-blue-600 font-bold self-center">
                          +{post.parsed.keyTags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Group Name & Publish Date */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 text-xs">
                      {post.groupName}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatArabicTime(post.createdAt)}</span>
                      <span>•</span>
                      <span>{post.author.name}</span>
                    </div>
                  </td>

                  {/* Direct Contact Buttons (WhatsApp, Phone) */}
                  <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      {whatsappUrl ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-colors"
                          title="محادثة واتساب مباشرة مع البائع"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-300 cursor-not-allowed">
                          <MessageCircle className="w-4 h-4" />
                        </span>
                      )}

                      {post.parsed.contact.phone && (
                        <a
                          href={`tel:${post.parsed.contact.phone}`}
                          className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-xs transition-colors"
                          title={`اتصال هاتفي: ${post.parsed.contact.phone}`}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectPost(post)}
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      title="عرض كامل التفاصيل والمنشور الأصلي"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
