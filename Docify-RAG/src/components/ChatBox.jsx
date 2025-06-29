import { useState } from 'react';

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      const botResponse = data.response || data.error || 'Something went wrong.';

      setChatLog((prev) => [...prev, { user: query, bot: botResponse }]);
      setQuery('');
    } catch (error) {
      setChatLog((prev) => [...prev, { user: query, bot: 'Error connecting to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-xl">
      {/* Chat Log */}
      <div className="border p-4 h-72 overflow-y-scroll bg-gray-50 rounded-xl space-y-4">
        {chatLog.map((entry, idx) => (
          <div key={idx} className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>You:</strong> <span>{entry.user}</span>
            </div>
            <div className="text-sm text-gray-900 font-medium bg-indigo-100 p-2 rounded-lg">
              <strong>Bot:</strong> <span>{entry.bot}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center mt-4 text-gray-500">
            <em>Bot is typing...</em>
          </div>
        )}
      </div>

      {/* User Input and Send Button */}
      <div className="flex gap-2 items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
