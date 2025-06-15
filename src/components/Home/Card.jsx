import React from 'react';
import styles from './Card.module.css';

export const Card = ({ children, className, ...props }) => (
  <div className={`${styles.card} ${className || ''}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={`${styles.cardHeader} ${className || ''}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2 className={`${styles.cardTitle} ${className || ''}`} {...props}>
    {children}
  </h2>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={`${styles.cardDescription} ${className || ''}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={`${styles.cardContent} ${className || ''}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={`${styles.cardFooter} ${className || ''}`} {...props}>
    {children}
  </div>
);