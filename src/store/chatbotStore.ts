/**
 * Chatbot Zustand Store
 * =====================
 * Replaces raw localStorage polling with a single reactive store.
 * All state is persisted to localStorage automatically via the
 * persist middleware — no manual get/set calls needed in components.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ------------------------------------------------------------------ //
// Types
// ------------------------------------------------------------------ //

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  message: string;
  timestamp: string;
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

interface ChatbotState {
  // UI state
  isOpen:    boolean;
  showIntro: boolean;

  // Session
  sessionId: string;
  userInfo:  UserInfo;

  // Messages
  messages:  ChatMessage[];
  isLoading: boolean;
  error:     string;

  // Actions
  open:          () => void;
  close:         () => void;
  setShowIntro:  (v: boolean) => void;
  setSessionId:  (id: string) => void;
  setUserInfo:   (info: UserInfo) => void;
  addMessage:    (msg: ChatMessage) => void;
  setMessages:   (msgs: ChatMessage[]) => void;
  setLoading:    (v: boolean) => void;
  setError:      (e: string) => void;
  clearSession:  () => void;
}

// ------------------------------------------------------------------ //
// Store
// ------------------------------------------------------------------ //

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOpen:    false,
      showIntro: true,
      sessionId: '',
      userInfo:  { name: '', email: '', phone: '' },
      messages:  [],
      isLoading: false,
      error:     '',

      // Actions
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      setShowIntro: (v) => set({ showIntro: v }),
      setSessionId: (id) => set({ sessionId: id }),
      setUserInfo:  (info) => set({ userInfo: info }),

      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),

      setMessages: (msgs) => set({ messages: msgs }),

      setLoading: (v) => set({ isLoading: v }),
      setError:   (e) => set({ error: e }),

      clearSession: () =>
        set({
          sessionId: '',
          messages:  [],
          showIntro: true,
          userInfo:  { name: '', email: '', phone: '' },
          error:     '',
        }),
    }),
    {
      name:    'chatbot-state',
      storage: createJSONStorage(() => localStorage),
      // Only persist these keys — isOpen and isLoading are transient
      partialize: (state) => ({
        sessionId: state.sessionId,
        userInfo:  state.userInfo,
        messages:  state.messages,
        showIntro: state.showIntro,
      }),
    }
  )
);
