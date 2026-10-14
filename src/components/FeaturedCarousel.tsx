import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types/product';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  ExternalLink, 
  Sparkles, 
  Tv, 
  Check, 
  ShoppingBag,
  Flame,
  Star
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface FeaturedCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onPreviewSimulator: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  products,
  onSelectProduct,
  onPreviewSimulator,
  onAddToCart,
}) => {
  // Only the top 3 featured products
  const featuredItems = products.filter(p => p.isTopThreeFeatured).slice(0, 3);
  
  // Current active index for mobile/carousel navigation
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto advance every 5.5s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, featuredItems.length]);

  const handlePrev = () => {
    sounds.playTap();
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const handleNext = () => {
    sounds.playTap();
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'MIỄN PHÍ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <section 
      id="featured-section"
      className="py-16 md:py-24 bg-ivory text-forest-900 border-b border-ivory-border transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Refined Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-ivory-border">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-forest-600 uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-600"></span>
              Sản phẩm nổi bật nhất
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-forest-900 tracking-tight">
              Featured Streamer Overlays
            </h2>
            <p className="mt-2 text-sm sm:text-base text-forest-800/70 max-w-xl">
              3 bộ giao diện được các streamer chuyên nghiệp tin dùng nhất cho kỳ phát sóng hiện tại.
            </p>
          </div>

          {/* Carousel Controls (Prev / Next & Position Indicator) */}
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {/* Dots */}
            <div className="flex items-center gap-1.5 mr-2">
              {featuredItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playTap();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? 'w-6 bg-forest-800' 
                      : 'w-2 bg-neutralMuted/50 hover:bg-neutralMuted'
                  }`}
                  aria-label={`Chuyển tới sản phẩm ${idx + 1}`}
                />
              ))}
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-xl border border-ivory-border bg-white hover:bg-forest-50 text-forest-900 hover:text-forest-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                aria-label="Sản phẩm trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-xl border border-ivory-border bg-white hover:bg-forest-50 text-forest-900 hover:text-forest-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                aria-label="Sản phẩm tiếp theo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop View: 3 Products in a balanced, elegant horizontal grid */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {featuredItems.map((product, idx) => (
            <div
              key={product.id}
              className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden shadow-forest-sm hover:shadow-forest-md hover:-translate-y-1 ${
                currentIndex === idx ? 'border-forest-600/50 ring-1 ring-forest-600/20' : 'border-ivory-border hover:border-forest-400'
              }`}
            >
              {/* Product Preview Frame */}
              <div className="relative aspect-video bg-forest-950 overflow-hidden">
                <img
                  src={product.previews.obsScene}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {product.badge && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-forest-900/90 text-ivory border border-forest-700/60 shadow-sm flex items-center gap-1">
                      {product.badge === 'Bestseller' && <Flame className="w-3 h-3 text-amber-400" />}
                      {product.badge === 'Featured' && <Star className="w-3 h-3 text-emerald-400" />}
                      {product.badge === 'New' && <Sparkles className="w-3 h-3 text-emerald-300" />}
                      <span>{product.badge}</span>
                    </span>
                  )}
                </div>

                {/* Resolution & FPS Tag */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-forest-950/80 backdrop-blur-sm text-[10px] font-mono text-ivory/90 border border-forest-800">
                  {product.resolution} • {product.fps}FPS
                </div>

                {/* Quick Action Overlay on Hover */}
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      onPreviewSimulator(product);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-forest-600 hover:bg-forest-500 text-ivory text-xs font-semibold shadow-lg flex items-center gap-1.5 transition-transform transform translate-y-1 group-hover:translate-y-0"
                    title="Xem thử overlay trong OBS Simulator"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Xem trước OBS</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onSelectProduct(product);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-forest-50 text-forest-900 text-xs font-semibold shadow-lg flex items-center gap-1.5 transition-transform transform translate-y-1 group-hover:translate-y-0"
                  >
                    <Eye className="w-3.5 h-3.5 text-forest-700" />
                    <span>Chi tiết</span>
                  </button>
                </div>
              </div>

              {/* Product Info Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-forest-600 font-medium mb-1">
                    <span>{product.categoryLabel}</span>
                    <span className="font-mono text-neutralMuted">{product.platforms[0]}</span>
                  </div>

                  <h3 
                    onClick={() => {
                      sounds.playClick();
                      onSelectProduct(product);
                    }}
                    className="font-display font-bold text-lg text-forest-900 hover:text-forest-700 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {product.title}
                  </h3>

                  <p className="mt-2 text-xs text-forest-800/70 line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                {/* Price and Bottom Buttons */}
                <div className="pt-4 mt-4 border-t border-ivory-border flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutralMuted line-through">
                      {product.originalPrice ? formatPrice(product.originalPrice) : ''}
                    </div>
                    <div className="text-base font-display font-bold text-forest-800">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSelectProduct(product);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-forest-200 hover:border-forest-400 text-xs font-semibold text-forest-800 hover:text-forest-900 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => {
                        onAddToCart(product);
                      }}
                      className="p-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-ivory transition-colors shadow-sm"
                      title="Thêm vào giỏ hàng"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Mobile & Tablet View: Smooth Carousel with Active Slide */}
        <div className="lg:hidden relative">
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredItems.map((product) => (
                <div 
                  key={product.id}
                  className="w-full flex-shrink-0 px-1"
                >
                  <div className="bg-white rounded-2xl border border-ivory-border overflow-hidden shadow-forest-md flex flex-col">
                    {/* Image Preview */}
                    <div className="relative aspect-video bg-forest-950">
                      <img
                        src={product.previews.obsScene}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        {product.badge && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-forest-900/90 text-ivory border border-forest-700/60">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-forest-950/80 text-[10px] font-mono text-ivory">
                        {product.resolution}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-forest-600 font-medium mb-1">
                          {product.categoryLabel}
                        </div>
                        <h3 className="font-display font-bold text-lg text-forest-900">
                          {product.title}
                        </h3>
                        <p className="mt-2 text-xs text-forest-800/70 leading-relaxed">
                          {product.shortDesc}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-ivory-border flex items-center justify-between">
                        <div>
                          {product.originalPrice && (
                            <div className="text-[11px] text-neutralMuted line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                          <div className="text-base font-display font-bold text-forest-800">
                            {formatPrice(product.price)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              sounds.playTap();
                              onPreviewSimulator(product);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-forest-100 text-forest-800 text-xs font-semibold"
                          >
                            Xem trước
                          </button>
                          <button
                            onClick={() => {
                              sounds.playClick();
                              onSelectProduct(product);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-forest-800 text-ivory text-xs font-semibold"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Swipe hint */}
          <div className="mt-3 text-center text-xs text-neutralMuted font-mono">
            <span>← Vuốt để chuyển sản phẩm ({currentIndex + 1} / {featuredItems.length}) →</span>
          </div>
        </div>

      </div>
    </section>
  );
};
