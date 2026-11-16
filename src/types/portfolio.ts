import type { ContentBlock, DocumentPreviewBlock } from './contentBlocks';

export type PublicationStatus = 'draft' | 'preview' | 'published';

export interface Education {
  degree: string;
  field: string;
  institution: string;
  startYear: string;
  endYear: string;
  currentStatus: string;
}

export interface Profile {
  id: string;
  name: string;
  tagline: string;
  subheadline: string;
  status: PublicationStatus;
  education: Education;
  bio: string[];
  location?: string;
  email?: string; // Optional — hidden if empty or unverified
  githubUrl: string; // Verified public profile
  linkedinUrl?: string; // Optional — hidden if empty or unverified
  resumeUrl?: string;
  statusBadge: string;
  roles: string[];
  contentBlocks?: ContentBlock[];
  updatedAt: string;
}

export interface DraftRevision {
  id: string;
  entityType: 'project' | 'experience' | 'certification' | 'profile' | 'skill' | 'site_settings';
  entityId: string;
  draftData: Record<string, unknown> | object;
  status: 'draft' | 'preview';
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  id: string;
  siteTitle: string;
  metaDescription: string;
  adminEmail?: string;
  resumeStoragePath?: string;
  allowResumeDownload: boolean;
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  category: string;
  featured: boolean;
  status: PublicationStatus;
  isVerified: boolean;
  projectStage: 'live' | 'hackathon_prototype' | 'in_progress';
  stageLabel: string;
  techStack: string[];
  tags: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  coverImage?: string | null; // Optional: intentional typography layout used when omitted
  keyHighlights: string[];
  challenges?: string[];
  contentBlocks?: ContentBlock[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  period: string;
  location?: string;
  focus: string;
  isVerified: boolean;
  status: PublicationStatus;
  bullets: string[];
  skills: string[];
  contentBlocks?: ContentBlock[];
  sortOrder: number;
}

export interface Certification {
  id: string;
  title: string;
  acronym?: string;
  issuer: string;
  issueDate: string;
  credentialId?: string; // Optional — hidden unless confirmed
  verificationUrl?: string; // Optional — hidden unless confirmed
  previewDocument?: DocumentPreviewBlock; // Dedicated document preview (preview-only, no download)
  contentBlocks?: ContentBlock[];
  isVerified: boolean;
  status: PublicationStatus;
  topics: string[];
  sortOrder: number;
}

export interface SkillCategory {
  id: string;
  category: string;
  description: string;
  items: {
    name: string;
    note?: string;
    isHighlight?: boolean;
  }[];
  sortOrder: number;
}

export interface ContactChannel {
  id: string;
  platform: string;
  label: string;
  value: string;
  url?: string;
  isVerified: boolean;
  isVisible: boolean; // Determines public rendering
}

export interface PortfolioData {
  profile: Profile;
  skills: SkillCategory[];
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  contactChannels: ContactChannel[];
}
