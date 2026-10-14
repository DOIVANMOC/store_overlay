import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { authService } from '../utils/auth';
import { User } from '../types/user';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Status state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#163D2B', '#387A4B', '#9EBA91', '#F5F6F0']
      });
    } catch {}
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = authService.login(loginIdentifier, loginPassword);
      setIsLoading(false);

      if (res.success && res.user) {
        sounds.playChime();
        triggerConfetti();
        setSuccessMsg(res.message || 'Đăng nhập thành công!');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.message || 'Đăng nhập thất bại.');
      }
    }, 250);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate confirmation password
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng nhập lại.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = authService.register(
        regUsername,
        regPassword,
        regDisplayName || regUsername,
        regEmail
      );
      setIsLoading(false);

      if (res.success && res.user) {
        sounds.playChime();
        triggerConfetti();
        setSuccessMsg(res.message || 'Đăng ký tài khoản thành công!');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 700);
      } else {
        setErrorMsg(res.message || 'Đăng ký thất bại.');
      }
    }, 300);
  };

  // Quick 1-click Fill demo account
  const handleUseDemoAccount = (username: string, pass: string) => {
    sounds.playTap();
    setLoginIdentifier(username);
    setLoginPassword(pass);
    setErrorMsg(null);
  };

  const demoAccounts = authService.getDemoAccounts();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-ivory rounded-3xl border border-ivory-border shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Nature Forest Aesthetics */}
        <div className="relative bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 p-6 text-ivory text-center overflow-hidden border-b border-forest-700/60">
          
          {/* Subtle Ambient Decorative Leaves Pattern */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-forest-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-forest-500/15 rounded-full blur-xl pointer-events-none" />

          {/* Close Modal Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-forest-950/50 hover:bg-forest-950 text-neutralMuted hover:text-ivory transition-colors border border-forest-700/40"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo Mark */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-forest-800/90 border border-forest-600/80 mb-3 shadow-inner">
            <svg className="w-6 h-6 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>

          <h2 className="font-display font-extrabold text-xl tracking-tight text-ivory">
            {mode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
          </h2>
          <p className="text-xs text-neutralMuted mt-1 max-w-xs mx-auto">
            {mode === 'login' 
              ? 'Đăng nhập để quản lý thư viện overlay, tải gói stream và lưu trữ cài đặt.'
              : 'Gia nhập cộng đồng Creator của Forest Overlay để nhận ngay các gói overlay miễn phí.'}
          </p>

          {/* Tab Pill Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-forest-950/70 rounded-2xl border border-forest-700/60 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-forest-700 text-ivory shadow-sm'
                  : 'text-neutralMuted hover:text-ivory'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-forest-700 text-ivory shadow-sm'
                  : 'text-neutralMuted hover:text-ivory'
              }`}
            >
              Đăng ký
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1.5">
                  Tên tài khoản hoặc Email
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-forest-600/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="streamer_demo hoặc email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-forest-900">
                    Mật khẩu
                  </label>
                  <span className="text-[11px] text-forest-600 hover:underline cursor-pointer">
                    Quên mật khẩu?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-forest-600/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutralMuted hover:text-forest-900 p-1"
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-bold tracking-wide transition-all shadow-forest-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Đang xác thực...</span>
                ) : (
                  <>
                    <span>Đăng nhập ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Convenient 1-Click Demo Accounts */}
              <div className="mt-5 pt-4 border-t border-ivory-border">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-700 mb-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Dùng nhanh tài khoản mẫu thử nghiệm:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => handleUseDemoAccount(acc.username, acc.password)}
                      className="p-2 rounded-xl bg-ivory-soft hover:bg-ivory-dark border border-ivory-border text-left transition-colors group"
                    >
                      <div className="text-[11px] font-bold text-forest-900 group-hover:text-forest-700 truncate">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-neutralMuted font-mono">
                        {acc.username}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Tên tài khoản (Username) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-forest-600/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="VD: vortex_streamer (viết liền, không dấu)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Tên hiển thị / Streamer Handle
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-forest-600/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={regDisplayName}
                    onChange={(e) => setRegDisplayName(e.target.value)}
                    placeholder="VD: Vortex Gaming"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Email liên hệ
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-forest-600/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="VD: streamer@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-forest-600/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutralMuted hover:text-forest-900 p-0.5"
                      tabIndex={-1}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-forest-600/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showRegConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu"
                      className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-ivory-soft border border-ivory-border text-forest-950 text-xs placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirm(!showRegConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutralMuted hover:text-forest-900 p-0.5"
                      tabIndex={-1}
                    >
                      {showRegConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-bold tracking-wide transition-all shadow-forest-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Đang tạo tài khoản...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Hoàn tất đăng ký</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-neutralMuted pt-2">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="text-forest-700 font-bold hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
