import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getMessages } from '../../firebase/firestore';
import Link from 'next/link';
import styles from '../../styles/globals.css';

export default function Inbox() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchThreads = async () => {
      const messages = await getMessages(user.uid);
      setThreads(messages);
    };
    fetchThreads();
  }, [user]);

  return (
    <div className="inbox">
      <h2>Inbox</h2>
      {threads.length === 0 ? (
        <p>No messages</p>
      ) : (
        threads.map((thread) => (
          <Link key={thread.id} href={`/inbox/${thread.id}`}>
            <div className="thread">
              <p>{thread.otherUserName}</p>
              <small>{thread.lastMessage}</small>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
