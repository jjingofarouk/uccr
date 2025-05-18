import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { sendMessage, getMessages } from '../../firebase/firestore';

export default function MessageThread({ threadId, otherUserName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const threadMessages = await getMessages(threadId);
      setMessages(threadMessages);
    };
    fetchMessages();
  }, [threadId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!user || !newMessage) return;
    try {
      await sendMessage(threadId, user.uid, newMessage);
      setNewMessage('');
      const updatedMessages = await getMessages(threadId);
      setMessages(updatedMessages);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="message-thread">
      <h3>Chat with {otherUserName}</h3>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
            <p>{msg.text}</p>
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
