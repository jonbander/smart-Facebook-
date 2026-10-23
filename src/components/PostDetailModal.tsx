import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Bookmark, 
  Calendar, 
  Sparkles, 
  Share2, 
  Check, 
  CheckCircle2,
  FileText,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { MarketplacePost } from '../types';
import { CATEGORIES } from '../data/mockData';

interface PostDetailModalProps {
  post: MarketplacePost | null;
  onClose: () => void;
  onToggleSave: (postId: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'raw'>('specs');
  const [copied, setCopied] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!post) return null;

  const catMeta = CATEGORIES.find(c => c.id === post.parsed.category) || CATEGORIES[0];

  const whatsappUrl = post.parsed.contact.whatsapp
    ? `https://wa.me/${post.parsed.contact.whatsapp}?text=${encodeURIComponent(
        `السلام عليكم، رأيت إعلانك في مجموعة فيسبوك ("${post.groupName}") عن: "${post.parsed.title}" بسعر ${post.parsed.price} ${post.parsed.currency}. هل المنتج ما زال متوفراً؟`
      )}`
    : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${catMeta.bgLight} ${catMeta.color}`}>
              {catMeta.label}
            </span>
            <span className="text-xs text-slate-500">
              {post.groupName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(post.id)}
              className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors ${
                post.saved ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/40' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="حفظ"
            >
              <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 transition-colors"
              title="نسخ الرابط"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Main Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {post.parsed.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {post.parsed.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  نُشر: {new Date(post.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'long' })}
                </span>
              </div>
            </div>

            <div className="sm:text-left shrink-0 bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {post.parsed.price > 0 ? (
                  <>
                    {post.parsed.price.toLocaleString()}{' '}
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      {post.parsed.currency}
                    </span>
                  </>
                ) : (
                  'على السوم'
                )}
              </div>
              <div className="text-xs font-semibold mt-0.5">
                {post.parsed.isPriceNegotiable ? (
                  <span className="text-emerald-600 font-bold">✓ السعر قابل للتفاوض</span>
                ) : (
                  <span className="text-slate-400">سعر نهائي</span>
                )}
              </div>
            </div>
          </div>

          {/* Media Images Gallery */}
          {post.mediaUrls.length > 0 && (
            <div className="space-y-2">
              <div className="relative h-72 sm:h-84 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={post.mediaUrls[selectedImageIdx] || post.mediaUrls[0]}
                  alt={post.parsed.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {post.mediaUrls.length > 1 && (
                <div className="flex items-center gap-2">
                  {post.mediaUrls.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIdx(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIdx === i ? 'border-blue-600 ring-2 ring-blue-300' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tabs: Structured Specs vs Raw Facebook Post */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex items-center gap-2 py-3 border-b-2 font-bold text-xs transition-colors ${
                  activeTab === 'specs'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>المواصفات المستخرجة والمصنفة</span>
              </button>

              <button
                onClick={() => setActiveTab('raw')}
                className={`flex items-center gap-2 py-3 border-b-2 font-bold text-xs transition-colors ${
                  activeTab === 'raw'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>نص المنشور الأصلي في فيسبوك</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Structured Specifications Table */}
          {activeTab === 'specs' ? (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-right text-xs">
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr className="bg-white dark:bg-slate-900/40">
                      <td className="py-3 px-4 font-bold text-slate-500 w-1/3">حالة المنتج:</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {post.parsed.condition === 'BRAND_NEW' && 'جديد بالكرتونة / وكالة'}
                        {post.parsed.condition === 'LIKE_NEW' && 'كسر زيرو / شبه جديد'}
                        {post.parsed.condition === 'EXCELLENT' && 'مستعمل بحالة ممتازة'}
                        {post.parsed.condition === 'GOOD' && 'مستعمل بحالة جيدة'}
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-900/40">
                      <td className="py-3 px-4 font-bold text-slate-500">المدينة والمنطقة:</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {post.parsed.location}
                      </td>
                    </tr>
                    {Object.entries(post.parsed.specifications).map(([key, value], idx) => (
                      <tr key={idx} className="bg-white dark:bg-slate-900/40">
                        <td className="py-3 px-4 font-bold text-slate-500">{key}:</td>
                        <td className="py-3 px-4 font-semibold text-blue-700 dark:text-blue-300">
                          {value}
                        </td>
                      </tr>
                    ))}
                    {post.parsed.keyTags.length > 0 && (
                      <tr className="bg-white dark:bg-slate-900/40">
                        <td className="py-3 px-4 font-bold text-slate-500">الوسوم المفتاحية:</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {post.parsed.keyTags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold block text-slate-900 dark:text-white mb-1">ملخص الإعلان:</span>
                {post.parsed.summary}
              </div>
            </div>
          ) : (
            /* Tab 2: Raw Facebook Post Content */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {post.rawContent}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>معرّف المنشور: {post.facebookPostId}</span>
                <a
                  href={`https://facebook.com/${post.facebookPostId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                >
                  <span>عرض المنشور الأصلي في فيسبوك</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Seller Card & Action Bar */}
          <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {post.author.name}
                </h4>
                <p className="text-xs text-slate-500">
                  صاحب الإعلان في {post.groupName}
                </p>
                {post.parsed.contact.phone && (
                  <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    📞 {post.parsed.contact.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل واتساب فوراً</span>
                </a>
              )}

              {post.parsed.contact.phone && (
                <a
                  href={`tel:${post.parsed.contact.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">اتصال هاتفي</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
