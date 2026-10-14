import React from 'react';
import { Leaf, Cpu, Sparkles, Eye, ShieldCheck, Heart } from 'lucide-react';

export const BrandPhilosophy: React.FC = () => {
  const pillars = [
    {
      icon: Leaf,
      title: 'Bản sắc rừng già nguyên bản',
      desc: 'Chúng tôi tin rằng không gian livestream không nhất thiết phải là những vệt màu neon chói mắt. Tông màu xanh rừng, rêu đá và ánh ban mai mang đến sự thư thái lâu dài cho cả streamer lẫn người xem trong suốt buổi stream nhiều giờ liên tục.',
    },
    {
      icon: Cpu,
      title: 'Tối ưu phần cứng chuẩn 60FPS',
      desc: 'Mỗi tệp tin WebM và video lặp đều được render với codec hiện đại nhất, giữ mức sử dụng CPU/GPU dưới 0.8%. Bạn hoàn toàn yên tâm cống hiến những pha highlight mà không lo sụt khung hình.',
    },
    {
      icon: Eye,
      title: 'Tôn vinh biểu cảm người phát sóng',
      desc: 'Khung overlay được thiết kế theo tỷ lệ vàng: đủ nổi bật để định hình thương hiệu cá nhân, nhưng tuyệt đối không lấn át giao diện game hay che khuất những khoảnh khắc cảm xúc của streamer.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-forest-900 text-ivory relative overflow-hidden border-b border-forest-800">
      
      {/* Subtle Forest Background Ambient Texture */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <img 
          src="/images/hero-forest.jpg" 
          alt="Forest Texture" 
          className="w-full h-full object-cover mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-forest-900/90"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              <Leaf className="w-4 h-4" />
              Triết lý thương hiệu FOREST OVERLAY
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-ivory tracking-tight leading-tight">
              Nghệ Thuật Thủ Công Gặp Gỡ Công Nghệ Broadcast
            </h2>
          </div>

          <div className="lg:col-span-6">
            <p className="text-base sm:text-lg text-forest-200/80 leading-relaxed font-light">
              Tại FOREST OVERLAY, chúng tôi từ chối những bố cục đại trà, lòe loẹt do AI tạo tự động. 
              Mỗi bộ giao diện là một tác phẩm được sáng tạo tỉ mỉ bởi các Senior Designer yêu mến thiên nhiên, 
              nhằm mang lại trải nghiệm livestream sang trọng, chỉn chu và bền vững theo thời gian.
            </p>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-forest-950/60 rounded-3xl p-8 border border-forest-800/80 hover:border-forest-600 transition-colors space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-forest-800/90 border border-forest-600/60 flex items-center justify-center text-emerald-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-ivory">
                  {item.title}
                </h3>
                <p className="text-sm text-neutralMuted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
