import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SUGGESTIONS = [
  "Care sunt ultimele 5 tichete deschise?",
  "Cate tickete sunt cu prioritate Critical?",
  "Care este echipa cu cele mai multe tichete?",
  "Cate tickete nu sunt rezolvate?",
  "Cate tichete a rezolvat fiecare echipa?",
];

interface Message {
  role: string;
  text: string;
  timestamp: Date;
  isWelcome?: boolean;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Astăzi';
  if (date.toDateString() === yesterday.toDateString()) return 'Ieri';
  return date.toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' });
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Bună dimineața';
  if (hour >= 12 && hour < 18) return 'Bună ziua';
  return 'Bună seara';
};

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      role: 'ai',
      text: `${getGreeting()}! Sunt asistentul de ticketing Nokia. Cu ce vă pot ajuta?`,
      timestamp: new Date(),
      isWelcome: true,
    };

    const loadHistory = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/history/1');
        const history = response.data.map((msg: { role: string, text: string, timestamp: string }) => ({
          role: msg.role === 'user' ? 'user' : 'ai',
          text: msg.text,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        }));
        if (history.length > 0) {
          setMessages([...history, welcomeMessage]);
        } else {
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Nu s-a putut încărca istoricul:", error);
        setMessages([welcomeMessage]);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const el = chatWindowRef.current;
    if (!el) return;
    const handleScroll = () => {
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
      setShowScrollBtn(!isNearBottom);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sendMessage = async (text: string) => {
    if (text.trim() === "" || isLoading) return;

    const userMessage: Message = { role: "user", text, timestamp: new Date() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: text,
        conversation_id: 1,
        user_id: 1
      });
      const aiMessage: Message = {
        role: "ai",
        text: response.data.natural_response,
        timestamp: new Date(),
      };
      setMessages([...newHistory, aiMessage]);
    } catch (error) {
      console.error("Eroare:", error);
      const errorMessage: Message = {
        role: "error",
        text: "Eroare: Nu m-am putut conecta la server.",
        timestamp: new Date(),
      };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => sendMessage(inputText);

  const handleSuggestionClick = (suggestion: string) => {
    setShowSuggestions(false);
    sendMessage(suggestion);
  };

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700&family=Sora:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-message { animation: messageIn 0.2s ease; }

        .chat-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background-color: #f0f5ff;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          color: #334155;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .chat-input:focus { border-color: rgba(37, 99, 235, 0.4); }
        .chat-input::placeholder { color: #94a3b8; }

        .chat-send-btn {
          padding: 10px 20px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.5px;
          transition: background-color 0.15s ease;
        }
        .chat-send-btn:hover:not(:disabled) { background-color: #4f86f7; }
        .chat-send-btn:disabled { background-color: rgba(37, 99, 235, 0.4); cursor: not-allowed; }

        .suggestions-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(37, 99, 235, 0.2);
          background-color: rgba(37, 99, 235, 0.06);
          color: #2563eb;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .suggestions-btn:hover { background-color: rgba(37, 99, 235, 0.12); border-color: #2563eb; }
        .suggestions-btn.active { background-color: #2563eb; color: white; border-color: #2563eb; }

        .suggestions-popover {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          background: #ffffff;
          border: 1px solid rgba(37, 99, 235, 0.1);
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(37, 99, 235, 0.1);
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 280px;
          animation: fadeIn 0.15s ease;
          z-index: 10;
        }

        .suggestion-item {
          padding: 8px 12px;
          border-radius: 6px;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: #334155;
          transition: background-color 0.1s ease;
        }
        .suggestion-item:hover { background-color: rgba(37, 99, 235, 0.06); color: #2563eb; }

        .date-separator {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 4px 0;
        }
        .date-separator::before,
        .date-separator::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(37, 99, 235, 0.08);
        }

        .scroll-to-bottom-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(37, 99, 235, 0.15);
          background-color: #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
          color: #2563eb;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.15s ease;
          animation: fadeInUp 0.2s ease;
          z-index: 5;
        }
        .scroll-to-bottom-btn:hover { background-color: #2563eb; color: white; border-color: #2563eb; }

        .chat-window::-webkit-scrollbar { width: 6px; }
        .chat-window::-webkit-scrollbar-track { background: transparent; }
        .chat-window::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.2); border-radius: 3px; }
        .chat-window::-webkit-scrollbar-thumb:hover { background: rgba(37, 99, 235, 0.4); }
      `}</style>

      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        fontFamily: "'Sora', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          color: '#0b1d4f',
          fontSize: '20px',
          margin: 0,
          letterSpacing: '-0.3px',
          fontWeight: 700,
        }}>
          Asistent Ticketing Nokia
        </h2>

        <div style={{ position: 'relative' }}>
          <div ref={chatWindowRef} className="chat-window" style={{
            border: '1px solid rgba(37, 99, 235, 0.1)',
            height: '420px',
            overflowY: 'scroll',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 12px rgba(37, 99, 235, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {messages.map((msg, index) => {
              const prevMsg = messages[index - 1];
              const showDateSeparator = !msg.isWelcome && (!prevMsg || !isSameDay(prevMsg.timestamp, msg.timestamp));

              return (
                <div key={index} className="chat-message">
                  {showDateSeparator && (
                    <div className="date-separator">
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: '#94a3b8',
                        letterSpacing: '0.5px',
                      }}>
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '3px',
                  }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      backgroundColor:
                        msg.role === 'user' ? '#2563eb' :
                        msg.role === 'error' ? 'rgba(220, 38, 38, 0.08)' :
                        '#f0f5ff',
                      color:
                        msg.role === 'user' ? '#ffffff' :
                        msg.role === 'error' ? '#dc2626' :
                        '#334155',
                      border:
                        msg.role === 'error' ? '1px solid rgba(220, 38, 38, 0.2)' :
                        msg.role === 'ai' ? '1px solid rgba(56, 189, 248, 0.3)' :
                        'none',
                      borderLeft:
                        msg.role === 'ai' ? '3px solid #38bdf8' : undefined,
                      maxWidth: '75%',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      fontFamily: "'Sora', sans-serif",
                    }}>
                      {msg.text}
                    </div>

                    {!msg.isWelcome && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: '#94a3b8',
                      }}>
                        {formatTime(msg.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#94a3b8',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
              }}>
                <div style={{
                  width: '14px', height: '14px',
                  border: '2px solid #e2e8f0',
                  borderTop: '2px solid #2563eb',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  flexShrink: 0,
                }}/>
                SE PROCESEAZĂ...
              </div>
            )}
          </div>

          {showScrollBtn && (
            <button className="scroll-to-bottom-btn" onClick={scrollToBottom}>
              ↓
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', position: 'relative', alignItems: 'center' }}>
          <input
            type="text"
            className="chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' ? handleSendMessage() : null}
            placeholder="Întreabă despre tichete..."
          />

          <div ref={suggestionsRef} style={{ position: 'relative' }}>
            <button
              className={`suggestions-btn ${showSuggestions ? 'active' : ''}`}
              onClick={() => setShowSuggestions(!showSuggestions)}
              title="Sugestii"
            >
              ✦
            </button>

            {showSuggestions && (
              <div className="suggestions-popover">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            TRIMITE
          </button>
        </div>

      </div>
    </>
  );
}

export default Chat;