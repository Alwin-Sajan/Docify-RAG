import { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import ChatBox from './components/ChatBox.jsx';

function App() {
  const [chatReady, setChatReady] = useState(false);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">📄 RAG Chat with PDF</h1>
      {!chatReady ? (
        <FileUpload onUploadComplete={() => setChatReady(true)} />
      ) : (
        <ChatBox />
      )}
    </div>
  );
}

export default App;
