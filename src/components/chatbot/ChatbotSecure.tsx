'use client';

/**
 * ChatbotSecure v2
 * ================
 * State:   Zustand store (chatbotStore.ts) — replaces raw localStorage
 * Animations: Framer Motion — fluid message entrance, widget expansion
 * NLP:     Backend uses spaCy NER + sentence-transformers (100% local)
 * Security: DOMPurify XSS sanitization, rate limiting, spam prevention
 */

import { useEffect, useRef, useState } from 'react';
import {
  MessageSquare, X, Send, User, Mail, Phone, Trash2, RefreshCw,
  Home, DollarSign, Bed, Droplets, Maximize, MapPin, ExternalLink,
  Clock, CheckCircle, HelpCircle, Calendar, Tag, CreditCard,
  Search, Info, Car, Trees, Star, BedDouble,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import styles from './Chatbot.module.css';
import { API_ENDPOINTS, apiRequest } from '@/lib/api';
import { useChatbotStore, type ChatMessage, type UserInfo } from '@/store/chatbotStore';
 
// ------------------------------------------------------------------ //
// Constants
// ------------------------------------------------------------------ //

const MAX_MESSAGE_LENGTH = 500;
const DEBOUNCE_MS        = 1000;

// ------------------------------------------------------------------ //
// Icon map + message parser
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
        return icon
          ? <span key={partIdx} className="inline-flex items-center mr-1 align-middle">{icon}</span>
          : null;
      }
      if (part.includes('/properties/')) {
        return (
          <a key={partIdx} href={part.trim()}
            className="text-[#c1a478] underline hover:text-[#b09368] transition-colors ml-1">
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
// Sanitize bot response
// ------------------------------------------------------------------ //

function sanitize(text: string): string {
  if (typeof window === 'undefined') return text.replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
  try {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    }).trim();
  } catch {
    return text.trim();
  }
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ------------------------------------------------------------------ //
// Intro Form — required fields, validation
// ------------------------------------------------------------------ //

function IntroForm({ onStart }: { onStart: (info: UserInfo) => void }) {
  const [info, setInfo]     = useState<UserInfo>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<UserInfo>>({});

  const validate = () => {
    const e: Partial<UserInfo> = {};
    if (!info.name.trim())  e.name  = 'Name is required';
    if (!info.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) e.email = 'Enter a valid email';
    if (!info.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const field = (
    label: string,
    icon: React.ReactNode,
    key: keyof UserInfo,
    type = 'text',
    placeholder = ''
  ) => (
    <div key={key}>
      <label className="flex items-center gap-1 text-[11px] font-semibold text-[#5d6d87] mb-1">
        {icon} {label} <span className="text-red-500 ml-0.5">*</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={info[key]}
        onChange={(e) => {
          setInfo(prev => ({ ...prev, [key]: e.target.value }));
          if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
        }}
        className={`w-full p-[10px] border rounded text-[13px] bg-white focus:outline-none focus:ring-2 transition-all ${
          errors[key]
            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
            : 'border-[#e8e8e8] focus:border-[#c1a478] focus:ring-[#c1a478]/20'
        }`}
      />
      {errors[key] && <p className="text-red-500 text-[11px] mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <motion.div
      className={styles.introForm}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#c1a478] flex items-center justify-center mb-3">
            <User size={24} color="#fff" />
          </div>
          <h3 className="text-[16px] font-bold text-[#1a1a1a]">Welcome to Lily White Real Estate!</h3>
          <p className="text-[13px] text-[#6c757d] mt-1 text-center">
            Let&apos;s find your perfect property together
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {field('Your Name',     <User size={12} />,  'name',  'text',  'John Doe')}
          {field('Email Address', <Mail size={12} />,  'email', 'email', 'john@example.com')}
          {field('Phone Number',  <Phone size={12} />, 'phone', 'tel',   '+1 (555) 123-4567')}
        </div>

        <button
          onClick={() => { if (validate()) onStart(info); }}
          className="w-full mt-5 py-3 bg-[#c1a478] hover:bg-[#b09368] text-white text-[13px] font-bold rounded transition-colors"
        >
          Start Chat
        </button>
      </div>
    </motion.div>
  );
}

// ------------------------------------------------------------------ //
// Main component
// ------------------------------------------------------------------ //

export default function ChatbotSecure() {
  const {
    isOpen, showIntro, sessionId, userInfo, messages, isLoading, error,
    open, close, setShowIntro, setSessionId, setUserInfo,
    addMessage, setMessages, setLoading, setError, clearSession,
  } = useChatbotStore();

  const [input, setInput]               = useState('');
  const [lastMsgTime, setLastMsgTime]   = useState(0);
  const chatAreaRef                     = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Sync with backend on open
  useEffect(() => {
    if (isOpen && sessionId && !showIntro) {
      syncWithBackend(sessionId);
    }
  }, [isOpen]);

  const syncWithBackend = async (sid: string) => {
    try {
      const data = await apiRequest<{ messages: any[] }>(
        `${API_ENDPOINTS.chatbot.history}?session_id=${sid}`
      );
      if (data.messages?.length) {
        const remote: ChatMessage[] = [];
        for (let i = 0; i < data.messages.length; i += 2) {
          const u = data.messages[i];
          const b = data.messages[i + 1];
          if (u) remote.push({ id: genId(), role: 'user', message: u.message, timestamp: u.timestamp });
          if (b) remote.push({ id: genId(), role: 'bot',  message: sanitize(b.message), timestamp: b.timestamp });
        }
        // Merge: keep local messages not in remote
        const remoteIds = new Set(remote.map(m => m.message + m.timestamp));
        const localOnly = messages.filter(m => !remoteIds.has(m.message + m.timestamp));
        setMessages([...remote, ...localOnly].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ));
      }
    } catch {
      // Silently fail — local messages remain
    }
  };

  const handleOpen = () => {
    open();
    if (!sessionId) setShowIntro(true);
  };

  const handleStart = (info: UserInfo) => {
    setUserInfo(info);
    setShowIntro(false);
    const firstName = info.name ? ' ' + info.name.split(' ')[0] : '';
    addMessage({
      id:        genId(),
      role:      'bot',
      message:   `Hi${firstName}! I'm your Investment Property Specialist assistant representing Bijen Khadka. With 12+ years of experience and 1500+ satisfied clients, I'm here to help you find the perfect property. What are you looking for today?`,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;

    // Rate limit
    const now = Date.now();
    if (now - lastMsgTime < DEBOUNCE_MS) {
      setError('Please wait a moment before sending another message');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Length check
    if (msg.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long (max ${MAX_MESSAGE_LENGTH} chars)`);
      return;
    }

    // Spam check
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser?.message === msg) {
      setError("Please don't send the same message twice");
      setTimeout(() => setError(''), 3000);
      return;
    }

    addMessage({ id: genId(), role: 'user', message: msg, timestamp: new Date().toISOString() });
    setInput('');
    setLoading(true);
    setError('');
    setLastMsgTime(now);

    try {
      const payload: Record<string, string> = { message: msg };
      if (sessionId) {
        payload.session_id = sessionId;
      } else {
        if (userInfo.name)  payload.user_name  = userInfo.name;
        if (userInfo.email) payload.user_email = userInfo.email;
        if (userInfo.phone) payload.user_phone = userInfo.phone;
      }

      const data = await apiRequest<{ response: string; session_id: string }>(
        API_ENDPOINTS.chatbot.chat,
        { method: 'POST', body: JSON.stringify(payload) }
      );

      if (data.session_id && !sessionId) setSessionId(data.session_id);

      addMessage({
        id:        genId(),
        role:      'bot',
        message:   sanitize(data.response),
        timestamp: new Date().toISOString(),
      });
    } catch {
      addMessage({
        id:        genId(),
        role:      'bot',
        message:   "I'm having trouble connecting right now. Please try again or contact us directly.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Clear this chat? This cannot be undone.')) return;
    try {
      if (sessionId) {
        await apiRequest(`${API_ENDPOINTS.chatbot.clearSession}?session_id=${sessionId}`, { method: 'DELETE' });
      }
    } catch { /* ignore */ }
    clearSession();
  };

  // ---------------------------------------------------------------- //
  // Render
  // ---------------------------------------------------------------- //

  return (
    <div className={styles.wrapper}>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className={styles.fab}
            onClick={handleOpen}
            aria-label="Open chat"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <MessageSquare size={24} />
            <span className={styles.pulse} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window + cat mascot wrapper */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 2001 }}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            {/* Cat face peeking over top of chatbox - right side */}
            <motion.div
              style={{
                position: 'absolute',
                top: -80,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 1,
                overflow: 'visible',
                width: 350,
                height: 200,
              }}
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.3 }}
            >
           
            </motion.div>

            {/* Chat container */}
            <div className={styles.container} style={{ position: 'relative', zIndex: 5 }}>
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.headerInfo}>
                  <h3>Lily White Real Estate</h3>
                  <p>Investment Property Specialist | Online</p>
                </div>
                <div className="flex items-center gap-2">
                  {!showIntro && sessionId && (
                    <>
                      <button onClick={() => syncWithBackend(sessionId)}
                        className="p-1 hover:bg-white/10 rounded transition-colors" title="Sync">
                        <RefreshCw size={16} />
                      </button>
                      <button onClick={handleClear}
                        className="p-1 hover:bg-white/10 rounded transition-colors" title="Clear chat">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  <button onClick={close} aria-label="Close chat">
                    <X size={20} />
                  </button>
                </div>
              </div>

            {/* Body */}
            {showIntro ? (
              <IntroForm onStart={handleStart} />
            ) : (
              <>
                {/* Messages */}
                <div className={styles.chatArea} ref={chatAreaRef}>
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        className={`${styles.message} ${m.role === 'bot' ? styles.bot : styles.user}`}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        <div className="flex flex-col">
                          <div>
                            {m.role === 'bot' ? parseMessage(m.message) : m.message}
                          </div>
                          <div className="text-[10px] opacity-60 mt-1">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        className={`${styles.message} ${styles.bot} ${styles.loading}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                      >
                        <span /><span /><span />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="text-center text-red-500 text-xs py-2">{error}</div>
                  )}
                </div>

                {/* Input */}
                <form className={styles.inputArea} onSubmit={handleSend}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    maxLength={MAX_MESSAGE_LENGTH}
                    autoFocus
                    aria-label="Message input"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{input.length}/{MAX_MESSAGE_LENGTH}</span>
                    <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
            </div>{/* end .container */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
