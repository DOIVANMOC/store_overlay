import React from 'react';
import { 
  Mail, 
  MessageCircle, 
  Heart,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface FooterProps {
  onOpenGuides: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuides, onSelectCategory }) => {
  return (
    <footer className="bg-forest-800 text-ivory border-t border-forest-700/80 pt-16 pb-12 relative overflow-hidden">
      
      {/* Delicate background leaf pattern accent */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12">
        <svg className="w-96 h-96 text-ivory" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-700">
          
          {/* Col 1 & 2: Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-900 border border-forest-600 flex items-center justify-center text-emerald-400">
                <svg className="w-5 h-5 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <span className="font-display font-extrabold text-lg tracking-wider text-ivory">
                FOREST <span className="text-forest-400 font-semibold">OVERLAY</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-forest-200/80 leading-relaxed max-w-sm">
              Studio chuyên biệt cung cấp các bộ Streamer Overlay bản quyền cao cấp dành cho OBS Studio, TikTok Live Studio và YouTube Gaming. Tối ưu 60FPS mượt mà, cảm hứng từ vẻ đẹp tĩnh lặng của thiên nhiên.
            </p>

            <div className="flex items-center gap-3 pt-2 text-forest-300">
              <span className="text-xs font-mono">Hỗ trợ các nền tảng:</span>
              <div className="flex gap-2 text-xs font-semibold text-ivory">
                <span className="px-2 py-0.5 rounded bg-forest-900/60 border border-forest-700">OBS</span>
                <span className="px-2 py-0.5 rounded bg-forest-900/60 border border-forest-700">TikTok</span>
                <span className="px-2 py-0.5 rounded bg-forest-900/60 border border-forest-700">Twitch</span>
                <span className="px-2 py-0.5 rounded bg-forest-900/60 border border-forest-700">YouTube</span>
              </div>
            </div>
          </div>

          {/* Col 3: Danh Mục Sản Phẩm */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-forest-300">
              Danh Mục Overlay
            </h4>
            <ul className="space-y-2 text-xs text-forest-100/80">
              <li>
                <button 
                  onClick={() => { sounds.playTap(); onSelectCategory('nature'); }}
                  className="hover:text-emerald-300 transition-colors"
                >
                  Nature & Forest Overlays
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playTap(); onSelectCategory('minimal'); }}
                  className="hover:text-emerald-300 transition-colors"
                >
                  Clean & Minimalist
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playTap(); onSelectCategory('gaming'); }}
                  className="hover:text-emerald-300 transition-colors"
                >
                  Gaming & Esports HUD
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playTap(); onSelectCategory('webcam'); }}
                  className="hover:text-emerald-300 transition-colors"
                >
                  Webcam Frames 16:9 & 4:3
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playTap(); onSelectCategory('free'); }}
                  className="text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Bộ miễn phí (Free Community)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hỗ Trợ & Hướng Dẫn */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-forest-300">
              Hỗ Trợ & Hướng Dẫn
            </h4>
            <ul className="space-y-2 text-xs text-forest-100/80">
              <li>
                <button 
                  onClick={() => { sounds.playTap(); onOpenGuides(); }}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Cách import Scene vào OBS Studio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playTap(); onOpenGuides(); }}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Cài đặt widget StreamElements
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { sounds.playTap(); onOpenGuides(); }}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  Thiết lập TikTok Live Studio 9:16
                </button>
              </li>
              <li>
                <a href="#featured-section" className="hover:text-emerald-300 transition-colors">
                  Top 3 sản phẩm nổi bật
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Liên Hệ & Cam Kết */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-forest-300">
              Liên Hệ & Cam Kết
            </h4>
            <div className="space-y-2 text-xs text-forest-100/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-forest-400" />
                <span>support@forestoverlay.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-forest-400" />
                <span>Discord: Forest Overlay Studio</span>
              </div>
              <div className="pt-2 text-[11px] text-forest-300/80">
                ✓ Bảo hành kỹ thuật 1-1 qua Ultraviewer / AnyDesk nếu gặp sự cố cài đặt OBS.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-300/80 gap-4">
          <div>
            © 2026 FOREST OVERLAY Studio. Mọi quyền được bảo lưu.
          </div>
          <div className="flex items-center gap-6">
            <span>Chính sách bản quyền</span>
            <span>Điều khoản dịch vụ</span>
            <span className="flex items-center gap-1 text-ivory">
              Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> for Streamers
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
