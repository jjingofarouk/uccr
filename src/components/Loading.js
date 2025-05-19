// src/components/Loading.js
import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from './loadingAnimation.json';
import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loaderContainer} role="status" aria-label="Loading cases">
      <div className={styles.loader}>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
      <p className={styles.loaderText}>Loading cases...</p>
    </div>
  );
}