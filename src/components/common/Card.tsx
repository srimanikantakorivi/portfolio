import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'white' | 'subtle';
  as?: 'div' | 'article' | 'section';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
  variant = 'white',
  as: Component = 'div',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-7 sm:p-9',
  };

  const variantClasses = {
    white: 'bg-white border-[#E8E4DC]',
    subtle: 'bg-[#F4F0E8] border-[#E2DDD2]',
  };

  const hoverClasses = hoverEffect
    ? 'transition-all duration-200 hover:border-[#CAD4CA] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
    : '';

  return (
    <Component
      className={`rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
    >
      {children}
    </Component>
  );
};
