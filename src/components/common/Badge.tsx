import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sage' | 'graphite' | 'neutral' | 'outline' | 'verified' | 'prototype' | 'in_progress';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 tracking-wide',
    md: 'text-xs px-2.5 py-1 gap-1.5 tracking-wide',
  };

  const variantClasses = {
    sage: 'bg-[#EBF0EA] text-[#3B4A3A] border border-[#D3DDD1]',
    graphite: 'bg-[#181A18] text-[#FAF8F5] border border-[#181A18]',
    neutral: 'bg-[#F4F0E8] text-[#414741] border border-[#E4DFD5]',
    outline: 'bg-transparent text-[#4E564E] border border-[#DDD7CC]',
    verified: 'bg-[#EBF2EB] text-[#2F4D33] border border-[#C6DAC9]',
    prototype: 'bg-[#F9F4EB] text-[#785419] border border-[#E9DDC2]',
    in_progress: 'bg-[#F0EFF4] text-[#4F4668] border border-[#D8D4E2]',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
