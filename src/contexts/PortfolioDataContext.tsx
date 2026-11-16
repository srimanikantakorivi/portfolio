import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  PortfolioData,
  Profile,
  Project,
  SkillCategory,
  Experience,
  Certification,
  DraftRevision,
  SiteSettings,
} from '../types/portfolio';
import { portfolioData as initialVerifiedData } from '../data/portfolioData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

export type { SiteSettings, DraftRevision };

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface PortfolioDataContextType {
  data: PortfolioData;
  siteSettings: SiteSettings;
  inquiries: Inquiry[];
  loading: boolean;
  dataError: string | null;
  isLiveConnected: boolean;
  previewMode: boolean;
  setPreviewMode: (enabled: boolean) => void;
  refreshData: () => Promise<void>;

  // Draft Revisions (Independent persistence & preview)
  draftRevisions: DraftRevision[];
  saveDraftRevision: (
    entityType: DraftRevision['entityType'],
    entityId: string,
    draftData: Record<string, unknown> | object,
    status?: 'draft' | 'preview'
  ) => Promise<{ success: boolean; error?: string }>;
  publishDraftRevision: (
    entityType: DraftRevision['entityType'],
    entityId: string
  ) => Promise<{ success: boolean; error?: string }>;
  discardDraftRevision: (
    entityType: DraftRevision['entityType'],
    entityId: string
  ) => Promise<{ success: boolean; error?: string }>;
  getDraftRevision: (
    entityType: DraftRevision['entityType'],
    entityId: string
  ) => DraftRevision | undefined;

  // Profile
  saveProfile: (updated: Profile) => Promise<{ success: boolean; error?: string }>;

  // Projects
  saveProject: (project: Project) => Promise<{ success: boolean; error?: string }>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleProjectPublish: (id: string, publish: boolean) => Promise<{ success: boolean; error?: string }>;
  reorderProjects: (orderedIds: string[]) => Promise<{ success: boolean; error?: string }>;

  // Skills
  saveSkills: (categories: SkillCategory[]) => Promise<{ success: boolean; error?: string }>;

  // Experience
  saveExperience: (exp: Experience) => Promise<{ success: boolean; error?: string }>;
  createExperience: (exp: Omit<Experience, 'id'>) => Promise<{ success: boolean; error?: string }>;
  deleteExperience: (id: string) => Promise<{ success: boolean; error?: string }>;
  reorderExperience: (orderedIds: string[]) => Promise<{ success: boolean; error?: string }>;

  // Certifications
  saveCertification: (cert: Certification) => Promise<{ success: boolean; error?: string }>;
  createCertification: (cert: Omit<Certification, 'id'>) => Promise<{ success: boolean; error?: string }>;
  deleteCertification: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Inquiries
  submitInquiry: (inquiry: { name: string; email: string; subject?: string; message: string }) => Promise<{ success: boolean; error?: string }>;
  markInquiryRead: (id: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // Site Settings
  saveSiteSettings: (settings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
}

const defaultSettings: SiteSettings = {
  id: 'primary',
  siteTitle: 'Sri Manikanta Korivi — Software Development & Modern Web Experiences',
  metaDescription:
    'B.Tech Computer Science & Engineering student at KITS Akshar Institute of Technology. Building modern web experiences and exploring practical AI-assisted workflows.',
  adminEmail: undefined, // Strict truth-in-data: No placeholder email; populated when configured by admin
  allowResumeDownload: false, // Strict publication lock: disabled by default until explicitly published
  updatedAt: new Date().toISOString(),
};

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isManagementView = location.pathname.startsWith('/admin');
  const [data, setData] = useState<PortfolioData>(initialVerifiedData);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [draftRevisions, setDraftRevisions] = useState<DraftRevision[]>([]);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [dataError, setDataError] = useState<string | null>(isSupabaseConfigured ? null : 'Portfolio connection is not configured.');
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const fetchLivePortfolioData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLiveConnected(false);
      setDataError('Portfolio connection is not configured.');
      return;
    }

    try {
      setLoading(true);
      setDataError(null);

      // In admin or preview mode, fetch all items; in public mode, only published
      const statusFilter = isAdmin ? ['published', 'draft', 'preview'] : ['published'];

      // 1. Fetch Profile
      const { data: profileRes, error: profErr } = await supabase
        .from('portfolio_profile')
        .select('*')
        .in('status', statusFilter)
        .limit(1)
        .maybeSingle();

      // 2. Fetch Projects
      const { data: projectsRes, error: projErr } = await supabase
        .from('portfolio_projects')
        .select('*')
        .in('status', statusFilter)
        .order('sort_order', { ascending: true });

      // 3. Fetch Skills
      const { data: skillsRes, error: skillErr } = await supabase
        .from('portfolio_skills')
        .select('*')
        .in('status', statusFilter)
        .order('sort_order', { ascending: true });

      // 4. Fetch Experience
      const { data: expRes, error: expErr } = await supabase
        .from('portfolio_experience')
        .select('*')
        .in('status', statusFilter)
        .order('sort_order', { ascending: true });

      // 5. Fetch Certifications
      const { data: certRes, error: certErr } = await supabase
        .from('portfolio_certifications')
        .select('*')
        .in('status', statusFilter)
        .order('sort_order', { ascending: true });

      // 6. Fetch Settings
      const { data: settingsRes, error: settingsErr } = await supabase
        .from('portfolio_site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      // 7. If admin, fetch Inquiries and Draft Revisions
      if (isAdmin) {
        const { data: inqRes } = await supabase
          .from('portfolio_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (inqRes) {
          setInquiries(inqRes as Inquiry[]);
        }

        const { data: draftRes } = await supabase
          .from('portfolio_draft_revisions')
          .select('*')
          .order('updated_at', { ascending: false });

        if (draftRes) {
          setDraftRevisions(
            draftRes.map((d) => ({
              id: d.id,
              entityType: d.entity_type,
              entityId: d.entity_id,
              draftData: d.draft_data as Record<string, unknown>,
              status: d.status,
              createdAt: d.created_at,
              updatedAt: d.updated_at,
            }))
          );
        }
      }

      if (profErr || projErr || skillErr || expErr || certErr) {
        console.warn('One or more live queries returned notices:', {
          profErr,
          projErr,
          skillErr,
          expErr,
          certErr,
        });
      }

      if (!profErr && !projErr && !skillErr && !expErr && !certErr && !settingsErr) {
        setIsLiveConnected(true);

        setData((prev) => ({
          profile: profileRes
            ? {
                id: profileRes.id,
                name: profileRes.name,
                tagline: profileRes.tagline,
                subheadline: profileRes.subheadline,
                status: profileRes.status,
                education: profileRes.education,
                bio: profileRes.bio,
                location: profileRes.location,
                email: profileRes.email,
                githubUrl: profileRes.github_url,
                linkedinUrl: profileRes.linkedin_url,
                resumeUrl: profileRes.resume_url,
                statusBadge: profileRes.status_badge,
                roles: profileRes.roles,
                contentBlocks: profileRes.content_blocks,
                updatedAt: profileRes.updated_at,
              }
            : { ...prev.profile, status: 'draft' },
          projects: projectsRes !== null
            ? projectsRes.map((p) => ({
                id: p.id,
                slug: p.slug,
                title: p.title,
                subtitle: p.subtitle,
                summary: p.summary,
                description: p.description,
                category: p.category,
                featured: p.featured,
                status: p.status,
                isVerified: p.is_verified,
                projectStage: p.project_stage,
                stageLabel: p.stage_label,
                techStack: p.tech_stack,
                tags: p.tags,
                liveUrl: p.live_url,
                githubUrl: p.github_url,
                coverImage: p.cover_image,
                keyHighlights: p.key_highlights,
                challenges: p.challenges,
                contentBlocks: p.content_blocks,
                sortOrder: p.sort_order,
                createdAt: p.created_at,
                updatedAt: p.updated_at,
              }))
            : prev.projects,
          skills: skillsRes !== null
            ? skillsRes.map((s) => ({
                id: s.id,
                category: s.category,
                description: s.description,
                items: s.items,
                sortOrder: s.sort_order,
              }))
            : prev.skills,
          experiences: expRes !== null
            ? expRes.map((e) => ({
                id: e.id,
                title: e.title,
                organization: e.organization,
                period: e.period,
                location: e.location,
                focus: e.focus,
                isVerified: e.is_verified,
                status: e.status,
                bullets: e.bullets,
                skills: e.skills,
                contentBlocks: e.content_blocks,
                sortOrder: e.sort_order,
              }))
            : prev.experiences,
          certifications: certRes !== null
            ? certRes.map((c) => ({
                id: c.id,
                title: c.title,
                acronym: c.acronym,
                issuer: c.issuer,
                issueDate: c.issue_date,
                credentialId: c.credential_id,
                verificationUrl: c.verification_url,
                previewDocument: c.preview_document,
                contentBlocks: c.content_blocks || [],
                isVerified: c.is_verified,
                status: c.status,
                topics: c.topics,
                sortOrder: c.sort_order,
              }))
            : prev.certifications,
          contactChannels: prev.contactChannels,
        }));

        if (settingsRes) {
          setSiteSettings({
            id: settingsRes.id,
            siteTitle: settingsRes.site_title,
            metaDescription: settingsRes.meta_description,
            adminEmail: settingsRes.admin_email,
            resumeStoragePath: settingsRes.resume_storage_path,
            allowResumeDownload: settingsRes.allow_resume_download,
            updatedAt: settingsRes.updated_at,
          });
        }
      }
      else { setIsLiveConnected(false); setDataError('Unable to load the portfolio. Please try again.'); }
    } catch (err) {
      console.warn('Supabase fetch failed; remaining on local verified data:', err);
      setIsLiveConnected(false);
      setDataError('Unable to load the portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    let ignore = false;
    void Promise.resolve().then(() => {
      if (!ignore) {
        fetchLivePortfolioData();
      }
    });
    return () => {
      ignore = true;
    };
  }, [fetchLivePortfolioData]);

  useEffect(() => {
    if (isAdmin) return;
    queueMicrotask(() => {
      setPreviewMode(false);
      setDraftRevisions([]);
      setInquiries([]);
      setData((previous) => ({
        ...previous,
        projects: previous.projects.filter((item) => item.status === 'published'),
        experiences: previous.experiences.filter((item) => item.status === 'published'),
        certifications: previous.certifications.filter((item) => item.status === 'published'),
      }));
    });
  }, [isAdmin]);

  // Draft Revisions: Independent draft persistence
  const saveDraftRevision = async (
    entityType: DraftRevision['entityType'],
    entityId: string,
    draftData: Record<string, unknown> | object,
    status: 'draft' | 'preview' = 'draft'
  ): Promise<{ success: boolean; error?: string }> => {
    const revision: DraftRevision = {
      id: `draft-${entityType}-${entityId}`,
      entityType,
      entityId,
      draftData,
      status,
      updatedAt: new Date().toISOString(),
    };

    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_draft_revisions').upsert(
          {
            entity_type: entityType,
            entity_id: entityId,
            draft_data: draftData,
            status,
            updated_at: revision.updatedAt,
          },
          { onConflict: 'entity_type,entity_id' }
        );
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setDraftRevisions((prev) => {
      const rest = prev.filter((d) => !(d.entityType === entityType && d.entityId === entityId));
      return [revision, ...rest];
    });

    return { success: true };
  };

  const discardDraftRevision = async (
    entityType: DraftRevision['entityType'],
    entityId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('portfolio_draft_revisions')
          .delete()
          .eq('entity_type', entityType)
          .eq('entity_id', entityId);
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setDraftRevisions((prev) =>
      prev.filter((d) => !(d.entityType === entityType && d.entityId === entityId))
    );

    return { success: true };
  };

  const getDraftRevision = useCallback(
    (entityType: DraftRevision['entityType'], entityId: string): DraftRevision | undefined => {
      return draftRevisions.find((d) => d.entityType === entityType && d.entityId === entityId);
    },
    [draftRevisions]
  );

  // Profile Save
  const saveProfile = async (updated: Profile): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_profile').upsert({
          id: updated.id || 'profile-sri-manikanta-korivi',
          name: updated.name,
          tagline: updated.tagline,
          subheadline: updated.subheadline,
          education: updated.education,
          bio: updated.bio,
          location: updated.location,
          email: updated.email,
          github_url: updated.githubUrl,
          linkedin_url: updated.linkedinUrl,
          resume_url: updated.resumeUrl,
          status_badge: updated.statusBadge,
          roles: updated.roles,
          content_blocks: updated.contentBlocks || [],
          status: updated.status,
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({ ...prev, profile: updated }));

    return { success: true };
  };

  // Projects Actions
  const saveProject = async (project: Project): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_projects').upsert({
          id: project.id,
          slug: project.slug,
          title: project.title,
          subtitle: project.subtitle,
          summary: project.summary,
          description: project.description,
          category: project.category,
          featured: project.featured,
          project_stage: project.projectStage,
          stage_label: project.stageLabel,
          status: project.status,
          is_verified: project.isVerified,
          tech_stack: project.techStack,
          tags: project.tags,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          cover_image: project.coverImage,
          key_highlights: project.keyHighlights,
          challenges: project.challenges || [],
          content_blocks: project.contentBlocks || [],
          sort_order: project.sortOrder,
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
    }));

    return { success: true };
  };

  const createProject = async (
    newProj: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; error?: string }> => {
    const id = `proj-${Date.now()}`;
    const project: Project = {
      ...newProj,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_projects').insert({
          id: project.id,
          slug: project.slug,
          title: project.title,
          subtitle: project.subtitle,
          summary: project.summary,
          description: project.description,
          category: project.category,
          featured: project.featured,
          project_stage: project.projectStage,
          stage_label: project.stageLabel,
          status: project.status,
          is_verified: project.isVerified,
          tech_stack: project.techStack,
          tags: project.tags,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          cover_image: project.coverImage,
          key_highlights: project.keyHighlights,
          challenges: project.challenges || [],
          content_blocks: project.contentBlocks || [],
          sort_order: project.sortOrder,
          created_at: project.createdAt,
          updated_at: project.updatedAt,
        });

        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({ ...prev, projects: [...prev.projects, project] }));

    return { success: true };
  };

  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));

    return { success: true };
  };

  const toggleProjectPublish = async (id: string, publish: boolean): Promise<{ success: boolean; error?: string }> => {
    const targetStatus = publish ? 'published' : 'draft';
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('portfolio_projects')
          .update({ status: targetStatus, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, status: targetStatus } : p)),
    }));

    return { success: true };
  };

  const reorderProjects = async (orderedIds: string[]): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          const { error } = await supabase
            .from('portfolio_projects')
            .update({ sort_order: i + 1 })
            .eq('id', orderedIds[i]);
          if (error) throw error;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => {
      const reordered = [...prev.projects].sort(
        (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
      );
      return {
        ...prev,
        projects: reordered.map((p, idx) => ({ ...p, sortOrder: idx + 1 })),
      };
    });

    return { success: true };
  };

  // Skills
  const saveSkills = async (categories: SkillCategory[]): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        for (const cat of categories) {
          const { error } = await supabase.from('portfolio_skills').upsert({
            id: cat.id,
            category: cat.category,
            description: cat.description,
            items: cat.items,
            sort_order: cat.sortOrder,
            status: 'published',
            updated_at: new Date().toISOString(),
          });
          if (error) throw error;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({ ...prev, skills: categories }));

    return { success: true };
  };

  // Experience
  const saveExperience = async (exp: Experience): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_experience').upsert({
          id: exp.id,
          title: exp.title,
          organization: exp.organization,
          period: exp.period,
          location: exp.location,
          focus: exp.focus,
          is_verified: exp.isVerified,
          status: exp.status,
          bullets: exp.bullets,
          skills: exp.skills,
          content_blocks: exp.contentBlocks || [],
          sort_order: exp.sortOrder,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === exp.id ? exp : e)),
    }));

    return { success: true };
  };

  const createExperience = async (exp: Omit<Experience, 'id'>): Promise<{ success: boolean; error?: string }> => {
    const newExp: Experience = { ...exp, id: `exp-${Date.now()}` };
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_experience').insert({
          id: newExp.id,
          title: newExp.title,
          organization: newExp.organization,
          period: newExp.period,
          location: newExp.location,
          focus: newExp.focus,
          is_verified: newExp.isVerified,
          status: newExp.status,
          bullets: newExp.bullets,
          skills: newExp.skills,
          content_blocks: newExp.contentBlocks || [],
          sort_order: newExp.sortOrder,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({ ...prev, experiences: [...prev.experiences, newExp] }));

    return { success: true };
  };

  const deleteExperience = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_experience').delete().eq('id', id);
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));

    return { success: true };
  };

  const reorderExperience = async (orderedIds: string[]): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          const { error } = await supabase
            .from('portfolio_experience')
            .update({ sort_order: i + 1 })
            .eq('id', orderedIds[i]);
          if (error) throw error;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => {
      const reordered = [...prev.experiences].sort(
        (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
      );
      return {
        ...prev,
        experiences: reordered.map((e, idx) => ({ ...e, sortOrder: idx + 1 })),
      };
    });

    return { success: true };
  };

  // Certifications
  const saveCertification = async (cert: Certification): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_certifications').upsert({
          id: cert.id,
          title: cert.title,
          acronym: cert.acronym,
          issuer: cert.issuer,
          issue_date: cert.issueDate,
          credential_id: cert.credentialId,
          verification_url: cert.verificationUrl,
          preview_document: cert.previewDocument,
          content_blocks: cert.contentBlocks || [],
          allow_download: false, // Strictly preview-only
          is_verified: cert.isVerified,
          status: cert.status,
          topics: cert.topics,
          sort_order: cert.sortOrder,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === cert.id ? cert : c)),
    }));

    return { success: true };
  };

  const createCertification = async (
    cert: Omit<Certification, 'id'>
  ): Promise<{ success: boolean; error?: string }> => {
    const newCert: Certification = { ...cert, id: `cert-${Date.now()}` };
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_certifications').insert({
          id: newCert.id,
          title: newCert.title,
          acronym: newCert.acronym,
          issuer: newCert.issuer,
          issue_date: newCert.issueDate,
          credential_id: newCert.credentialId,
          verification_url: newCert.verificationUrl,
          preview_document: newCert.previewDocument,
          content_blocks: newCert.contentBlocks || [],
          allow_download: false,
          is_verified: newCert.isVerified,
          status: newCert.status,
          topics: newCert.topics,
          sort_order: newCert.sortOrder,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));

    return { success: true };
  };

  const deleteCertification = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_certifications').delete().eq('id', id);
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));

    return { success: true };
  };

  // Publish Draft Revision directly into live table
  const publishDraftRevision = async (
    entityType: DraftRevision['entityType'],
    entityId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const draft = draftRevisions.find((d) => d.entityType === entityType && d.entityId === entityId);
    if (!draft) {
      return { success: false, error: 'Draft revision not found.' };
    }

    try {
      if (entityType === 'project') {
        const base = data.projects.find((p) => p.id === entityId) || ({} as Project);
        const res = await saveProject({
          ...base,
          ...draft.draftData,
          id: entityId,
          status: 'published',
        } as Project);
        if (!res.success) return res;
      } else if (entityType === 'experience') {
        const base = data.experiences.find((e) => e.id === entityId) || ({} as Experience);
        const res = await saveExperience({
          ...base,
          ...draft.draftData,
          id: entityId,
          status: 'published',
        } as Experience);
        if (!res.success) return res;
      } else if (entityType === 'certification') {
        const base = data.certifications.find((c) => c.id === entityId) || ({} as Certification);
        const res = await saveCertification({
          ...base,
          ...draft.draftData,
          id: entityId,
          status: 'published',
        } as Certification);
        if (!res.success) return res;
      } else if (entityType === 'profile') {
        const res = await saveProfile({
          ...data.profile,
          ...draft.draftData,
          id: entityId,
          status: 'published',
        } as Profile);
        if (!res.success) return res;
      } else if (entityType === 'site_settings') {
        const res = await saveSiteSettings({
          ...siteSettings,
          ...draft.draftData,
        });
        if (!res.success) return res;
      }

      return await discardDraftRevision(entityType, entityId);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { success: false, error: errorMsg };
    }
  };

  // Inquiries
  const submitInquiry = async (inquiry: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = inquiry.name?.trim() || '';
    const trimmedEmail = inquiry.email?.trim().toLowerCase() || '';
    const trimmedSubject = inquiry.subject?.trim();
    const trimmedMessage = inquiry.message?.trim() || '';

    // Field-length and format validations matching database constraints
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return { success: false, error: 'Name must be between 2 and 100 characters.' };
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (trimmedEmail.length < 5 || trimmedEmail.length > 255 || !emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (trimmedSubject && trimmedSubject.length > 150) {
      return { success: false, error: 'Subject cannot exceed 150 characters.' };
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 3000) {
      return { success: false, error: 'Message must be between 10 and 3000 characters.' };
    }

    if (!supabase) return { success: false, error: 'Contact form is unavailable. Please try again later.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_inquiries').insert({
          name: trimmedName,
          email: trimmedEmail,
          subject: trimmedSubject || null,
          message: trimmedMessage,
        });
        if (error) {
          // Check for rate-limiting trigger message
          const msg = error.message || '';
          if (msg.includes('Rate limit exceeded') || msg.includes('Maximum of 3 inquiries')) {
            return { success: false, error: msg };
          }
          throw error;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    return { success: true };
  };

  const markInquiryRead = async (id: string) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, is_read: true } : i)));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('portfolio_inquiries').update({ is_read: true }).eq('id', id);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('portfolio_inquiries').delete().eq('id', id);
    }
  };

  // Site Settings
  const saveSiteSettings = async (
    settings: Partial<SiteSettings>
  ): Promise<{ success: boolean; error?: string }> => {
    const updated = { ...siteSettings, ...settings, updatedAt: new Date().toISOString() };
    if (!isAdmin || !supabase) return { success: false, error: 'An authorized admin connection is required.' };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_site_settings').upsert({
          id: 'primary',
          site_title: updated.siteTitle,
          meta_description: updated.metaDescription,
          admin_email: updated.adminEmail || null,
          resume_storage_path: updated.resumeStoragePath || null,
          allow_resume_download: updated.allowResumeDownload,
          updated_at: updated.updatedAt,
        });
        if (error) throw error;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { success: false, error: errorMsg };
      }
    }

    setSiteSettings(updated);

    return { success: true };
  };

  // Dynamically overlay draft revisions when in previewMode
  const previewData = useMemo(() => {
    if (!isAdmin || !previewMode || draftRevisions.length === 0) {
      return data;
    }

    const merged: PortfolioData = {
      ...data,
      projects: data.projects.map((p) => {
        const draft = draftRevisions.find((d) => d.entityType === 'project' && d.entityId === p.id);
        return draft ? ({ ...p, ...draft.draftData } as Project) : p;
      }),
      experiences: data.experiences.map((e) => {
        const draft = draftRevisions.find((d) => d.entityType === 'experience' && d.entityId === e.id);
        return draft ? ({ ...e, ...draft.draftData } as Experience) : e;
      }),
      certifications: data.certifications.map((c) => {
        const draft = draftRevisions.find((d) => d.entityType === 'certification' && d.entityId === c.id);
        return draft ? ({ ...c, ...draft.draftData } as Certification) : c;
      }),
    };

    const profDraft = draftRevisions.find((d) => d.entityType === 'profile');
    if (profDraft) {
      merged.profile = { ...merged.profile, ...profDraft.draftData } as Profile;
    }

    return merged;
  }, [data, draftRevisions, previewMode, isAdmin]);

  const displayedData = useMemo(() => {
    if (isAdmin && (isManagementView || previewMode)) return previewData;
    return {
      ...data,
      projects: data.projects.filter((item) => item.status === 'published'),
      experiences: data.experiences.filter((item) => item.status === 'published'),
      certifications: data.certifications.filter((item) => item.status === 'published'),
    };
  }, [data, previewData, isAdmin, isManagementView, previewMode]);

  return (
    <PortfolioDataContext.Provider
      value={{
        data: displayedData,
        siteSettings,
        inquiries,
        draftRevisions,
        loading,
        dataError,
        isLiveConnected,
        previewMode: isAdmin && previewMode,
        setPreviewMode,
        refreshData: fetchLivePortfolioData,
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
        submitInquiry,
        markInquiryRead,
        deleteInquiry,
        saveSiteSettings,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = (): PortfolioDataContextType => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};
