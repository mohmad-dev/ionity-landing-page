'use client';

import React, { ReactNode } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

/** 
 * TiltCard — stripped to a clean passthrough wrapper.
 * All 3D tilt logic removed per design directive.
 * CSS hover states handle depth via border-color transitions.
 */
export const TiltCard = ({
  children,
  className = '',
  intensity: _intensity,   // accepted but unused — API compatibility
  ...rest
}: TiltCardProps) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

export default TiltCard;
