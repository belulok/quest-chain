'use client';

import React from 'react';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  animate?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
  animate = false,
}) => {
  const baseClasses = 'font-pixel py-2 px-6 text-xl transition-all duration-200 border-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'border-primary bg-primary/20 text-primary hover:bg-primary/30 hover:scale-105',
    secondary: 'border-gray-500 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 hover:scale-105 opacity-70 hover:opacity-100',
  };
  
  const widthClass = fullWidth ? 'w-full text-center' : '';
  const animationClass = animate ? 'animate-pulse-slow' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${animationClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default PixelButton;
