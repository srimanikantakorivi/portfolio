import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Download, ShieldCheck, GraduationCap, Users, Code, Info } from 'lucide-react';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { usePortfolioMotion } from '../../hooks/usePortfolioMotion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const location = useLocation();
  const { data, siteSettings, previewMode, setPreviewMode, loading, dataError, refreshData } = usePortfolioData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { profile, certifications, experiences, skills, projects } = data;
  usePortfolioMotion(location.pathname, !loading && !dataError && (previewMode || profile.status === 'published'));

  const primaryExp = experiences[0];
  const primaryCert = certifications[0];

  const handleDownloadSummary = () => {
    // Generate verified curriculum vitae text summary file
    const content = `======================================================
SRI MANIKANTA KORIVI - CURRICULUM VITAE
======================================================
Positioning: ${profile.tagline}
GitHub: ${profile.githubUrl}
Status: Undergraduate Student (2024-2028)

EDUCATION:
Degree: ${profile.education.degree} in ${profile.education.field}
Institution: ${profile.education.institution}
Period: ${profile.education.startYear} - ${profile.education.endYear}

${primaryExp ? `CAMPUS LEADERSHIP:
Role: ${primaryExp.title}
Organization: ${primaryExp.organization}
Period: ${primaryExp.period}
Focus: ${primaryExp.focus}
` : ''}
${primaryCert ? `VERIFIED CERTIFICATION:
Title: ${primaryCert.title}
Issuer: ${primaryCert.issuer}
Issue Date: ${primaryCert.issueDate}
Topics:
${primaryCert.topics.map((t) => ` - ${t}`).join('\n')}
` : ''}
VERIFIED SKILLS:
${skills.map((c) => `${c.category}:\n  ${c.items.map((i) => i.name).join(', ')}`).join('\n\n')}

FEATURED PROJECTS:
${projects
  .map(
    (p) => `* ${p.title} (${p.stageLabel})
  Category: ${p.category}
  Tech Stack: ${p.techStack.join(', ')}
  Summary: ${p.summary}
  ${p.liveUrl ? `Live Demo: ${p.liveUrl}` : ''}
  ${p.githubUrl ? `Repository: ${p.githubUrl}` : ''}`
  )
  .join('\n\n')}
======================================================
Document generated from Sri Manikanta Korivi Portfolio V2
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Sri_Manikanta_Korivi_CV_Summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdfResume = async () => {
    if (!siteSettings?.resumeStoragePath || !supabase) {
      handleDownloadSummary();
      return;
    }

    try {
      setDownloadingPdf(true);
      const { data: blobData, error } = await supabase.storage
        .from('portfolio-documents')
        .download(siteSettings.resumeStoragePath);

      if (error || !blobData) {
        console.warn('Direct PDF resume download failed; falling back to summary:', error);
        handleDownloadSummary();
        return;
      }

      const url = URL.createObjectURL(blobData);
      const link = document.createElement('a');
      link.href = url;
      const fileName = siteSettings.resumeStoragePath.split('/').pop() || 'Sri_Manikanta_Korivi_Resume.pdf';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('PDF download error:', err);
      handleDownloadSummary();
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading || dataError || (!previewMode && profile.status !== 'published')) {
    return <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4" role="status">
        <h1 className="text-2xl font-semibold">Sri Manikanta Korivi</h1>
        <p className="text-sm text-[#606760]">{loading ? 'Loading portfolio.' : dataError || 'The portfolio is currently being updated.'}</p>
        {!loading && dataError && <button type="button" onClick={() => void refreshData()} className="rounded-lg bg-[#4D5E4B] px-4 py-2 text-sm text-white">Try again</button>}
      </div>
    </main>;
  }

  return (
    <div className="portfolio-public min-h-screen flex flex-col bg-[#FAF8F5] text-[#181A18] selection:bg-[#E5EBE3] selection:text-[#1E2E1D]">
      {/* Admin Preview Mode Indicator */}
      {previewMode && (
        <aside aria-label="Admin Preview Mode" className="bg-[#181A18] text-[#FAF8F5] px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 z-50 sticky top-0 border-b border-[#2D332D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E5B54F] animate-pulse" />
            <span className="font-mono-code font-semibold tracking-wider uppercase text-[11px] text-[#E5B54F]">
              Admin Preview Mode:
            </span>
            <span>Displaying draft, unpublished, and pending changes.</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-xs text-[#FAF8F5] hover:text-[#D5DDD2] underline underline-offset-2 font-mono-code"
            >
              Back to CMS &rarr;
            </Link>
            <button
              onClick={() => setPreviewMode(false)}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono-code cursor-pointer transition-colors"
            >
              Exit Preview
            </button>
          </div>
        </aside>
      )}

      <Navbar onOpenResume={() => setResumeModalOpen(true)} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Resume Document Preview Modal */}
      <Modal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        title="Curriculum Vitae Preview"
        subtitle="Verified Academic & Technical Profile - Sri Manikanta Korivi"
        maxWidth="xl"
      >
        <div className="space-y-6 text-sm text-[#414741]">
          {/* Header Card */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold text-[#181A18]">{profile.name}</h4>
              <p className="text-xs text-[#606760] mt-0.5">
                {profile.education.degree} in {profile.education.field}  {profile.education.institution}
              </p>
              <p className="text-xs text-[#4D5E4B] font-medium mt-1">
                Tech Lead - KITS Innovation Club (Gen 2)  Certified LLM Security Professional
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 flex-wrap">
              {siteSettings?.allowResumeDownload && siteSettings?.resumeStoragePath && (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={downloadingPdf}
                  onClick={handleDownloadPdfResume}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  {downloadingPdf ? 'Downloading PDF...' : 'Download PDF'}
                </Button>
              )}
              <Button
                variant={siteSettings?.allowResumeDownload && siteSettings?.resumeStoragePath ? 'outline' : 'primary'}
                size="sm"
                onClick={handleDownloadSummary}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Download Summary (.txt)
              </Button>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#181A18] text-xs uppercase tracking-wider font-mono-code">
              <GraduationCap className="w-4 h-4 text-[#4D5E4B]" />
              <span>Education</span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#E8E4DC] bg-white space-y-1">
              <div className="flex justify-between font-medium text-xs sm:text-sm text-[#181A18]">
                <span>{profile.education.degree} in {profile.education.field}</span>
                <span className="text-[#656C65] font-mono-code text-xs">
                  {profile.education.startYear} - {profile.education.endYear}
                </span>
              </div>
              <p className="text-xs text-[#4F564F] font-medium">
                {profile.education.institution}
              </p>
              <p className="text-xs text-[#737A73]">
                {profile.education.currentStatus}
              </p>
            </div>
          </div>

          {/* Verified Certification */}
          {primaryCert && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#181A18] text-xs uppercase tracking-wider font-mono-code">
                <ShieldCheck className="w-4 h-4 text-[#4D5E4B]" />
                <span>Verified Certification</span>
              </div>
              <div className="p-3.5 rounded-lg border border-[#D3DDD1] bg-[#F7FAF7] space-y-1.5">
                <div className="flex justify-between font-medium text-xs sm:text-sm text-[#1F3322]">
                  <span>{primaryCert.title}</span>
                  <span className="text-xs text-[#3C533F] font-mono-code">{primaryCert.issueDate}</span>
                </div>
                <p className="text-xs text-[#4B5E4E]">
                  Issuer: {primaryCert.issuer}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {primaryCert.topics.map((t, idx) => (
                    <Badge key={idx} variant="sage" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Leadership & Activities */}
          {primaryExp && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#181A18] text-xs uppercase tracking-wider font-mono-code">
                <Users className="w-4 h-4 text-[#4D5E4B]" />
                <span>Leadership Experience</span>
              </div>
              <div className="p-3.5 rounded-lg border border-[#E8E4DC] bg-white space-y-2">
                <div className="flex justify-between font-medium text-xs sm:text-sm text-[#181A18]">
                  <span>{primaryExp.title}</span>
                  <span className="text-[#656C65] font-mono-code text-xs">{primaryExp.period}</span>
                </div>
                <p className="text-xs text-[#4D5E4B] font-medium">{primaryExp.organization}</p>
                <p className="text-xs text-[#5D635D]">{primaryExp.focus}</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#4A504A] pt-1">
                  {primaryExp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Skills Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#181A18] text-xs uppercase tracking-wider font-mono-code">
              <Code className="w-4 h-4 text-[#4D5E4B]" />
              <span>Verified Technical Skills</span>
            </div>
            <div className="p-3.5 rounded-lg border border-[#E8E4DC] bg-white space-y-2 text-xs">
              {skills.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <span className="font-semibold text-[#181A18] block">{cat.category}:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#F4F0E8] text-[#333833] border border-[#E2DDD2]"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Policy Notice */}
          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E5E0D6] flex items-start gap-2.5 text-xs text-[#6B726B]">
            <Info className="w-4 h-4 text-[#4D5E4B] shrink-0 mt-0.5" />
            <p>
              {siteSettings?.allowResumeDownload && siteSettings?.resumeStoragePath
                ? 'The official PDF resume is available to download.'
                : 'The PDF resume is not currently available. You can download the profile summary above.'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
