import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ShieldCheck, Award } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { Badge } from '../common/Badge';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';

export const Footer: React.FC = () => {
  const { data } = usePortfolioData();
  const { profile, projects } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-24 border-t border-[#E8E4DC] bg-[#FAF8F5] py-14 md:py-20 text-[#595F59]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#E8E4DC]">
          {/* Identity & verified details */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4D5E4B]" />
              <h3 className="text-base font-semibold text-[#181A18] tracking-tight">
                Sri Manikanta Korivi
              </h3>
            </div>
            <p className="text-sm text-[#595F59] max-w-md leading-relaxed">
              B.Tech in Computer Science and Engineering (2024–2028) at KITS Akshar Institute of Technology. Focus on modern web experiences, software fundamentals, and practical AI-assisted workflows.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <Badge variant="verified" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                CLLMSP • Red Team Leaders (July 2026)
              </Badge>
              <Badge variant="sage" size="sm" icon={<Award className="w-3.5 h-3.5" />}>
                Tech Lead • KITS Innovation Club (Gen 2)
              </Badge>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-[#181A18] uppercase tracking-widest mb-3 font-mono-code">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-[#181A18] transition-colors">
                  Home / Overview
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#181A18] transition-colors">
                  All Projects ({projects.length})
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#181A18] transition-colors">
                  About &amp; Background
                </a>
              </li>
              <li>
                <a href="/#skills" className="hover:text-[#181A18] transition-colors">
                  Skills & Tools
                </a>
              </li>
              <li>
                <a href="/#experience" className="hover:text-[#181A18] transition-colors">
                  Experience &amp; Leadership
                </a>
              </li>
              <li>
                <a href="/#certifications" className="hover:text-[#181A18] transition-colors">
                  Certifications
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-[#181A18] transition-colors">
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>

          {/* Find Me Online & Architecture */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-[#181A18] uppercase tracking-widest mb-3 font-mono-code">
              Find Me Online
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {profile.linkedinUrl && <li>
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#181A18] transition-colors font-medium text-[#2A2E2A]">
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </li>}
              <li>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#181A18] transition-colors font-medium text-[#2A2E2A]"
                >
                  <GithubIcon className="w-4 h-4 text-[#181A18]" />
                  <span>GitHub (@srimanikantakorivi)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://idea-portal-sandy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#4D5E4B] hover:text-[#384637] transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4D5E4B]" />
                  <span>Innovation & Idea Portal</span>
                </a>
              </li>
            </ul>


          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707670]">
          <p>© {new Date().getFullYear()} Sri Manikanta Korivi. </p>
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-[#181A18] transition-colors p-1"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
