import { ContentBlockRenderer } from '../blocks/ContentBlockRenderer';
import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { Users, GraduationCap } from 'lucide-react';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';

export const Experience: React.FC = () => {
  const { data } = usePortfolioData();
  const { experiences } = data;

  const roleIcons: Record<string, React.ReactNode> = {
    'exp-kits-innovation-lead': <Users className="w-5 h-5 text-[#4D5E4B]" />,
    'exp-btech-cse': <GraduationCap className="w-5 h-5 text-[#4D5E4B]" />,
  };

  return (
    <section id="experience" className="py-20 md:py-28 border-b border-[#E8E4DC] bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="04"
          kicker="Trajectory"
          title="Experience & Education"
          description="Leadership responsibilities in KITS Innovation Club alongside undergraduate computer science studies."
        />

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-7 sm:p-9 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D5DDD2] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#EBF0EA] text-[#4D5E4B] shrink-0 mt-0.5">
                    {roleIcons[exp.id] || <Users className="w-5 h-5 text-[#4D5E4B]" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-[#181A18]">
                        {exp.title}
                      </h3>
                    </div>

                    <p className="text-sm font-medium text-[#4D5E4B]">
                      {exp.organization}
                    </p>

                    {exp.location && (
                      <p className="text-xs text-[#737A73]">
                        {exp.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="md:text-right shrink-0">
                  <span className="inline-block font-mono-code text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF8F5] text-[#333833] border border-[#E2DDD2]">
                    {exp.period}
                  </span>
                </div>
              </div>

              {/* Focus Statement */}
              <div className="mt-5 pl-0 md:pl-16">
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#ECE8DF] text-xs sm:text-sm text-[#4E544E] italic mb-4">
                  "{exp.focus}"
                </div>

                {/* Bullets */}
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#474D47] leading-relaxed">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4D5E4B] shrink-0 mt-2" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {exp.contentBlocks?.map((block) => <ContentBlockRenderer key={block.id} block={block} />)}

                {/* Skills used */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {exp.skills.map((skill, sIdx) => (
                    <Badge key={sIdx} variant="neutral" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
