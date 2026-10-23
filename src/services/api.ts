import { FacebookGroup, MarketplacePost, FacebookUser, ParsedProductData } from '../types';
import { INITIAL_GROUPS, INITIAL_POSTS, DEMO_USER } from '../data/mockData';
import { parseRawFacebookPost } from './nlpParser';

const STORAGE_KEY_USER = 'fb_marketplace_user';
const STORAGE_KEY_POSTS = 'fb_marketplace_posts';
const STORAGE_KEY_GROUPS = 'fb_marketplace_groups';
const STORAGE_KEY_SAVED = 'fb_marketplace_saved';

export function getStoredUser(): FacebookUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: FacebookUser | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

export function getStoredPosts(): MarketplacePost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (raw) {
      const posts: MarketplacePost[] = JSON.parse(raw);
      const savedIds = getSavedPostIds();
      return posts.map(p => ({ ...p, saved: savedIds.has(p.id) }));
    }
  } catch (e) {
    console.error('Error reading stored posts:', e);
  }
  const savedIds = getSavedPostIds();
  return INITIAL_POSTS.map(p => ({ ...p, saved: savedIds.has(p.id) }));
}

export function saveStoredPosts(posts: MarketplacePost[]): void {
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
}

export function getStoredGroups(): FacebookGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GROUPS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored groups:', e);
  }
  return INITIAL_GROUPS;
}

export function saveStoredGroups(groups: FacebookGroup[]): void {
  localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
}

export function getSavedPostIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED);
    return raw ? new Set(JSON.parse(raw)) : new Set(['post_02', 'post_04', 'post_12']);
  } catch {
    return new Set();
  }
}

export function toggleSavedPost(postId: string): boolean {
  const saved = getSavedPostIds();
  let isSaved = false;
  if (saved.has(postId)) {
    saved.delete(postId);
    isSaved = false;
  } else {
    saved.add(postId);
    isSaved = true;
  }
  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(Array.from(saved)));
  return isSaved;
}

// AI Analysis using server endpoint if available, falling back to local NLP
export async function analyzePostWithAI(content: string): Promise<ParsedProductData> {
  try {
    const res = await fetch('/api/ai/analyze-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.parsed) {
        return { ...data.parsed, aiAnalyzed: true };
      }
    }
  } catch (err) {
    console.warn('Backend AI analysis not reachable, using intelligent local engine', err);
  }
  return parseRawFacebookPost(content);
}

// Bulk AI Analysis for multiple posts copied from a Facebook group
export async function analyzeBulkPostsWithAI(rawText: string, groupName: string): Promise<MarketplacePost[]> {
  try {
    const res = await fetch('/api/ai/analyze-bulk-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, groupName }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
        return data.posts.map((item: any, idx: number) => {
          const parsed: ParsedProductData = {
            title: item.title,
            category: item.category || 'ELECTRONICS',
            subCategory: item.subCategory,
            price: item.price || 0,
            currency: item.currency || 'SAR',
            originalPriceText: item.originalPriceText || `${item.price || 0} ${item.currency || 'SAR'}`,
            isPriceNegotiable: !!item.isPriceNegotiable,
            condition: item.condition || 'GOOD',
            city: item.city || 'الرياض',
            location: item.location || item.city || 'غير محدد',
            contact: {
              phone: item.phone,
              whatsapp: item.whatsapp || item.phone,
            },
            specifications: item.specifications || {},
            keyTags: item.keyTags || [item.city || 'سوق', item.category || 'إعلان'],
            summary: item.summary || item.title,
            aiAnalyzed: true,
          };

          return {
            id: `post_bulk_${Date.now()}_${idx}`,
            facebookPostId: `fb_post_${Math.floor(Math.random() * 100000000)}`,
            groupId: 'grp_custom_' + Date.now(),
            groupName: groupName || 'مجموعة فيسبوك الحقيقية',
            author: {
              name: item.authorName || 'معلن حقيقي',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            },
            createdAt: new Date(Date.now() - idx * 10 * 60 * 1000).toISOString(),
            rawContent: item.rawSnippet || rawText,
            mediaUrls: [
              item.category === 'CARS' ? 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600' :
              item.category === 'PHONES' ? 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600' :
              item.category === 'REAL_ESTATE' ? 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' :
              'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'
            ],
            parsed,
            saved: false,
          };
        });
      }
    }
  } catch (err) {
    console.warn('Backend bulk AI analysis fallback', err);
  }

  // Fallback: Split rawText into chunks by common separators (newlines, emojis, dashes)
  const chunks = rawText.split(/(?:\n---+\n|\n\n\n+|(?=للبيع|عرض|فرصة|ما شاء الله|مطلوب|سيارة|شقة|ايفون|لابتوب))/i)
    .map(c => c.trim())
    .filter(c => c.length > 25);

  const parsedChunks = chunks.length > 0 ? chunks : [rawText];

  return parsedChunks.map((chunk, idx) => {
    const parsed = parseRawFacebookPost(chunk);
    return {
      id: `post_bulk_fallback_${Date.now()}_${idx}`,
      facebookPostId: `fb_post_${Math.floor(Math.random() * 100000000)}`,
      groupId: 'grp_custom_' + Date.now(),
      groupName: groupName || 'مجموعة فيسبوك الحقيقية',
      author: {
        name: 'معلن فيسبوك',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      },
      createdAt: new Date(Date.now() - idx * 10 * 60 * 1000).toISOString(),
      rawContent: chunk,
      mediaUrls: [
        parsed.category === 'CARS' ? 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600' :
        parsed.category === 'PHONES' ? 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600' :
        parsed.category === 'REAL_ESTATE' ? 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' :
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'
      ],
      parsed,
      saved: false,
    };
  });
}

export function clearStoredPosts(): void {
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify([]));
}

// Fetch OAuth URL from server
export async function getFacebookAuthUrl(appId?: string): Promise<string> {
  try {
    const query = appId ? `?client_id=${encodeURIComponent(appId)}` : '';
    const res = await fetch(`/api/auth/facebook/url${query}`);
    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch (e) {
    console.error('Error getting auth url', e);
  }
  
  // Direct client fallback
  const redirectUri = `${window.location.origin}/auth/callback`;
  const clientId = appId || '184920491029384';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'public_profile,email,groups_access_member_info',
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}

// Export items to CSV
export function exportPostsToCSV(posts: MarketplacePost[]): void {
  const headers = ['العنوان', 'الفئة', 'السعر', 'العملة', 'الحالة', 'المدينة', 'المجموعة', 'رقم الهاتف', 'المواصفات', 'تاريخ النشر'];
  const rows = posts.map(p => [
    `"${p.parsed.title.replace(/"/g, '""')}"`,
    `"${p.parsed.category}"`,
    p.parsed.price,
    `"${p.parsed.currency}"`,
    `"${p.parsed.condition}"`,
    `"${p.parsed.city}"`,
    `"${p.groupName.replace(/"/g, '""')}"`,
    `"${p.parsed.contact.phone || '-'}"`,
    `"${Object.entries(p.parsed.specifications).map(([k, v]) => `${k}: ${v}`).join(' | ').replace(/"/g, '""')}"`,
    `"${new Date(p.createdAt).toLocaleDateString('ar-EG')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `facebook_marketplace_posts_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
