import React from 'react';
import { MousePointerClick, DownloadCloud, Tv, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

export const StreamerWorkflow: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Chọn & Thử Nghiệm Trực Quan',
      desc: 'Khám phá bộ sưu tập và sử dụng OBS Stream Simulator để thử nghiệm khung camera với chính tên kênh và hiệu ứng thông báo của bạn.',
      icon: MousePointerClick,
      time: '1 phút',
    },
    {
      step: '02',
      title: 'Tải Xuống Gói Trọn Bộ',
      desc: 'Nhận ngay toàn bộ tệp tin nguồn: Cảnh OBS (.json), khung WebM 60FPS trong suốt, video nền lặp mp4, và liên kết 1-Click StreamElements.',
      icon: DownloadCloud,
      time: 'Ngay lập tức',
    },
    {
      step: '03',
      title: 'Import & Lên Sóng Tự Tin',
      desc: 'Chỉ cần chọn "Import Scene Collection" trong OBS Studio, mọi cảnh, nguồn hình ảnh và widget thông báo sẽ tự động khớp hoàn hảo 100%.',
      icon: Tv,
      time: '30 giây',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-ivory text-forest-900 border-b border-ivory-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-forest-600 uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-forest-600"></span>
            Đơn giản & Nhanh chóng
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-forest-900 tracking-tight">
            Quy Trình Sử Dụng 3 Bước
          </h2>
          <p className="mt-3 text-base text-forest-800/70">
            Từ lúc chọn giao diện đến khi lên sóng livestream chỉ mất chưa đầy 3 phút.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="relative bg-white rounded-3xl p-8 border border-ivory-border shadow-forest-sm hover:shadow-forest-md hover:border-forest-400 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Number & Time Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-extrabold text-forest-200 group-hover:text-forest-400 transition-colors">
                      {item.step}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-forest-50 border border-ivory-border text-forest-700 text-[11px] font-mono font-semibold">
                      {item.time}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-ivory flex items-center justify-center mb-5 shadow-sm group-hover:bg-forest-700 transition-colors">
                    <Icon className="w-6 h-6 text-forest-300" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-bold text-xl text-forest-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-forest-800/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-ivory-border flex items-center gap-2 text-xs font-semibold text-forest-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Đã kiểm nghiệm trên OBS 30+</span>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
