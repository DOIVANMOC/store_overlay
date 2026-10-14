import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types/product';
import { Search, X, ArrowRight, Tv, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown for Escape or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = products.filter(p => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const formatPrice = (price: number) => {
    if (price === 0) return 'MIỄN PHÍ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/80 backdrop-blur-md p-4 sm:p-6 flex items-start justify-center pt-20 animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-ivory-border shadow-2xl overflow-hidden flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-forest-900 border-b border-forest-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên overlay, game, chủ đề (ví dụ: TikTok, Valorant, Free)..."
            className="flex-1 bg-transparent text-sm text-ivory placeholder:text-neutralMuted focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs text-neutralMuted hover:text-ivory px-2 py-1"
            >
              ✕
            </button>
          )}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-neutralMuted hover:text-ivory bg-forest-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-neutralMuted space-y-2">
              <Sparkles className="w-6 h-6 mx-auto text-forest-400 opacity-60" />
              <p>Gõ từ khóa để tìm kiếm trong kho Streamer Overlay FOREST OVERLAY.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Deep Woods', 'TikTok Live', 'Minimal', 'Esports', 'Webcam', 'Free'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      sounds.playTap();
                      setQuery(tag);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-forest-50 text-forest-700 text-[11px] font-mono hover:bg-forest-100"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3 rounded-2xl border border-ivory-border hover:border-forest-400 hover:bg-forest-50/60 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-10 rounded-lg bg-forest-950 overflow-hidden flex-shrink-0">
                    <img src={product.previews.obsScene} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-forest-900 group-hover:text-forest-700 truncate">
                      {product.title}
                    </div>
                    <div className="text-[10px] text-neutralMuted font-mono">
                      {product.categoryLabel} • {product.resolution.split(' ')[0]}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-forest-900 font-display">
                    {formatPrice(product.price)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutralMuted group-hover:text-forest-800 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-neutralMuted">
              Không tìm thấy overlay nào khớp với "{query}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
