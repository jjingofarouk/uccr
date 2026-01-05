import React, { useState } from 'react';
import Link from 'next/link';
import ECGCard from './ECGCard';
import styles from './ECGSystem.module.css';
import { Search, Plus, Sparkles, Filter, Database } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useECGs } from '../../hooks/useECGs';

const ECGSystem = () => {
    const { user } = useAuth();
    const { ecgs, loading } = useECGs();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Ischemia', 'Arrhythmia', 'Metabolic', 'Pre-excitation', 'Conduction'];

    const filteredECGs = ecgs.filter(ecg => {
        const matchesFilter = filter === 'All' || ecg.category === filter;
        const matchesSearch = (ecg.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ecg.interpretation || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className={styles.container}>
            <header className={styles.headerSection}>
                <div className={styles.headerContent}>
                    <div className={styles.badge}>
                        <Sparkles size={14} />
                        <span>Advanced Interpretation Hub</span>
                    </div>
                    <h1 className={styles.title}>ECG Masterclass</h1>
                    <p className={styles.subtitle}>
                        A community-driven platform for mastering electrocardiography. Learn from high-yield clinical cases and expert interpretations.
                    </p>

                    <div className={styles.actionGroup}>
                        <Link href={user ? "/ecg-learning/new" : "/auth"} style={{ textDecoration: 'none' }}>
                            <button className={styles.primaryAction}>
                                <Plus size={20} />
                                {user ? 'Post New ECG Case' : 'Sign In to Post Case'}
                            </button>
                        </Link>
                    </div>
                </div>

                <div className={styles.statsBar}>
                    <div className={styles.statItem}>
                        <Database size={18} />
                        <span><strong>{ecgs.length}</strong> Cases Available</span>
                    </div>
                </div>
            </header>

            <div className={styles.mainContent}>
                <div className={styles.controls}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search by diagnosis, findings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterWrapper}>
                        <Filter size={16} className={styles.filterIcon} />
                        <div className={styles.filters}>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`${styles.filterButton} ${filter === cat ? styles.activeFilter : ''}`}
                                    onClick={() => setFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className={styles.skeletonCard} />
                        ))
                    ) : filteredECGs.length > 0 ? (
                        filteredECGs.map((ecg) => (
                            <ECGCard key={ecg.id} ecg={ecg} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}><Activity size={48} /></div>
                            <h3>No Cases Yet</h3>
                            <p>Be the first to contribute an interesting ECG case to the community.</p>
                            {user && (
                                <Link href="/ecg-learning/new">
                                    <button className={styles.emptyButton}>Get Started</button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ECGSystem;
