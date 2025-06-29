import { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import ChatBox from './components/ChatBox.jsx';
import { HiMenuAlt3 } from 'react-icons/hi';

function App() {
  const [chatReady, setChatReady] = useState(false);

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl space-y-6">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600">
          <a href="/">Docify</a>
        </h1>
        <p className="text-xl text-center text-gray-600">
          Upload a PDF file to start chatting with its content.
        </p>

        {/* Content Container */}
        <div className="mt-8">
          {!chatReady ? (
            <FileUpload
              onUploadComplete={() => setChatReady(true)}
              className="border border-gray-300 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gray-50"
            />
          ) : (
            <ChatBox className="border border-gray-300 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gray-50" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
