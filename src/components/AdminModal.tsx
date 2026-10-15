import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  PlusCircle, 
  Trash2, 
  Upload, 
  Check, 
  AlertTriangle, 
  Eye, 
  RotateCcw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  FolderArchive,
  FileCode,
  FileText,
  File,
  Download,
  Link as LinkIcon,
  Cloud,
  HardDrive,
  ExternalLink,
  Plus,
  HelpCircle
} from 'lucide-react';
import { Product, ProductCategory, IncludedFile } from '../types/product';
import { CATEGORIES_LIST } from '../data/products';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetDefaultProducts: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onDeleteProduct,
  onResetDefaultProducts,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  // Create Form State
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('nature');
  const [price, setPrice] = useState<number>(350000);
  const [isFree, setIsFree] = useState(false);
  const [badge, setBadge] = useState<string>('New');
  const [imageUrl, setImageUrl] = useState('/images/deep-woods.jpg');
  const [imagePreview, setImagePreview] = useState<string>('/images/deep-woods.jpg');
  const [resolution, setResolution] = useState('1920x1080 (60 FPS)');
  const [tagInput, setTagInput] = useState('New, Forest, Live');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Attached Project Files State
  const [projectDownloadUrl, setProjectDownloadUrl] = useState('');
  const [projectPackName, setProjectPackName] = useState('');
  const [projectPackSize, setProjectPackSize] = useState('48.5 MB');
  const [attachedFiles, setAttachedFiles] = useState<IncludedFile[]>([
    { name: 'OBS_Scene_Collection_QuickSetup.json', type: 'OBS Studio Scene', size: '1.2 MB', isProjectSource: true },
    { name: 'Animated_Webcam_Frame_60fps.webm', type: 'WebM Transparent (60FPS)', size: '14.5 MB', isProjectSource: true },
    { name: 'Alerts_Follow_Sub_Donation.zip', type: 'HTML/CSS/JS Widget Pack', size: '4.8 MB', isProjectSource: true },
    { name: 'Full_Project_Master_Files.zip', type: 'Gói nén dự án (.ZIP)', size: '48.5 MB', isProjectSource: true }
  ]);
  const [showCustomFileInput, setShowCustomFileInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [customLink, setCustomLink] = useState('');

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helpers
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const detectFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'json': return 'OBS Studio Scene Collection';
      case 'overlay': return 'Streamlabs / OBS Overlay Package';
      case 'zip':
      case 'rar':
      case '7z': return 'Gói tệp nén dự án (.ZIP)';
      case 'psd': return 'Photoshop Master Source File';
      case 'webm': return 'Animated WebM Transparent (60FPS)';
      case 'mp4': return 'Video hoạt họa 1080p60';
      case 'aep': return 'After Effects Project (.AEP)';
      case 'png': return 'Bộ icon / Twitch Panels (PNG)';
      default: return 'Tệp tài nguyên dự án';
    }
  };

  // Handle image upload from computer via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle project file upload from computer
  const handleProjectFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    sounds.playTap();
    const newItems: IncludedFile[] = [];

    Array.from(fileList).forEach((file) => {
      const type = detectFileType(file.name);
      const size = formatBytes(file.size);

      // If under 10MB, convert to Data URL for direct in-browser download
      if (file.size <= 10 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setAttachedFiles((prev) => [
            ...prev,
            {
              name: file.name,
              type: type,
              size: size,
              fileData: base64,
              isProjectSource: true
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        newItems.push({
          name: file.name,
          type: type,
          size: size,
          isProjectSource: true
        });
      }
    });

    if (newItems.length > 0) {
      setAttachedFiles((prev) => [...prev, ...newItems]);
    }
  };

  const handleRemoveAttachedFile = (index: number) => {
    sounds.playClick();
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomFile = () => {
    if (!customName.trim()) return;
    sounds.playTap();
    setAttachedFiles((prev) => [
      ...prev,
      {
        name: customName.trim(),
        type: customType.trim() || detectFileType(customName.trim()),
        size: customSize.trim() || '1.5 MB',
        downloadUrl: customLink.trim() || undefined,
        isProjectSource: true
      }
    ]);
    setCustomName('');
    setCustomType('');
    setCustomSize('');
    setCustomLink('');
    setShowCustomFileInput(false);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playChime();

    const categoryObj = CATEGORIES_LIST.find(c => c.id === category);
    const categoryLabel = categoryObj ? categoryObj.label : 'Gói Stream';

    const safeTitle = title.trim();
    const packName = projectPackName.trim() || `${safeTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Full_Project.zip`;

    const newProduct: Product = {
      id: `custom-overlay-${Date.now()}`,
      slug: safeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: safeTitle,
      shortDesc: shortDesc.trim() || 'Khung overlay phát sóng chuyên nghiệp được tối ưu chuẩn OBS Studio và Streamlabs.',
      description: description.trim() || `${safeTitle} là bộ nhận diện phát sóng cao cấp với đầy đủ khung webcam, thông báo cảnh báo và màn hình chuyển cảnh.`,
      category: isFree ? 'free' : category,
      categoryLabel: categoryLabel,
      price: isFree ? 0 : Number(price) || 0,
      originalPrice: isFree ? undefined : Number(price) * 1.3,
      isFree: isFree,
      badge: isFree ? 'Free Community' : (badge as any) || 'New',
      platforms: ['OBS Studio', 'Streamlabs', 'Twitch', 'YouTube', 'TikTok Live'],
      resolution: resolution,
      fps: 60,
      aspectRatio: '16:9',
      softwareCompatibility: ['OBS Studio v30+', 'Streamlabs Desktop', 'vMix', 'Twitch Studio'],
      includedFiles: attachedFiles.length > 0 ? attachedFiles : [
        { name: 'OBS_Scene_Collection_QuickSetup.json', type: 'OBS Studio Scene', size: '1.2 MB', isProjectSource: true },
        { name: 'Full_Project_Master_Files.zip', type: 'Gói nén dự án (.ZIP)', size: '48.5 MB', isProjectSource: true }
      ],
      installSteps: [
        'Mở OBS Studio, tại mục Scene Collection (Bộ sưu tập cảnh) chọn Import (Nhập).',
        'Chọn tệp JSON/Overlay đính kèm để tự động liên kết toàn bộ cảnh và webcam.',
        'Chọn nguồn Browser Source nếu có cảnh báo động và tận hưởng buổi phát sóng chuyên nghiệp!'
      ],
      themeColor: '#163D2B',
      accentColor: '#387A4B',
      previews: {
        obsScene: imagePreview,
        startingSoon: imagePreview,
        beRightBack: imagePreview,
        webcamCloseup: imagePreview,
        stingerAlert: imagePreview
      },
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
      mockupPreset: 'forest_woods',
      // Attached Project Pack info
      projectDownloadUrl: projectDownloadUrl.trim() || undefined,
      projectPackName: packName,
      projectPackSize: projectPackSize.trim() || '48.5 MB'
    };

    onAddProduct(newProduct);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    setSuccessNotice(`Đã đăng tải thành công khung "${newProduct.title}" kèm ${newProduct.includedFiles.length} tệp dự án!`);
    setTimeout(() => setSuccessNotice(null), 4000);

    // Reset Form
    setTitle('');
    setShortDesc('');
    setDescription('');
    setPrice(350000);
    setIsFree(false);
    setProjectDownloadUrl('');
    setProjectPackName('');
  };

  const handleDelete = (id: string, name: string) => {
    sounds.playClick();
    onDeleteProduct(id);
    setConfirmDeleteId(null);
    setSuccessNotice(`Đã xóa bài đăng "${name}" thành công.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-ivory rounded-3xl border border-ivory-border shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header Banner */}
        <div className="relative bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 p-6 text-ivory border-b border-forest-700/60">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-5 right-5 p-2 rounded-xl bg-forest-950/50 hover:bg-forest-950 text-neutralMuted hover:text-ivory transition-colors border border-forest-700/40"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-700 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-forest-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg text-ivory">
                  Quản Trị Viên (Admin Control Panel)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                  Quyền Admin
                </span>
              </div>
              <p className="text-xs text-neutralMuted mt-0.5">
                Tài khoản: <span className="text-ivory font-mono font-semibold">honggiahuy933@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mt-5 flex items-center gap-2 border-t border-forest-700/50 pt-4">
            <button
              onClick={() => {
                sounds.playTap();
                setActiveTab('create');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-ivory text-forest-900 shadow-sm'
                  : 'text-neutralMuted hover:text-ivory bg-forest-950/40'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng tải khung & gắn file dự án</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                setActiveTab('manage');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'manage'
                  ? 'bg-ivory text-forest-900 shadow-sm'
                  : 'text-neutralMuted hover:text-ivory bg-forest-950/40'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Quản lý & Xóa bài đăng ({products.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* TAB 1: ĐĂNG TẢI KHUNG MỚI VÀ GẮN FILE DỰ ÁN */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateSubmit} className="space-y-6">
              
              {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700 border-b border-ivory-border pb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                  <span>1. Thông tin giới thiệu khung overlay</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tiêu đề */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Tên gói khung livestream (Tiêu đề bài đăng) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="VD: Cyber Emerald Neon Stream Package"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600 font-sans"
                    />
                  </div>

                  {/* Danh mục */}
                  <div>
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Chủ đề / Thể loại
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full px-3 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600"
                    >
                      <option value="nature">Nature & Forest (Rừng cây & Tự nhiên)</option>
                      <option value="minimal">Minimalist (Tối giản thanh lịch)</option>
                      <option value="gaming">Gaming & Esports (Chiến đấu FPS)</option>
                      <option value="dark">Dark & Ambient (Đêm tối & Trầm lặng)</option>
                      <option value="webcam">Webcam Focus (Chuyên khung Facecam)</option>
                      <option value="full-package">Full Package (Trọn bộ đài phát thanh)</option>
                    </select>
                  </div>

                  {/* Huy hiệu */}
                  <div>
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Huy hiệu nhãn (Badge)
                    </label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600"
                    >
                      <option value="New">Mới ra mắt (New)</option>
                      <option value="Bestseller">Bán chạy nhất (Bestseller)</option>
                      <option value="Featured">Nổi bật (Featured)</option>
                      <option value="Trending">Xu hướng (Trending)</option>
                      <option value="Staff Pick">Khuyên dùng (Staff Pick)</option>
                    </select>
                  </div>

                  {/* Giá bán & Miễn phí */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-forest-900">
                        Giá niêm yết (VNĐ)
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-forest-700">
                        <input
                          type="checkbox"
                          checked={isFree}
                          onChange={(e) => setIsFree(e.target.checked)}
                          className="rounded accent-forest-700"
                        />
                        <span className="font-semibold text-emerald-700">Miễn phí 100%</span>
                      </label>
                    </div>
                    <input
                      type="number"
                      disabled={isFree}
                      value={isFree ? 0 : price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      step={10000}
                      placeholder="350000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs disabled:opacity-40 disabled:bg-ivory-dark focus:outline-none focus:border-forest-600 font-mono"
                    />
                  </div>

                  {/* Độ phân giải */}
                  <div>
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Độ phân giải & Tần số quét
                    </label>
                    <input
                      type="text"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="1920x1080 (60 FPS) hoặc 4K UHD"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600 font-mono"
                    />
                  </div>

                  {/* Mô tả ngắn */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Mô tả ngắn hiển thị trên thẻ bài đăng
                    </label>
                    <input
                      type="text"
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="VD: Khung stream phong cách neon xanh lục bảo với hiệu ứng ánh sáng động tinh tế..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600"
                    />
                  </div>

                  {/* Hình ảnh sản phẩm (Upload hoặc URL) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Hình ảnh bài đăng (Banner 16:9)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Image Preview Box */}
                      <div className="w-full sm:w-48 aspect-video rounded-xl bg-forest-950 border border-ivory-border overflow-hidden shrink-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>

                      <div className="w-full space-y-2">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            setImagePreview(e.target.value);
                          }}
                          placeholder="Dán link ảnh online (https://...)"
                          className="w-full px-3 py-2 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600 font-mono"
                        />

                        <div className="flex items-center gap-2">
                          <label className="px-3 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Tải ảnh từ máy tính</span>
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          </label>
                          <span className="text-[11px] text-neutralMuted">Hỗ trợ PNG, JPG, WebP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PHẦN 2: TÍNH NĂNG MỚI - GẮN FILE DỰ ÁN KHUNG CHO ADMIN */}
              <div className="p-4 sm:p-5 rounded-2xl bg-forest-50/80 border-2 border-dashed border-forest-600/30 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-forest-800 text-ivory flex items-center justify-center shrink-0 shadow-sm">
                      <FolderArchive className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wide flex items-center gap-2">
                        <span>2. Gắn tệp dự án khung (Project Assets & Source Files)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-ivory">
                          ADMIN FEATURE
                        </span>
                      </h4>
                      <p className="text-[11px] text-forest-800/80">
                        Đính kèm tệp nguồn OBS (.json), tệp nén (.zip/.rar), WebM hoặc liên kết Google Drive để streamer tải về.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phương thức 1: Liên kết Google Drive / Cloud Drive */}
                <div className="bg-white p-3.5 rounded-xl border border-ivory-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-forest-900">
                    <Cloud className="w-4 h-4 text-forest-600" />
                    <span>Link tải trọn gói đám mây (Google Drive, Dropbox, Mega, OneDrive)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="url"
                        value={projectDownloadUrl}
                        onChange={(e) => setProjectDownloadUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/... (hoặc link tải trực tiếp)"
                        className="w-full px-3 py-2 rounded-lg bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600 font-mono"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={projectPackSize}
                        onChange={(e) => setProjectPackSize(e.target.value)}
                        placeholder="Dung lượng (VD: 85 MB)"
                        className="w-full px-3 py-2 rounded-lg bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600 font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-neutralMuted font-mono">
                    * Gợi ý: Các file nén nặng trên 50MB nên lưu trên Google Drive và dán liên kết vào đây để streamer tải với tốc độ cao nhất.
                  </p>
                </div>

                {/* Phương thức 2: Tải tệp trực tiếp từ máy tính */}
                <div className="bg-white p-3.5 rounded-xl border border-ivory-border space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-forest-900">
                      <HardDrive className="w-4 h-4 text-forest-600" />
                      <span>Tải tệp dự án từ máy tính ({attachedFiles.length} tệp đã gắn)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Chọn tệp từ máy (.zip, .json, .webm, .psd...)</span>
                        <input
                          type="file"
                          multiple
                          accept=".zip,.rar,.7z,.json,.overlay,.psd,.webm,.mp4,.mov,.aep,.pdf,.png,.txt"
                          onChange={handleProjectFilesUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowCustomFileInput(!showCustomFileInput)}
                        className="px-2.5 py-1.5 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-800 text-xs font-medium transition-colors flex items-center gap-1"
                        title="Thêm thủ công"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm thủ công</span>
                      </button>
                    </div>
                  </div>

                  {/* Form thêm thủ công */}
                  {showCustomFileInput && (
                    <div className="p-3 bg-forest-50/70 rounded-lg border border-forest-200 space-y-2 animate-fade-in text-xs">
                      <div className="font-bold text-forest-900">Nhập thông tin tệp thành phần mới:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="Tên tệp (VD: OBS_Scene.json)"
                          className="px-2.5 py-1.5 rounded bg-white border border-ivory-border text-xs"
                        />
                        <input
                          type="text"
                          value={customType}
                          onChange={(e) => setCustomType(e.target.value)}
                          placeholder="Loại (VD: Scene Collection)"
                          className="px-2.5 py-1.5 rounded bg-white border border-ivory-border text-xs"
                        />
                        <input
                          type="text"
                          value={customSize}
                          onChange={(e) => setCustomSize(e.target.value)}
                          placeholder="Dung lượng (VD: 2.4 MB)"
                          className="px-2.5 py-1.5 rounded bg-white border border-ivory-border text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowCustomFileInput(false)}
                          className="px-2.5 py-1 rounded text-neutralMuted hover:text-forest-900"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleAddCustomFile}
                          className="px-3 py-1 rounded bg-forest-800 text-ivory font-bold hover:bg-forest-700"
                        >
                          Lưu vào danh sách
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Danh sách tệp dự án đã gắn */}
                  <div className="divide-y divide-ivory-border border border-ivory-border rounded-lg overflow-hidden bg-ivory-soft max-h-48 overflow-y-auto">
                    {attachedFiles.map((file, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between gap-3 text-xs hover:bg-white transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded bg-forest-200 text-forest-900 flex items-center justify-center font-mono font-bold text-[9px] shrink-0">
                            {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-forest-900 truncate">
                              {file.name}
                            </div>
                            <div className="text-[10px] text-neutralMuted">
                              {file.type} • <span className="font-mono">{file.size}</span>
                              {file.fileData && (
                                <span className="ml-2 text-emerald-600 font-bold">• Đã lưu sẵn tệp tải trực tiếp</span>
                              )}
                              {file.downloadUrl && (
                                <span className="ml-2 text-forest-600 font-bold">• Có link tải</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveAttachedFile(idx)}
                          className="p-1 rounded text-neutralMuted hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                          title="Gỡ tệp này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-ivory-border flex items-center justify-between">
                <div className="text-[11px] text-neutralMuted flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bài đăng sẽ tự động lưu và đồng bộ lên website</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-bold transition-all shadow-forest-md flex items-center gap-2 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Xuất Bản Bài Đăng & Gắn Tệp Dự Án Ngay</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: QUẢN LÝ & XÓA BÀI ĐĂNG */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-ivory-border">
                <div className="text-xs text-forest-800 font-semibold">
                  Tổng cộng: <span className="font-bold text-forest-900">{products.length} bài đăng</span> đang hiển thị
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bạn có muốn khôi phục lại danh sách các bài đăng gốc ban đầu?')) {
                      onResetDefaultProducts();
                      setSuccessNotice('Đã khôi phục dữ liệu bài đăng gốc thành công.');
                    }
                  }}
                  className="text-xs text-forest-700 hover:text-forest-900 flex items-center gap-1 font-medium"
                  title="Khôi phục lại các bài đăng mẫu gốc"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục mẫu gốc</span>
                </button>
              </div>

              {/* Products List Table */}
              <div className="divide-y divide-ivory-border border border-ivory-border rounded-2xl overflow-hidden bg-white">
                {products.map((p, index) => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-ivory-soft transition-colors">
                    
                    {/* Media & Info */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-xs font-mono text-neutralMuted w-5 shrink-0 text-center">
                        {index + 1}
                      </span>
                      <img 
                        src={p.previews.obsScene} 
                        alt={p.title} 
                        className="w-16 aspect-video rounded-lg object-cover bg-forest-950 shrink-0 border border-ivory-border"
                      />
                      <div className="overflow-hidden">
                        <div className="font-display font-bold text-xs text-forest-900 truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-neutralMuted flex items-center gap-2 font-mono flex-wrap">
                          <span className="text-forest-600 font-semibold">{p.categoryLabel}</span>
                          <span>•</span>
                          <span className={p.isFree ? 'text-emerald-700 font-bold' : 'text-forest-900'}>
                            {p.isFree ? 'Miễn phí' : `${p.price.toLocaleString('vi-VN')} ₫`}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-sans font-medium flex items-center gap-1">
                            <FolderArchive className="w-3 h-3" />
                            {p.includedFiles?.length || 0} tệp dự án
                          </span>
                          {p.projectDownloadUrl && (
                            <span className="px-1.5 py-0.2 rounded bg-forest-100 text-forest-800 text-[10px]">
                              Cloud Link
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete Action */}
                    <div className="shrink-0 flex items-center gap-2">
                      {confirmDeleteId === p.id ? (
                        <div className="flex items-center gap-1.5 animate-fade-in">
                          <span className="text-[11px] text-red-600 font-bold">Xác nhận xóa?</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.title)}
                            className="px-2.5 py-1 rounded-lg bg-red-600 text-ivory text-xs font-bold hover:bg-red-700 transition-colors"
                          >
                            Xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-1 rounded-lg bg-ivory-border text-forest-900 text-xs font-semibold hover:bg-ivory-dark transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setConfirmDeleteId(p.id);
                          }}
                          className="p-2 rounded-xl text-neutralMuted hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                          title="Xóa bài đăng này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
