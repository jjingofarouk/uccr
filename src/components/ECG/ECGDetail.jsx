import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Activity,
    Clock,
    Brain,
    Eye,
    CheckCircle2,
    Info,
    Stethoscope,
    Heart
} from 'lucide-react';
import CommentSection from '../Case/CommentSection';
import styles from './ECGDetail.module.css';

const ECGDetail = ({ ecg }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    if (!ecg) return <div className={styles.loading}>Loading ECG case...</div>;

    const imageUrl = ecg.mediaUrls?.[0] || ecg.imageUrl || '/images/ecg-placeholder.jpg';

    return (
        <div className={styles.detailContainer}>
            <header className={styles.topBar}>
                <Link href="/ecg-learning" className={styles.backButton}>
                    <ArrowLeft size={20} /> Back to Library
                </Link>
                <div className={styles.caseBadge}>{ecg.category}</div>
            </header>

            <div className={styles.contentGrid}>
                <div className={styles.mediaSide}>
                    <div className={styles.imageCard}>
                        <img src={imageUrl} alt={ecg.title} className={styles.ecgImage} />
                    </div>
                </div>

                <div className={styles.infoSide}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{ecg.title}</h1>
                        <div className={styles.clinicalContext}>
                            <div className={styles.sectionHeader}>
                                <Stethoscope size={20} />
                                <h3>Clinical Context</h3>
                            </div>
                            <p>{ecg.clinicalContext || ecg.description}</p>
                        </div>
                    </div>

                    <div className={styles.vitalsGrid}>
                        <div className={styles.vitalItem}>
                            <Activity size={18} />
                            <div>
                                <label>Rate</label>
                                <span>{ecg.rate || 'N/A'} bpm</span>
                            </div>
                        </div>
                        <div className={styles.vitalItem}>
                            <Heart size={18} />
                            <div>
                                <label>Rhythm</label>
                                <span>{ecg.rhythm || 'N/A'}</span>
                            </div>
                        </div>
                        <div className={styles.vitalItem}>
                            <Clock size={18} />
                            <div>
                                <label>QTc</label>
                                <span>{ecg.qtInterval || 'N/A'} ms</span>
                            </div>
                        </div>
                    </div>

                    {!isRevealed ? (
                        <div className={styles.revealOverlay}>
                            <p>Challenge yourself before seeing the diagnosis.</p>
                            <button className={styles.revealButton} onClick={() => setIsRevealed(true)}>
                                <Eye size={20} />
                                Reveal Expert Interpretation
                            </button>
                        </div>
                    ) : (
                        <div className={styles.revealedContent}>
                            <div className={styles.interpretationCard}>
                                <div className={styles.cardHeader}>
                                    <Brain size={20} />
                                    <h3>Findings & Interpretation</h3>
                                </div>
                                <div className={styles.findingsGrid}>
                                    <div className={styles.findingItem}>
                                        <label>Cardiac Axis</label>
                                        <p>{ecg.axis || 'N/A'}</p>
                                    </div>
                                    <div className={styles.findingItem}>
                                        <label>P Wave</label>
                                        <p>{ecg.pWave || 'N/A'}</p>
                                    </div>
                                    <div className={styles.findingItem}>
                                        <label>PR Interval</label>
                                        <p>{ecg.prInterval || 'N/A'}</p>
                                    </div>
                                    <div className={styles.findingItem}>
                                        <label>QRS Complex</label>
                                        <p>{ecg.qrsComplex || 'N/A'}</p>
                                    </div>
                                    <div className={styles.findingItem}>
                                        <label>ST Segment</label>
                                        <p>{ecg.stSegment || 'N/A'}</p>
                                    </div>
                                    <div className={styles.findingItem}>
                                        <label>T Wave</label>
                                        <p>{ecg.tWave || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className={styles.finalDiagnosis}>
                                    <label>Diagnosis</label>
                                    <p className={styles.diagnosisText}>{ecg.interpretation || ecg.diagnosis}</p>
                                </div>
                            </div>

                            <div className={styles.teachingCard}>
                                <div className={styles.cardHeader}>
                                    <Info size={20} />
                                    <h3>Educational Takeaways</h3>
                                </div>
                                <div className={styles.teachingText}>
                                    {ecg.teachingPoints || (ecg.learningPoints && (
                                        <ul className={styles.bulletList}>
                                            {ecg.learningPoints.map((p, i) => <li key={i}>{p}</li>)}
                                        </ul>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.commentsWrap}>
                        <div className={styles.sectionHeader}>
                            <Activity size={20} />
                            <h3>Case Discussion</h3>
                        </div>
                        <CommentSection caseId={ecg.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ECGDetail;
