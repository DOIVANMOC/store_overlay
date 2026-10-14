import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { sounds } from '../utils/audio';
import { 
  Play, 
  Tv, 
  Bell, 
  MessageSquare, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  Maximize2,
  Leaf
} from 'lucide-react';

interface StreamSimulatorProps {
  product: Product;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const StreamSimulator: React.FC<StreamSimulatorProps> = ({ product, isEmbedded = false }) => {
  const [activeScene, setActiveScene] = useState<'live' | 'starting' | 'brb'>('live');
  const [streamerName, setStreamerName] = useState<string>('FOREST_STREAMER');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<'follow' | 'donate'>('follow');
  const [alertText, setAlertText] = useState<string>('New Follower: Sylvan_Hunter!');
  const [showWebcam, setShowWebcam] = useState<boolean>(true);
  const [showChat, setShowChat] = useState<boolean>(true);

  // Trigger simulated live alert
  const triggerSimulatedAlert = (type: 'follow' | 'donate') => {
    sounds.playChime();
    setAlertType(type);
    if (type === 'follow') {
      const followers = ['Sylvan_Hunter', 'GreenWanderer', 'MossKnight', 'CedarBreeze', 'LinhChi_Gamer'];
      const randomName = followers[Math.floor(Math.random() * followers.length)];
      setAlertText(`🌿 New Follower: ${randomName}`);
    } else {
      const amounts = ['50.000₫', '100.000₫', '250.000₫'];
      const randomAmt = amounts[Math.floor(Math.random() * amounts.length)];
      setAlertText(`✨ Donation: ${randomAmt} - "Overlay đẹp quá bạn ơi!"`);
    }
    setShowAlert(true);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className={`flex flex-col bg-forest-950 text-ivory rounded-2xl overflow-hidden border border-forest-800 shadow-forest-lg ${isEmbedded ? 'w-full' : 'max-w-5xl mx-auto'}`}>
      {/* OBS Simulator Header Bar */}
      <div className="bg-forest-900 px-4 py-2.5 border-b border-forest-800 flex items-center justify-between text-xs text-neutralMuted select-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
          <span className="font-mono text-ivory/80 flex items-center gap-1.5 font-medium">
            <Tv className="w-3.5 h-3.5 text-forest-400" />
            OBS Studio 30.2 - {product.title} (Trình diễn trực quan)
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE 01:24:50
          </span>
          <span className="font-mono">FPS: 60.00</span>
          <span className="font-mono hidden sm:inline">CPU: 0.8%</span>
          <span className="font-mono hidden md:inline">0 Drop Frames</span>
        </div>
      </div>

      {/* Main Broadcast Canvas (16:9 Aspect Ratio) */}
      <div className="relative w-full aspect-video bg-forest-950 overflow-hidden select-none">
        {/* SCENE 1: LIVE BROADCAST */}
        {activeScene === 'live' && (
          <div className="absolute inset-0">
            {/* Background Image / Game Footage */}
            <img 
              src={product.previews.obsScene} 
              alt={product.title}
              className="w-full h-full object-cover" 
            />

            {/* Realistic Stream Overlay Layer Elements */}
            {/* 1. Top Event Notification Alert Box */}
            {showAlert && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 animate-slide-up">
                <div className="bg-forest-900/90 backdrop-blur-md border border-forest-500/70 text-ivory px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-forest-600/60 flex items-center justify-center text-forest-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-forest-300 font-bold">
                      {alertType === 'follow' ? 'Thành viên mới gia nhập' : 'Khoản ủng hộ kênh'}
                    </div>
                    <div className="text-sm font-semibold text-ivory">
                      {alertText}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Top-Left Streamer Handle Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-forest-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-forest-700/60 text-xs">
              <Leaf className="w-3.5 h-3.5 text-forest-400" />
              <span className="font-bold tracking-wider text-ivory">{streamerName}</span>
              <span className="text-forest-400 text-[10px] font-mono px-1.5 py-0.5 rounded bg-forest-800">OBS READY</span>
            </div>

            {/* 3. Streamer Facecam Frame with Realistic Foliage Border */}
            {showWebcam && (
              <div className="absolute top-6 right-6 z-20 w-[28%] aspect-[4/3] rounded-xl overflow-hidden border-2 border-forest-600/80 shadow-2xl bg-forest-900/40 backdrop-blur-[2px]">
                {/* Simulated Webcam Feed */}
                <div className="relative w-full h-full">
                  <img 
                    src={product.previews.webcamCloseup} 
                    alt="Webcam Feed" 
                    className="w-full h-full object-cover scale-105" 
                  />
                  {/* Subtle Corner Leaves Accent */}
                  <div className="absolute top-0 right-0 p-1.5 bg-forest-900/60 text-[10px] text-forest-300 font-mono">
                    CAM 1 • 60FPS
                  </div>
                  {/* Streamer Name Tag on bottom of webcam */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-950 via-forest-950/80 to-transparent pt-4 pb-1.5 px-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-ivory truncate">{streamerName}</span>
                    <span className="text-forest-400 text-[9px] font-mono">HD PRO</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Stream Chatbox Widget */}
            {showChat && (
              <div className="absolute bottom-6 right-6 z-20 w-[28%] max-h-[38%] rounded-xl bg-forest-950/75 backdrop-blur-md border border-forest-800/80 p-2.5 flex flex-col justify-end text-[11px] shadow-lg space-y-1.5">
                <div className="text-[10px] font-bold text-forest-400 uppercase tracking-wider pb-1 border-b border-forest-800/60 flex items-center justify-between">
                  <span>Stream Chat</span>
                  <span className="text-[9px] text-forest-300">● 1.2k xem</span>
                </div>
                <div className="space-y-1 overflow-hidden">
                  <div className="text-ivory/90 leading-tight">
                    <span className="text-forest-400 font-semibold">LeafWanderer:</span> Bộ overlay mượt quá streamer ơi!
                  </div>
                  <div className="text-ivory/90 leading-tight">
                    <span className="text-emerald-400 font-semibold">MossFan:</span> Khung webcam lá cây nhìn rất sang trọng.
                  </div>
                  <div className="text-ivory/90 leading-tight">
                    <span className="text-forest-300 font-semibold">VietGamer:</span> Lên sóng bằng OBS Studio chuẩn 60FPS luôn.
                  </div>
                </div>
              </div>
            )}

            {/* 5. Bottom Stream Info Ticker */}
            <div className="absolute bottom-4 left-4 z-20 bg-forest-900/85 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-forest-700/60 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-forest-400 font-medium">Mục tiêu Follow:</span>
                <span className="font-bold text-ivory">842 / 1000</span>
              </div>
              <div className="w-20 h-1.5 bg-forest-950 rounded-full overflow-hidden">
                <div className="w-[84%] h-full bg-emerald-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 2: STARTING SOON */}
        {activeScene === 'starting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-forest-950">
            <img 
              src={product.previews.startingSoon} 
              alt="Starting Soon" 
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
            />
            <div className="relative z-10 max-w-lg p-6 bg-forest-900/80 backdrop-blur-md rounded-2xl border border-forest-700/80 shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-forest-800/80 border border-forest-600 flex items-center justify-center mb-3 text-emerald-400">
                <Leaf className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold font-display tracking-tight text-ivory mb-1">
                STREAM STARTING SOON
              </h3>
              <p className="text-xs text-forest-300 mb-4 font-mono">
                Buổi phát sóng sẽ bắt đầu sau ít phút...
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest-950/80 rounded-full text-xs text-ivory/90 border border-forest-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Kênh: {streamerName}</span>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 3: BE RIGHT BACK */}
        {activeScene === 'brb' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-forest-950">
            <img 
              src={product.previews.beRightBack} 
              alt="Be Right Back" 
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
            />
            <div className="relative z-10 max-w-lg p-6 bg-forest-900/80 backdrop-blur-md rounded-2xl border border-forest-700/80 shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-forest-800/80 border border-forest-600 flex items-center justify-center mb-3 text-forest-400">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-display tracking-tight text-ivory mb-1">
                BE RIGHT BACK
              </h3>
              <p className="text-xs text-forest-300 mb-4 font-mono">
                Streamer nghỉ giải lao chốc lát • Đừng rời đi nhé!
              </p>
              <div className="text-xs text-neutralMuted font-mono">
                Nhạc nền: Forest Lo-Fi Chill Beats
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simulator Control Panel (Docked at Bottom) */}
      <div className="p-4 bg-forest-900 border-t border-forest-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Switch Scenes */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutralMuted uppercase tracking-wider">Cảnh OBS:</span>
          <div className="flex bg-forest-950 p-1 rounded-lg border border-forest-800">
            <button
              onClick={() => { sounds.playTap(); setActiveScene('live'); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeScene === 'live' 
                  ? 'bg-forest-600 text-ivory shadow-sm' 
                  : 'text-neutralMuted hover:text-ivory'
              }`}
            >
              Lên sóng (Live)
            </button>
            <button
              onClick={() => { sounds.playTap(); setActiveScene('starting'); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeScene === 'starting' 
                  ? 'bg-forest-600 text-ivory shadow-sm' 
                  : 'text-neutralMuted hover:text-ivory'
              }`}
            >
              Sắp bắt đầu
            </button>
            <button
              onClick={() => { sounds.playTap(); setActiveScene('brb'); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeScene === 'brb' 
                  ? 'bg-forest-600 text-ivory shadow-sm' 
                  : 'text-neutralMuted hover:text-ivory'
              }`}
            >
              Nghỉ giải lao
            </button>
          </div>
        </div>

        {/* Change Streamer Name */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutralMuted whitespace-nowrap">Tên kênh của bạn:</span>
          <input
            type="text"
            value={streamerName}
            onChange={(e) => setStreamerName(e.target.value.toUpperCase())}
            placeholder="Tên kênh..."
            className="w-full bg-forest-950 border border-forest-700 rounded-lg px-2.5 py-1 text-xs text-ivory focus:outline-none focus:border-forest-500 font-mono"
            maxLength={20}
          />
        </div>

        {/* Interactive Triggers */}
        <div className="flex items-center justify-end gap-2 flex-wrap">
          <button
            onClick={() => triggerSimulatedAlert('follow')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-medium border border-forest-700 transition-colors"
            title="Thử xem thông báo người theo dõi mới"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Thử Alert Follow</span>
          </button>
          <button
            onClick={() => triggerSimulatedAlert('donate')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forest-800 hover:bg-forest-700 text-ivory text-xs font-medium border border-forest-700 transition-colors"
            title="Thử xem thông báo ủng hộ"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Thử Donate</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setShowWebcam(!showWebcam); }}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${showWebcam ? 'bg-forest-700 border-forest-600 text-ivory' : 'bg-forest-950 border-forest-800 text-neutralMuted'}`}
            title="Bật/Tắt Webcam"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { sounds.playClick(); setShowChat(!showChat); }}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${showChat ? 'bg-forest-700 border-forest-600 text-ivory' : 'bg-forest-950 border-forest-800 text-neutralMuted'}`}
            title="Bật/Tắt Khung Chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
