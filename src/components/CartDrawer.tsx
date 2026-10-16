import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { User } from '../types/user';
import { Order } from '../types/order';
import { orderService } from '../utils/orders';
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
  CheckCircle2,
  QrCode,
  Copy,
  ChevronLeft,
  ExternalLink,
  User as UserIcon,
  Mail,
  Phone,
  FolderArchive,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  currentUser?: User | null;
  onOpenProfile?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
  currentUser,
  onOpenProfile,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');

  // Checkout form state
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'momo' | 'free'>('vietqr');
  const [tempOrderId, setTempOrderId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Completed order state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.displayName);
      if (!customerEmail) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    // Generate temporary order code when moving to checkout
    if (step === 'checkout' && !tempOrderId) {
      setTempOrderId(Math.floor(100000 + Math.random() * 900000).toString());
    }
  }, [step, tempOrderId]);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = Math.round(rawSubtotal * appliedDiscount);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  // If total is 0, auto-switch payment method to free
  const isActuallyFree = finalTotal === 0;

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
      setCouponError('Mã không hợp lệ. Hãy thử mã FOREST2026 giảm 15%.');
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProceedToCheckout = () => {
    sounds.playTap();
    if (isActuallyFree) {
      setPaymentMethod('free');
    }
    setStep('checkout');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playChime();

    // Create authentic Order in database
    const newOrder = orderService.createOrder({
      userId: currentUser?.id,
      customerName: customerName || 'Streamer Quý Khách',
      customerEmail: customerEmail || 'streamer@forestoverlay.io',
      customerPhone: customerPhone,
      items: cart.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        image: item.previews.obsScene,
        resolution: item.resolution,
        projectDownloadUrl: item.projectDownloadUrl,
        projectPackName: item.projectPackName,
        projectPackSize: item.projectPackSize,
        includedFiles: item.includedFiles
      })),
      totalAmount: finalTotal,
      discountAmount: discountAmount,
      couponCode: appliedDiscount > 0 ? 'FOREST2026' : undefined,
      paymentMethod: isActuallyFree ? 'free' : paymentMethod
    });

    setCompletedOrder(newOrder);
    setStep('success');

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#387A4B', '#78966A', '#163D2B', '#F5F6F0'],
      });
    } catch {}
  };

  const handleFinishAndClear = () => {
    onClearCart();
    setStep('cart');
    setCompletedOrder(null);
    setTempOrderId('');
    onClose();
  };

  const handleDownloadFile = (fileName: string, url?: string, fileData?: string) => {
    sounds.playChime();
    if (fileData) {
      const a = document.createElement('a');
      a.href = fileData;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Default download package manifest
    const manifest = {
      orderId: completedOrder?.id,
      fileName: fileName,
      licenseKey: completedOrder?.licenseKey,
      customer: completedOrder?.customerName,
      licensedTo: completedOrder?.customerEmail,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName.endsWith('.json') ? fileName : `${fileName}_Setup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleDownloadAllOrderFiles = () => {
    if (!completedOrder) return;
    sounds.playChime();
    const manifest = {
      orderNumber: completedOrder.id,
      licenseKey: completedOrder.licenseKey,
      licensedCustomer: completedOrder.customerName,
      customerEmail: completedOrder.customerEmail,
      purchaseDate: completedOrder.createdAt,
      totalAmount: completedOrder.totalAmount,
      streamPackages: completedOrder.items.map(item => ({
        title: item.title,
        resolution: item.resolution,
        packName: item.projectPackName,
        cloudDownloadLink: item.projectDownloadUrl || 'Đã tích hợp trong tệp cài đặt',
        files: item.includedFiles?.map(f => f.name) || ['OBS_Scene.json', 'Webcam_Border.webm']
      }))
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Forest_Overlay_${completedOrder.id}_Master_Package.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const qrImageUrl = orderService.getVietQrUrl(finalTotal, tempOrderId || '849201');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-forest-950/70 backdrop-blur-sm animate-fade-in flex justify-end">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 border-l border-ivory-border">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-forest-900 text-ivory border-b border-forest-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => { sounds.playTap(); setStep('cart'); }}
                className="p-1 rounded-lg hover:bg-forest-800 text-neutralMuted hover:text-ivory mr-1"
                title="Quay lại giỏ hàng"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-forest-300" />
            <h3 className="font-display font-bold text-base">
              {step === 'cart' && `Giỏ hàng của bạn (${cart.length})`}
              {step === 'checkout' && 'Xác nhận thanh toán & nhận file'}
              {step === 'success' && 'Đặt hàng thành công!'}
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              if (step === 'success') {
                handleFinishAndClear();
              } else {
                onClose();
              }
            }}
            className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-neutralMuted hover:text-ivory transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART LIST VIEW */}
        {step === 'cart' && (
          <>
            {cart.length > 0 ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-forest-50/50 rounded-2xl border border-ivory-border flex gap-3 items-center group"
                  >
                    <div className="w-16 h-12 rounded-lg bg-forest-950 overflow-hidden flex-shrink-0 border border-ivory-border">
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
                      className="flex-1 px-3 py-2 rounded-xl bg-forest-50 border border-ivory-border text-xs text-forest-950 font-mono uppercase focus:outline-none focus:border-forest-600"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 py-2 rounded-xl bg-forest-800 text-ivory text-xs font-semibold hover:bg-forest-700 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1 font-medium">
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

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-forest-50/70 border-t border-ivory-border space-y-3 shrink-0">
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
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold flex items-center justify-center gap-2 shadow-forest-md transition-all active:scale-[0.99]"
                >
                  <span>{isActuallyFree ? 'Tải Xuống Miễn Phí Ngay' : 'Tiến Hành Thanh Toán & Nhận File'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutralMuted">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bảo mật tải xuống • Hỗ trợ kỹ thuật OBS 24/7</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT VIEW */}
        {step === 'checkout' && (
          <form onSubmit={handleConfirmOrder} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              
              {/* Customer Contact Box */}
              <div className="p-4 rounded-2xl bg-forest-50/60 border border-ivory-border space-y-3">
                <div className="text-xs font-bold text-forest-900 uppercase tracking-wide flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-forest-600" />
                  <span>Thông tin người nhận bản quyền</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forest-900 mb-1">
                    Họ và tên Streamer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Hoàng"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-ivory-border text-xs text-forest-950 focus:outline-none focus:border-forest-600 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forest-900 mb-1">
                    Email nhận tệp dự án & giấy phép <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="VD: streamer@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-ivory-border text-xs text-forest-950 focus:outline-none focus:border-forest-600 font-sans"
                  />
                  <p className="text-[10px] text-neutralMuted mt-1">
                    Hệ thống sẽ lưu trữ liên kết tải về vĩnh viễn gắn với email này.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-forest-900 mb-1">
                    Số điện thoại / Zalo hỗ trợ (Tùy chọn)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="VD: 0988xxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-ivory-border text-xs text-forest-950 focus:outline-none focus:border-forest-600 font-sans"
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              {!isActuallyFree ? (
                <div className="p-4 rounded-2xl bg-white border border-ivory-border shadow-xs space-y-3">
                  <div className="text-xs font-bold text-forest-900 uppercase tracking-wide flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-forest-600" />
                      <span>Phương thức thanh toán</span>
                    </span>
                    <span className="text-xs font-extrabold text-forest-900 font-mono">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  {/* Payment selector tabs */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('vietqr')}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        paymentMethod === 'vietqr'
                          ? 'border-emerald-600 bg-emerald-50/50 text-forest-950 shadow-xs'
                          : 'border-ivory-border bg-ivory-soft text-forest-800'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div className="text-xs font-bold leading-tight">
                        Chuyển khoản VietQR
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('momo')}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        paymentMethod === 'momo'
                          ? 'border-pink-600 bg-pink-50/50 text-forest-950 shadow-xs'
                          : 'border-ivory-border bg-ivory-soft text-forest-800'
                      }`}
                    >
                      <span className="w-4 h-4 rounded bg-pink-600 text-ivory text-[9px] font-bold flex items-center justify-center shrink-0">M</span>
                      <div className="text-xs font-bold leading-tight">
                        Ví điện tử MoMo
                      </div>
                    </button>
                  </div>

                  {/* VietQR Bank Details */}
                  {paymentMethod === 'vietqr' && (
                    <div className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-200/80 space-y-3 animate-fade-in text-xs">
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        {/* Live VietQR Image */}
                        <div className="w-32 h-32 rounded-xl bg-white p-1.5 border border-ivory-border shrink-0 shadow-xs flex items-center justify-center">
                          <img
                            src={qrImageUrl}
                            alt="VietQR MBBank"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Bank info box */}
                        <div className="space-y-1.5 text-[11px] flex-1 w-full">
                          <div className="flex justify-between items-center pb-1 border-b border-ivory-border">
                            <span className="text-neutralMuted">Ngân hàng:</span>
                            <span className="font-bold text-forest-900">MB Bank (Quân Đội)</span>
                          </div>
                          
                          <div className="flex justify-between items-center pb-1 border-b border-ivory-border">
                            <span className="text-neutralMuted">Số tài khoản:</span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-bold text-forest-900">0933933933</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard('0933933933', 'stk')}
                                className="text-forest-700 hover:text-forest-900 p-0.5"
                                title="Sao chép"
                              >
                                {copiedField === 'stk' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pb-1 border-b border-ivory-border">
                            <span className="text-neutralMuted">Chủ tài khoản:</span>
                            <span className="font-bold text-forest-900 uppercase">HONG GIA HUY</span>
                          </div>

                          <div className="flex justify-between items-center pb-1 border-b border-ivory-border">
                            <span className="text-neutralMuted">Nội dung CK:</span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-bold text-emerald-800">FOREST {tempOrderId}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(`FOREST ${tempOrderId}`, 'nd')}
                                className="text-forest-700 hover:text-forest-900 p-0.5"
                                title="Sao chép"
                              >
                                {copiedField === 'nd' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-neutralMuted text-center font-mono">
                        * Quét mã bằng app ngân hàng bất kỳ để tự động điền STK và nội dung.
                      </div>
                    </div>
                  )}

                  {/* MoMo Details */}
                  {paymentMethod === 'momo' && (
                    <div className="p-3.5 rounded-xl bg-pink-50 border border-pink-200 space-y-2 animate-fade-in text-xs">
                      <div className="font-bold text-pink-900">Thông tin chuyển tiền Ví MoMo:</div>
                      <div className="text-xs space-y-1">
                        <div>Số MoMo: <span className="font-mono font-bold">0933933933</span> (Huy Hoàng)</div>
                        <div>Số tiền: <span className="font-bold">{formatPrice(finalTotal)}</span></div>
                        <div>Nội dung: <span className="font-mono font-bold text-pink-800">FOREST {tempOrderId}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Free order notice */
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đơn hàng miễn phí (0 VNĐ)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80">
                    Bạn không cần thực hiện bất kỳ giao dịch thanh toán nào. Nhấn nút bên dưới để nhận ngay file và giấy phép.
                  </p>
                </div>
              )}

            </div>

            {/* Submit Order Button */}
            <div className="pt-4 border-t border-ivory-border space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-bold transition-all shadow-forest-md flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>
                  {isActuallyFree ? 'Hoàn Tất & Nhận File Miễn Phí Ngay' : 'Tôi Đã Hoàn Tất Chuyển Khoản & Nhận File'}
                </span>
              </button>
              <div className="text-[10px] text-neutralMuted text-center">
                Mã bản quyền và link tải OBS sẽ kích hoạt ngay tức thì.
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS & DOWNLOAD SCREEN */}
        {step === 'success' && completedOrder && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-between space-y-5 animate-fade-in">
            <div className="w-full space-y-4">
              
              {/* Badge & Congratulation */}
              <div className="text-center space-y-2 pt-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="font-display font-extrabold text-2xl text-forest-900">
                  Đặt Hàng Thành Công!
                </h4>
                <p className="text-xs text-forest-800/80 max-w-sm mx-auto leading-relaxed">
                  Cảm ơn <span className="font-bold text-forest-950">{completedOrder.customerName}</span>! Bản quyền đã được kích hoạt vĩnh viễn cho tài khoản của bạn.
                </p>
              </div>

              {/* Order Invoice Card */}
              <div className="p-4 rounded-2xl bg-forest-50/80 border border-ivory-border space-y-2 text-xs">
                <div className="flex justify-between items-center pb-1.5 border-b border-ivory-border">
                  <span className="text-neutralMuted">Mã đơn hàng:</span>
                  <span className="font-mono font-bold text-forest-900">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-ivory-border">
                  <span className="text-neutralMuted">Mã bản quyền (License Key):</span>
                  <span className="font-mono font-bold text-emerald-700">{completedOrder.licenseKey}</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-ivory-border">
                  <span className="text-neutralMuted">Email nhận tệp:</span>
                  <span className="font-medium text-forest-900">{completedOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-neutralMuted">Tổng số tiền:</span>
                  <span className="font-bold text-forest-900">
                    {completedOrder.totalAmount === 0 ? 'MIỄN PHÍ' : `${completedOrder.totalAmount.toLocaleString('vi-VN')} ₫`}
                  </span>
                </div>
              </div>

              {/* List of Ordered Packages with Direct Download Buttons */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-forest-900 flex items-center justify-between">
                  <span>Gói overlay đã mở khóa ({completedOrder.items.length}):</span>
                  <span className="text-[10px] font-mono text-emerald-700">Tải không giới hạn</span>
                </div>

                <div className="space-y-2">
                  {completedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-ivory-border flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-9 rounded-lg object-cover bg-forest-950 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-forest-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-neutralMuted font-mono">
                            {item.projectPackName || `${item.resolution.split(' ')[0]} • OBS Ready`}
                          </div>
                        </div>
                      </div>

                      {/* Download actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.projectDownloadUrl && (
                          <a
                            href={item.projectDownloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-800 text-[10px] font-bold flex items-center gap-1 transition-colors"
                            title="Tải từ Google Drive"
                          >
                            <span>Drive</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDownloadFile(item.projectPackName || `${item.title}_OBS_Pack.zip`, item.projectDownloadUrl)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-ivory text-[10px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <Download className="w-3 h-3" />
                          <span>Tải về</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="w-full space-y-2 pt-3 border-t border-ivory-border">
              <button
                type="button"
                onClick={handleDownloadAllOrderFiles}
                className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-bold transition-all shadow-forest-md flex items-center justify-center gap-2"
              >
                <FolderArchive className="w-4 h-4 text-emerald-400" />
                <span>Tải Hồ Sơ Cài Đặt Trọn Gói (.JSON)</span>
              </button>

              <button
                type="button"
                onClick={handleFinishAndClear}
                className="w-full py-2.5 rounded-xl bg-ivory-soft hover:bg-ivory-dark border border-ivory-border text-xs font-semibold text-forest-900 transition-colors"
              >
                Hoàn tất & Quay về trang chủ
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
