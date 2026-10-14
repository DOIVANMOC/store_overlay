import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Tv, 
  HelpCircle, 
  CheckCircle2, 
  Smartphone, 
  FileCode, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface GuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidesModal: React.FC<GuidesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'obs' | 'tiktok' | 'alerts' | 'faq'>('obs');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/80 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-ivory-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-forest-900 text-ivory border-b border-forest-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-base">
              Trung Tâm Hướng Dẫn & Thiết Lập Stream
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

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-ivory-border flex gap-2 overflow-x-auto">
          <button
            onClick={() => { sounds.playTap(); setActiveTab('obs'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'obs'
                ? 'bg-forest-800 text-ivory shadow-sm'
                : 'text-forest-700 hover:bg-forest-50'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Cài đặt OBS Studio (1-Click)</span>
          </button>

          <button
            onClick={() => { sounds.playTap(); setActiveTab('tiktok'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'tiktok'
                ? 'bg-forest-800 text-ivory shadow-sm'
                : 'text-forest-700 hover:bg-forest-50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>TikTok Live Studio 9:16</span>
          </button>

          <button
            onClick={() => { sounds.playTap(); setActiveTab('alerts'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-forest-800 text-ivory shadow-sm'
                : 'text-forest-700 hover:bg-forest-50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Thông báo StreamElements</span>
          </button>

          <button
            onClick={() => { sounds.playTap(); setActiveTab('faq'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'faq'
                ? 'bg-forest-800 text-ivory shadow-sm'
                : 'text-forest-700 hover:bg-forest-50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Câu hỏi thường gặp (FAQ)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-sm text-forest-900">
          
          {/* TAB 1: OBS STUDIO */}
          {activeTab === 'obs' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-forest-50 border border-ivory-border">
                <h4 className="font-display font-bold text-base text-forest-900 mb-2">
                  Hướng Dẫn Nhập Cảnh Tự Động Vào OBS Studio 29/30+
                </h4>
                <p className="text-xs text-forest-800/80 leading-relaxed">
                  Mỗi gói Streamer Overlay từ FOREST OVERLAY đều tích hợp sẵn file Scene Collection <code>.json</code>. Bạn không cần phải thêm từng cảnh hay sắp xếp từng layer thủ công.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-ivory-border">
                  <span className="w-6 h-6 rounded-full bg-forest-800 text-ivory text-xs font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <div>
                    <div className="font-bold text-xs text-forest-900">Mở tính năng Import trong OBS</div>
                    <div className="text-xs text-neutralMuted mt-0.5">
                      Trên thanh menu trên cùng của OBS, chọn <strong>Scene Collection (Bộ sưu tập cảnh)</strong> → <strong>Import (Nhập)</strong>.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-ivory-border">
                  <span className="w-6 h-6 rounded-full bg-forest-800 text-ivory text-xs font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <div>
                    <div className="font-bold text-xs text-forest-900">Chọn file .json của gói overlay</div>
                    <div className="text-xs text-neutralMuted mt-0.5">
                      Trỏ đường dẫn đến tệp <code>.json</code> trong thư mục giải nén (ví dụ: <code>DeepWoods_QuickSetup_OBS.json</code>).
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-ivory-border">
                  <span className="w-6 h-6 rounded-full bg-forest-800 text-ivory text-xs font-bold flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <div>
                    <div className="font-bold text-xs text-forest-900">Gán Camera & Bắt Đầu Lên Sóng</div>
                    <div className="text-xs text-neutralMuted mt-0.5">
                      OBS sẽ tự động tạo đủ 4 cảnh: [Live Stream], [Starting Soon], [Be Right Back], [Ending]. Nhấp đôi vào nguồn "Webcam Source" để chọn thiết bị camera của bạn là hoàn tất!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIKTOK LIVE STUDIO */}
          {activeTab === 'tiktok' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-forest-50 border border-ivory-border">
                <h4 className="font-display font-bold text-base text-forest-900 mb-2">
                  Thiết Lập Khung Dọc 9:16 Trên TikTok Live Studio
                </h4>
                <p className="text-xs text-forest-800/80 leading-relaxed">
                  Định dạng chuẩn dọc 1080x1920 giúp tối ưu hóa diện tích hiển thị trên điện thoại người xem, kích thích lượt tặng hoa và tương tác bình luận.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-ivory-border text-xs leading-relaxed">
                  <strong>Bước 1:</strong> Trong TikTok Live Studio, chọn bố cục màn hình là <strong>Portrait (Dọc 1080x1920)</strong>.
                </div>
                <div className="p-3 bg-white rounded-xl border border-ivory-border text-xs leading-relaxed">
                  <strong>Bước 2:</strong> Thêm nguồn hình ảnh và chọn tệp <code>Bonsai_Camera_Frame_9x16.png</code> (Định dạng PNG 32-bit trong suốt).
                </div>
                <div className="p-3 bg-white rounded-xl border border-ivory-border text-xs leading-relaxed">
                  <strong>Bước 3:</strong> Kéo nguồn camera máy ảnh hoặc điện thoại nằm ngay bên dưới lớp khung viền.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STREAM ELEMENTS ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-forest-50 border border-ivory-border">
                <h4 className="font-display font-bold text-base text-forest-900 mb-2">
                  Kích Hoạt Thông Báo Tự Động 1-Click StreamElements
                </h4>
                <p className="text-xs text-forest-800/80 leading-relaxed">
                  Mỗi gói đều có link 1-Click. Bạn chỉ cần nhấp vào link, hệ thống StreamElements sẽ tự động cài đặt toàn bộ hình ảnh và âm thanh thông báo.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-ivory-border text-xs leading-relaxed">
                  <strong>Bước 1:</strong> Mở tệp <code>StreamElements_Alerts_Link.url</code> trong gói sản phẩm.
                </div>
                <div className="p-3 bg-white rounded-xl border border-ivory-border text-xs leading-relaxed">
                  <strong>Bước 2:</strong> Nhấn "Create Overlay" trên bảng điều khiển StreamElements.
                </div>
                <div className="p-3 bg-white rounded-xl border border-ivory-border text-xs leading-relaxed">
                  <strong>Bước 3:</strong> Sao chép đường dẫn Overlay URL dán vào nguồn <strong>Browser Source</strong> trong OBS với kích thước 1920x1080.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-ivory-border space-y-1">
                <div className="font-bold text-xs text-forest-900">
                  Giao diện động có làm máy tính của tôi bị tụt FPS khi chơi game không?
                </div>
                <div className="text-xs text-neutralMuted leading-relaxed">
                  Tuyệt đối không. Toàn bộ hiệu ứng động được mã hóa bằng codec WebM VP9 với tăng tốc phần cứng, mức tải CPU chỉ dao động dưới 0.8%, cam kết 0 frame drop.
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-ivory-border space-y-1">
                <div className="font-bold text-xs text-forest-900">
                  Tôi có thể chỉnh sửa tên kênh streamer trên khung webcam không?
                </div>
                <div className="text-xs text-neutralMuted leading-relaxed">
                  Có! Mỗi gói đều đi kèm tệp nguồn PSD và font chữ chuyên dụng, bạn có thể dễ dàng thay đổi tên kênh và link mạng xã hội của mình bằng Photoshop hoặc Photopea miễn phí.
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-ivory-border space-y-1">
                <div className="font-bold text-xs text-forest-900">
                  Tôi có quyền phát sóng thương mại và nhận donate không?
                </div>
                <div className="text-xs text-neutralMuted leading-relaxed">
                  100% bản quyền thương mại trọn đời. Bạn được tự do livestream trên mọi nền tảng (Twitch, YouTube, TikTok, Kick, Facebook) và kiếm doanh thu từ quảng cáo và ủng hộ.
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
