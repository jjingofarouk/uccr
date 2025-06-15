import React from 'react';
import { Tooltip } from 'recharts';
import styles from './Chart.module.css';

export const ChartContainer = ({ config, children, className, ...props }) => (
  <div className={`${styles.chartContainer} ${className || ''}`} {...props}>
    {children}
  </div>
);

export const ChartTooltip = ({ cursor, content, ...props }) => (
  <Tooltip
    cursor={cursor}
    content={content}
    wrapperStyle={{ zIndex: 1000 }}
    {...props}
  />
);

export const ChartTooltipContent = ({ active, payload, formatter }) => {
  if (active && payload?.length) {
    const { payload: data } = payload[0];
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipText}>
          {formatter ? formatter(data.count, 'count', data) : `${data.count} cases`}
        </p>
      </div>
    );
  }
  return null;
};