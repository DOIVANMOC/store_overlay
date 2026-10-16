import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Sparkles, 
  BookOpen,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { User } from '../types/user';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenGuides: () => void;
  onSelectCategory: (category: string) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenProfile: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenGuides,
  onSelectCategory,
  activeNav,
  setActiveNav,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getIsMuted());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (nav: string, categoryFilter?: string) => {
    sounds.playTap();
    setActiveNav(nav);
    setMobileMenuOpen(false);
    if (categoryFilter) {
      onSelectCategory(categoryFilter);
    }
  };

  const handleSoundToggle = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-forest-900/90 backdrop-blur-md shadow-forest-md border-b border-forest-800/80 py-3' 
          : 'bg-forest-900/70 backdrop-blur-sm border-b border-forest-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: Brand Logo & Minimalist Leaf Mark */}
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-forest-800 border border-forest-600/70 flex items-center justify-center text-forest-300 shadow-forest-sm group-hover:bg-forest-700 transition-colors">
              <svg className="w-5 h-5 text-forest-400 group-hover:text-emerald-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-wider text-ivory block leading-none">
                FOREST <span className="text-forest-400 font-semibold">OVERLAY</span>
              </span>
              <span className="text-[10px] tracking-widest text-neutralMuted uppercase font-mono block mt-1">
                Stream Assets Studio
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-forest-950/60 p-1.5 rounded-full border border-forest-800/80">
            <button
              onClick={() => {
                handleNavClick('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeNav === 'home'
                  ? 'bg-forest-700 text-ivory shadow-sm'
                  : 'text-neutralMuted hover:text-ivory'
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => {
                handleNavClick('overlay');
                const el = document.getElementById('explore-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeNav === 'overlay'
                  ? 'bg-forest-700 text-ivory shadow-sm'
                  : 'text-neutralMuted hover:text-ivory'
              }`}
            >
              Overlay
            </button>
            <button
              onClick={() => {
                handleNavClick('free', 'free');
                const el = document.getElementById('explore-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1 ${
                activeNav === 'free'
                  ? 'bg-forest-700 text-ivory shadow-sm'
                  : 'text-neutralMuted hover:text-ivory'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Miễn phí</span>
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                onOpenGuides();
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-neutralMuted hover:text-ivory transition-all flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-forest-400" />
              <span>Hướng dẫn</span>
            </button>
          </nav>

          {/* Right Action Icons: Search, SFX Audio Toggle, Admin, User, Cart */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSearch();
              }}
              className="p-2 rounded-xl text-neutralMuted hover:text-ivory hover:bg-forest-800/80 transition-colors border border-transparent hover:border-forest-700"
              aria-label="Tìm kiếm sản phẩm"
              title="Tìm kiếm overlay (Phím tắt: Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sound Toggle (Web Audio API) */}
            <button
              onClick={handleSoundToggle}
              className={`p-2 rounded-xl border transition-all ${
                isMuted 
                  ? 'text-neutralMuted/60 border-forest-800/40 hover:text-neutralMuted' 
                  : 'text-forest-400 border-forest-700 bg-forest-800/50 hover:bg-forest-800 hover:text-emerald-300'
              }`}
              aria-label={isMuted ? "Bật âm thanh giao diện" : "Tắt âm thanh giao diện"}
              title={isMuted ? "Bật âm thanh thao tác" : "Tắt âm thanh thao tác"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Admin Panel Quick Action Button (Visible only to Admin) */}
            {currentUser?.role === 'admin' && onOpenAdmin && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAdmin();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-forest-sm group"
                title="Quản trị viên: Đăng tải & Xóa bài đăng"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline font-mono font-bold">Admin Panel</span>
              </button>
            )}

            {/* User Account / Login Button */}
            {currentUser ? (
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenProfile();
                }}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold border border-forest-600/70 transition-all shadow-forest-sm group"
                title="Hồ sơ tài khoản & Cài đặt"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}&backgroundColor=163D2B`}
                    alt={currentUser.displayName}
                    className="w-6 h-6 rounded-lg object-cover bg-forest-700 border border-forest-500"
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-forest-900 ${currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                </div>
                <span className="hidden sm:inline font-display max-w-[90px] truncate">
                  {currentUser.displayName}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAuth('login');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold border border-forest-600/70 transition-all shadow-forest-sm group"
                title="Đăng nhập hoặc Đăng ký tài khoản"
              >
                <UserIcon className="w-4 h-4 text-forest-300 group-hover:text-emerald-300 transition-colors" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}

            {/* Cart Drawer Button with Count Badge */}
            <button
              onClick={() => {
                sounds.playWhoosh();
                onOpenCart();
              }}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-semibold border border-forest-600/70 transition-all shadow-forest-sm group"
              aria-label="Giỏ hàng và thư viện"
            >
              <ShoppingBag className="w-4 h-4 text-forest-300 group-hover:text-emerald-300 transition-colors" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-forest-500 text-ivory text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-xl text-neutralMuted hover:text-ivory hover:bg-forest-800 transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-forest-800 bg-forest-900/95 rounded-2xl p-4 space-y-2.5 animate-fade-in shadow-xl">
            {/* Admin Quick Action Button on Mobile */}
            {currentUser?.role === 'admin' && onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 mb-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Bảng Quản Trị Admin (Đăng/Xóa Bài)</span>
              </button>
            )}

            {/* User Profile / Auth Section in Mobile Menu */}
            {currentUser ? (
              <div className="p-2.5 rounded-xl bg-forest-800/80 border border-forest-700 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}&backgroundColor=163D2B`}
                    alt={currentUser.displayName}
                    className="w-9 h-9 rounded-xl object-cover border border-forest-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-ivory font-display flex items-center gap-1.5">
                      <span>{currentUser.displayName}</span>
                      {currentUser.role === 'admin' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-mono font-bold">ADMIN</span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutralMuted font-mono">@{currentUser.username}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-forest-700 text-ivory text-xs font-semibold hover:bg-forest-600"
                >
                  Hồ sơ
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="py-2 px-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-bold text-center border border-forest-700"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="py-2 px-3 rounded-xl bg-forest-700 hover:bg-forest-600 text-ivory text-xs font-bold text-center border border-forest-600"
                >
                  Tạo tài khoản
                </button>
              </div>
            )}

            <button
              onClick={() => {
                handleNavClick('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-ivory hover:bg-forest-800 transition-colors"
            >
              Trang chủ
            </button>
            <button
              onClick={() => {
                handleNavClick('overlay');
                const el = document.getElementById('explore-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-ivory hover:bg-forest-800 transition-colors"
            >
              Overlay & Gói Stream
            </button>
            <button
              onClick={() => {
                handleNavClick('free', 'free');
                const el = document.getElementById('explore-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:bg-forest-800 transition-colors flex items-center justify-between"
            >
              <span>Gói Miễn Phí (Free Community)</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGuides();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-ivory hover:bg-forest-800 transition-colors flex items-center justify-between"
            >
              <span>Hướng dẫn cài đặt OBS</span>
              <BookOpen className="w-4 h-4 text-forest-400" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
