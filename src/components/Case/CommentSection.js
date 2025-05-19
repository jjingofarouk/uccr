// components/Case/CommentSection.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { addComment, getComments } from '../../firebase/firestore';
import Image from 'next/image';
import styles from './commentSection.module.css';

export default function CommentSection({ caseId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments(caseId);
      setComments(
        commentsData.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt),
        }))
      );
    };
    fetchComments();
  }, [caseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    try {
      await addComment(caseId, {
        text: newComment,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '/default-avatar.png',
        createdAt: new Date(),
      });
      setNewComment('');
      setError('');
      const updatedComments = await getComments(caseId);
      setComments(
        updatedComments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt),
        }))
      );
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    }
  };

  return (
    <section className={styles.commentSection}>
      <h2>Discussion</h2>
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.inputGroup}>
          {user && (
            <Image
              src={user.photoURL || '/default-avatar.png'}
              alt="User avatar"
              width={40}
              height={40}
              className={styles.avatar}
            />
          )}
          <textarea
            placeholder={user ? 'Add a comment...' : 'Please log in to comment'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.textarea}
            disabled={!user}
            required
          />
        </div>
        <button
          type="submit"
          disabled={!user || !newComment.trim()}
          className={styles.submitButton}
        >
          Post Comment
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <div className={styles.comments}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <Image
                src={comment.userPhoto || '/default-avatar.png'}
                alt={`${comment.userName} avatar`}
                width={32}
                height={32}
                className={styles.commentAvatar}
              />
              <div className={styles.commentContent}>
                <p className={styles.commentHeader}>
                  <strong>{comment.userName}</strong>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
                <p className={styles.commentText}>{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </section>
  );
}