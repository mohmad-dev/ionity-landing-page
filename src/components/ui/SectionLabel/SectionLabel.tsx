import React, { ReactNode } from 'react';
import styles from './SectionLabel.module.css';

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
  dotColor?: 'mint' | 'none';
}

export const SectionLabel = ({ children, className = '', dotColor = 'mint' }: SectionLabelProps) => {
  return (
    <div className={`${styles.label} ${className}`}>
      {dotColor === 'mint' && <span className={styles.dot} />}
      <span className="caption">{children}</span>
    </div>
  );
};

export default SectionLabel;
