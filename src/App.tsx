import React from 'react';
import Chat from './Chat'; // Asigură-te că importi componenta de chat creată

function App() {
  return (
    <div style={{ padding: '20px' }}>
      {/* Aici poți lăsa restul paginii (header-ul etc.), dar în loc de testul vechi, pui Chat-ul */}
      <Chat />
    </div>
  );
}

export default App;