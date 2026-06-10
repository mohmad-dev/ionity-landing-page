import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, href, children, disabled, ...props }, ref) => {
    
    const classes = [
      styles.button,
      styles[variant],
      styles[size],
      isLoading ? styles.loading : '',
      className
    ].filter(Boolean).join(' ');

    if (href) {
      return (
        <a 
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as any)}
        >
          <span className={styles.content}>{children}</span>
        </a>
      );
    }

    return (
      <button 
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className={styles.spinner} />}
        <span className={styles.content}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
