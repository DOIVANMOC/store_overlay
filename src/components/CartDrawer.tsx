import React, { useState } from 'react';
import { Product } from '../types/product';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Download, 
  Tag, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [isSuccessCheckout, setIsSuccessCheckout] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = Math.round(rawSubtotal * appliedDiscount);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const formatPrice = (price: number) => {
    if (price === 0) return 'MIỄN PHÍ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'FOREST2026') {
      sounds.playChime();
      setAppliedDiscount(0.15); // 15% off
      setCouponError('');
    } else {
      sounds.playTap();
      setCouponError('Mã không hợp lệ. Hãy thử mã FOREST2026.');
    }
  };

  const handleCheckout = () => {
    sounds.playChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#387A4B', '#78966A', '#163D2B', '#F5F6F0'],
    });
    setIsSuccessCheckout(true);
  };

  const handleFinish = () => {
    onClearCart();
    setIsSuccessCheckout(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-forest-950/70 backdrop-blur-sm animate-fade-in flex justify-end">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-ivory-border">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-forest-900 text-ivory border-b border-forest-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-forest-300" />
            <h3 className="font-display font-bold text-base">
              Giỏ hàng của bạn ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-neutralMuted hover:text-ivory transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccessCheckout ? (
          /* Checkout Celebration State */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-display font-bold text-2xl text-forest-900">
              Đặt Hàng Thành Công!
            </h4>
            <p className="text-xs text-forest-800/80 leading-relaxed max-w-xs">
              Cảm ơn bạn đã lựa chọn FOREST OVERLAY! Đường link tải tệp tin và mã bản quyền đã sẵn sàng.
            </p>

            <div className="w-full bg-forest-50 p-4 rounded-2xl border border-ivory-border text-left space-y-2.5 max-h-56 overflow-y-auto">
              <div className="text-[11px] font-mono text-neutralMuted">Gói đã đặt ({cart.length}):</div>
              {cart.map(c => (
                <div key={c.id} className="p-2 bg-white rounded-xl border border-ivory-border flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-forest-900 truncate">• {c.title}</div>
                    <div className="text-[10px] text-neutralMuted font-mono">
                      {c.projectPackName || `${c.includedFiles?.length || 4} tệp cài đặt`}
                    </div>
                  </div>
                  {c.projectDownloadUrl ? (
                    <a
                      href={c.projectDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-700 text-ivory text-[10px] font-bold hover:bg-emerald-600 transition-colors shrink-0"
                    >
                      Mở Link Tải
                    </a>
                  ) : (
                    <span className="text-emerald-700 font-mono text-[10px] font-bold shrink-0">
                      Đã cấp quyền
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                sounds.playChime();
                const downloadManifest = {
                  orderId: `ORDER-${Date.now()}`,
                  purchasedPackages: cart.map(item => ({
                    id: item.id,
                    title: item.title,
                    resolution: item.resolution,
                    cloudLink: item.projectDownloadUrl || "Trực tiếp trong tài nguyên website",
                    files: item.includedFiles.map(f => f.name)
                  })),
                  licenseHolder: "Streamer VIP",
                  createdAt: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(downloadManifest, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Forest_Overlay_Package_${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                handleFinish();
              }}
              className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Tải Toàn Bộ Tệp Cài Đặt (.JSON / .ZIP)</span>
            </button>
          </div>
        ) : cart.length > 0 ? (
          /* Cart List */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-forest-50/50 rounded-2xl border border-ivory-border flex gap-3 items-center group"
              >
                <div className="w-16 h-12 rounded-lg bg-forest-950 overflow-hidden flex-shrink-0">
                  <img src={item.previews.obsScene} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-display font-bold text-xs text-forest-900 truncate">
                    {item.title}
                  </h5>
                  <div className="text-[10px] text-neutralMuted font-mono">
                    {item.resolution.split(' ')[0]} • 60FPS
                  </div>
                  <div className={`text-xs font-bold mt-1 ${item.isFree ? 'text-emerald-700' : 'text-forest-900'}`}>
                    {formatPrice(item.price)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onRemoveFromCart(item.id);
                  }}
                  className="p-2 text-neutralMuted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  title="Xóa khỏi giỏ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Discount Coupon Box */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Mã giảm giá (ví dụ: FOREST2026)"
                  className="flex-1 px-3 py-2 rounded-xl bg-forest-50 border border-ivory-border text-xs text-forest-900 font-mono uppercase focus:outline-none focus:border-forest-600"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 rounded-xl bg-forest-800 text-ivory text-xs font-semibold hover:bg-forest-700 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
              {appliedDiscount > 0 && (
                <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã áp dụng giảm 15% (Mã: FOREST2026)</span>
                </div>
              )}
              {couponError && (
                <div className="mt-2 text-xs text-red-500 font-mono">
                  {couponError}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center text-neutralMuted mb-2">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="font-display font-bold text-lg text-forest-900">
              Giỏ hàng đang trống
            </h4>
            <p className="text-xs text-forest-800/70 max-w-xs">
              Bạn chưa thêm bộ overlay nào vào giỏ hàng. Hãy khám phá bộ sưu tập và chọn giao diện yêu thích nhé!
            </p>
          </div>
        )}

        {/* Drawer Footer with Calculations */}
        {cart.length > 0 && !isSuccessCheckout && (
          <div className="p-6 bg-forest-50/70 border-t border-ivory-border space-y-3">
            <div className="space-y-1.5 text-xs text-forest-800">
              <div className="flex justify-between">
                <span className="text-neutralMuted">Tạm tính:</span>
                <span className="font-semibold">{formatPrice(rawSubtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Giảm giá (15%):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-ivory-border text-forest-900">
                <span>Tổng thanh toán:</span>
                <span className="font-display text-base text-forest-900">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold flex items-center justify-center gap-2 shadow-forest-md transition-all active:scale-[0.99]"
            >
              <span>{finalTotal === 0 ? 'Tải Xuống Ngay (Miễn Phí)' : 'Tiến Hành Nhận File Trọn Bộ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutralMuted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo mật tải xuống • Hỗ trợ kỹ thuật 24/7</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
