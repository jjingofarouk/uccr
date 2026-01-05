import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ECGDetail from '../../components/ECG/ECGDetail';
import { getECGById } from '../../firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import styles from '../Home.module.css';

export default function ECGDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [ecg, setEcg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchEcg = async () => {
                try {
                    const data = await getECGById(id);
                    setEcg(data);
                } catch (error) {
                    console.error('Error fetching ECG:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchEcg();
        }
    }, [id]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={styles.container}>
            <Head>
                <title>{ecg ? `${ecg.title} | ECG Masterclass` : 'ECG Masterclass'}</title>
            </Head>

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                user={user}
            />

            <main style={{ marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin 0.3s' }}>
                {!isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            left: '20px',
                            zIndex: 50,
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: 'pointer'
                        }}
                    >
                        ☰ Menu
                    </button>
                )}
                {loading ? (
                    <div style={{ color: 'var(--text)', padding: '100px', textAlign: 'center' }}>
                        Loading ECG analysis...
                    </div>
                ) : ecg ? (
                    <ECGDetail ecg={ecg} />
                ) : (
                    <div style={{ color: 'var(--text)', padding: '100px', textAlign: 'center' }}>
                        ECG case not found.
                    </div>
                )}
            </main>
        </div>
    );
}
