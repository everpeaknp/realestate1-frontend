'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
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

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your Realtor Pal assistant powered by AI. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
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
      // Call the NLTK-powered chatbot API
      const data = await apiRequest<ChatResponse>(API_ENDPOINTS.chatbot.chat, {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId || undefined
        }),
      });
      
      // Save session ID for conversation continuity
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

      // Add bot response
      setMessages(prev => [
        ...prev,
        { 
          text: data.response, 
          isBot: true,
          intent: data.intent,
          confidence: data.confidence
        }
      ]);

      // Save as lead if it's a property search or contact intent
      if (data.intent === 'property_search' || data.intent === 'contact' || data.intent === 'schedule_viewing') {
        // Silent background lead creation
        apiRequest(API_ENDPOINTS.leads.contact, {
          method: 'POST',
          body: JSON.stringify({
            name: 'Chat User',
            email: 'chat@user.com',
            message: `Chat Inquiry (${data.intent}): ${userMessage}`,
            source: 'chatbot',
            type: 'contact'
          }),
        }).catch(() => {
          // Silently fail - don't interrupt user experience
        });
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [
        ...prev,
        { 
          text: "I apologize, but I'm having trouble connecting right now. Please try again or contact us directly.", 
          isBot: true 
        }
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
                {m.text}
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
