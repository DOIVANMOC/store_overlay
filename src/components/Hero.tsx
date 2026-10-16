import React from 'react';
import { 
  ArrowRight, 
  Tv, 
  Leaf, 
  CheckCircle2 
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeroProps {
  onExploreClick: () => void;
  onFeaturedClick: () => void;
  onOpenLiveSimulator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onFeaturedClick,
  onOpenLiveSimulator,
}) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-forest-900 text-ivory overflow-hidden border-b border-forest-800">
      {/* Background Layer: Primeval Forest with God Rays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-forest.jpg" 
          alt="Ancient Forest Canopy" 
          className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105"
        />
        {/* Deep Green & Ivory Gradient Vignette to ensure maximum text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/90 via-forest-900/80 to-forest-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(56,122,75,0.22),transparent_70%)]"></div>
      </div>

      {/* Subtle Floating Ambient Particles (CSS based, gentle and quiet) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-1.5 h-1.5 rounded-full bg-forest-300/30 blur-[0.5px] animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-emerald-400/25 blur-[1px] animate-pulse-subtle"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-forest-200/20 blur-[0.5px] animate-float-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Copy & Actions (7 Cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-ivory tracking-tight leading-[1.12]">
              Bring Your Stream <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-forest-300 to-forest-200">
                to Life.
              </span>
            </h1>

            {/* Description in Vietnamese */}
            <p className="text-base sm:text-lg text-neutralMuted max-w-2xl font-normal leading-relaxed">
              Các bộ streamer overlay thủ công chuẩn broadcast mang phong cách thiên nhiên hiện đại. 
              Thiết kế dành riêng cho OBS Studio, TikTok Live Studio và YouTube Gaming — tối ưu 60FPS mượt mà, 
              cam kết không giật lag và hỗ trợ cài đặt tự động 1-click.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  sounds.playClick();
                  onExploreClick();
                }}
                className="px-6 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-ivory font-semibold text-sm shadow-forest-md hover:shadow-forest-glow transition-all flex items-center gap-2.5 group"
              >
                <span>Khám phá bộ sưu tập</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onFeaturedClick();
                }}
                className="px-6 py-3.5 rounded-xl bg-forest-800/90 hover:bg-forest-800 text-ivory/95 font-semibold text-sm border border-forest-700/80 hover:border-forest-500 transition-all flex items-center gap-2"
              >
                <span>Xem 3 sản phẩm nổi bật</span>
              </button>
            </div>

          </div>

          {/* Right Column: Live Streamer Mockup Display (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-forest-700/80 shadow-2xl bg-forest-950 group">
              
              {/* Mockup Header Bar */}
              <div className="bg-forest-900/90 px-3 py-2 border-b border-forest-800 flex items-center justify-between text-[11px] text-neutralMuted">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-mono text-ivory font-medium">LIVE PREVIEW • OBS STUDIO</span>
                </div>
                <span className="text-[10px] font-mono text-forest-300">1080p 60FPS</span>
              </div>

              {/* Realistic Overlay Live Snapshot */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src="/images/deep-woods.jpg" 
                  alt="Deep Woods Live Overlay Broadcast" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Interactive Simulator Trigger Pill */}
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button
                    onClick={() => {
                      sounds.playWhoosh();
                      onOpenLiveSimulator();
                    }}
                    className="px-4 py-2 rounded-xl bg-forest-600 text-ivory text-xs font-semibold shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                  >
                    <Tv className="w-4 h-4 text-emerald-300" />
                    <span>Mở OBS Stream Simulator</span>
                  </button>
                </div>

                {/* Floating Follower Notification Badge inside mockup */}
                <div className="absolute top-3 left-3 bg-forest-900/85 backdrop-blur-sm border border-forest-600/60 px-2.5 py-1 rounded-lg text-[10px] text-ivory flex items-center gap-1.5 shadow-md">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  <span>New Sub: <strong>Sylvan_Hunter</strong></span>
                </div>

                {/* Streamer Frame Tag */}
                <div className="absolute bottom-3 left-3 bg-forest-900/85 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono text-forest-300 border border-forest-800">
                  Suite: Deep Woods Primal
                </div>
              </div>

              {/* Bottom Specs Ticker */}
              <div className="p-3 bg-forest-900/80 border-t border-forest-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-forest-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kèm WebM Stinger Transition & SFX</span>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenLiveSimulator();
                  }}
                  className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1"
                >
                  <span>Thử ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
