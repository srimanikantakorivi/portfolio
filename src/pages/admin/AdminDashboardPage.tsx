import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ContentBlocksEditor } from '../../components/admin/ContentBlocksEditor';
import { FileUpload } from '../../components/admin/FileUpload';
import { MediaManager } from '../../components/admin/MediaManager';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Database,
  RefreshCw,
  X,
} from 'lucide-react';
import type { Project, Experience, Certification, SkillCategory } from '../../types/portfolio';

type AdminTab =
  | 'overview'
  | 'profile'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'certifications'
  | 'resume'
  | 'media'
  | 'inquiries'
  | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    data,
    siteSettings,
    inquiries,
    draftRevisions,
    loading,
    isLiveConnected,
    previewMode,
    setPreviewMode,
    refreshData,
    saveDraftRevision,
    publishDraftRevision,
    discardDraftRevision,
    getDraftRevision,
    saveProfile,
    saveProject,
    createProject,
    deleteProject,
    toggleProjectPublish,
    reorderProjects,
    saveSkills,
    saveExperience,
    createExperience,
    deleteExperience,
    reorderExperience,
    saveCertification,
    createCertification,
    deleteCertification,
    markInquiryRead,
    deleteInquiry,
    saveSiteSettings,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(data.profile);

  // Project Edit State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

  // Experience Edit State
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isCreatingExperience, setIsCreatingExperience] = useState(false);
  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({});

  // Certification Edit State
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [isCreatingCertification, setIsCreatingCertification] = useState(false);
  const [certificationForm, setCertificationForm] = useState<Partial<Certification>>({});

  // Skills Edit State
  const [skillsForm, setSkillsForm] = useState<SkillCategory[]>(data.skills);

  // Settings State
  const [settingsForm, setSettingsForm] = useState(siteSettings);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navItems: { tab: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'profile', label: 'Profile & Hero', icon: <User className="w-4 h-4" /> },
    { tab: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" />, badge: data.projects.length },
    { tab: 'skills', label: 'Skills Matrix', icon: <Cpu className="w-4 h-4" /> },
    { tab: 'experience', label: 'Experience & Leadership', icon: <Briefcase className="w-4 h-4" /> },
    { tab: 'certifications', label: 'Certifications', icon: <ShieldCheck className="w-4 h-4" /> },
    { tab: 'resume', label: 'Resume & CV', icon: <FileText className="w-4 h-4" /> },
    { tab: 'media', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    {
      tab: 'inquiries',
      label: 'Inquiries',
      icon: <Mail className="w-4 h-4" />,
      badge: inquiries.filter((i) => !i.is_read).length,
    },
    { tab: 'settings', label: 'Site & SEO Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Profile Save
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveProfile(profileForm);
    if (res.success) {
      showToast('Profile and Hero updated successfully.');
    } else {
      showToast(res.error || 'Failed to save profile.', 'error');
    }
  };

  const handleSaveProfileDraft = async () => {
    const res = await saveDraftRevision(
      'profile',
      data.profile.id || 'profile-sri-manikanta-korivi',
      profileForm,
      'draft'
    );
    if (res.success) {
      showToast('Profile draft revision saved. Use Admin Preview to view without altering published site.');
    } else {
      showToast(res.error || 'Failed to save profile draft.', 'error');
    }
  };

  // Project Save
  const handleSaveProjectForm = async () => {
    if (!projectForm.title || !projectForm.slug) {
      showToast('Title and URL slug are required.', 'error');
      return;
    }

    if (isCreatingProject) {
      const res = await createProject({
        title: projectForm.title,
        slug: projectForm.slug,
        subtitle: projectForm.subtitle || '',
        summary: projectForm.summary || '',
        description: projectForm.description || '',
        category: projectForm.category || 'Web Development',
        featured: projectForm.featured || false,
        status: projectForm.status || 'published',
        isVerified: projectForm.isVerified !== undefined ? projectForm.isVerified : true,
        projectStage: projectForm.projectStage || 'live',
        stageLabel: projectForm.stageLabel || 'Live Project',
        techStack: projectForm.techStack || [],
        tags: projectForm.tags || [],
        liveUrl: projectForm.liveUrl,
        githubUrl: projectForm.githubUrl,
        coverImage: projectForm.coverImage,
        keyHighlights: projectForm.keyHighlights || [],
        challenges: projectForm.challenges || [],
        contentBlocks: projectForm.contentBlocks || [],
        sortOrder: data.projects.length + 1,
      });

      if (res.success) {
        showToast('New project created successfully.');
        setIsCreatingProject(false);
        setEditingProject(null);
      } else {
        showToast(res.error || 'Failed to create project.', 'error');
      }
    } else if (editingProject) {
      const res = await saveProject({
        ...editingProject,
        ...projectForm,
      } as Project);

      if (res.success) {
        showToast('Project changes published to live site.');
        setEditingProject(null);
      } else {
        showToast(res.error || 'Failed to save project.', 'error');
      }
    }
  };

  const handleSaveProjectDraft = async () => {
    if (!editingProject) {
      showToast('Please create the project before saving draft revisions.', 'error');
      return;
    }
    const res = await saveDraftRevision('project', editingProject.id, projectForm, 'draft');
    if (res.success) {
      showToast('Project draft revision saved. Published live version remains untouched.');
      setEditingProject(null);
    } else {
      showToast(res.error || 'Failed to save project draft.', 'error');
    }
  };

  // Experience Save
  const handleSaveExperienceForm = async () => {
    if (!experienceForm.title || !experienceForm.organization) {
      showToast('Title and organization are required.', 'error');
      return;
    }

    if (isCreatingExperience) {
      const res = await createExperience({
        title: experienceForm.title,
        organization: experienceForm.organization,
        period: experienceForm.period || 'Generation 2',
        location: experienceForm.location,
        focus: experienceForm.focus || '',
        isVerified: experienceForm.isVerified !== undefined ? experienceForm.isVerified : true,
        status: experienceForm.status || 'published',
        bullets: experienceForm.bullets || [],
        skills: experienceForm.skills || [],
        contentBlocks: experienceForm.contentBlocks || [],
        sortOrder: data.experiences.length + 1,
      });

      if (res.success) {
        showToast('New experience created successfully.');
        setIsCreatingExperience(false);
        setEditingExperience(null);
      } else {
        showToast(res.error || 'Failed to create experience.', 'error');
      }
    } else if (editingExperience) {
      const res = await saveExperience({
        ...editingExperience,
        ...experienceForm,
      } as Experience);

      if (res.success) {
        showToast('Experience changes published to live site.');
        setEditingExperience(null);
      } else {
        showToast(res.error || 'Failed to save experience.', 'error');
      }
    }
  };

  const handleSaveExperienceDraft = async () => {
    if (!editingExperience) {
      showToast('Please create the experience entry first before saving draft revisions.', 'error');
      return;
    }
    const res = await saveDraftRevision('experience', editingExperience.id, experienceForm, 'draft');
    if (res.success) {
      showToast('Experience draft revision saved. Published live version remains untouched.');
      setEditingExperience(null);
    } else {
      showToast(res.error || 'Failed to save experience draft.', 'error');
    }
  };

  // Certification Save
  const handleSaveCertificationForm = async () => {
    if (!certificationForm.title || !certificationForm.issuer) {
      showToast('Title and issuing authority are required.', 'error');
      return;
    }

    if (isCreatingCertification) {
      const res = await createCertification({
        title: certificationForm.title,
        acronym: certificationForm.acronym,
        issuer: certificationForm.issuer,
        issueDate: certificationForm.issueDate || 'July 2026',
        credentialId: certificationForm.credentialId,
        verificationUrl: certificationForm.verificationUrl,
        isVerified: certificationForm.isVerified !== undefined ? certificationForm.isVerified : true,
        status: certificationForm.status || 'published',
        topics: certificationForm.topics || [],
        contentBlocks: certificationForm.contentBlocks || [],
        previewDocument: certificationForm.previewDocument,
        sortOrder: data.certifications.length + 1,
      });

      if (res.success) {
        showToast('New certification created successfully.');
        setIsCreatingCertification(false);
        setEditingCertification(null);
      } else {
        showToast(res.error || 'Failed to create certification.', 'error');
      }
    } else if (editingCertification) {
      const res = await saveCertification({
        ...editingCertification,
        ...certificationForm,
      } as Certification);

      if (res.success) {
        showToast('Certification changes published to live site.');
        setEditingCertification(null);
      } else {
        showToast(res.error || 'Failed to save certification.', 'error');
      }
    }
  };

  const handleSaveCertificationDraft = async () => {
    if (!editingCertification) {
      showToast('Please create the certification first before saving draft revisions.', 'error');
      return;
    }
    const res = await saveDraftRevision('certification', editingCertification.id, certificationForm, 'draft');
    if (res.success) {
      showToast('Certification draft revision saved. Published live version remains untouched.');
      setEditingCertification(null);
    } else {
      showToast(res.error || 'Failed to save certification draft.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181A18] flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-3.5 px-4 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === 'success'
              ? 'bg-[#EBF2EB] border-[#C5DEC9] text-[#2F4D33]'
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#38593E]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#B91C1C]" />
          )}
          <span>{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-75"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#E8E4DC] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4D5E4B]" />
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-[#181A18]">
              Portfolio CMS
            </h1>
            <p className="text-[10px] text-[#707670] font-mono-code hidden sm:block">
              Sri Manikanta Korivi • {user?.email || 'Administrator'}
            </p>
          </div>
        </div>

        {/* Global Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live vs Local Fallback Badge */}
          {isLiveConnected ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono-code px-2.5 py-1 rounded-full bg-[#EBF2EB] text-[#2F4D33] border border-[#C5DEC9]">
              <Database className="w-3 h-3 text-[#38593E]" />
              <span>Live Database</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono-code px-2.5 py-1 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
              <AlertCircle className="w-3 h-3" />
              <span>Setup Pending</span>
            </span>
          )}

          {/* Draft Preview Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !previewMode;
              setPreviewMode(next);
              showToast(next ? 'Draft Preview Mode Enabled' : 'Draft Preview Mode Disabled');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              previewMode
                ? 'bg-[#4D5E4B] text-white border-[#4D5E4B]'
                : 'bg-white text-[#414741] border-[#DCD6C9] hover:bg-[#FAF8F5]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Drafts</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            to="/"
            external
            icon={<ExternalLink className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            View Live Site
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            icon={<LogOut className="w-3.5 h-3.5" />}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-1 bg-white p-3 rounded-2xl border border-[#E8E4DC] shadow-xs">
          <div className="px-3 py-2 text-[10px] font-mono-code uppercase tracking-wider text-[#7A807A] font-semibold">
            CMS Modules
          </div>
          {navItems.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => {
                setActiveTab(item.tab);
                setEditingProject(null);
                setIsCreatingProject(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                activeTab === item.tab
                  ? 'bg-[#EBF0EA] text-[#334233] font-semibold'
                  : 'text-[#565C56] hover:bg-[#FAF8F5] hover:text-[#181A18]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-mono-code px-1.5 py-0.2 rounded-full ${
                    item.tab === 'inquiries' && inquiries.some((i) => !i.is_read)
                      ? 'bg-[#B91C1C] text-white font-bold'
                      : 'bg-[#FAF8F5] border border-[#DDD7CC] text-[#555B55]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Right Active Tab Content (9 cols) */}
        <main className="lg:col-span-9 space-y-6">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#181A18]">
                      Portfolio CMS Overview
                    </h2>
                    <p className="text-xs text-[#6E756E] mt-0.5">
                      Production Content Management System for Sri Manikanta Korivi.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={loading}
                    icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
                  >
                    Refresh Data
                  </Button>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] font-mono-code uppercase text-[#737A73] block">
                      Published Projects
                    </span>
                    <span className="text-xl font-bold text-[#181A18]">
                      {data.projects.filter((p) => p.status === 'published').length}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] font-mono-code uppercase text-[#737A73] block">
                      Pending Draft Revisions
                    </span>
                    <span className="text-xl font-bold text-[#735118]">
                      {draftRevisions.length}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] font-mono-code uppercase text-[#737A73] block">
                      Skill Competencies
                    </span>
                    <span className="text-xl font-bold text-[#181A18]">
                      {data.skills.reduce((acc, cat) => acc + cat.items.length, 0)}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] font-mono-code uppercase text-[#737A73] block">
                      Inquiries
                    </span>
                    <span className="text-xl font-bold text-[#181A18]">
                      {inquiries.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Database Connection Diagnostic Card */}
              <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#4D5E4B]" />
                    <h3 className="text-sm font-semibold text-[#181A18]">
                      Backend Database Status
                    </h3>
                  </div>
                  {isLiveConnected ? (
                    <Badge variant="verified" size="sm">
                      Connected &amp; Synchronized
                    </Badge>
                  ) : (
                    <Badge variant="prototype" size="sm">
                      Local Fallback Mode
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-[#525852] leading-relaxed">
                  {isLiveConnected
                    ? 'Your Supabase PostgreSQL database is connected and serving live data. Content changes saved here update the public portfolio immediately without redeployment.'
                    : 'Supabase credentials are not connected or tables are not initialized yet. The public site is safely rendering the verified portfolio records. To connect live PostgreSQL and Storage, execute the SQL migration files in your Supabase SQL editor.'}
                </p>

                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-between text-xs">
                  <span className="text-[#656C65]">Database Migrations Directory:</span>
                  <code className="font-mono-code text-[#181A18] text-[11px]">supabase/migrations/</code>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab('projects')}
                  className="p-5 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#CAD4CA] transition-colors cursor-pointer space-y-1"
                >
                  <FolderGit2 className="w-5 h-5 text-[#4D5E4B] mb-2" />
                  <h4 className="text-sm font-semibold text-[#181A18]">Manage Projects</h4>
                  <p className="text-xs text-[#6E756E]">
                    Edit project descriptions, live links, and modular content blocks.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('media')}
                  className="p-5 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#CAD4CA] transition-colors cursor-pointer space-y-1"
                >
                  <ImageIcon className="w-5 h-5 text-[#4D5E4B] mb-2" />
                  <h4 className="text-sm font-semibold text-[#181A18]">Media Library</h4>
                  <p className="text-xs text-[#6E756E]">
                    Upload and manage screenshots, diagrams, and protected documents.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('inquiries')}
                  className="p-5 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#CAD4CA] transition-colors cursor-pointer space-y-1"
                >
                  <Mail className="w-5 h-5 text-[#4D5E4B] mb-2" />
                  <h4 className="text-sm font-semibold text-[#181A18]">Inquiries</h4>
                  <p className="text-xs text-[#6E756E]">
                    Review messages submitted by visitors through the contact form.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE & HERO TAB */}
          {activeTab === 'profile' && (
            <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE]">
                <div>
                  <h3 className="text-base font-semibold text-[#181A18]">Profile &amp; Hero Section</h3>
                  <p className="text-xs text-[#6E756E]">
                    Edit public name, positioning headline, academic institution, and biography.
                  </p>
                </div>
                <Badge variant={profileForm.status === 'published' ? 'verified' : 'prototype'} size="sm">
                  {profileForm.status}
                </Badge>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Academic Institution
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.education.institution}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          education: { ...profileForm.education, institution: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                    Hero Main Headline (Positioning Tagline)
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                    Subheadline Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={profileForm.subheadline}
                    onChange={(e) => setProfileForm({ ...profileForm, subheadline: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] focus:bg-white resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={profileForm.education.degree}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          education: { ...profileForm.education, degree: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={profileForm.education.field}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          education: { ...profileForm.education, field: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Cohort (Start – End)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={profileForm.education.startYear}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            education: { ...profileForm.education, startYear: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                      />
                      <span>–</span>
                      <input
                        type="text"
                        value={profileForm.education.endYear}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            education: { ...profileForm.education, endYear: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                    Bio Paragraph 1
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio[0] || ''}
                    onChange={(e) => {
                      const updatedBio = [...profileForm.bio];
                      updatedBio[0] = e.target.value;
                      setProfileForm({ ...profileForm, bio: updatedBio });
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] resize-y"
                  />
                </div>

                <div>
                  <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                    Bio Paragraph 2 (Leadership &amp; Campus Collaboration)
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio[1] || ''}
                    onChange={(e) => {
                      const updatedBio = [...profileForm.bio];
                      updatedBio[1] = e.target.value;
                      setProfileForm({ ...profileForm, bio: updatedBio });
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] resize-y"
                  />
                </div>

                <ContentBlocksEditor blocks={profileForm.contentBlocks || []}
                  onChange={(blocks) => setProfileForm((previous) => ({ ...previous, contentBlocks: blocks }))} />

                <div className="pt-4 border-t border-[#EAE6DE] flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-[#181A18]">Publication Status:</label>
                    <select
                      value={profileForm.status}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          status: e.target.value as 'draft' | 'preview' | 'published',
                        })
                      }
                      className="px-2.5 py-1 text-xs rounded-md border border-[#DCD6C9] bg-[#FAF8F5]"
                    >
                      <option value="published">Published (Public)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="preview">Preview Only</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleSaveProfileDraft}
                      icon={<FileText className="w-3.5 h-3.5" />}
                    >
                      Save Draft Revision
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      icon={<Save className="w-3.5 h-3.5" />}
                    >
                      Publish Profile Changes
                    </Button>
                  </div>
                </div>

                {getDraftRevision('profile', data.profile.id || 'profile-sri-manikanta-korivi') && (
                  <div className="p-3.5 rounded-xl bg-[#FAF5EA] border border-[#ECD9B5] flex items-center justify-between text-xs text-[#7A5B1D]">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#B8860B]" />
                      <span>You have an unpublished draft revision saved for Profile. Enable Admin Preview Mode to inspect it.</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await publishDraftRevision('profile', data.profile.id || 'profile-sri-manikanta-korivi');
                          if (res.success) showToast('Profile draft revision published live.');
                          else showToast(res.error || 'Failed to publish draft.', 'error');
                        }}
                        className="font-semibold text-[#664D00] hover:underline"
                      >
                        Publish Now
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm('Discard profile draft revision?')) {
                            await discardDraftRevision('profile', data.profile.id || 'profile-sri-manikanta-korivi');
                            showToast('Profile draft discarded.');
                          }
                        }}
                        className="text-[#B91C1C] hover:underline"
                      >
                        Discard
                      </button>
                    </div>
              </div>
                )}
              </form>
            </div>
          )}

          {/* 3. PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Project Editor Form Modal / View */}
              {(editingProject || isCreatingProject) ? (
                <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE]">
                    <div>
                      <h3 className="text-base font-semibold text-[#181A18]">
                        {isCreatingProject ? 'Create New Project' : `Edit: ${editingProject?.title}`}
                      </h3>
                      <p className="text-xs text-[#6E756E]">
                        Configure case study details, verification badges, and modular content blocks.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingProject(null);
                        setIsCreatingProject(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                          Project Title <span className="text-[#B91C1C]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.title || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                          URL Slug <span className="text-[#B91C1C]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.slug || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={projectForm.category || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          placeholder="Full-Stack Web, AI Workflow Prototype, etc."
                          className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                          Project Stage
                        </label>
                        <select
                          value={projectForm.projectStage || 'live'}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              projectStage: e.target.value as 'live' | 'hackathon_prototype' | 'in_progress',
                            })
                          }
                          className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                        >
                          <option value="live">Live deployment</option>
                          <option value="hackathon_prototype">Hackathon Prototype (In Progress)</option>
                          <option value="in_progress">Active Workspace Development</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                          Stage Label
                        </label>
                        <input
                          type="text"
                          value={projectForm.stageLabel || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, stageLabel: e.target.value })}
                          placeholder="e.g. Internship Project • Public Demo"
                          className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={projectForm.subtitle || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Summary (Card Description)
                      </label>
                      <textarea
                        rows={2}
                        value={projectForm.summary || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] resize-y"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Detailed Description (Case Study Overview)
                      </label>
                      <textarea
                        rows={4}
                        value={projectForm.description || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] resize-y"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                          Live project URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={projectForm.liveUrl || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value || undefined })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                          GitHub Repository URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={projectForm.githubUrl || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value || undefined })}
                          placeholder="https://github.com/..."
                          className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Tech Stack (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(projectForm.techStack || []).join(', ')}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="React, Supabase, JavaScript, HTML/CSS"
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                      />
                    </div>

                    {/* Highlights */}
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Key Highlights (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={(projectForm.keyHighlights || []).join('\n')}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            keyHighlights: e.target.value.split('\n').filter(Boolean),
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] resize-y"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#EAE6DE] space-y-3">
                      <h4 className="text-sm font-semibold">Project cover image · Optional</h4>
                      <FileUpload kind="image" multiple={false} folder="projects" onUploaded={([asset]) => setProjectForm((previous) => ({ ...previous, coverImage: asset.url }))} />
                      {projectForm.coverImage && <div className="flex items-center gap-3">
                        <img src={projectForm.coverImage} alt="Project cover" className="h-24 w-40 rounded-lg object-cover" />
                        <button type="button" className="text-xs text-red-700" onClick={() => setProjectForm((previous) => ({ ...previous, coverImage: null }))}>Remove cover</button>
                      </div>}
                    </div>

                    {/* Flexible Content Blocks */}
                    <div className="pt-4 border-t border-[#EAE6DE]">
                      <ContentBlocksEditor
                        blocks={projectForm.contentBlocks || []}
                        onChange={(blocks) => setProjectForm({ ...projectForm, contentBlocks: blocks })}
                      />
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-[#EAE6DE] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-[#181A18]">Status:</label>
                        <select
                          value={projectForm.status || 'published'}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              status: e.target.value as 'draft' | 'preview' | 'published',
                            })
                          }
                          className="px-2.5 py-1 text-xs rounded-md border border-[#DCD6C9] bg-[#FAF8F5]"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="preview">Preview</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => {
                            setEditingProject(null);
                            setIsCreatingProject(false);
                          }}
                        >
                          Cancel
                        </Button>
                        {editingProject && (
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={handleSaveProjectDraft}
                            icon={<FileText className="w-3.5 h-3.5" />}
                          >
                            Save Draft Revision
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleSaveProjectForm}
                          icon={<Save className="w-3.5 h-3.5" />}
                        >
                          {editingProject ? 'Publish Live' : 'Create Project'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Projects List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DE]">
                    <div>
                      <h3 className="text-base font-semibold text-[#181A18]">Projects Directory</h3>
                      <p className="text-xs text-[#6E756E]">
                        Reorder, toggle published/draft status, edit case studies, or add new projects.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setIsCreatingProject(true);
                        setProjectForm({
                          title: '',
                          slug: '',
                          subtitle: '',
                          summary: '',
                          description: '',
                          category: 'Full-Stack Web',
                          projectStage: 'live',
                          stageLabel: 'Live Project',
                          status: 'draft',
                          featured: true,
                          techStack: ['React', 'TypeScript'],
                          keyHighlights: [],
                          contentBlocks: [],
                        });
                      }}
                      icon={<Plus className="w-3.5 h-3.5" />}
                    >
                      New Project
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {data.projects.map((project, idx) => {
                      const draftRev = getDraftRevision('project', project.id);
                      return (
                      <div
                        key={project.id}
                        className="p-5 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D5DDD2] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-lg">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono-code text-[11px] text-[#7A807A]">
                              0{idx + 1}
                            </span>
                            <h4 className="text-sm font-semibold text-[#181A18]">
                              {project.title}
                            </h4>
                            <Badge
                              variant={project.status === 'published' ? 'verified' : 'prototype'}
                              size="sm"
                            >
                              {project.status}
                            </Badge>
                            {draftRev && (
                              <Badge variant="prototype" size="sm">
                                Draft Revision Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[#6E756E] line-clamp-1">
                            {project.summary}
                          </p>
                          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono-code text-[#4D5E4B]">
                            <span>/{project.slug}</span>
                            <span>•</span>
                            <span>{project.category}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          {draftRev && (
                            <div className="flex items-center gap-1 bg-[#FAF5EA] border border-[#ECD9B5] px-2 py-1 rounded-lg">
                              <Button
                                variant="sage"
                                size="sm"
                                onClick={async () => {
                                  const res = await publishDraftRevision('project', project.id);
                                  if (res.success) showToast('Draft revision published live.');
                                  else showToast(res.error || 'Failed to publish draft.', 'error');
                                }}
                              >
                                Publish Draft
                              </Button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm('Discard pending draft revision for this project?')) {
                                    await discardDraftRevision('project', project.id);
                                    showToast('Draft revision discarded.');
                                  }
                                }}
                                className="text-[11px] text-[#B91C1C] hover:underline px-1 cursor-pointer"
                              >
                                Discard
                              </button>
                            </div>
                          )}

                          {/* Reorder */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const ids = data.projects.map((p) => p.id);
                              const temp = ids[idx];
                              ids[idx] = ids[idx - 1];
                              ids[idx - 1] = temp;
                              reorderProjects(ids);
                            }}
                            className="p-1.5 rounded-lg border border-[#E8E4DC] text-[#6E756E] hover:text-[#181A18] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === data.projects.length - 1}
                            onClick={() => {
                              const ids = data.projects.map((p) => p.id);
                              const temp = ids[idx];
                              ids[idx] = ids[idx + 1];
                              ids[idx + 1] = temp;
                              reorderProjects(ids);
                            }}
                            className="p-1.5 rounded-lg border border-[#E8E4DC] text-[#6E756E] hover:text-[#181A18] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Publish */}
                          <Button
                            variant={project.status === 'published' ? 'secondary' : 'sage'}
                            size="sm"
                            onClick={() =>
                              toggleProjectPublish(project.id, project.status !== 'published')
                            }
                          >
                            {project.status === 'published' ? 'Unpublish' : 'Publish'}
                          </Button>

                          {/* Edit */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProject(project);
                              setProjectForm(project);
                              setIsCreatingProject(false);
                            }}
                          >
                            Edit
                          </Button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete project "${project.title}"?`)) {
                                deleteProject(project.id);
                                showToast('Project deleted.');
                              }
                            }}
                            className="p-2 rounded-lg text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE]">
                <div>
                  <h3 className="text-base font-semibold text-[#181A18]">Skills Matrix Editor</h3>
                  <p className="text-xs text-[#6E756E]">
                    Manage programming fundamentals, web technologies, and developer tooling.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    const res = await saveSkills(skillsForm);
                    if (res.success) showToast('Skills matrix saved.');
                    else showToast(res.error || 'Failed to save skills.', 'error');
                  }}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Skills
                </Button>
              </div>

              <div className="space-y-6">
                {skillsForm.map((cat, cIdx) => (
                  <div key={cat.id} className="p-5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#181A18]">{cat.category}</h4>
                      <span className="text-[11px] font-mono-code text-[#7A807A]">
                        {cat.items.length} items
                      </span>
                    </div>

                    <p className="text-xs text-[#6E756E]">{cat.description}</p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {cat.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#DCD6C9] text-xs font-medium text-[#181A18]"
                        >
                          <span>{item.name}</span>
                          {item.note && (
                            <span className="text-[10px] text-[#4D5E4B]">({item.note})</span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...skillsForm];
                              copy[cIdx].items = copy[cIdx].items.filter((_, idx) => idx !== iIdx);
                              setSkillsForm(copy);
                            }}
                            className="hover:text-[#B91C1C] ml-1"
                            title="Remove item"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Skill Item */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add new skill in this category..."
                        id={`new-skill-input-${cat.id}`}
                        className="px-3 py-1.5 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18] max-w-xs focus:outline-none focus:ring-1 focus:ring-[#4D5E4B]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              const copy = [...skillsForm];
                              copy[cIdx].items.push({ name: val, isHighlight: true });
                              setSkillsForm(copy);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById(`new-skill-input-${cat.id}`) as HTMLInputElement;
                          if (el && el.value.trim()) {
                            const copy = [...skillsForm];
                            copy[cIdx].items.push({ name: el.value.trim(), isHighlight: true });
                            setSkillsForm(copy);
                            el.value = '';
                          }
                        }}
                        className="text-xs text-[#4D5E4B] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. EXPERIENCE & LEADERSHIP TAB */}
          {activeTab === 'experience' && (
            <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE]">
                <div>
                  <h3 className="text-base font-semibold text-[#181A18]">
                    Experience &amp; Campus Leadership
                  </h3>
                  <p className="text-xs text-[#6E756E]">
                    Manage KITS Innovation Club roles and academic timeline entries.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsCreatingExperience(true);
                    setEditingExperience(null);
                    setExperienceForm({
                      title: '',
                      organization: 'KITS Innovation Club',
                      period: '2024–Present',
                      focus: '',
                      bullets: [],
                      skills: [],
                      status: 'published',
                      isVerified: true,
                    });
                  }}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Experience
                </Button>
              </div>

              {/* Experience Edit / Create Form */}
              {(isCreatingExperience || editingExperience) && (
                <div className="p-6 rounded-2xl bg-[#F7FAF7] border border-[#CAD8C8] space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8E4D6]">
                    <h4 className="font-semibold text-sm text-[#181A18]">
                      {isCreatingExperience ? 'Add New Experience' : `Edit: ${editingExperience?.title}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingExperience(false);
                        setEditingExperience(null);
                      }}
                      className="p-1 text-[#6E756E] hover:text-[#181A18]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        required
                        value={experienceForm.title || ''}
                        onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                        placeholder="e.g. Tech Lead — Generation 2"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Organization
                      </label>
                      <input
                        type="text"
                        required
                        value={experienceForm.organization || ''}
                        onChange={(e) => setExperienceForm({ ...experienceForm, organization: e.target.value })}
                        placeholder="e.g. KITS Innovation Club"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Period / Timeline
                      </label>
                      <input
                        type="text"
                        value={experienceForm.period || ''}
                        onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                        placeholder="e.g. Generation 2"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Publication Status
                      </label>
                      <select
                        value={experienceForm.status || 'published'}
                        onChange={(e) =>
                          setExperienceForm({
                            ...experienceForm,
                            status: e.target.value as 'published' | 'draft',
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (Admin Only)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Focus Statement
                    </label>
                    <input
                      type="text"
                      value={experienceForm.focus || ''}
                      onChange={(e) => setExperienceForm({ ...experienceForm, focus: e.target.value })}
                      placeholder="e.g. Focus on collaboration, technical initiatives, and student innovation."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Key Highlights &amp; Responsibilities (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(experienceForm.bullets || []).join('\n')}
                      onChange={(e) =>
                        setExperienceForm({
                          ...experienceForm,
                          bullets: e.target.value.split('\n').filter((b) => b.trim().length > 0),
                        })
                      }
                      placeholder="Serving as Tech Lead for KITS Innovation Club Generation 2&#10;Promoting structured student innovation and collaborative project ideation"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Associated Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(experienceForm.skills || []).join(', ')}
                      onChange={(e) =>
                        setExperienceForm({
                          ...experienceForm,
                          skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Technical Initiatives, Student Innovation, Collaboration"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                    />
                  </div>

                  <ContentBlocksEditor blocks={experienceForm.contentBlocks || []}
                    onChange={(blocks) => setExperienceForm((previous) => ({ ...previous, contentBlocks: blocks }))} />

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCreatingExperience(false);
                        setEditingExperience(null);
                      }}
                    >
                      Cancel
                    </Button>
                    {editingExperience && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleSaveExperienceDraft}
                        icon={<FileText className="w-3.5 h-3.5" />}
                      >
                        Save Draft Revision
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveExperienceForm}
                      icon={<Save className="w-3.5 h-3.5" />}
                    >
                      {editingExperience ? 'Publish Live' : 'Create Experience'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {data.experiences.map((exp, idx) => {
                  const expDraft = getDraftRevision('experience', exp.id);
                  return (
                  <div
                    key={exp.id}
                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-[#181A18]">{exp.title}</h4>
                          <Badge variant="verified" size="sm">
                            {exp.period}
                          </Badge>
                          <Badge
                            variant={exp.status === 'published' ? 'sage' : 'neutral'}
                            size="sm"
                          >
                            {exp.status}
                          </Badge>
                          {expDraft && (
                            <Badge variant="prototype" size="sm">
                              Draft Revision Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#4D5E4B] font-medium mt-0.5">{exp.organization}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {expDraft && (
                          <div className="flex items-center gap-1 bg-[#FAF5EA] border border-[#ECD9B5] px-2 py-1 rounded-lg">
                            <Button
                              variant="sage"
                              size="sm"
                              onClick={async () => {
                                const res = await publishDraftRevision('experience', exp.id);
                                if (res.success) showToast('Experience draft revision published live.');
                                else showToast(res.error || 'Failed to publish draft.', 'error');
                              }}
                            >
                              Publish Draft
                            </Button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm('Discard pending draft revision for this experience?')) {
                                  await discardDraftRevision('experience', exp.id);
                                  showToast('Draft revision discarded.');
                                }
                              }}
                              className="text-[11px] text-[#B91C1C] hover:underline px-1 cursor-pointer"
                            >
                              Discard
                            </button>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingExperience(exp);
                            setIsCreatingExperience(false);
                            setExperienceForm(exp);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Delete "${exp.title}"?`)) {
                              deleteExperience(exp.id);
                              showToast('Experience entry deleted.');
                            }
                          }}
                          className="text-[#B91C1C] hover:bg-[#FEF2F2]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const ids = data.experiences.map((e) => e.id);
                            const temp = ids[idx];
                            ids[idx] = ids[idx - 1];
                            ids[idx - 1] = temp;
                            reorderExperience(ids);
                          }}
                          className="p-1 rounded text-[#6E756E] hover:text-[#181A18] disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === data.experiences.length - 1}
                          onClick={() => {
                            const ids = data.experiences.map((e) => e.id);
                            const temp = ids[idx];
                            ids[idx] = ids[idx + 1];
                            ids[idx + 1] = temp;
                            reorderExperience(ids);
                          }}
                          className="p-1 rounded text-[#6E756E] hover:text-[#181A18] disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#5D635D] italic">"{exp.focus}"</p>

                    <ul className="list-disc list-inside space-y-1 text-xs text-[#474D47]">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                );
                })}
              </div>
            </div>
          )}

          {/* 6. CERTIFICATIONS TAB */}
          {activeTab === 'certifications' && (
            <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE]">
                <div>
                  <h3 className="text-base font-semibold text-[#181A18]">
                    Professional Certifications
                  </h3>
                  <p className="text-xs text-[#6E756E]">
                    CLLMSP from Red Team Leaders and specialized security credentials.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsCreatingCertification(true);
                    setEditingCertification(null);
                    setCertificationForm({
                      title: '',
                      acronym: '',
                      issuer: 'Red Team Leaders',
                      issueDate: 'July 2026',
                      topics: [],
                      status: 'published',
                      isVerified: true,
                    });
                  }}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Credential
                </Button>
              </div>

              {/* Certification Edit / Create Form */}
              {(isCreatingCertification || editingCertification) && (
                <div className="p-6 rounded-2xl bg-[#F7FAF7] border border-[#CAD8C8] space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8E4D6]">
                    <h4 className="font-semibold text-sm text-[#181A18]">
                      {isCreatingCertification ? 'Add New Certification' : `Edit: ${editingCertification?.title}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingCertification(false);
                        setEditingCertification(null);
                      }}
                      className="p-1 text-[#6E756E] hover:text-[#181A18]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Credential Title
                      </label>
                      <input
                        type="text"
                        required
                        value={certificationForm.title || ''}
                        onChange={(e) => setCertificationForm({ ...certificationForm, title: e.target.value })}
                        placeholder="e.g. Certified LLM Security Professional"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Acronym / Badge
                      </label>
                      <input
                        type="text"
                        value={certificationForm.acronym || ''}
                        onChange={(e) => setCertificationForm({ ...certificationForm, acronym: e.target.value })}
                        placeholder="e.g. CLLMSP"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Issuing Authority
                      </label>
                      <input
                        type="text"
                        required
                        value={certificationForm.issuer || ''}
                        onChange={(e) => setCertificationForm({ ...certificationForm, issuer: e.target.value })}
                        placeholder="e.g. Red Team Leaders"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Issue Date
                      </label>
                      <input
                        type="text"
                        value={certificationForm.issueDate || ''}
                        onChange={(e) => setCertificationForm({ ...certificationForm, issueDate: e.target.value })}
                        placeholder="e.g. July 2026"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                        Status
                      </label>
                      <select
                        value={certificationForm.status || 'published'}
                        onChange={(e) =>
                          setCertificationForm({
                            ...certificationForm,
                            status: e.target.value as 'published' | 'draft',
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                      Evaluated Topics (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(certificationForm.topics || []).join(', ')}
                      onChange={(e) =>
                        setCertificationForm({
                          ...certificationForm,
                          topics: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Prompt Injection Defense, Adversarial Testing, LLM Vulnerabilities"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                    />
                  </div>

                  <ContentBlocksEditor blocks={certificationForm.contentBlocks || []}
                    onChange={(blocks) => setCertificationForm((previous) => ({ ...previous, contentBlocks: blocks }))} />

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCreatingCertification(false);
                        setEditingCertification(null);
                      }}
                    >
                      Cancel
                    </Button>
                    {editingCertification && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleSaveCertificationDraft}
                        icon={<FileText className="w-3.5 h-3.5" />}
                      >
                        Save Draft Revision
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveCertificationForm}
                      icon={<Save className="w-3.5 h-3.5" />}
                    >
                      {editingCertification ? 'Publish Live' : 'Create Credential'}
                    </Button>
                  </div>
                </div>
              )}

              {data.certifications.map((cert) => {
                const certDraft = getDraftRevision('certification', cert.id);
                return (
                <div
                  key={cert.id}
                  className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-4"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-semibold text-[#181A18]">{cert.title}</h4>
                        {certDraft && (
                          <Badge variant="prototype" size="sm">
                            Draft Revision Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#4D5E4B] font-medium mt-0.5">
                        Issuer: {cert.issuer} • Issued: {cert.issueDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {certDraft && (
                        <div className="flex items-center gap-1 bg-[#FAF5EA] border border-[#ECD9B5] px-2 py-1 rounded-lg">
                          <Button
                            variant="sage"
                            size="sm"
                            onClick={async () => {
                              const res = await publishDraftRevision('certification', cert.id);
                              if (res.success) showToast('Certification draft revision published live.');
                              else showToast(res.error || 'Failed to publish draft.', 'error');
                            }}
                          >
                            Publish Draft
                          </Button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm('Discard pending draft revision for this certification?')) {
                                await discardDraftRevision('certification', cert.id);
                                showToast('Draft revision discarded.');
                              }
                            }}
                            className="text-[11px] text-[#B91C1C] hover:underline px-1 cursor-pointer"
                          >
                            Discard
                          </button>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCertification(cert);
                          setIsCreatingCertification(false);
                          setCertificationForm(cert);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Delete "${cert.title}"?`)) {
                            deleteCertification(cert.id);
                            showToast('Certification deleted.');
                          }
                        }}
                        className="text-[#B91C1C] hover:bg-[#FEF2F2]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Badge variant="verified" size="sm">
                        Verified Active
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono-code font-semibold uppercase text-[#737A73] block">
                      Evaluated Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#DCD6C9] text-[#292F29]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EAE6DD] flex items-center justify-between text-xs text-[#6E756E]">
                    <span>Policy: Preview Only (Direct public download suppressed)</span>
                    <Badge variant="sage" size="sm">
                      Protected Specimen
                    </Badge>
                  </div>
                </div>
              );
              })}
            </div>
          )}

          {/* 7. RESUME TAB */}
          {activeTab === 'resume' && (
            <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-6">
              <div className="pb-4 border-b border-[#EAE6DE]">
                <h3 className="text-base font-semibold text-[#181A18]">Resume &amp; CV Management</h3>
                <p className="text-xs text-[#6E756E]">
                  Manage official curriculum vitae delivery and public download settings.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4D5E4B]" />
                    <span className="font-semibold text-sm text-[#181A18]">
                      Curriculum Vitae Download
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.allowResumeDownload}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, allowResumeDownload: e.target.checked })
                    }
                    className="rounded border-[#DCD6C9] text-[#4D5E4B]"
                  />
                </div>

                <p className="text-[#595F59] leading-relaxed">
                  When enabled, visitors can preview and download Sri Manikanta Korivi's verified CV directly from the header modal.
                </p>

                <div>
                  <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                    Uploaded PDF Path in Supabase Storage
                  </label>
                  <input
                    type="text"
                    value={settingsForm.resumeStoragePath || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, resumeStoragePath: e.target.value })
                    }
                    placeholder="resumes/sri_manikanta_korivi_resume.pdf"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-white text-[#181A18]"
                  />
                  <p className="text-[11px] text-[#787E78] mt-1">
                    Select an uploaded document below or type the exact storage path.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    const res = await saveSiteSettings(settingsForm);
                    if (res.success) showToast('Resume settings saved.');
                    else showToast(res.error || 'Failed to save settings.', 'error');
                  }}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Resume Settings
                </Button>

                <FileUpload kind="document" multiple={false} folder="resumes"
                  onUploaded={([asset]) => { setSettingsForm((previous) => ({ ...previous, resumeStoragePath: asset.path })); showToast('Resume uploaded. Save Resume Settings to apply it.'); }} />

                <div className="pt-4 border-t border-[#EAE6DE] space-y-2">
                  <h4 className="text-xs font-semibold text-[#181A18] font-mono-code">
                    Documents Storage Browser (portfolio-documents)
                  </h4>
                  <MediaManager
                    filterBucket="portfolio-documents"
                    selectionMode
                    onSelectFile={(selectedPath) => {
                      setSettingsForm((prev) => ({ ...prev, resumeStoragePath: selectedPath }));
                      showToast(`Selected document: ${selectedPath}`);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 8. MEDIA LIBRARY TAB */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#EAE6DE]">
                <h3 className="text-base font-semibold text-[#181A18]">Cloud Storage Media Library</h3>
                <p className="text-xs text-[#6E756E]">
                  Browse, upload, and manage assets in Supabase Storage buckets.
                </p>
              </div>
              <MediaManager />
            </div>
          )}

          {/* 9. INQUIRIES TAB */}
          {activeTab === 'inquiries' && (
            <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE]">
                <div>
                  <h3 className="text-base font-semibold text-[#181A18]">Contact Inquiries</h3>
                  <p className="text-xs text-[#6E756E]">
                    Messages submitted by public visitors through the portfolio contact form.
                  </p>
                </div>
                <Badge variant="sage" size="sm">
                  {inquiries.length} Total
                </Badge>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center rounded-xl border border-dashed border-[#DDD7CC] bg-[#FAF8F5] text-xs text-[#6E756E]">
                  No messages have been received yet. All new inquiries submitted on the public website will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-5 rounded-xl border transition-all text-xs space-y-2 ${
                        inq.is_read
                          ? 'bg-[#FAF8F5] border-[#E8E4DC]'
                          : 'bg-white border-[#CAD4CA] shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#181A18]">{inq.name}</span>
                            {!inq.is_read && (
                              <Badge variant="sage" size="sm">
                                New
                              </Badge>
                            )}
                          </div>
                          <a
                            href={`mailto:${inq.email}`}
                            className="text-[#4D5E4B] hover:underline font-mono-code text-[11px]"
                          >
                            {inq.email}
                          </a>
                        </div>
                        <span className="text-[10px] font-mono-code text-[#7A807A]">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {inq.subject && (
                        <p className="font-semibold text-[#292F29]">Subject: {inq.subject}</p>
                      )}

                      <p className="text-[#474D47] leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-lg border border-[#EFECE5]">
                        {inq.message}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE4]">
                        {!inq.is_read ? (
                          <button
                            type="button"
                            onClick={() => {
                              markInquiryRead(inq.id);
                              showToast('Marked as read.');
                            }}
                            className="text-[#4D5E4B] hover:underline font-medium text-xs cursor-pointer"
                          >
                            Mark as Read
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#7A807A]">Read</span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this inquiry?')) {
                              deleteInquiry(inq.id);
                              showToast('Inquiry removed.');
                            }
                          }}
                          className="text-[#B91C1C] hover:underline text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 10. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="p-7 rounded-2xl bg-white border border-[#E8E4DC] space-y-6">
              <div className="pb-4 border-b border-[#EAE6DE]">
                <h3 className="text-base font-semibold text-[#181A18]">Site Settings &amp; SEO</h3>
                <p className="text-xs text-[#6E756E]">
                  Configure global metadata, search engine title, and single-admin email authorization.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                    Global Page Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.siteTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                  />
                </div>

                <div>
                  <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                    Meta Description (SEO)
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.metaDescription}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, metaDescription: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] resize-y"
                  />
                </div>

                <div>
                  <label className="block font-mono-code font-semibold text-[#292F29] mb-1">
                    Authorized Single-Admin Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.adminEmail || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                    placeholder="e.g. admin@yourdomain.com"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18]"
                  />
                  <p className="text-[11px] text-[#787E78] mt-1">
                    Matches <code className="font-mono-code">VITE_ADMIN_EMAIL</code> in your environment variables.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE6DE]">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={async () => {
                      const res = await saveSiteSettings(settingsForm);
                      if (res.success) showToast('Settings saved.');
                    }}
                    icon={<Save className="w-3.5 h-3.5" />}
                  >
                    Save Site Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
