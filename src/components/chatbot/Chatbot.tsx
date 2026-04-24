'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, X, Send, User, Mail, Phone,
  Home, DollarSign, Bed, Droplets, Maximize, MapPin, ExternalLink,
  Clock, CheckCircle, HelpCircle, Calendar,
  Tag, CreditCard, Search, Info, Car, Trees, Star, BedDouble,
} from 'lucide-react';
import styles from './Chatbot.module.css';
import { API_ENDPOINTS, apiRequest } from '@/lib/api';

// ------------------------------------------------------------------ //
// Types
// ------------------------------------------------------------------ //

interface Message {
  text: string;
  isBot: boolean;
  intent?: string;
}

interface ChatResponse {
  response: string;
  session_id: string;
  intent?: string;
  confidence?: number;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

// ------------------------------------------------------------------ //
// Icon map — [icon-name] markers → Lucide components
// ------------------------------------------------------------------ //

const ICON_MAP: Record<string, React.ReactNode> = {
  'home':          <Home size={14} className="inline-block shrink-0 text-[#c1a478]" />,
  'dollar-sign':   <DollarSign size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'bed':           <Bed size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'droplets':      <Droplets size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'maximize':      <Maximize size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'map-pin':       <MapPin size={14} className="inline-block shrink-0 text-[#c1a478]" />,
  'external-link': <ExternalLink size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'phone':         <Phone size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'mail':          <Mail size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'user':          <User size={14} className="inline-block shrink-0 text-[#c1a478]" />,
  'clock':         <Clock size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'check-circle':  <CheckCircle size={14} className="inline-block shrink-0 text-green-500" />,
  'help-circle':   <HelpCircle size={14} className="inline-block shrink-0 text-[#c1a478]" />,
  'calendar':      <Calendar size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'tag':           <Tag size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'credit-card':   <CreditCard size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'search':        <Search size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'info':          <Info size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'car':           <Car size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'trees':         <Trees size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
  'star':          <Star size={14} className="inline-block shrink-0 text-[#c1a478]" />,
  'bed-double':    <BedDouble size={14} className="inline-block shrink-0 text-[#5d6d87]" />,
};

function parseMessage(text: string): React.ReactNode[] {
  return text.split('\n').map((line, lineIdx, arr) => {
    const parts = line.split(/(\[[a-z-]+\])/g);
    const rendered = parts.map((part, partIdx) => {
      const m = part.match(/^\[([a-z-]+)\]$/);
      if (m) {
        const icon = ICON_MAP[m[1]];
        return icon ? <span key={partIdx} className="inline-flex items-center mr-1 align-middle">{icon}</span> : null;
      }
      if (part.includes('/properties/')) {
        return (
          <a key={partIdx} href={part.trim()} className="text-[#c1a478] underline hover:text-[#b09368] transition-colors ml-1">
            View property
          </a>
        );
      }
      return <span key={partIdx}>{part}</span>;
    });
    return (
      <span key={lineIdx} className="flex items-start gap-0.5 flex-wrap">
        {rendered}
        {lineIdx < arr.length - 1 && <br />}
      </span>
    );
  });
}

// ------------------------------------------------------------------ //
// Intro form
// ------------------------------------------------------------------ //

function IntroForm({ onStart }: { onStart: (info: UserInfo) => void }) {
  const [info, setInfo] = useState<UserInfo>({ name: '', email: '', phone: '' });

  const field = (
    label: string,
    icon: React.ReactNode,
    key: keyof UserInfo,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label className="flex items-center gap-1 text-[11px] font-semibold text-[#5d6d87] mb-1">
        {icon} {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={info[key]}
        onChange={(e) => setInfo(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full p-[10px] border border-[#e8e8e8] rounded text-[13px] bg-white focus:border-[#c1a478] focus:outline-none focus:ring-2 focus:ring-[#c1a478]/20 transition-all"
      />
    </div>
  );

  return (
    <div className={styles.introForm}>
      <div className="p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#c1a478] flex items-center justify-center mb-3">
            <User size={24} color="#fff" />
          </div>
          <h3 className="text-[16px] font-bold text-[#1a1a1a]">Welcome to Lily White Realestate!</h3>
          <p className="text-[13px] text-[#6c757d] mt-1 text-center">
            Help us serve you better — all fields optional
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          {field('Your Name',     <User size={12} />,  'name',  'text',  'John Doe')}
          {field('Email Address', <Mail size={12} />,  'email', 'email', 'john@example.com')}
          {field('Phone Number',  <Phone size={12} />, 'phone', 'tel',   '+1 (555) 123-4567')}
        </div>

        {/* Buttons */}
        <button
          onClick={() => onStart(info)}
          className="w-full mt-5 py-3 bg-[#c1a478] hover:bg-[#b09368] text-white text-[13px] font-bold rounded transition-colors"
        >
          Start Chat
        </button>
        <button
          onClick={() => onStart({ name: '', email: '', phone: '' })}
          className="w-full mt-2 py-2 text-[12px] text-[#6c757d] hover:text-[#1a1a1a] underline bg-transparent border-none cursor-pointer transition-colors"
        >
          Skip and chat anonymously
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ //
// Main component
// ------------------------------------------------------------------ //

export default function Chatbot() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [userInfo,  setUserInfo]  = useState<UserInfo>({ name: '', email: '', phone: '' });
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [error,     setError]     = useState('');
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Reset intro when chat is closed and reopened
  const handleOpen = () => {
    setIsOpen(true);
    // Only reset if no session yet
    if (!sessionId) setShowIntro(true);
  };

  const handleStart = (info: UserInfo) => {
    setUserInfo(info);
    setShowIntro(false);
    const firstName = info.name ? ' ' + info.name.split(' ')[0] : '';
    setMessages([{
      text: `Hi${firstName}! I'm your Lily White Realestate assistant. How can I help you find your perfect property today?`,
      isBot: true,
    }]);
  };

  const handleSend = async (e?: React.SyntheticEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;

    setMessages(prev => [...prev, { text: msg, isBot: false }]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const payload: Record<string, string> = { message: msg };
      if (sessionId) {
        payload.session_id = sessionId;
      } else {
        // First message — attach user info if provided
        if (userInfo.name)  payload.user_name  = userInfo.name;
        if (userInfo.email) payload.user_email = userInfo.email;
        if (userInfo.phone) payload.user_phone = userInfo.phone;
      }

      const data = await apiRequest<ChatResponse>(API_ENDPOINTS.chatbot.chat, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (data.session_id && !sessionId) setSessionId(data.session_id);

      setMessages(prev => [...prev, {
        text: data.response,
        isBot: true,
        intent: data.intent,
      }]);
    } catch {
      setError('Connection error. Please try again.');
      setMessages(prev => [...prev, {
        text: "I'm having trouble connecting right now. Please try again or contact us directly.",
        isBot: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* FAB */}
      {!isOpen && (
        <button className={styles.fab} onClick={handleOpen} aria-label="Open chat">
          <MessageSquare size={24} />
          <span className={styles.pulse} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h3>Lily White Realestate Bot</h3>
              <p>Online | Ready to help</p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          {/* Intro form or chat */}
          {showIntro ? (
            <IntroForm onStart={handleStart} />
          ) : (
            <>
              <div className={styles.chatArea} ref={chatAreaRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`${styles.message} ${m.isBot ? styles.bot : styles.user}`}>
                    {m.isBot ? parseMessage(m.text) : m.text}
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.message} ${styles.bot} ${styles.loading}`}>
                    <span /><span /><span />
                  </div>
                )}
              </div>

              <form className={styles.inputArea} onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
                <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send">
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
