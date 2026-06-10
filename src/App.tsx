import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Asigură-te că fișierul tău CSS este importat aici

// 1. Definim tipul pentru un mesaj
interface Message {
  role: string;
  text: string;
}

function Chat() {
  // 2. Memoria componentei
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 3. Funcția care se rulează când apeși butonul "Trimite"
  const handleSendMessage = async () => {
    // Dacă input-ul e gol, nu face nimic
    if (inputText.trim() === "") return;

    // A. Adaugă întrebarea utilizatorului pe ecran instantaneu
    const userMessage: Message = { role: "user", text: inputText };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    
    // Golește căsuța de text și pornește animația de încărcare
    setInputText(""); 
    setIsLoading(true);

    try {
      // B. Trimite întrebarea către backend prin POST
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: userMessage.text,  
        conversation_id: 1,       
        user_id: 1,         
        ticket_id: "1"       
      });

      // C. Preia răspunsul de la Python și afișează-l pe ecran
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

  // 4. Desenarea interfeței (Interfața de Chat)
  return (
    <div className="chat-container">
      {/* Header cu tematică corporate și Logo */}
      <header className="chat-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: 'var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Nokia_2023.svg" 
          alt="Nokia 2023 Logo" 
          style={{ height: '30px', width: 'auto' }} // Logo-ul este acum vizibil și dimensionat corect
        />
        <h2 style={{ margin: 0, fontFamily: 'var(--font-title)', color: 'var(--text-title)', paddingLeft: '12px' }}>
          Asistent Ticketing
        </h2>
      </header>
      
      {/* Zona principală de mesaje */}
      <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px'
      }}>
        {messages.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
            Scrie un mesaj pentru a începe...
          </p>
        ) : (
          messages.map((msg, index) => {
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

      {/* Zona de Input stilizată conform CSS-ului */}
      <div className="chat-input-area" style={{ marginTop: '16px', paddingTop: '16px', borderTop: 'var(--border-subtle)' }}>
        <input 
          type="text" 
          className="chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          placeholder="Întreabă-mă despre tichete..."
          style={{ padding: '12px', borderRadius: '6px' }}
        />
        <button 
          className="counter"
          onClick={handleSendMessage}
          disabled={isLoading}
          style={{ 
            margin: 0, 
            opacity: isLoading ? 0.6 : 1, 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px'
          }}
        >
          Trimite
        </button>
      </div>
    </div>
  );
}

export default Chat;