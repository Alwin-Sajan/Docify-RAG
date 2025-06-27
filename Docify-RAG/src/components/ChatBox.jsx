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
    <div className="space-y-4">
      <div className="border p-4 h-64 overflow-y-scroll bg-gray-100">
        {chatLog.map((entry, idx) => (
          <div key={idx} className="mb-2">
            <p><strong>You:</strong> {entry.user}</p>
            <p><strong>Bot:</strong> {entry.bot}</p>
          </div>
        ))}
        {loading && <p><em>Bot is typing...</em></p>}
      </div>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2"
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
