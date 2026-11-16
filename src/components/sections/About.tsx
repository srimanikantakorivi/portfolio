import { ContentBlockRenderer } from '../blocks/ContentBlockRenderer';
import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { GraduationCap, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';

export const About: React.FC = () => {
  const { data } = usePortfolioData();
  const { profile, experiences, certifications } = data;
  const primaryExp = experiences[0];
  const primaryCert = certifications[0];

  const editorialThemes = [
    {
      title: 'Modern Web Interfaces',
      summary: 'Exploring responsive component architecture and intuitive user workflows with React, clean CSS, and modern web standards.',
    },
    {
      title: 'Practical AI-Assisted Workflows',
      summary: 'Leveraging prompt engineering and developer AI tooling to accelerate debugging, explore APIs, and streamline engineering tasks.',
    },
    {
      title: 'Student Innovation & Peer Collaboration',
      summary: 'Active engagement in KITS Innovation Club, guiding peers through technical fundamentals, Git version control, and idea prototyping.',
    },
    {
      title: 'Core Software Fundamentals',
      summary: 'Studying core programming principles in C, Python, and Java alongside academic coursework at KITS Akshar Institute of Technology.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 border-b border-[#E8E4DC] bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="01"
          kicker="Background & Overview"
          title="Engineering curiosity grounded in software fundamentals and collaborative learning."
          description="A verified overview of my academic trajectory at KITS Akshar Institute of Technology and student technical leadership."
        />

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Narrative Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-[#3E443E] text-base sm:text-lg leading-relaxed space-y-5 font-normal">
              {profile.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Editorial Focus Areas */}
            <div className="pt-6 border-t border-[#EAE6DD] space-y-3">
              <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#737A73] font-semibold">
                Technical Focus &amp; Practical Interests
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {editorialThemes.map((theme, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-[#E8E4DC] space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4D5E4B] shrink-0" />
                      <h5 className="text-xs sm:text-sm font-semibold text-[#181A18]">
                        {theme.title}
                      </h5>
                    </div>
                    <p className="text-xs text-[#5D635D] leading-relaxed pl-6">
                      {theme.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Academic Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#EBF0EA] text-[#4D5E4B]">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono-code font-semibold uppercase tracking-wider text-[#181A18]">
                    Education
                  </span>
                </div>
                <Badge variant="verified" size="sm">
                  Verified
                </Badge>
              </div>

              <div>
                <h4 className="text-base font-semibold text-[#181A18]">
                  {profile.education.degree} in {profile.education.field}
                </h4>
                <p className="text-sm text-[#4D5E4B] font-medium mt-0.5">
                  {profile.education.institution}
                </p>
                <p className="text-xs text-[#6E756E] mt-1">
                  Cohort {profile.education.startYear} – {profile.education.endYear} • {profile.education.currentStatus}
                </p>
              </div>
            </div>

            {/* Leadership Card */}
            {primaryExp && (
              <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#EBF0EA] text-[#4D5E4B]">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono-code font-semibold uppercase tracking-wider text-[#181A18]">
                      Campus Leadership
                    </span>
                  </div>
                  <Badge variant="sage" size="sm">
                    Active
                  </Badge>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-[#181A18]">
                    {primaryExp.title}
                  </h4>
                  <p className="text-sm text-[#4D5E4B] font-medium mt-0.5">
                    {primaryExp.organization}
                  </p>
                  <p className="text-xs text-[#6E756E] mt-1 leading-relaxed">
                    {primaryExp.focus}
                  </p>
                </div>
              </div>
            )}

            {/* Credential Card */}
            {primaryCert && (
              <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#EBF0EA] text-[#4D5E4B]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono-code font-semibold uppercase tracking-wider text-[#181A18]">
                      Certification
                    </span>
                  </div>
                  <Badge variant="verified" size="sm">
                    {primaryCert.issueDate}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-[#181A18]">
                    {primaryCert.title}
                  </h4>
                  <p className="text-xs text-[#6E756E] mt-0.5">
                    Issued by <strong className="font-medium text-[#181A18]">{primaryCert.issuer}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {profile.contentBlocks && profile.contentBlocks.length > 0 && <div className="mt-8 space-y-4">
          {profile.contentBlocks.map((block) => <ContentBlockRenderer key={block.id} block={block} />)}
        </div>}
      </div>
    </section>
  );
};
