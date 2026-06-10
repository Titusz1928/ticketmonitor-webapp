import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// 1. Definim "rețeta" (tipul) pentru un mesaj ca să nu mai dea eroare TypeScript
interface Message {
  role: string;
  text: string;
}

function Chat() {
  // 2. Acum îi spunem lui React clar că acest array va conține obiecte de tip Message
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    // A. Adaugă întrebarea utilizatorului
    const userMessage: Message = { role: "user", text: inputText };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    
    setInputText(""); 
    setIsLoading(true);

    try {
      // B. Trimite întrebarea către backend
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: userMessage.text,  
        conversation_id: 1,       
        user_id: 1                
      });

      // C. Preia răspunsul 
      const aiMessage: Message = { role: "ai", text: response.data.natural_response };
      setMessages([...newHistory, aiMessage]);

    } catch (error) {
      console.error("Eroare la trimiterea mesajului:", error);
      const errorMessage: Message = { role: "ai", text: "Eroare: Nu m-am putut conecta la server." };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg" 
          alt="Nokia Logo" 
          style={{ height: '20px', width: 'auto', fill: 'var(--text-title)' }} 
        />
        <h2 style={{ margin: 0, borderLeft: '1px solid var(--text-muted)', paddingLeft: '12px' }}>
          Asistent Ticketing
        </h2>
      </header>
      
      <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'var(--bg-card)'
      }}>
        {messages.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
            Scrie un mesaj pentru a începe...
          </p>
        ) : (
          messages.map((msg, index) => {
            // Extragem condițiile de stilizare aici pentru a evita erorile de parsare JSX
            const isUser = msg.role === 'user';
            const bubbleStyle = isUser 
              ? { backgroundColor: 'var(--blue-primary)', color: '#ffffff', borderBottomRightRadius: '4px' }
              : { backgroundColor: 'var(--bg-input)', color: 'var(--text-normal)', border: 'var(--border-control)', borderBottomLeftRadius: '4px' };

            return (
              <div key={index} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    maxWidth: '75%',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    boxShadow: 'var(--shadow-blue)',
                    ...bubbleStyle
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        {isLoading && (
          <div style={{ textAlign: 'left', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', fontSize: '13px' }}>
            Asistentul procesează...
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          placeholder="Întreabă-mă despre tichete..."
        />
        <button 
          className="counter"
          onClick={handleSendMessage}
          disabled={isLoading}
          style={{ 
            margin: 0, 
            opacity: isLoading ? 0.6 : 1, 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            border: 'none' 
          }}
        >
          Trimite
        </button>
      </div>
    </div>
  );
}

export default Chat;