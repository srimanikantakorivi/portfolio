/**
 * Flexible Content Block System
 * Typed schemas for modular CMS blocks supporting optional rich media,
 * documents, and structured editorial content.
 */

export type ContentBlockType =
  | 'rich_text'
  | 'single_image'
  | 'image_gallery'
  | 'document_preview'
  | 'external_link'
  | 'embedded_video'
  | 'tech_tags'
  | 'project_highlights';

export interface BaseContentBlock {
  id: string;
  type: ContentBlockType;
  caption?: string;
  description?: string;
  order?: number;
}

export interface RichTextBlock extends BaseContentBlock {
  type: 'rich_text';
  content: string; // Markdown or clean text paragraphs
  heading?: string;
  lead?: boolean;
}

export interface SingleImageBlock extends BaseContentBlock {
  type: 'single_image';
  url: string;
  altText: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
}

export interface ImageGalleryBlock extends BaseContentBlock {
  type: 'image_gallery';
  images: {
    id: string;
    url: string;
    altText: string;
    caption?: string;
  }[];
  layout?: 'grid' | 'carousel';
}

export interface DocumentPreviewBlock extends BaseContentBlock {
  type: 'document_preview';
  documentTitle: string;
  documentType: 'pdf' | 'certificate' | 'resume';
  documentUrl?: string; // Path in Supabase Storage or asset URL
  fileName?: string;
  fileSizeBytes?: number;
  previewUrl?: string;
  allowDownload: boolean; // TRUE for resume, FALSE for certificates/sensitive documents
  privacyNotice?: string; // e.g. "Preview mode • Protected verification delivery"
  specimenData?: {
    recipientName?: string;
    issuerName?: string;
    issueDate?: string;
    topics?: string[];
  };
}

export interface ExternalLinkBlock extends BaseContentBlock {
  type: 'external_link';
  title: string;
  url: string;
  label?: string;
  isVerified?: boolean;
  linkType?: 'github' | 'live_demo' | 'external_doc' | 'other';
}

export interface EmbeddedVideoBlock extends BaseContentBlock {
  type: 'embedded_video';
  videoUrl: string;
  posterUrl?: string;
  title?: string;
}

export interface TechTagsBlock extends BaseContentBlock {
  type: 'tech_tags';
  tags: {
    name: string;
    category?: string;
    note?: string;
  }[];
}

export interface ProjectHighlightsBlock extends BaseContentBlock {
  type: 'project_highlights';
  title?: string;
  highlights: {
    title: string;
    detail: string;
    badge?: string;
  }[];
}

export type ContentBlock =
  | RichTextBlock
  | SingleImageBlock
  | ImageGalleryBlock
  | DocumentPreviewBlock
  | ExternalLinkBlock
  | EmbeddedVideoBlock
  | TechTagsBlock
  | ProjectHighlightsBlock;
