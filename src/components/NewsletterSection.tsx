import React, { useState } from 'react';
import { Mail, Check, Sparkles, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'already' | 'error'>('idle');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      setStatus('error');
      return;
    }

    try {
      // Retrieve existing subscribers from localStorage
      const existingRaw = localStorage.getItem('forest_subscribers');
      const subscribers: { email: string; timestamp: number }[] = existingRaw ? JSON.parse(existingRaw) : [];

      const exists = subscribers.some(s => s.email.toLowerCase() === trimmed.toLowerCase());
      if (exists) {
        setStatus('already');
        sounds.playTap();
        return;
      }

      // Save new subscriber
      subscribers.push({ email: trimmed, timestamp: Date.now() });
      localStorage.setItem('forest_subscribers', JSON.stringify(subscribers));
      
      sounds.playChime();
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  const copyCoupon = () => {
    sounds.playClick();
    navigator.clipboard.writeText('FOREST2026');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="py-20 md:py-24 bg-forest-950 text-ivory relative border-b border-forest-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="bg-gradient-to-b from-forest-900 to-forest-900/60 rounded-3xl p-8 sm:p-12 border border-forest-700/60 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-forest-800 border border-forest-600/70 flex items-center justify-center text-emerald-300 mb-6 shadow-forest-md">
            <Mail className="w-7 h-7" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-ivory tracking-tight mb-3">
            Gia Nhập Cộng Đồng Streamer Cao Cấp
          </h2>

          <p className="text-sm sm:text-base text-forest-200/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Đăng ký để nhận thông báo khi có bộ sưu tập overlay mới, cập nhật phiên bản miễn phí và nhận ngay mã giảm giá 15% cho đơn hàng đầu tiên.
          </p>

          {status !== 'success' && status !== 'already' ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="Nhập địa chỉ email của bạn..."
                  className="flex-1 px-4 py-3 rounded-xl bg-forest-950 border border-forest-700 text-sm text-ivory placeholder:text-neutralMuted focus:outline-none focus:border-forest-400 font-sans"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-ivory text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Đăng ký</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {status === 'error' && (
                <div className="text-xs text-red-400 font-mono">
                  Vui lòng nhập định dạng email hợp lệ (ví dụ: streamer@gmail.com).
                </div>
              )}

              <div className="text-[11px] text-neutralMuted flex items-center justify-center gap-2 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Không spam • Bạn có thể hủy nhận tin bất kỳ lúc nào.</span>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto bg-forest-950/90 rounded-2xl p-6 border border-emerald-500/50 space-y-4 animate-slide-up">
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold">
                <Check className="w-5 h-5" />
                <span>{status === 'success' ? 'Đăng ký thành công! Chào mừng bạn.' : 'Email này đã đăng ký trước đó!'}</span>
              </div>

              <div className="p-3 bg-forest-900 rounded-xl border border-forest-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-neutralMuted uppercase font-mono">Mã giảm giá 15% của bạn:</div>
                  <div className="text-base font-mono font-bold text-emerald-300">FOREST2026</div>
                </div>
                <button
                  onClick={copyCoupon}
                  className="px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-xs font-semibold text-ivory flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
