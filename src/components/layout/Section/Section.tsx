import React, { ReactNode } from 'react';
import styles from './Section.module.css';
import { GradientOrb } from '@/components/ui/GradientOrb/GradientOrb';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  withOrb?: boolean;
  orbColor?: 'mint' | 'cool';
  orbPosition?: 'left' | 'right' | 'center';
}

export const Section = ({
  children,
  id,
  className = '',
  containerClassName = '',
  withOrb = false,
  orbColor = 'mint',
  orbPosition = 'center'
}: SectionProps) => {
  return (
    <section id={id} className={`${styles.section} ${className}`}>
      {withOrb && (
        <GradientOrb 
          color={orbColor} 
          position={orbPosition} 
          className={styles.orb} 
        />
      )}
      <div className={`${styles.container} ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
