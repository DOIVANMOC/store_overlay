import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  LogOut, 
  ShoppingBag, 
  BookOpen, 
  Check, 
  Edit3,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types/user';
import { authService } from '../utils/auth';
import { sounds } from '../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenGuides: () => void;
  onUserUpdated: (updatedUser: User) => void;
  onOpenAdmin?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenCart,
  onOpenGuides,
  onUserUpdated,
  onOpenAdmin,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const res = authService.updateProfile({
      displayName: displayName.trim() || user.username,
      email: email.trim(),
      bio: bio.trim()
    });

    if (res.success && res.user) {
      sounds.playChime();
      onUserUpdated(res.user);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleLogoutClick = () => {
    sounds.playClick();
    authService.logout();
    onLogout();
    onClose();
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-ivory rounded-3xl border border-ivory-border shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Forest Theme */}
        <div className="relative bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 p-6 text-ivory">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-forest-950/50 hover:bg-forest-950 text-neutralMuted hover:text-ivory transition-colors border border-forest-700/40"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}&backgroundColor=163D2B`}
                alt={user.displayName}
                className="w-16 h-16 rounded-2xl object-cover bg-forest-800 border-2 border-forest-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-forest-900" title="Online" />
            </div>

            {/* Name and Handle */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg text-ivory">
                  {user.displayName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-700 text-emerald-300 border border-forest-600">
                  {user.role === 'vip' ? 'VIP Creator' : user.role === 'pro' ? 'Pro Streamer' : 'Streamer'}
                </span>
              </div>
              <p className="text-xs font-mono text-neutralMuted">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-5">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu thông tin hồ sơ thành công!</span>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              {/* Bio */}
              <div className="p-3.5 rounded-2xl bg-ivory-soft border border-ivory-border">
                <div className="text-[11px] font-semibold text-neutralMuted uppercase tracking-wider mb-1">
                  Giới thiệu ngắn
                </div>
                <p className="text-xs text-forest-900 leading-relaxed">
                  {user.bio || 'Chưa cập nhật phần giới thiệu kênh.'}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-ivory-soft border border-ivory-border flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-forest-600 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-neutralMuted">Email</div>
                    <div className="text-forest-900 font-medium truncate">{user.email}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ivory-soft border border-ivory-border flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-forest-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-neutralMuted">Ngày tham gia</div>
                    <div className="text-forest-900 font-medium">{formattedDate}</div>
                  </div>
                </div>
              </div>

              {/* Admin Panel Quick Trigger */}
              {user.role === 'admin' && onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                    onOpenAdmin();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-bold text-amber-900 flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Mở Bảng Quản Trị Website (Đăng & Xóa Bài)</span>
                </button>
              )}

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    onClose();
                    onOpenCart();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-ivory-soft hover:bg-ivory-dark border border-ivory-border text-xs font-semibold text-forest-900 flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-forest-600" />
                  <span>Xem giỏ hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    onClose();
                    onOpenGuides();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-ivory-soft hover:bg-ivory-dark border border-ivory-border text-xs font-semibold text-forest-900 flex items-center justify-center gap-2 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-forest-600" />
                  <span>Hướng dẫn OBS</span>
                </button>
              </div>

              {/* Edit Profile Trigger */}
              <div className="pt-2 flex items-center justify-between border-t border-ivory-border">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsEditing(true);
                  }}
                  className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa thông tin</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            /* Editing Form */
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Giới thiệu kênh / Stream Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Mô tả phong cách stream, tựa game yêu thích..."
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs focus:outline-none focus:border-forest-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-bold transition-all shadow-forest-sm flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2.5 px-4 rounded-xl bg-ivory-soft hover:bg-ivory-dark border border-ivory-border text-xs font-semibold text-neutralMuted transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
