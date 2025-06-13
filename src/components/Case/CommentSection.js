import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { addComment, getComments, addReaction } from '../../firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import styles from './commentSection.module.css';
import { useRouter } from 'next/router';

// Utility function to process comment text with line breaks and paragraphs
const formatCommentText = (text) => {
  if (!text || typeof text !== 'string') return <p>Not specified</p>;
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  return paragraphs.map((paragraph, index) => (
    <p key={index} className={styles.commentParagraph}>
      {paragraph.split('\n').map((line, i, arr) =>
        i < arr.length - 1 ? (
          <span key={i}>
            {line}
            <br />
          </span>
        ) : (
          line
        )
      )}
    </p>
  ));
};

export default function CommentSection({ caseId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // Track pageview when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: `Comment Section - Case ${caseId}`,
        page_location: window.location.href,
        page_path: router.asPath,
      });
    }
  }, [router.asPath, caseId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(caseId);
        setComments(
          commentsData.map((comment) => ({
            ...comment,
            createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt),
          }))
        );
      } catch (err) {
        setError('Failed to load comments. Please try again.');
        console.error('Fetch comments error:', err);
        if (window.gtag) {
          window.gtag('event', 'fetch_comments_failed', {
            event_category: 'CommentSection',
            event_label: 'Fetch Comments Error',
            value: err.message,
          });
        }
      }
    };
    fetchComments();
  }, [caseId]);

  const handleSubmit = async (e, parentCommentId = null) => {
    e.preventDefault();
    const text = parentCommentId ? replyComment : newComment;
    if (!user) {
      setError('You must be logged in to comment.');
      if (window.gtag) {
        window.gtag('event', 'comment_submit_failed', {
          event_category: 'CommentSection',
          event_label: 'Comment Submission Failed: Not Logged In',
        });
      }
      return;
    }
    if (!text.trim()) {
      setError('Comment cannot be empty.');
      if (window.gtag) {
        window.gtag('event', 'comment_submit_failed', {
          event_category: 'CommentSection',
          event_label: 'Comment Submission Failed: Empty Comment',
        });
      }
      return;
    }
    try {
      await addComment(caseId, {
        text: text.replace(/\n{3,}/g, '\n\n').trimEnd(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '/images/doctor-avatar.jpeg',
        upvotes: 0,
        downvotes: 0,
      }, parentCommentId);
      if (window.gtag) {
        window.gtag('event', parentCommentId ? 'reply_submitted' : 'comment_submitted', {
          event_category: 'CommentSection',
          event_label: parentCommentId ? 'Reply Submitted' : 'Comment Submitted',
          value: caseId,
        });
      }
      if (parentCommentId) {
        setReplyComment('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
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
      console.error('Comment submit error:', err);
      if (window.gtag) {
        window.gtag('event', 'comment_submit_failed', {
          event_category: 'CommentSection',
          event_label: 'Comment Submission Failed: Error',
          value: err.message,
        });
      }
    }
  };

  const handleVote = async (commentId, type) => {
    if (!user) {
      setError('You must be logged in to vote.');
      if (window.gtag) {
        window.gtag('event', 'vote_failed', {
          event_category: 'CommentSection',
          event_label: 'Vote Failed: Not Logged In',
        });
      }
      return;
    }
    try {
      await addReaction(caseId, user.uid, type, commentId);
      if (window.gtag) {
        window.gtag('event', type === 'upvote' ? 'upvote' : 'downvote', {
          event_category: 'CommentSection',
          event_label: `${type.charAt(0).toUpperCase() + type.slice(1)} on Comment`,
          value: commentId,
        });
      }
      const updatedComments = await getComments(caseId);
      setComments(
        updatedComments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt),
        }))
      );
    } catch (err) {
      setError('Failed to record vote. Please try again.');
      console.error('Vote error:', err);
      if (window.gtag) {
        window.gtag('event', 'vote_failed', {
          event_category: 'CommentSection',
          event_label: 'Vote Failed: Error',
          value: err.message,
        });
      }
    }
  };

  const buildCommentTree = (comments) => {
    const commentMap = new Map();
    const tree = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    comments.forEach(comment => {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        tree.push(comment);
      }
    });

    return tree;
  };

  const commentTree = buildCommentTree(comments);

  const renderComment = (comment, depth = 0) => (
    <div key={comment.id} className={`${styles.comment} ${depth > 0 ? styles.reply : ''}`}>
      <Link href={`/profile/view/${comment.userId}`}>
        <Image
          src={comment.userPhoto || '/images/doctor-avatar.jpeg'}
          alt={`${comment.userName} avatar`}
          width={32}
          height={32}
          className={styles.commentAvatar}
          onError={(e) => console.error('Comment image error:', comment.userPhoto)}
        />
      </Link>
      <div className={styles.commentContent}>
        <p className={styles.commentHeader}>
          <Link href={`/profile/view/${comment.userId}`}>
            <strong className={styles.commentAuthor}>{comment.userName}</strong>
          </Link>
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
        <div className={styles.commentText}>{formatCommentText(comment.text)}</div>
        <div className={styles.voteButtons}>
          <button
            onClick={() => handleVote(comment.id, 'upvote')}
            className={styles.voteButton}
            disabled={!user}
          >
            <ThumbsUp size={16} />
            <span className={styles.voteCount}>{comment.upvotes || 0}</span>
          </button>
          <button
            onClick={() => handleVote(comment.id, 'downvote')}
            className={styles.voteButton}
            disabled={!user}
          >
            <ThumbsDown size={16} />
            <span className={styles.voteCount}>{comment.downvotes || 0}</span>
          </button>
        </div>
        <button
          onClick={() => {
            const newReplyingTo = replyingTo === comment.id ? null : comment.id;
            setReplyingTo(newReplyingTo);
            if (window.gtag) {
              window.gtag('event', 'reply_toggle', {
                event_category: 'CommentSection',
                event_label: newReplyingTo ? 'Reply Form Opened' : 'Reply Form Closed',
                value: comment.id,
              });
            }
          }}
          className={styles.replyButton}
        >
          {replyingTo === comment.id ? 'Cancel' : 'Reply'}
        </button>
        {replyingTo === comment.id && (
          <form onSubmit={(e) => handleSubmit(e, comment.id)} className={styles.replyForm}>
            <div className={styles.inputGroup}>
              {user && (
                <Image
                  src={user.photoURL || '/images/doctor-avatar.jpeg'}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className={styles.avatar}
                />
              )}
              <textarea
                placeholder="Add a reply..."
                value={replyComment}
                onChange={(e) => setReplyComment(e.target.value)}
                className={styles.textarea}
                disabled={!user}
                required
              />
            </div>
            <button
              type="submit"
              disabled={!user || !replyComment.trim()}
              className={styles.submitButton}
            >
              Post Reply
            </button>
          </form>
        )}
        {comment.replies.length > 0 && (
          <div className={styles.replies}>
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className={styles.commentSection}>
      <h2>Discussion</h2>
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.inputGroup}>
          {user && (
            <Image
              src={user.photoURL || '/images/doctor-avatar.jpeg'}
              alt="User avatar"
              width={40}
              height={40}
              className={styles.avatar}
            />
          )}
          <textarea
            placeholder={user ? 'Add a comment...' : 'Please log in to comment'}
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              if (window.gtag) {
                window.gtag('event', 'comment_text_updated', {
                  event_category: 'CommentSection',
                  event_label: 'Comment Text Updated',
                });
              }
            }}
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
        {error && (
          <p className={styles.error}>
            {error}
            {window.gtag &&
              window.gtag('event', 'error_displayed', {
                event_category: 'CommentSection',
                event_label: 'Error Displayed',
                value: error,
              })}
          </p>
        )}
      </form>
      <div className={styles.comments}>
        {commentTree.length > 0 ? (
          commentTree.map(comment => renderComment(comment))
        ) : (
          <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </section>
  );
}