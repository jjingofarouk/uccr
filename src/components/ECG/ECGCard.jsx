import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, Clock, Heart } from 'lucide-react';
import styles from './ECGCard.module.css';

const ECGCard = ({ ecg }) => {
    // Handle both static and firebase data
    const title = ecg.title || 'Untitled ECG';
    const category = ecg.category || 'General';
    const imageUrl = ecg.mediaUrls?.[0] || ecg.imageUrl || '/images/ecg-placeholder.jpg';
    const description = ecg.clinicalContext || ecg.description || 'No clinical context provided.';
    const rate = ecg.rate || 'N/A';
    const interpret = ecg.interpretation || ecg.diagnosis || 'Pending interpretation';

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={imageUrl} alt={title} className={styles.image} />
                <div className={styles.categoryBadge}>{category}</div>
            </div>

            <div className={styles.content}>
                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <Activity size={14} />
                        <span>{rate} bpm</span>
                    </div>
                </div>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>

                <div className={styles.diagnosisPreview}>
                    <strong>Interpretation:</strong>
                    <p>{interpret}</p>
                </div>

                <div className={styles.footer}>
                    <Link href={`/ecg-learning/${ecg.id}`} className={styles.analyzeLink}>
                        Detailed Analysis
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ECGCard;
