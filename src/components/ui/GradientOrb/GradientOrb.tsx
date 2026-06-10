import React from 'react';

interface GradientOrbProps {
  color?: 'mint' | 'cool';
  position?: 'left' | 'right' | 'center';
  className?: string;
  size?: number;
}

/**
 * GradientOrb - deactivated per corporate minimalist design directives.
 * Returns null to eliminate all glowing background shapes.
 */
export const GradientOrb = ({ 
  color = 'mint', 
  position = 'center', 
  className = '',
  size = 600
}: GradientOrbProps) => {
  return null;
};

export default GradientOrb;
