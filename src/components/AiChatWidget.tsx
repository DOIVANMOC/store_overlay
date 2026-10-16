import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  Phone, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowRight,
  Palette,
  Clock,
  DollarSign,
  ShieldCheck,
  Minimize2
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  showZaloAction?: boolean;
}

const ZALO_PHONE = '0876065085';
const ZALO_LINK = 'https://zalo.me/0876065085';

export const AiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome-1',
      sender: 'ai',
      text: 'Chào bạn! Mình là Trợ Lý AI của Studio. Bạn đang tìm mẫu overlay có sẵn hay muốn đặt làm riêng theo phong cách độc quyền?',
      timestamp: 'Vừa xong',
      showZaloAction: false
    },
    {
      id: 'msg-welcome-2',
      sender: 'ai',
      text: '✨ Để đặt thiết kế khung livestream riêng (Custom Brand Overlay) theo tên kênh và màu sắc cá nhân, bạn hãy nhắn tin trực tiếp qua Zalo: 0876.065.085 để nhận phác thảo và báo giá nhé!',
      timestamp: 'Vừa xong',
      showZaloAction: true
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    navigator.clipboard.writeText(ZALO_PHONE);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const getAiResponse = (query: string): { text: string; showZalo: boolean } => {
    const q = query.toLowerCase();

    if (q.includes('giá') || q.includes('nhiêu') || q.includes('chi phí') || q.includes('báo giá')) {
      return {
        text: '💰 Về chi phí thiết kế riêng:\n• Gói Khung Webcam + Alerts: từ 250.000đ – 450.000đ.\n• Gói Trọn Bộ Stream Suite (Webcam, Màn hình chờ, Chuyển cảnh Stinger, Banner, Chatbox): từ 650.000đ – 1.200.000đ tùy độ phức tạp động 60FPS.\n\n👉 Bạn hãy gửi ý tưởng hoặc logo qua Zalo 0876.065.085 để designer chốt giá ưu đãi nhất nhé!',
        showZalo: true
      };
    }

    if (q.includes('thời gian') || q.includes('lâu không') || q.includes('bao lâu') || q.includes('mất mấy ngày')) {
      return {
        text: '⏱️ Thời gian hoàn thiện thiết kế riêng thường chỉ từ 24h đến 48h! Bạn sẽ được xem trước bản vẽ phác thảo 2D/3D và chỉnh sửa 1-1 không giới hạn cho đến khi ưng ý nhất rồi mới xuất file cài OBS Studio.',
        showZalo: true
      };
    }

    if (q.includes('quy trình') || q.includes('các bước') || q.includes('làm sao')) {
      return {
        text: '📋 Quy trình đặt làm khung riêng rất nhanh chóng:\n1. Nhắn Zalo 0876.065.085 gửi tên kênh và ý tưởng phong cách.\n2. Designer lên bản vẽ demo màu sắc & hiệu ứng động.\n3. Bạn duyệt và yêu cầu chỉnh sửa theo sở thích.\n4. Bàn giao trọn gói file OBS Scene (.json) & WebM 60FPS chỉ việc import là xong!',
        showZalo: true
      };
    }

    if (q.includes('zalo') || q.includes('sđt') || q.includes('liên hệ') || q.includes('gọi') || q.includes('inbox')) {
      return {
        text: '📱 Số Zalo tư vấn thiết kế riêng độc quyền: 0876.065.085 (Huy Hoàng - Forest Overlay Studio).\nBấm nút bên dưới để mở trực tiếp cuộc trò chuyện trên Zalo bạn nhé!',
        showZalo: true
      };
    }

    if (q.includes('game') || q.includes('fps') || q.includes('esports') || q.includes('lol') || q.includes('valorant') || q.includes('pubg')) {
      return {
        text: '🎮 Studio chuyên thiết kế khung overlay tối ưu cho các tựa game FPS/Esports (Valorant, CS2, LMHT, PUBG, GTA V...). Thiết kế viền siêu mỏng, không che minimap, tiêu hao CPU dưới 1%.\nNhắn Zalo 0876.065.085 để nhận mẫu demo game của bạn!',
        showZalo: true
      };
    }

    // Default friendly response
    return {
      text: `Dạ mình đã ghi nhận thông tin! Để được hỗ trợ thiết kế theo phong cách riêng đúng ý nhất, bạn hãy nhắn tin trực tiếp qua Zalo 0876.065.085 hoặc bấm vào nút bên dưới để designer tư vấn và lên phác thảo cho kênh của bạn ngay nhé!`,
      showZalo: true
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sounds.playTap();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: 'Vừa xong'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAiResponse(text);
      sounds.playChime();
      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: 'Vừa xong',
        showZaloAction: response.showZalo
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      
      {/* 1. CHAT WINDOW (When Open) */}
      {isOpen && (
        <div className="relative w-[340px] sm:w-[380px] h-[520px] max-h-[82vh] bg-white rounded-3xl border border-ivory-border shadow-2xl flex flex-col overflow-hidden animate-slide-up mb-3">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-ivory p-4 border-b border-forest-700/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-forest-800 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-forest-900" title="Online" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-extrabold text-sm text-ivory">
                    Trợ Lý AI Thiết Kế Riêng
                  </h4>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                    24/7
                  </span>
                </div>
                <div className="text-[11px] text-neutralMuted flex items-center gap-1">
                  <span>Zalo:</span>
                  <a
                    href={ZALO_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-emerald-300 hover:underline"
                  >
                    0876.065.085
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setIsOpen(false); }}
                className="p-1.5 rounded-xl bg-forest-950/40 hover:bg-forest-950 text-neutralMuted hover:text-ivory transition-colors"
                title="Thu nhỏ"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { sounds.playClick(); setIsOpen(false); }}
                className="p-1.5 rounded-xl bg-forest-950/40 hover:bg-forest-950 text-neutralMuted hover:text-ivory transition-colors"
                title="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Zalo Banner inside Chat */}
          <div className="bg-forest-50 px-4 py-2 border-b border-ivory-border flex items-center justify-between text-xs shrink-0">
            <span className="text-forest-800 font-medium text-[11px]">
              Đặt làm khung overlay theo yêu cầu:
            </span>
            <div className="flex items-center gap-1.5">
              <a
                href={ZALO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs transition-colors"
              >
                <span>Zalo: 0876065085</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="p-1 rounded-lg hover:bg-forest-100 text-forest-700 transition-colors"
                title="Sao chép SĐT Zalo"
              >
                {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-ivory-soft">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-forest-800 text-ivory rounded-br-none shadow-sm'
                      : 'bg-white text-forest-900 rounded-bl-none border border-ivory-border shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Zalo Direct Button if AI recommends it */}
                {m.showZaloAction && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <a
                      href={ZALO_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Nhắn Tin Zalo: 0876.065.085</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-forest-50 border border-ivory-border text-forest-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy SĐT</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <span className="text-[9px] text-neutralMuted font-mono mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-ivory-border w-20 text-neutralMuted">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce delay-200"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-ivory-border flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => handleSendMessage('Đặt làm khung overlay riêng')}
              className="px-2.5 py-1 rounded-full bg-forest-50 hover:bg-forest-100 text-forest-800 border border-ivory-border whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Palette className="w-3 h-3 text-forest-600" />
              <span>Đặt làm riêng</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Báo giá thiết kế riêng bao nhiêu?')}
              className="px-2.5 py-1 rounded-full bg-forest-50 hover:bg-forest-100 text-forest-800 border border-ivory-border whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <DollarSign className="w-3 h-3 text-emerald-600" />
              <span>Báo giá</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Thời gian hoàn thành bao lâu?')}
              className="px-2.5 py-1 rounded-full bg-forest-50 hover:bg-forest-100 text-forest-800 border border-ivory-border whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Thời gian</span>
            </button>
            <a
              href={ZALO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap transition-colors font-bold flex items-center gap-1"
            >
              <span>Zalo 0876065085</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-ivory-border flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi hoặc yêu cầu thiết kế..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-ivory-soft border border-ivory-border text-xs text-forest-950 placeholder:text-neutralMuted focus:outline-none focus:border-forest-600 font-sans"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory transition-colors disabled:opacity-40 disabled:hover:bg-forest-800 shadow-sm"
              title="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 2. FLOATING TRIGGER BUTTON (Always visible at corner) */}
      <div className="flex items-center gap-2">
        {/* Helper popup pill when closed */}
        {!isOpen && (
          <div 
            onClick={() => { sounds.playTap(); setIsOpen(true); }}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-ivory-border text-forest-900 text-xs font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-spin-slow" />
            <span>Đặt làm khung riêng:</span>
            <span className="font-mono text-emerald-700 font-bold group-hover:underline">
              Zalo 0876.065.085
            </span>
          </div>
        )}

        {/* Round Launcher Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            setIsOpen(!isOpen);
          }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-forest-900 via-forest-800 to-emerald-700 text-ivory flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-emerald-400/40"
          aria-label="Mở chat tư vấn AI"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6 text-emerald-300" />
              {/* Ping Animation Indicator */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
