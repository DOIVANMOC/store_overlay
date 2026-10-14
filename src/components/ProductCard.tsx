import React, { useState } from 'react';
import { Product } from '../types/product';
import { 
  Tv, 
  Eye, 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  Check, 
  Download,
  Trash2
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onPreviewSimulator: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdmin?: boolean;
  onDeleteProduct?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onPreviewSimulator,
  onAddToCart,
  isAdmin = false,
  onDeleteProduct,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price: number) => {
    if (price === 0) return 'MIỄN PHÍ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    if (window.confirm(`[ADMIN] Bạn có chắc chắn muốn xóa bài đăng "${product.title}" khỏi website?`)) {
      onDeleteProduct?.(product.id);
    }
  };

  // Determine which preview image to show (secondary preview on hover!)
  const activeImage = isHovered && product.previews.startingSoon !== product.previews.obsScene 
    ? product.previews.startingSoon 
    : product.previews.obsScene;

  return (
    <div 
      className="group bg-white rounded-2xl border border-ivory-border hover:border-forest-400 transition-all duration-300 flex flex-col overflow-hidden shadow-forest-sm hover:shadow-forest-md hover:-translate-y-1 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-video bg-forest-950 overflow-hidden cursor-pointer">
        <img
          src={activeImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.badge && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
              product.isFree 
                ? 'bg-emerald-600 text-ivory' 
                : 'bg-forest-900/90 text-ivory border border-forest-700/60'
            }`}>
              {product.badge === 'Bestseller' && <Flame className="w-2.5 h-2.5 text-amber-400" />}
              {product.badge === 'New' && <Sparkles className="w-2.5 h-2.5 text-emerald-300" />}
              {product.badge === 'Free Community' && <Sparkles className="w-2.5 h-2.5 text-ivory" />}
              <span>{product.badge}</span>
            </span>
          )}
        </div>

        {/* Admin Quick Delete Button */}
        {isAdmin && onDeleteProduct && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-md border border-red-400 transition-transform transform hover:scale-110"
            title="[Admin] Xóa bài đăng này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Platform tag bottom right */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-forest-950/80 backdrop-blur-sm text-[10px] font-mono text-ivory/90 border border-forest-800">
          {product.platforms[0]}
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-forest-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playTap();
              onPreviewSimulator(product);
            }}
            className="px-3 py-1.5 rounded-lg bg-forest-600 hover:bg-forest-500 text-ivory text-xs font-semibold shadow-lg flex items-center gap-1 transition-transform transform translate-y-1 group-hover:translate-y-0"
            title="Thử trực tiếp trên OBS Simulator"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Xem trước</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectProduct(product);
            }}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-forest-50 text-forest-900 text-xs font-semibold shadow-lg flex items-center gap-1 transition-transform transform translate-y-1 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5 text-forest-700" />
            <span>Chi tiết</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Resolution */}
          <div className="flex items-center justify-between text-[11px] text-forest-600 font-medium mb-1.5">
            <span className="uppercase tracking-wide">{product.categoryLabel}</span>
            <span className="font-mono text-neutralMuted">{product.resolution.split(' ')[0]}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => {
              sounds.playClick();
              onSelectProduct(product);
            }}
            className="font-display font-bold text-base text-forest-900 hover:text-forest-700 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.title}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-forest-800/70 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Tags preview */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-forest-50 text-forest-700 font-mono">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3.5 mt-3 border-t border-ivory-border flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <div className="text-[11px] text-neutralMuted line-through leading-none">
                {formatPrice(product.originalPrice)}
              </div>
            )}
            <div className={`text-base font-display font-bold ${product.isFree ? 'text-emerald-700' : 'text-forest-900'}`}>
              {formatPrice(product.price)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playClick();
                onSelectProduct(product);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-forest-200 hover:border-forest-400 text-xs font-semibold text-forest-800 transition-colors"
            >
              Chi tiết
            </button>

            <button
              onClick={handleAdd}
              className={`p-1.5 rounded-lg transition-all ${
                isAdded 
                  ? 'bg-emerald-600 text-ivory' 
                  : 'bg-forest-800 hover:bg-forest-700 text-ivory'
              }`}
              title={product.isFree ? 'Tải ngay miễn phí' : 'Thêm vào giỏ hàng'}
              aria-label="Thêm vào giỏ"
            >
              {isAdded ? (
                <Check className="w-4 h-4" />
              ) : product.isFree ? (
                <Download className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
