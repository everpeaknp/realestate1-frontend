'use client';

import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Realtor Pal assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { text: userMessage, isBot: false }]);
    setInput('');

    // Simple bot logic - in a real app, this would hit an LLM
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "That sounds interesting! Please leave your email and I'll have one of our agents contact you with more details.", 
        isBot: true 
      }]);
    }, 1000);

    // Save as lead if it looks like an inquiry
    if (userMessage.toLowerCase().includes('buy') || userMessage.toLowerCase().includes('price')) {
        // Silent background lead creation
        fetch('http://localhost:5001/api/v1/leads/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Chat User',
                email: 'chat@incomplete.com',
                message: `User Interest: ${userMessage}`,
                source: 'chatbot',
                type: 'contact'
            }),
        });
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
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          <div className={styles.chatArea}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.message} ${m.isBot ? styles.bot : styles.user}`}>
                {m.text}
              </div>
            ))}
          </div>

          <form className={styles.inputArea} onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
}
