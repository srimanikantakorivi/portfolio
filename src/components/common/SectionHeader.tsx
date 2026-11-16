import React from 'react';
import { Badge } from './Badge';

export interface SectionHeaderProps {
  index?: string;
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  kicker,
  title,
  description,
  align = 'left',
  action,
  className = '',
}) => {
  const alignmentClasses = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16 pb-6 border-b border-[#EAE6DE] ${className}`}>
      <div className={`flex flex-col ${alignmentClasses} max-w-2xl`}>
        <div className="flex items-center gap-2 mb-3">
          {index && (
            <span className="font-mono-code text-xs font-semibold text-[#4D5E4B] tracking-widest">
              {index}
            </span>
          )}
          {index && kicker && <span className="text-xs text-[#BCB6A9]">/</span>}
          {kicker && (
            <Badge variant="sage" size="sm">
              {kicker}
            </Badge>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#181A18] leading-[1.2]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm sm:text-base text-[#565C56] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 md:self-end pt-2 md:pt-0">{action}</div>}
    </div>
  );
};
