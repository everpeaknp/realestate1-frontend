/**
 * SECURE PERSISTENT CHATBOT COMPONENT
 * 
 * Security Features:
 * ✓ XSS prevention with DOMPurify sanitization
 * ✓ Input length validation (max 500 chars)
 * ✓ Rate limiting (client-side debounce)
 * ✓ Spam prevention (duplicate message detection)
 * ✓ Secure localStorage with error handling
 * ✓ CSRF-ready structure
 * 
 * Persistence Features:
 * ✓ Messages persist after refresh (localStorage)
 * ✓ Backend sync on load
 * ✓ Merge local + remote messages
 * ✓ Session ID management
 * 
 * UX Features:
 * ✓ Auto-scroll to latest message
 * ✓ Typing indicator
 * ✓ Disabled input while sending
 * ✓ Clear chat button
 * ✓ Error handling with fallback
 * ✓ Timestamps on messages
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, X, Send, User, Mail, Phone, Trash2, RefreshCw
} from 'lucide-react';
import DOMPurify from 'dompurify';
import styles from './Chatbot.module.css';
import { API_ENDPOINTS, apiRequest } from '@/lib/api';

// ================================================================
// TYPES
// ================================================================

interface Message {
  id: string;
  role: 'user' | 'bot';
  message: string;
  timestamp: string;
}

interface ChatResponse {
  response: string;
  session_id: string;
  intent?: string;
  confidence?: number;
}

interface ChatHistoryResponse {
  session_id: string;
  messages: Message[];
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

// ================================================================
// CONSTANTS
// ================================================================

const STORAGE_KEYS = {
  MESSAGES: 'chatbot_messages',
  SESSION_ID: 'chatbot_session_id',
  USER_INFO: 'chatbot_user_info',
  LAST_SYNC: 'chatbot_last_sync',
} as const;

const MAX_MESSAGE_LENGTH = 500;
const DEBOUNCE_DELAY = 1000; // 1 second between messages
const SYNC_INTERVAL = 30000; // Sync with backend every 30 seconds

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Sanitize bot response for safe display
 * Uses DOMPurify to remove dangerous content from bot responses
 */
function sanitizeBotResponse(response: string): string {
  // Basic sanitization for server-side or when DOMPurify is not available
  const basicSanitize = (text: string) => text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();

  if (typeof window === 'undefined') {
    return basicSanitize(response);
  }

  // Check if DOMPurify is available
  if (typeof DOMPurify === 'undefined' || !DOMPurify.sanitize) {
    console.warn('DOMPurify not available, using basic sanitization');
    return basicSanitize(response);
  }

  try {
    // Client-side: use DOMPurify to sanitize bot response
    const sanitized = DOMPurify.sanitize(response, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });
    return sanitized.trim();
  } catch (error) {
    console.error('DOMPurify sanitization failed:', error);
    return basicSanitize(response);
  }
}

/**
 * Basic input validation (not sanitization)
 * The backend will handle proper sanitization
 */
function validateInput(input: string): string {
  // Just trim whitespace - let backend handle sanitization
  return input.trim();
}

/**
 * Validate message before sending
 */
