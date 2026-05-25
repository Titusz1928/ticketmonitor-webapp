import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Încarcă istoricul la deschiderea aplicației
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/history/1');
        const history = response.data.map((msg: { role: string, text: string }) => ({
          role: msg.role === 'user' ? 'user' : 'ai',
          text: msg.text
        }));
        setMessages(history);
      } catch (error) {
        console.error("Nu s-a putut încărca istoricul:", error);
      }
    };
    loadHistory();
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = { role: "user", text: inputText };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: userMessage.text,
        conversation_id: 1,
        user_id: 1
      });

      const aiMessage = { role: "ai", text: response.data.natural_response };
      setMessages([...newHistory, aiMessage]);

    } catch (error) {
      console.error("Eroare la trimiterea mesajului:", error);
      const errorMessage = { role: "error", text: "Eroare: Nu m-am putut conecta la server." };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Asistent Ticketing Nokia</h2>
      
      <div style={{ 
          border: '1px solid #ccc', 
          height: '400px', 
          overflowY: 'scroll', 
          padding: '20px',
          marginBottom: '10px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Scrie un mesaj pentru a începe...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ 
                textAlign: msg.role === 'user' ? 'right' : 'left', 
                marginBottom: '15px' 
            }}>
              <div style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  backgroundColor: msg.role === 'user' ? '#005aff' : msg.role === 'error' ? '#ff4444' : '#e0e0e0',
                  color: msg.role === 'user' || msg.role === 'error' ? 'white' : 'black',
                  maxWidth: '70%'
              }}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ textAlign: 'left', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px', height: '16px',
              border: '2px solid #ccc',
              borderTop: '2px solid #005aff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}/>
            Asistentul se gândește...
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          placeholder="Întreabă-mă despre tichete..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading}
          style={{ 
              padding: '10px 20px', 
              backgroundColor: isLoading ? '#ccc' : '#005aff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Trimite
        </button>
      </div>
    </div>
  );
}

export default Chat;