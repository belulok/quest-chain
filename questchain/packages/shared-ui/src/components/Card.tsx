import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  bordered = true,
}) => {
  const borderClass = bordered ? 'border-2 border-primary/50' : '';
  
  return (
    <div className={`bg-background/80 p-4 rounded-md ${borderClass} ${className}`}>
      {title && (
        <div className="mb-4 pb-2 border-b border-primary/30">
          <h3 className="font-pixel text-xl text-primary">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
