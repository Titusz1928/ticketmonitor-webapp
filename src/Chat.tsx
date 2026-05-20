import React, { useState } from 'react';
import axios from 'axios';

function Chat() {
  // 1. Memoria componentei
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. Funcția care se rulează când apeși butonul "Trimite"
  const handleSendMessage = async () => {
    // Dacă input-ul e gol, nu face nimic
    if (inputText.trim() === "") return;

    // A. Adaugă întrebarea utilizatorului pe ecran instantaneu
    const userMessage = { role: "user", text: inputText };
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
        user_id: 1                
      });

      // C. Preia răspunsul de la Python și afișează-l pe ecran
      const aiMessage = { role: "ai", text: response.data.natural_response };
      setMessages([...newHistory, aiMessage]);

    } catch (error) {
      console.error("Eroare la trimiterea mesajului:", error);
      const errorMessage = { role: "ai", text: "Eroare: Nu m-am putut conecta la server." };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Desenarea interfeței (Interfața de Chat)
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
                  backgroundColor: msg.role === 'user' ? '#005aff' : '#e0e0e0',
                  color: msg.role === 'user' ? 'white' : 'black',
                  maxWidth: '70%'
              }}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {isLoading && <div style={{ textAlign: 'left', color: '#888' }}>Asistentul se gândește...</div>}
      </div>

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