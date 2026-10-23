import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Smartphone, 
  Car, 
  Home, 
  Armchair, 
  Tv, 
  Laptop, 
  Watch, 
  Briefcase, 
  LayoutGrid,
  Check,
  Tag
} from 'lucide-react';
import { FilterOptions, MarketplaceCategory } from '../types';
import { CATEGORIES } from '../data/mockData';

interface SearchAndFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableCities: string[];
  totalResults: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  availableCities,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Helper for category icon
  const getCategoryIcon = (id: MarketplaceCategory) => {
    switch (id) {
      case 'ALL': return <LayoutGrid className="w-4 h-4" />;
      case 'PHONES': return <Smartphone className="w-4 h-4" />;
      case 'CARS': return <Car className="w-4 h-4" />;
      case 'REAL_ESTATE': return <Home className="w-4 h-4" />;
      case 'ELECTRONICS': return <Laptop className="w-4 h-4" />;
      case 'FURNITURE': return <Armchair className="w-4 h-4" />;
      case 'APPLIANCES': return <Tv className="w-4 h-4" />;
      case 'FASHION': return <Watch className="w-4 h-4" />;
      case 'SERVICES': return <Briefcase className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  const handleTextSearch = (val: string) => {
    onFilterChange({ ...filters, query: val });
  };

  const handleCategorySelect = (cat: MarketplaceCategory) => {
    onFilterChange({ ...filters, category: cat });
  };

  const resetFilters = () => {
    onFilterChange({
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
      specKey: undefined,
      specValue: undefined,
    });
  };

  const hasActiveFilters = 
    Boolean(filters.query) ||
    filters.category !== 'ALL' ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.currency !== 'ALL' ||
    filters.condition !== 'ALL' ||
    filters.city !== 'ALL' ||
    filters.hasPhoneOnly ||
    filters.negotiableOnly ||
    Boolean(filters.specValue);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        
        {/* Top Search Bar & Main Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleTextSearch(e.target.value)}
              placeholder="ابحث عن منتج محدد.. مثال: آيفون 15 برو، كامري 2023، شقة بالتجمع، لابتوب RTX 4080..."
              className="w-full pr-11 pl-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder-slate-400"
            />
            {filters.query && (
              <button
                onClick={() => handleTextSearch('')}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Controls: Advanced Filter Toggle, Sort By */}
          <div className="flex items-center gap-2">
            
            {/* Advanced Filters Button */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-all ${
                showAdvanced || hasActiveFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>بحث تفصيلي بالمواصفات</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
                className="px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="NEWEST">الأحدث نشراً</option>
                <option value="PRICE_ASC">السعر: من الأقل للأعلى</option>
                <option value="PRICE_DESC">السعر: من الأعلى للأقل</option>
              </select>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-3 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/30 transition-colors text-xs font-semibold"
                title="إلغاء كل الفلاتر"
              >
                <X className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={isSelected ? 'text-white' : cat.color}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Collapsible Advanced Attributes Search Panel */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* 1. Price Range */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  نطاق السعر:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="الأدنى"
                    value={filters.minPrice ?? ''}
                    onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-right"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="الأقصى"
                    value={filters.maxPrice ?? ''}
                    onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-right"
                  />
                </div>
              </div>

              {/* 2. City Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  المدينة والموقع:
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">جميع المدن والمناطق</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* 3. Condition Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  حالة المنتج:
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => onFilterChange({ ...filters, condition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">جميع الحالات</option>
                  <option value="BRAND_NEW">جديد بالكرتونة / وكالة</option>
                  <option value="LIKE_NEW">كسر زيرو / شبه جديد</option>
                  <option value="EXCELLENT">مستعمل بحالة ممتازة</option>
                  <option value="GOOD">مستعمل بحالة جيدة</option>
                </select>
              </div>

              {/* 4. Currency Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  العملة:
                </label>
                <select
                  value={filters.currency}
                  onChange={(e) => onFilterChange({ ...filters, currency: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">جميع العملات</option>
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                  <option value="EGP">جنيه مصري (EGP)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                </select>
              </div>

            </div>

            {/* Specific Specs Filter Input (e.g. 256GB, 2023, RTX 4080) */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
                  فلتر بمواصفة فنية محددة:
                </span>
                <input
                  type="text"
                  placeholder="مثال: 256GB، بطارية 100%، موديل 2023، 3 غرف، RTX 4080، خشب زان..."
                  value={filters.specValue || ''}
                  onChange={(e) => onFilterChange({ ...filters, specValue: e.target.value })}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasPhoneOnly}
                    onChange={(e) => onFilterChange({ ...filters, hasPhoneOnly: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>يحتوي على واتساب / اتصال</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.negotiableOnly}
                    onChange={(e) => onFilterChange({ ...filters, negotiableOnly: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>قابل للتفاوض فقط</span>
                </label>
              </div>

            </div>

          </div>
        )}

        {/* Results Count & Active Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            تم العثور على <strong className="text-blue-600 dark:text-blue-400">{totalResults}</strong> إعلان مطابق
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
