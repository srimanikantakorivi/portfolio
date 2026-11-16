import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ExternalLink, ArrowRight, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';

export const FeaturedProjects: React.FC = () => {
  const { data } = usePortfolioData();
  const { projects } = data;
  const mainProject = projects[0];
  const secondaryProjects = projects.slice(1);

  return (
    <section id="projects" className="py-20 md:py-28 border-b border-[#E8E4DC] bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="03"
          kicker="Selected Works"
          title="Featured Projects & Prototype Explorations"
          description="Verified applications, hackathon concepts, and in-progress architectures. Each project reflects real development state without exaggerated claims."
          action={
            <Button
              variant="outline"
              size="md"
              to="/projects"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              All Projects Directory ({projects.length})
            </Button>
          }
        />

        {/* Feature 01: Lead Editorial Showcase (Innovation & Idea Submission Portal) */}
        {mainProject && (
          <div className="mb-10 p-7 sm:p-10 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D5DDD2] transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Project Overview (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="verified" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-[#38593E]" />}>
                    {mainProject.stageLabel}
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    {mainProject.category}
                  </Badge>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-[#181A18] tracking-tight leading-snug">
                  <Link
                    to={`/projects/${mainProject.slug}`}
                    className="hover:text-[#4D5E4B] transition-colors"
                  >
                    {mainProject.title}
                  </Link>
                </h3>

                <p className="text-sm sm:text-base text-[#474D47] leading-relaxed">
                  {mainProject.summary}
                </p>

                {/* Tech Stack Pills */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {mainProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono-code px-2.5 py-1 rounded bg-[#F4F0E8] text-[#333833] border border-[#E2DDD2]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Direct Action Links */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  {mainProject.liveUrl && (
                    <Button
                      variant="primary"
                      size="md"
                      href={mainProject.liveUrl}
                      external
                      icon={<ExternalLink className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      View live project
                    </Button>
                  )}

                  {mainProject.githubUrl && (
                    <Button
                      variant="outline"
                      size="md"
                      href={mainProject.githubUrl}
                      external
                      icon={<GithubIcon className="w-4 h-4" />}
                    >
                      Repository
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="md"
                    to={`/projects/${mainProject.slug}`}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Case Study
                  </Button>
                </div>
              </div>

              {/* Right Column: Verified Highlights Ledger (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-xl bg-[#FAF8F5] border border-[#EAE6DD] space-y-3.5">
                <span className="text-[11px] font-mono-code uppercase tracking-widest text-[#727872] font-semibold block">
                  Project Highlights
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#4E544E]">
                  {mainProject.keyHighlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4D5E4B] shrink-0 mt-2" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Editorial Showcases (2 cols grid) */}
        {secondaryProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {secondaryProjects.map((project, pIdx) => (
            <div
              key={project.id}
              className="p-7 sm:p-8 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D5DDD2] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {project.projectStage === 'hackathon_prototype' ? (
                    <Badge variant="prototype" size="sm" icon={<AlertCircle className="w-3 h-3 text-[#875D1C]" />}>
                      {project.stageLabel}
                    </Badge>
                  ) : (
                    <Badge variant="in_progress" size="sm" icon={<Wrench className="w-3 h-3 text-[#53496D]" />}>
                      {project.stageLabel}
                    </Badge>
                  )}
                  <span className="text-[11px] font-mono-code text-[#7A807A]">
                    0{pIdx + 2}
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-semibold text-[#181A18] tracking-tight leading-snug">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="hover:text-[#4D5E4B] transition-colors"
                  >
                    {project.title}
                  </Link>
                </h4>

                <p className="text-xs sm:text-sm text-[#4E544E] leading-relaxed">
                  {project.summary}
                </p>

                {/* Tech Tags */}
                <div className="pt-1 flex flex-wrap gap-1.5">
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

              {/* Card Footer with Details link */}
              <div className="pt-6 mt-6 border-t border-[#F0ECE4] flex items-center justify-between text-xs">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#565C56] hover:text-[#181A18] transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                ) : (
                  <span />
                )}

                <Link
                  to={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1 font-medium text-[#4D5E4B] hover:text-[#384637] transition-colors"
                >
                  <span>Read Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
};
