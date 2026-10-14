import React from 'react';
import { ArrowRight, Compass, Sparkles, Flame, Eye, Leaf } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CuratedCollectionsProps {
  onSelectCategory: (category: string) => void;
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ onSelectCategory }) => {
  const collections = [
    {
      id: 'nature',
      title: 'Forest & Nature',
      tagline: 'Hồn cốt của rừng già ngàn năm',
      desc: 'Sắc xanh ngọc lục bảo, rêu phong và tán thông tĩnh lặng mang lại cảm giác thư thái, tĩnh tại cho khán giả.',
      image: '/images/hero-forest.jpg',
      badge: 'Chủ đạo',
      count: '6 Bộ Giao Diện',
    },
    {
      id: 'minimal',
      title: 'Clean & Minimal',
      tagline: 'Tinh hoa của sự tối giản Bắc Âu',
      desc: 'Đường nét thanh thoát, khung máy ảnh siêu mảnh và hộp thoại tinh tế giúp biểu cảm streamer luôn là tâm điểm.',
      image: '/images/minimal-pine.jpg',
      badge: 'Thanh lịch',
      count: '3 Bộ Giao Diện',
    },
    {
      id: 'dark',
      title: 'Dark & Cinematic',
      tagline: 'Màn đêm than chì huyền ảo',
      desc: 'Bầu không khí điện ảnh trầm lắng với khói sương bạc và tông xám than chì sâu thẳm, hoàn hảo cho game kinh dị và podcast.',
      image: '/images/silent-mist.jpg',
      badge: 'Huyền bí',
      count: '2 Bộ Giao Diện',
    },
    {
      id: 'gaming',
      title: 'Gaming Essentials',
      tagline: 'Năng lượng thể thao điện tử',
      desc: 'Khung HUD góc cạnh, bảng tỷ số giải đấu và thanh đo killstreak chuẩn esports quốc tế cho các tựa game thi đấu.',
      image: '/images/cyber-emerald.jpg',
      badge: 'Esports',
      count: '2 Bộ Giao Diện',
    },
  ];

  const handleCollectionClick = (id: string) => {
    sounds.playTap();
    onSelectCategory(id);
    const el = document.getElementById('explore-collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="curated-collections" className="py-20 md:py-28 bg-forest-950 text-ivory relative overflow-hidden border-b border-forest-800">
      
      {/* Background ambient light */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-forest-900/60 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase mb-2">
              <Compass className="w-3.5 h-3.5" />
              Định hướng thẩm mỹ
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-ivory tracking-tight">
              Bộ Sưu Tập Theo Phong Cách
            </h2>
            <p className="mt-3 text-base text-forest-200/70 max-w-xl">
              Khám phá các thế giới hình ảnh được thiết kế chuyên biệt cho từng phong cách truyền cảm hứng livestream.
            </p>
          </div>
        </div>

        {/* 4 Editorial Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.id)}
              className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer border border-forest-800/80 hover:border-forest-500 transition-all duration-500 shadow-2xl flex flex-col justify-end p-6 sm:p-8"
            >
              {/* Background Cover Image */}
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7] group-hover:brightness-[0.8]"
              />

              {/* Gradient Scrim for deep readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent"></div>

              {/* Top Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono uppercase bg-forest-900/90 text-emerald-300 border border-forest-700/80 backdrop-blur-sm">
                  {col.badge}
                </span>
                <span className="text-xs text-ivory/80 font-mono">
                  {col.count}
                </span>
              </div>

              {/* Content Block */}
              <div className="relative z-10 space-y-2 transform transition-transform duration-300 group-hover:-translate-y-1">
                <div className="text-xs text-emerald-400 font-mono tracking-wider uppercase">
                  {col.tagline}
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-ivory group-hover:text-emerald-200 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs sm:text-sm text-forest-100/70 line-clamp-2 max-w-lg leading-relaxed">
                  {col.desc}
                </p>

                <div className="pt-3 flex items-center gap-2 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
                  <span>Khám phá các sản phẩm trong bộ sưu tập</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
