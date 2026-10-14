import React, { useState } from 'react';
import { Product } from '../types/product';
import { StreamSimulator } from './StreamSimulator';
import { 
  X, 
  ShoppingBag, 
  Download, 
  Tv, 
  CheckCircle2, 
  FileText, 
  Cpu, 
  Monitor, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Star
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  allProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  allProducts,
  onSelectRelated,
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'preview' | 'simulator' | 'files' | 'install'>('preview');
  const [selectedImageKey, setSelectedImageKey] = useState<keyof typeof product.previews>('obsScene');
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price: number) => {
    if (price === 0) return 'MIỄN PHÍ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAdd = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // Find related products (same category or related tags)
  const related = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.tags.some(t => product.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-ivory-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-forest-900 text-ivory border-b border-forest-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-forest-300">
              Chi tiết gói Streamer Overlay
            </span>
            <span className="text-forest-700">|</span>
            <span className="text-xs text-neutralMuted font-mono hidden sm:inline">{product.id}</span>
          </div>
          
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-neutralMuted hover:text-ivory transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Main Visual & Info Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Visual Showcase & Tabs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Tab Selector: Live Preview vs Interactive Simulator */}
              <div className="flex items-center gap-2 border-b border-ivory-border pb-3">
                <button
                  onClick={() => {
                    sounds.playTap();
                    setActiveTab('preview');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-forest-800 text-ivory shadow-sm'
                      : 'bg-forest-50 text-forest-800 hover:bg-forest-100'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Ảnh màn hình thực tế</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playWhoosh();
                    setActiveTab('simulator');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'simulator'
                      ? 'bg-forest-800 text-ivory shadow-sm'
                      : 'bg-forest-50 text-forest-800 hover:bg-forest-100'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OBS Live Simulator</span>
                </button>
              </div>

              {/* View 1: Photo Preview */}
              {activeTab === 'preview' && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-forest-950 border border-ivory-border shadow-forest-md">
                    <img 
                      src={product.previews[selectedImageKey]} 
                      alt={product.title}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-3 left-3 bg-forest-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono text-ivory border border-forest-800">
                      {product.resolution} • {product.fps}FPS • Chuẩn Broadcast
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => { sounds.playTap(); setSelectedImageKey('obsScene'); }}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageKey === 'obsScene' ? 'border-forest-600 scale-[1.02]' : 'border-ivory-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={product.previews.obsScene} alt="OBS Scene" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-forest-950/30 text-[9px] text-ivory font-semibold flex items-end p-1">Toàn cảnh OBS</div>
                    </button>

                    <button
                      onClick={() => { sounds.playTap(); setSelectedImageKey('startingSoon'); }}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageKey === 'startingSoon' ? 'border-forest-600 scale-[1.02]' : 'border-ivory-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={product.previews.startingSoon} alt="Starting Soon" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-forest-950/30 text-[9px] text-ivory font-semibold flex items-end p-1">Starting Soon</div>
                    </button>

                    <button
                      onClick={() => { sounds.playTap(); setSelectedImageKey('webcamCloseup'); }}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageKey === 'webcamCloseup' ? 'border-forest-600 scale-[1.02]' : 'border-ivory-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={product.previews.webcamCloseup} alt="Webcam" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-forest-950/30 text-[9px] text-ivory font-semibold flex items-end p-1">Khung Webcam</div>
                    </button>

                    <button
                      onClick={() => { sounds.playTap(); setSelectedImageKey('stingerAlert'); }}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageKey === 'stingerAlert' ? 'border-forest-600 scale-[1.02]' : 'border-ivory-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={product.previews.stingerAlert} alt="Alerts" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-forest-950/30 text-[9px] text-ivory font-semibold flex items-end p-1">Alerts & Chat</div>
                    </button>
                  </div>
                </div>
              )}

              {/* View 2: Interactive Live Simulator */}
              {activeTab === 'simulator' && (
                <div className="space-y-2">
                  <StreamSimulator product={product} isEmbedded={true} />
                  <p className="text-[11px] text-neutralMuted font-mono text-center">
                    Gợi ý: Bạn có thể nhập tên kênh streamer của mình ở thanh điều khiển bên dưới và thử kích hoạt thông báo!
                  </p>
                </div>
              )}

            </div>

            {/* Right Column: Key Details, Price, and Purchase CTA (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div>
                {/* Category & Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-forest-600 uppercase tracking-wide">
                    {product.categoryLabel}
                  </span>
                  {product.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-forest-800 text-ivory uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-forest-900 leading-tight">
                  {product.title}
                </h2>

                <p className="mt-3 text-sm text-forest-800/80 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-forest-50/70 border border-ivory-border text-xs">
                <div>
                  <div className="text-neutralMuted text-[11px]">Độ phân giải:</div>
                  <div className="font-semibold text-forest-900">{product.resolution}</div>
                </div>
                <div>
                  <div className="text-neutralMuted text-[11px]">Tốc độ khung hình:</div>
                  <div className="font-semibold text-forest-900">{product.fps} FPS Mượt mà</div>
                </div>
                <div>
                  <div className="text-neutralMuted text-[11px]">Tỷ lệ khung hình:</div>
                  <div className="font-semibold text-forest-900">{product.aspectRatio}</div>
                </div>
                <div>
                  <div className="text-neutralMuted text-[11px]">Hiệu năng OBS:</div>
                  <div className="font-semibold text-emerald-700">Tối ưu &lt; 1% CPU</div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-5 rounded-2xl bg-white border border-ivory-border shadow-forest-sm space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    {product.originalPrice && (
                      <span className="text-xs text-neutralMuted line-through mr-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span className={`text-2xl sm:text-3xl font-display font-extrabold ${product.isFree ? 'text-emerald-700' : 'text-forest-900'}`}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutralMuted">
                    Giấy phép bản quyền vĩnh viễn
                  </span>
                </div>

                <button
                  onClick={handleAdd}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-forest-md ${
                    isAdded 
                      ? 'bg-emerald-600 text-ivory' 
                      : product.isFree 
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-ivory' 
                        : 'bg-forest-800 hover:bg-forest-700 text-ivory'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{product.isFree ? 'Đã thêm vào mục tải về!' : 'Đã thêm vào giỏ hàng!'}</span>
                    </>
                  ) : product.isFree ? (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Tải ngay miễn phí (Free Download)</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Thêm vào giỏ hàng</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-neutralMuted pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Bảo hành cài đặt 1-1
                  </span>
                  <span>•</span>
                  <span>Cập nhật miễn phí trọn đời</span>
                </div>
              </div>

            </div>

          </div>

          {/* Section 2: Included Files & Installation Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-ivory-border">
            
            {/* Left: Included Files List */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-base text-forest-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-forest-600" />
                <span>Danh sách file đính kèm ({product.includedFiles.length} tệp)</span>
              </h3>
              <div className="bg-forest-50/50 rounded-2xl border border-ivory-border divide-y divide-ivory-border overflow-hidden text-xs">
                {product.includedFiles.map((file, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-white transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center text-forest-800 font-mono text-[10px] font-bold">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-forest-900">{file.name}</div>
                        <div className="text-[10px] text-neutralMuted">{file.type}</div>
                      </div>
                    </div>
                    <span className="font-mono text-neutralMuted text-[11px]">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Compatible Software & 4-Step Installation */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-forest-900 flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-forest-600" />
                  <span>Phần mềm tương thích</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.softwareCompatibility.map((soft, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-forest-100/80 text-forest-800 text-xs font-medium">
                      {soft}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-forest-900 flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-forest-600" />
                  <span>Hướng dẫn thiết lập 1-Click</span>
                </h3>
                <div className="space-y-2">
                  {product.installSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-forest-800/80 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-forest-800 text-ivory text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: Related Overlays */}
          {related.length > 0 && (
            <div className="pt-6 border-t border-ivory-border space-y-4">
              <h3 className="font-display font-bold text-base text-forest-900">
                Sản phẩm liên quan bạn có thể thích
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      sounds.playTap();
                      onSelectRelated(item);
                    }}
                    className="group p-3 rounded-2xl border border-ivory-border hover:border-forest-400 bg-forest-50/40 hover:bg-white transition-all cursor-pointer flex items-center gap-3"
                  >
                    <div className="w-16 h-12 rounded-lg bg-forest-950 overflow-hidden flex-shrink-0">
                      <img src={item.previews.obsScene} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-forest-900 truncate group-hover:text-forest-700">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-bold text-forest-800 mt-0.5">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
