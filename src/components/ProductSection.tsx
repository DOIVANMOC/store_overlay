import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types/product';
import { CATEGORIES_LIST, PLATFORMS_LIST } from '../data/products';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowUpDown, 
  RotateCcw,
  Check
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ProductSectionProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onPreviewSimulator: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdmin?: boolean;
  onDeleteProduct?: (productId: string) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onPreviewSimulator,
  onAddToCart,
  isAdmin = false,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Tất cả nền tảng');
  const [priceRange, setPriceRange] = useState<'all' | 'free' | 'under300' | '300to500' | 'above500'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Dynamic filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'free') {
          if (!item.isFree) return false;
        } else if (selectedCategory === 'paid') {
          if (item.isFree) return false;
        } else if (selectedCategory === 'nature') {
          if (!item.tags.includes('Nature & Forest') && item.category !== 'nature') return false;
        } else if (selectedCategory === 'gaming') {
          if (item.category !== 'gaming') return false;
        } else if (selectedCategory === 'dark') {
          if (item.category !== 'dark') return false;
        } else if (selectedCategory === 'minimal') {
          if (item.category !== 'minimal') return false;
        } else if (selectedCategory === 'webcam') {
          if (item.category !== 'webcam') return false;
        } else if (selectedCategory === 'full-package') {
          if (item.category !== 'full-package') return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.shortDesc.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
        const matchesTag = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTag) return false;
      }

      // 3. Platform filter
      if (selectedPlatform !== 'Tất cả nền tảng') {
        const matchesPlatform = item.platforms.some(p => p.toLowerCase().includes(selectedPlatform.toLowerCase().replace(' studio', '')));
        if (!matchesPlatform) return false;
      }

      // 4. Price range filter
      if (priceRange === 'free' && !item.isFree) return false;
      if (priceRange === 'under300' && (item.price === 0 || item.price > 300000)) return false;
      if (priceRange === '300to500' && (item.price < 300000 || item.price > 500000)) return false;
      if (priceRange === 'above500' && item.price <= 500000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0);
      // 'featured' default: top featured items first
      return (b.isTopThreeFeatured ? 1 : 0) - (a.isTopThreeFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, selectedPlatform, priceRange, sortBy]);

  const resetFilters = () => {
    sounds.playTap();
    onSelectCategory('all');
    setSearchQuery('');
    setSelectedPlatform('Tất cả nền tảng');
    setPriceRange('all');
    setSortBy('featured');
  };

  return (
    <section id="explore-collection" className="py-16 md:py-24 bg-ivory text-forest-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-forest-600 uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            Cửa hàng bản quyền
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-forest-900 tracking-tight">
            Explore the Collection
          </h2>
          <p className="mt-3 text-base text-forest-800/70 font-normal">
            Tìm bộ giao diện hoàn hảo cho phong cách livestream của bạn.
          </p>
        </div>

        {/* Category Filter Pills (Horizontal Scrollable on mobile) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {CATEGORIES_LIST.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sounds.playTap();
                    onSelectCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-forest-800 text-ivory shadow-forest-sm'
                      : 'bg-white border border-ivory-border text-forest-800 hover:border-forest-400 hover:bg-forest-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-forest-700 text-ivory' : 'bg-forest-100 text-forest-700'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter & Search Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-ivory-border shadow-forest-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutralMuted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm overlay theo tên, thẻ tag (ví dụ: TikTok, Stinger, Valorant)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-forest-50/70 border border-ivory-border text-xs text-forest-900 placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutralMuted hover:text-forest-900"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Selectors & Sort */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Platform Selector */}
              <div className="relative">
                <select
                  value={selectedPlatform}
                  onChange={(e) => {
                    sounds.playTap();
                    setSelectedPlatform(e.target.value);
                  }}
                  className="px-3 py-2 rounded-xl bg-forest-50/70 border border-ivory-border text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-600 transition-colors cursor-pointer appearance-none pr-8"
                >
                  {PLATFORMS_LIST.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutralMuted text-[10px]">
                  ▼
                </div>
              </div>

              {/* Price Filter Selector */}
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => {
                    sounds.playTap();
                    setPriceRange(e.target.value as any);
                  }}
                  className="px-3 py-2 rounded-xl bg-forest-50/70 border border-ivory-border text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-600 transition-colors cursor-pointer appearance-none pr-8"
                >
                  <option value="all">Tất cả mức giá</option>
                  <option value="free">Miễn phí (0₫)</option>
                  <option value="under300">Dưới 300.000₫</option>
                  <option value="300to500">300.000₫ - 500.000₫</option>
                  <option value="above500">Trên 500.000₫</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutralMuted text-[10px]">
                  ▼
                </div>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    sounds.playTap();
                    setSortBy(e.target.value as any);
                  }}
                  className="px-3 py-2 rounded-xl bg-forest-50/70 border border-ivory-border text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-600 transition-colors cursor-pointer appearance-none pr-8"
                >
                  <option value="featured">Sắp xếp: Nổi bật</option>
                  <option value="newest">Sắp xếp: Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutralMuted text-[10px]">
                  ▼
                </div>
              </div>

              {/* Reset button if any filter is active */}
              {(selectedCategory !== 'all' || searchQuery || selectedPlatform !== 'Tất cả nền tảng' || priceRange !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="p-2 rounded-xl text-neutralMuted hover:text-forest-900 border border-ivory-border hover:bg-forest-50 transition-colors"
                  title="Đặt lại toàn bộ bộ lọc"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Result Status Bar */}
          <div className="pt-2 border-t border-ivory-border flex items-center justify-between text-xs text-neutralMuted font-mono">
            <span>Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} sản phẩm</span>
            {selectedCategory !== 'all' && (
              <span className="text-forest-600 font-sans">
                Đang lọc: <strong>{CATEGORIES_LIST.find(c => c.id === selectedCategory)?.label}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onPreviewSimulator={onPreviewSimulator}
                onAddToCart={onAddToCart}
                isAdmin={isAdmin}
                onDeleteProduct={onDeleteProduct}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-ivory-border p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-forest-50 flex items-center justify-center text-forest-600 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-forest-900 mb-2">
              Không tìm thấy overlay phù hợp
            </h3>
            <p className="text-sm text-forest-800/70 max-w-md mx-auto mb-6">
              Không có sản phẩm nào khớp với tiêu chí tìm kiếm hiện tại. Hãy thử chọn danh mục khác hoặc xóa bộ lọc.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
