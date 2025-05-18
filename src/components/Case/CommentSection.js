import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { addComment, getComments } from '../../firebase/firestore';
import styles from './commentSection.module.css'

export default function CommentSection({ caseId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments(caseId);
      setComments(commentsData);
    };
    fetchComments();
  }, [caseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addComment(caseId, {
        text: newComment,
        userId: user.uid,
        userName: user.displayName,
        createdAt: new Date(),
      });
      setNewComment('');
      const updatedComments = await getComments(caseId);
      setComments(updatedComments);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="comment-section">
      <h3>Discussion</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit" disabled={!user}>Post Comment</button>
        {error && <p className="error">{error}</p>}
      </form>
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.userName}</strong>: {comment.text}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
