import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../../components/Sidebar';
import ECGForm from '../../../components/ECG/ECGForm';
import { getECGById } from '../../../firebase/firestore';
import { useAuth } from '../../../hooks/useAuth';
import styles from '../../Home.module.css';

export default function EditECGPage() {
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
                    if (data && user && data.userId === user.uid) {
                        setEcg(data);
                    } else if (data) {
                        // Not the owner
                        router.push('/ecg-learning');
                    }
                } catch (error) {
                    console.error('Error fetching ECG:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchEcg();
        }
    }, [id, user]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={styles.container}>
            <Head>
                <title>Edit ECG Case | ECG Masterclass</title>
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

                <div style={{ padding: '80px 20px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'var(--text)' }}>Loading case details...</div>
                    ) : ecg ? (
                        <ECGForm initialData={ecg} id={id} />
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text)' }}>Case not found or permission denied.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
