import React from 'react';
import { Button } from '../components/common/Button';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 sm:py-32 flex items-center justify-center text-center">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#EEF3EE] text-[#4F6B56] border border-[#D5E1D7]">
          404 • Not Found
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1C1F1D]">
          Page Not Located
        </h1>
        <p className="mt-3 text-sm text-[#5D635E] leading-relaxed">
          The requested portfolio section or project case study does not exist or may have been reorganized.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="primary" size="md" to="/" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
          <Button variant="outline" size="md" to="/projects" icon={<ArrowLeft className="w-4 h-4" />}>
            All Projects
          </Button>
        </div>
      </div>
    </div>
  );
};
