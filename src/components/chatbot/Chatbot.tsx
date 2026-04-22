'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, X, Send,
  Home, DollarSign, Bed, Droplets, Maximize, MapPin, ExternalLink,
  Phone, Mail, User, Clock, CheckCircle, HelpCircle, Calendar,
  Tag, CreditCard, Search, Info, Car, Trees, Star, BedDouble,
} from 'lucide-react';
import styles from './Chatbot.module.css';
import { API_ENDPOINTS, apiRequest } from '@/lib/api';

interface Message {
  text: string;
  isBot: boolean;
  intent?: string;
  confidence?: number;
}

interface ChatResponse {
  response: string;
  session_id: string;
  intent?: string;
  confidence?: number;
}

// Map [icon-name] markers to Lucide components
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

/**
 * Parse a message string and return an array of React nodes.
 * [icon-name] markers are replaced with Lucide icons.
 * /properties/slug links become clickable anchors.
 */
function parseMessage(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Split line on [icon] tokens
    const parts = line.split(/(\[[a-z-]+\])/g);
    const rendered = parts.map((part, partIdx) => {
      const iconMatch = part.match(/^\[([a-z-]+)\]$/);
      if (iconMatch) {
        const icon = ICON_MAP[iconMatch[1]];
        return icon ? (
          <span key={partIdx} className="inline-flex items-center mr-1 align-middle">
            {icon}
          </span>
        ) : null;
      }

      // Turn /properties/slug into a clickable link
      if (part.includes('/properties/')) {
        const slug = part.trim();
        return (
          <a
            key={partIdx}
            href={slug}
            className="text-[#c1a478] underline hover:text-[#b09368] transition-colors ml-1"
          >
            View property
          </a>
        );
      }

      return <span key={partIdx}>{part}</span>;
    });

    return (
      <span key={lineIdx} className="flex items-start gap-0.5 flex-wrap">
        {rendered}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your Realtor Pal assistant. How can I help you find your perfect property today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await apiRequest<ChatResponse>(API_ENDPOINTS.chatbot.chat, {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId || undefined,
        }),
      });

      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

      setMessages(prev => [
        ...prev,
        {
          text: data.response,
          isBot: true,
          intent: data.intent,
          confidence: data.confidence,
        },
      ]);

      // Silent background lead creation for high-intent messages
      if (data.intent === 'property_search' || data.intent === 'contact' || data.intent === 'schedule_viewing') {
        apiRequest(API_ENDPOINTS.leads.contact, {
          method: 'POST',
          body: JSON.stringify({
            first_name: 'Chat',
            last_name: 'User',
            email: 'chat@user.com',
            message: `Chat Inquiry (${data.intent}): ${userMessage}`,
            inquiry_type: 'GENERAL',
            source: 'CHATBOT',
          }),
        }).catch(() => {});
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          text: "I'm having trouble connecting right now. Please try again or contact us directly.",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {!isOpen && (
        <button className={styles.fab} onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
          <span className={styles.pulse}></span>
        </button>
      )}

      {isOpen && (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h3>Realtor Pal Bot</h3>
              <p>Online | Ready to help</p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.chatArea} ref={chatAreaRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.message} ${m.isBot ? styles.bot : styles.user}`}
              >
                {m.isBot ? parseMessage(m.text) : m.text}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.bot} ${styles.loading}`}>
                <span></span>
                <span></span>
                <span></span>
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
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
