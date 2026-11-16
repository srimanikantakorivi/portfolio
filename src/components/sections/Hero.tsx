import React from 'react';
import { ArrowRight, ExternalLink, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';

export const Hero: React.FC = () => {
  const { data } = usePortfolioData();
  const { profile, projects, experiences, certifications } = data;

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const primaryProject = projects[0];
  const primaryExp = experiences[0];
  const primaryCert = certifications[0];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-[#EAE6DD] text-xs font-mono-code text-[#6E756E]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4D5E4B]" />
            <span className="text-[#181A18] font-medium tracking-wider uppercase text-[11px]">
              Sri Manikanta Korivi
            </span>
            <span className="text-[#BCB6A9]">/</span>
            <span>Portfolio V2</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#6E756E]">
            <span>KITS Akshar Institute of Technology</span>
            <span className="hidden sm:inline text-[#BCB6A9]">•</span>
            <span className="hidden sm:inline">Cohort 2024–2028</span>
          </div>
        </div>

        {/* Asymmetric Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Editorial Text Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="sage" size="sm" icon={<Sparkles className="w-3 h-3 text-[#4D5E4B]" />}>
                Software Development & AI Workflows
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#181A18] leading-[1.12]">
              Building Modern Web Experiences with{' '}
              <span className="font-editorial italic font-normal text-[#3A4739]">
                AI &amp; Software Development.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#474D47] leading-relaxed max-w-2xl font-normal">
              Computer Science undergraduate at <strong className="font-semibold text-[#181A18]">KITS Akshar Institute of Technology</strong>, interested in software development, modern web experiences, and practical AI-assisted workflows. Tech Lead at <strong className="font-semibold text-[#181A18]">KITS Innovation Club (Generation 2)</strong> and certified as an <strong className="font-semibold text-[#181A18]">LLM Security Professional (CLLMSP)</strong> by Red Team Leaders.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('#projects')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Explore Projects
              </Button>

              <Button
                variant="secondary"
                size="lg"
                to="/projects"
              >
                All Projects ({projects.length})
              </Button>

              <Button
                variant="outline"
                size="lg"
                href={profile.githubUrl}
                external
                icon={<GithubIcon className="w-4 h-4" />}
              >
                GitHub
              </Button>
            </div>
          </div>

          {/* Right Asymmetric Ledger Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl bg-[#F4F0E8] border border-[#E2DDD2] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3DDCF]">
                <span className="text-[11px] font-mono-code uppercase tracking-widest text-[#666D66] font-semibold">
                  Verified Index
                </span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-white text-[#3E4F3D] border border-[#D5DDD2]">
                  Active
                </span>
              </div>

              {/* Index 01: Academics */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono-code text-[#4D5E4B] font-semibold uppercase tracking-wider block">
                  01 / Education
                </span>
                <h4 className="text-sm font-semibold text-[#181A18]">
                  {profile.education.degree} in {profile.education.field}
                </h4>
                <p className="text-xs text-[#5D635D]">
                  {profile.education.institution} ({profile.education.startYear}–{profile.education.endYear})
                </p>
              </div>

              {/* Index 02: Leadership */}
              {primaryExp && (
                <div className="space-y-1 pt-2 border-t border-[#E3DDCF]">
                  <span className="text-[10px] font-mono-code text-[#4D5E4B] font-semibold uppercase tracking-wider block">
                    02 / Leadership
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#4D5E4B]" />
                    <h4 className="text-sm font-semibold text-[#181A18]">
                      {primaryExp.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5D635D]">
                    {primaryExp.organization}
                  </p>
                </div>
              )}

              {/* Index 03: Certification */}
              {primaryCert && (
                <div className="space-y-1 pt-2 border-t border-[#E3DDCF]">
                  <span className="text-[10px] font-mono-code text-[#4D5E4B] font-semibold uppercase tracking-wider block">
                    03 / Certification
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4D5E4B]" />
                    <h4 className="text-sm font-semibold text-[#181A18]">
                      {primaryCert.acronym || 'CLLMSP'}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5D635D]">
                    {primaryCert.issuer} • {primaryCert.issueDate}
                  </p>
                </div>
              )}

              {/* Index 04: Project Spotlight */}
              {primaryProject && (
                <div className="space-y-1.5 pt-2 border-t border-[#E3DDCF]">
                  <span className="text-[10px] font-mono-code text-[#4D5E4B] font-semibold uppercase tracking-wider block">
                    04 / Key Project
                  </span>
                  <a
                    href={primaryProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#181A18] hover:text-[#4D5E4B] transition-colors"
                  >
                    <span>{primaryProject.title}</span>
                    <ExternalLink className="w-3 h-3 text-[#4D5E4B] group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <p className="text-[11px] text-[#696F69]">
                    {primaryProject.stageLabel}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
