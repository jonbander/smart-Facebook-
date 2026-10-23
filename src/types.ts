export type MarketplaceCategory = 
  | 'ALL'
  | 'PHONES'
  | 'ELECTRONICS'
  | 'CARS'
  | 'REAL_ESTATE'
  | 'FURNITURE'
  | 'FASHION'
  | 'APPLIANCES'
  | 'SERVICES';

export type ProductCondition = 
  | 'BRAND_NEW'
  | 'LIKE_NEW'
  | 'EXCELLENT'
  | 'GOOD'
  | 'FAIR';

export interface FacebookUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  isDemo: boolean;
  accessToken?: string;
  connectedAt: string;
}

export interface FacebookGroup {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  isBuyAndSell: boolean;
  location: string;
  avatarUrl: string;
  privacy: 'PUBLIC' | 'CLOSED';
  syncedPostsCount: number;
  lastSync: string;
}

export interface ParsedProductData {
  title: string;
  category: MarketplaceCategory;
  subCategory?: string;
  price: number;
  currency: string;
  originalPriceText?: string;
  isPriceNegotiable: boolean;
  condition: ProductCondition;
  location: string;
  city: string;
  contact: {
    phone?: string;
    whatsapp?: string;
    messengerUrl?: string;
  };
  specifications: Record<string, string>;
  keyTags: string[];
  summary: string;
  aiAnalyzed: boolean;
}

export interface MarketplacePost {
  id: string;
  facebookPostId: string;
  groupId: string;
  groupName: string;
  author: {
    name: string;
    avatar: string;
    profileUrl?: string;
  };
  createdAt: string;
  rawContent: string;
  mediaUrls: string[];
  parsed: ParsedProductData;
  saved?: boolean;
}

export interface FilterOptions {
  query: string;
  category: MarketplaceCategory;
  groupId: string;
  minPrice?: number;
  maxPrice?: number;
  currency: string;
  condition: string;
  city: string;
  hasPhoneOnly: boolean;
  negotiableOnly: boolean;
  dateRange: 'ALL' | 'TODAY' | '3DAYS' | 'WEEK';
  sortBy: 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'POPULAR';
  specKey?: string;
  specValue?: string;
}

export interface CategoryInfo {
  id: MarketplaceCategory;
  label: string;
  iconName: string;
  color: string;
  bgLight: string;
}
