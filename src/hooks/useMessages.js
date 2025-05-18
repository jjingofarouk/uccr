import { useState, useEffect } from 'react';
import { getMessages } from '../firebase/firestore';

export const useMessages = (userId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const fetchMessages = async () => {
      const messagesData = await getMessages(userId);
      setMessages(messagesData);
    };
    fetchMessages();
  }, [userId]);

  return messages;
};
