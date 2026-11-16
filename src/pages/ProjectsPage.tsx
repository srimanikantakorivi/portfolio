import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, ArrowRight, CheckCircle2, AlertCircle, Wrench, ArrowLeft } from 'lucide-react';
import { GithubIcon } from '../components/common/Icons';
import { SectionHeader } from '../components/common/SectionHeader';
import { Badge } from '../components/common/Badge';
import { usePortfolioData } from '../contexts/PortfolioDataContext';

export const ProjectsPage: React.FC = () => {
  const { data } = usePortfolioData();
  const { projects } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...cats];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.techStack.some((t) => t.toLowerCase().includes(q)) ||
        project.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, projects]);

  return (
    <div className="py-12 md:py-20 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-xs font-mono-code font-medium text-[#4D5E4B] hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio Home</span>
          </Link>
        </div>

        {/* Section Header */}
        <SectionHeader
          index="DIR"
          kicker="Catalog"
          title="All Projects &amp; Concept Prototypes"
          description="Complete index of web platforms, hackathon investigation prototypes, and active workspace systems developed by Sri Manikanta Korivi."
        />

        {/* Filter and Search Bar */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E4DC] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#181A18] text-[#FAF8F5]'
                    : 'text-[#565C56] hover:bg-[#F4F0E8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8C928B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tech or keyword..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] placeholder:text-[#919690] focus:outline-none focus:ring-2 focus:ring-[#4D5E4B] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#D5DDD2] rounded-2xl bg-white">
            <p className="text-sm text-[#666C66]">No projects found matching your query.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-medium text-[#4D5E4B] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project, pIdx) => (
              <div
                key={project.id}
                className="p-7 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D5DDD2] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {project.projectStage === 'live' && (
                      <Badge variant="verified" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-[#38593E]" />}>
                        {project.stageLabel}
                      </Badge>
                    )}
                    {project.projectStage === 'hackathon_prototype' && (
                      <Badge variant="prototype" size="sm" icon={<AlertCircle className="w-3 h-3 text-[#875D1C]" />}>
                        {project.stageLabel}
                      </Badge>
                    )}
                    {project.projectStage === 'in_progress' && (
                      <Badge variant="in_progress" size="sm" icon={<Wrench className="w-3 h-3 text-[#53496D]" />}>
                        {project.stageLabel}
                      </Badge>
                    )}

                    <span className="text-[11px] font-mono-code text-[#7A807A]">
                      0{pIdx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-[#181A18] tracking-tight leading-snug">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="hover:text-[#4D5E4B] transition-colors"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4E544E] leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Tech stack */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#FAF8F5] text-[#333833] border border-[#E6E1D7]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 mt-6 border-t border-[#F0ECE4] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#4D5E4B] hover:text-[#384637] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live project</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#565C56] hover:text-[#181A18]"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1 text-[#181A18] font-medium hover:text-[#4D5E4B] transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
