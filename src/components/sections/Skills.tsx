import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Terminal, Layout, Cpu } from 'lucide-react';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';

export const Skills: React.FC = () => {
  const { data } = usePortfolioData();
  const { skills } = data;

  const categoryIcons: Record<string, React.ReactNode> = {
    'cat-languages': <Terminal className="w-4 h-4 text-[#4D5E4B]" />,
    'cat-web': <Layout className="w-4 h-4 text-[#4D5E4B]" />,
    'cat-tools': <Cpu className="w-4 h-4 text-[#4D5E4B]" />,
  };

  return (
    <section id="skills" className="py-20 md:py-28 border-b border-[#E8E4DC] bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="03"
          kicker="Skills & Tools"
          title="What I Work With"
          description="Languages, tools and technologies I use and continue to learn."
        />

        {/* Editorial Skills Ledger / List */}
        <div className="space-y-6">
          {skills.map((category, index) => (
            <div
              key={category.id}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D5DDD2] transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Category Meta (4 cols) */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code text-xs font-semibold text-[#4D5E4B]">
                      0{index + 1}
                    </span>
                    <span className="text-xs text-[#BCB6A9]">/</span>
                    <div className="p-1.5 rounded-md bg-[#EBF0EA]">
                      {categoryIcons[category.id] || <Terminal className="w-4 h-4 text-[#4D5E4B]" />}
                    </div>
                    <h3 className="text-base font-semibold text-[#181A18]">
                      {category.category}
                    </h3>
                  </div>

                  <p className="text-xs text-[#6B726B] leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Skills Items Row (8 cols) */}
                <div className="lg:col-span-8 flex flex-wrap gap-2.5 items-center pt-1 lg:pt-0">
                  {category.items.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E4DFD5] text-xs font-medium text-[#252B25] hover:border-[#CAD4CA] transition-colors"
                    >
                      <span>{skill.name}</span>
                      {skill.note && (
                        <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[#EBF0EA] text-[#3D4F3C]">
                          {skill.note}
                        </span>
                      )}
                    </div>
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
