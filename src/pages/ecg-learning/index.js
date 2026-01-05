import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ECGSystem from '../../components/ECG/ECGSystem';
import styles from '../Home.module.css'; // Reusing layout styles if applicable

export default function ECGLearningPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock user and handlers - in a real app these come from context
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleNavigationClick = (path) => console.log('Navigating to', path);

    // Ideally, user authentication context should be used here layout wrapper
    const user = { displayName: 'Dr. User', photoURL: null }; // Mock user

    return (
        <div className={styles.container}>
            <Head>
                <title>ECG Masterclass | UCCR</title>
                <meta name="description" content="Learn to interpret ECGs with real-world cases." />
            </Head>

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                user={user}
                handleNavigationClick={handleNavigationClick}
            />

            <main style={{ marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin 0.3s' }}>
                {/* We need a button to open sidebar if it's closed, usually in a Navbar. 
            For now, assuming the Layout handles this or reusing a Layout component.
            However, looking at the file structure, there isn't a global Layout file seen in 'components' but _app.js might wrap it.
            I will render the ECGSystem directly.
        */}
                <div style={{ padding: '0' }}>
                    {/* Temporary hamburger or relying on system having one */}
                    {!isSidebarOpen && (
                        <button
                            onClick={toggleSidebar}
                            style={{
                                position: 'fixed',
                                top: '20px',
                                left: '20px',
                                zIndex: 50,
                                background: '#334155',
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
                    <ECGSystem />
                </div>
            </main>
        </div>
    );
}
