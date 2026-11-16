import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { GithubIcon } from '../components/common/Icons';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { usePortfolioData } from '../contexts/PortfolioDataContext';
import { ContentBlockRenderer } from '../components/blocks/ContentBlockRenderer';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePortfolioData();
  const projects = data.projects;

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) {
    return <Navigate to="/projects" replace />;
  }

  const project = projects[currentIndex];
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <article className="py-12 md:py-20 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono-code text-[#6E756E] mb-6">
          <Link to="/" className="hover:text-[#181A18] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-[#181A18] transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-[#181A18] font-medium truncate max-w-xs">
            {project.title}
          </span>
        </nav>

        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono-code font-medium text-[#4D5E4B] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Projects</span>
          </Link>
        </div>

        {/* Header Block */}
        <header className="space-y-4 pb-8 border-b border-[#E8E4DC]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral" size="sm">
              {project.category}
            </Badge>

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

            <span className="text-xs text-[#7A807A] font-mono-code ml-auto">
              Updated: {project.updatedAt}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#181A18] leading-[1.15]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#4E544E] leading-relaxed">
            {project.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <Button
                variant="primary"
                size="md"
                href={project.liveUrl}
                external
                icon={<ExternalLink className="w-4 h-4" />}
                iconPosition="right"
              >
                View live project
              </Button>
            )}

            {project.githubUrl && (
              <Button
                variant="outline"
                size="md"
                href={project.githubUrl}
                external
                icon={<GithubIcon className="w-4 h-4" />}
              >
                Repository
              </Button>
            )}
          </div>
        </header>

        {project.coverImage && <figure className="my-8 overflow-hidden rounded-2xl border border-[#E8E4DC]">
          <img src={project.coverImage} alt={`${project.title} cover`} className="w-full max-h-[480px] object-contain bg-white" />
        </figure>}

        {/* Technical Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 my-8 rounded-2xl bg-white border border-[#E8E4DC] text-xs">
          <div>
            <span className="text-[#727872] block uppercase tracking-wider text-[10px] font-mono-code font-semibold mb-1">
              Category
            </span>
            <span className="font-semibold text-[#181A18]">{project.category}</span>
          </div>
          <div>
            <span className="text-[#727872] block uppercase tracking-wider text-[10px] font-mono-code font-semibold mb-1">
              Project Stage
            </span>
            <span className="font-semibold text-[#181A18]">{project.stageLabel}</span>
          </div>
          <div>
            <span className="text-[#727872] block uppercase tracking-wider text-[10px] font-mono-code font-semibold mb-1">
              Primary Stack
            </span>
            <span className="font-semibold text-[#181A18]">{project.techStack[0]}</span>
          </div>
          <div>
            <span className="text-[#727872] block uppercase tracking-wider text-[10px] font-mono-code font-semibold mb-1">
              Technologies
            </span>
            <span className="font-semibold text-[#4D5E4B]">{project.techStack.length} tools</span>
          </div>
        </div>

        {/* Intentional Typography Layout / Case Study Body */}
        <div className="space-y-10 text-[#414741] leading-relaxed">
          {/* Executive Overview */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#181A18]">
              Overview &amp; Context
            </h2>
            <p className="text-sm sm:text-base text-[#474D47] leading-relaxed">
              {project.description}
            </p>
          </section>

          {/* Key Technologies */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#4D5E4B]" />
              <h2 className="text-xl sm:text-2xl font-semibold text-[#181A18]">
                Technical Stack &amp; Tools
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono-code px-3 py-1 rounded-md bg-[#FAF8F5] text-[#333833] border border-[#E4DFD5]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4D5E4B]" />
              <h2 className="text-xl sm:text-2xl font-semibold text-[#181A18]">
                Key Highlights &amp; Capabilities
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {project.keyHighlights.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-[#E8E4DC] flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#4D5E4B] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#383E38] font-medium leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Challenges & Solutions */}
          {project.challenges && project.challenges.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4D5E4B]" />
                <h2 className="text-xl sm:text-2xl font-semibold text-[#181A18]">
                  Technical Challenges &amp; Observations
                </h2>
              </div>
              <ul className="space-y-2.5">
                {project.challenges.map((challenge, idx) => (
                  <li
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-[#E8E4DC] text-xs sm:text-sm text-[#4E544E] flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4D5E4B] shrink-0 mt-2" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.contentBlocks && project.contentBlocks.length > 0 && <section className="space-y-5" aria-label="Project attachments and details">
            {project.contentBlocks.map((block) => <ContentBlockRenderer key={block.id} block={block} />)}
          </section>}
        </div>

        {/* Next / Previous Project Navigation */}
        <div className="mt-12 pt-8 border-t border-[#E8E4DC] flex items-center justify-between gap-4">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#4D5E4B] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="truncate max-w-[140px] sm:max-w-xs">{prevProject.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              to={`/projects/${nextProject.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#4D5E4B] hover:underline ml-auto"
            >
              <span className="truncate max-w-[140px] sm:max-w-xs">{nextProject.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </article>
  );
};
