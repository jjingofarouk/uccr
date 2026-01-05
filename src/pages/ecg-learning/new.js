import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ECGForm from '../../components/ECG/ECGForm';
import { useAuth } from '../../hooks/useAuth';
import styles from '../Home.module.css';

export default function NewECGPage() {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={styles.container}>
            <Head>
                <title>Post New ECG Case | UCCR</title>
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
                <ECGForm />
            </main>
        </div>
    );
}
