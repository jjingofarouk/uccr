import { useState } from 'react';
import { useCases } from '../../hooks/useCases';
import CommentSection from './CommentSection';

import { useAuth } from '../../hooks/useAuth';
import { addReaction } from '../../firebase/firestore';

export default function CaseDetail({ caseData }) {
  const { user } = useAuth();
  const [reaction, setReaction] = useState(null);

  const handleReaction = async (type) => {
    if (!user) return;
    await addReaction(caseData.id, user.uid, type);
    setReaction(type);
  };

  return (
    <div className="case-detail">
      <h2>{caseData.title}</h2>
      <p><strong>Complaint:</strong> {caseData.presentingComplaint}</p>
      <p><strong>History:</strong> {caseData.history}</p>
      <p><strong>Investigations:</strong> {caseData.investigations}</p>
      <p><strong>Management:</strong> {caseData.management}</p>
      {caseData.imageUrl && <img src={caseData.imageUrl} alt="Case Image" />}
      <div className="reactions">
        <button onClick={() => handleReaction('Like')} disabled={reaction === 'Like'}>Like</button>
        <button onClick={() => handleReaction('Insightful')} disabled={reaction === 'Insightful'}>Insightful</button>
        <button onClick={() => handleReaction('Dislike')} disabled={reaction === 'Dislike'}>Dislike</button>
      </div>
      <CommentSection caseId={caseData.id} />
    </div>
  );
}