function validateMessage(message: string): { valid: boolean; error?: string } {
  const trimmed = validateInput(message);

  if (!trimmed) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)` };
  }

  return { valid: true };
}

/**
 * Safe localStorage operations with error handling
 */
const storage = {
  get: <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

/**
 * Generate unique message ID
 */
function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Merge local and remote messages, removing duplicates
 */
function mergeMessages(local: Message[], remote: Message[]): Message[] {
  const messageMap = new Map<string, Message>();

  // Add local messages
  local.forEach(msg => messageMap.set(msg.id, msg));

  // Add remote messages (they override local if same ID)
  remote.forEach(msg => messageMap.set(msg.id, msg));

  // Sort by timestamp
  return Array.from(messageMap.values()).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

// ================================================================
// INTRO FORM COMPONENT
// ================================================================

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
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#c1a478] flex items-center justify-center mb-3">
            <User size={24} color="#fff" />
          </div>
          <h3 className="text-[16px] font-bold text-[#1a1a1a]">Welcome to Lily White Real Estate!</h3>
          <p className="text-[13px] text-[#6c757d] mt-1 text-center">
            Let's find your perfect property together
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {field('Your Name', <User size={12} />, 'name', 'text', 'John Doe')}
          {field('Email Address', <Mail size={12} />, 'email', 'email', 'john@example.com')}
          {field('Phone Number', <Phone size={12} />, 'phone', 'tel', '+1 (555) 123-4567')}
        </div>

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

// ================================================================
// MAIN CHATBOT COMPONENT
// ================================================================

export default function ChatbotSecure() {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', phone: '' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(0);

  // Refs
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ================================================================
  // PERSISTENCE FUNCTIONS
  // ================================================================

  /**
   * Load messages from localStorage
   */
  const loadFromLocalStorage = useCallback(() => {
    const storedMessages = storage.get<Message[]>(STORAGE_KEYS.MESSAGES, []);
    const storedSessionId = storage.get<string>(STORAGE_KEYS.SESSION_ID, '');
    const storedUserInfo = storage.get<UserInfo>(STORAGE_KEYS.USER_INFO, { name: '', email: '', phone: '' });

    if (storedMessages.length > 0) {
      setMessages(storedMessages);
      setShowIntro(false);
    }

    if (storedSessionId) {
      setSessionId(storedSessionId);
    }

    if (storedUserInfo.name || storedUserInfo.email) {
      setUserInfo(storedUserInfo);
    }
  }, []);

  /**
   * Save messages to localStorage
   */
  const saveToLocalStorage = useCallback((msgs: Message[], sessId: string) => {
    storage.set(STORAGE_KEYS.MESSAGES, msgs);
    storage.set(STORAGE_KEYS.SESSION_ID, sessId);
    storage.set(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }, []);

  /**
   * Sync with backend - fetch history and merge
   */
  const syncWithBackend = useCallback(async (sessId: string) => {
    if (!sessId) return;

    try {
      const data = await apiRequest<ChatHistoryResponse>(
        `${API_ENDPOINTS.chatbot.history}?session_id=${sessId}`,
        { method: 'GET' }
      );

      if (data.messages && data.messages.length > 0) {
        setMessages(prevMessages => {
          const merged = mergeMessages(prevMessages, data.messages);
          saveToLocalStorage(merged, sessId);
          return merged;
        });
      }
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      // Don't show error to user - fallback to local storage
    }
  }, [saveToLocalStorage]);

  // ================================================================
  // LIFECYCLE HOOKS
  // ================================================================

  /**
   * Load from localStorage on mount
   */
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  /**
   * Sync with backend when session ID is available
   */
  useEffect(() => {
    if (sessionId && isOpen) {
      syncWithBackend(sessionId);

      // Set up periodic sync
      syncIntervalRef.current = setInterval(() => {
        syncWithBackend(sessionId);
      }, SYNC_INTERVAL);

      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
        }
      };
    }
  }, [sessionId, isOpen, syncWithBackend]);

  /**
   * Save to localStorage whenever messages change
   */
  useEffect(() => {
    if (messages.length > 0 && sessionId) {
      saveToLocalStorage(messages, sessionId);
    }
  }, [messages, sessionId, saveToLocalStorage]);

  /**
   * Auto-scroll to latest message
   */
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // ================================================================
  // EVENT HANDLERS
  // ================================================================

  /**
   * Handle chat open
   */
  const handleOpen = () => {
    setIsOpen(true);
    // Only show intro if no session exists
    if (!sessionId && messages.length === 0) {
      setShowIntro(true);
    }
  };

  /**
   * Handle intro form submission
   */
  const handleStart = (info: UserInfo) => {
    setUserInfo(info);
    storage.set(STORAGE_KEYS.USER_INFO, info);
    setShowIntro(false);

    // Add welcome message if no messages exist
    if (messages.length === 0 && typeof window !== 'undefined') {
      const firstName = info.name ? ' ' + info.name.split(' ')[0] : '';
      const welcomeText = `Hi${firstName}! I'm your Investment Property Specialist assistant representing Bijen Khadka. With 12+ years of experience and 1500+ satisfied clients, I'm here to help you find the perfect property. What are you looking for today?`;
      
      const welcomeMessage: Message = {
        id: generateMessageId(),
        role: 'bot',
        message: sanitizeBotResponse(welcomeText),
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  };

  /**
   * Handle message send with security and rate limiting
   */
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const msg = input.trim();
    if (!msg || isLoading) return;

    // Rate limiting check (client-side debounce)
    const now = Date.now();
    if (now - lastMessageTime < DEBOUNCE_DELAY) {
      setError('Please wait a moment before sending another message');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validate message
    const validation = validateMessage(msg);
    if (!validation.valid) {
      setError(validation.error || 'Invalid message');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const trimmedMessage = validateInput(msg);

    // Check for duplicate message (spam prevention)
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage && lastUserMessage.message === trimmedMessage) {
        setError('Please don\'t send the same message twice');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    // Add user message to state
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      message: trimmedMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');
    setLastMessageTime(now);

    try {
      const payload: Record<string, string> = { message: trimmedMessage };

      if (sessionId) {
        payload.session_id = sessionId;
      } else {
        // First message - attach user info if provided
        if (userInfo.name) payload.user_name = userInfo.name;
        if (userInfo.email) payload.user_email = userInfo.email;
        if (userInfo.phone) payload.user_phone = userInfo.phone;
      }

      const data = await apiRequest<ChatResponse>(API_ENDPOINTS.chatbot.chat, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Update session ID if new
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
        storage.set(STORAGE_KEYS.SESSION_ID, data.session_id);
      }

      // Add bot response (sanitize for safe display)
      const botMessage: Message = {
        id: generateMessageId(),
        role: 'bot',
        message: sanitizeBotResponse(data.response),
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Connection error';
      setError(errorMsg);
      
      // Add error message to chat (sanitized)
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'bot',
        message: sanitizeBotResponse("I'm having trouble connecting right now. Please try again or contact us directly at Bijen@lilywhiterealestate.com.au or +600414701721."),
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle clear chat
   */
  const handleClearChat = async () => {
    if (!confirm('Are you sure you want to clear this chat? This cannot be undone.')) {
      return;
    }

    try {
      // Clear backend session if exists
      if (sessionId) {
        await apiRequest(
          `${API_ENDPOINTS.chatbot.clearSession}?session_id=${sessionId}`,
          { method: 'DELETE' }
        );
      }
    } catch (error) {
      console.error('Failed to clear backend session:', error);
    }

    // Clear local state and storage
    setMessages([]);
    setSessionId('');
    setShowIntro(true);
    storage.clear();
  };

  /**
   * Handle refresh/sync
   */
  const handleRefresh = () => {
    if (sessionId) {
      syncWithBackend(sessionId);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <div className={styles.wrapper}>
      {/* Floating Action Button */}
      {!isOpen && (
        <button className={styles.fab} onClick={handleOpen} aria-label="Open chat">
          <MessageSquare size={24} />
          <span className={styles.pulse} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h3>Lily White Real Estate</h3>
              <p>Investment Property Specialist | Online</p>
            </div>
            <div className="flex items-center gap-2">
              {!showIntro && sessionId && (
                <>
                  <button
                    onClick={handleRefresh}
                    aria-label="Refresh chat"
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Sync with server"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button
                    onClick={handleClearChat}
                    aria-label="Clear chat"
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Clear chat history"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
              <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Intro Form or Chat */}
          {showIntro ? (
            <IntroForm onStart={handleStart} />
          ) : (
            <>
              {/* Chat Area */}
              <div className={styles.chatArea} ref={chatAreaRef}>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`${styles.message} ${m.role === 'bot' ? styles.bot : styles.user}`}
                  >
                    <div className="flex flex-col">
                      <div>{m.message}</div>
                      <div className="text-[10px] opacity-60 mt-1">
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className={`${styles.message} ${styles.bot} ${styles.loading}`}>
                    <span /><span /><span />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="text-center text-red-500 text-xs py-2">
                    {error}
                  </div>
                )}
              </div>

              {/* Input Area */}
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
                  <span className="text-[10px] text-gray-400">
                    {input.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
