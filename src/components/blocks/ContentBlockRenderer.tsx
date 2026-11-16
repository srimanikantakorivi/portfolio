import React from 'react';
import type { ContentBlock } from '../../types/contentBlocks';
import { ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { DocumentPreview } from './DocumentPreview';
import { useAuth } from '../../contexts/AuthContext';

interface ContentBlockRendererProps {
  block: ContentBlock;
  className?: string;
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ block, className = '' }) => {
  const { isAdmin } = useAuth();
  if (block.type === 'document_preview') {
    const path = block.documentUrl || block.previewUrl;
    if (path && !/^https:\/\//i.test(path) && !path.startsWith('/') && !isAdmin) return null;
  }
  switch (block.type) {
    case 'rich_text':
      return (
        <div className={`space-y-3 ${className}`}>
          {block.heading && (
            <h3 className="text-xl sm:text-2xl font-semibold text-[#181A18] tracking-tight">
              {block.heading}
            </h3>
          )}
          <div
            className={`text-[#414741] leading-relaxed ${
              block.lead ? 'text-lg sm:text-xl font-normal text-[#2A2E2A]' : 'text-sm sm:text-base'
            }`}
          >
            {block.content}
          </div>
          {block.caption && (
            <p className="text-xs text-[#707670] italic pt-1 border-l-2 border-[#D6DDD4] pl-3">
              {block.caption}
            </p>
          )}
        </div>
      );

    case 'single_image':
      if (!block.url) return null;
      return (
        <figure className={`space-y-2.5 my-6 ${className}`}>
          <div className="overflow-hidden rounded-xl border border-[#E8E4DC] bg-[#F4F0E8]">
            <img
              src={block.url}
              alt={block.altText}
              className="w-full h-auto object-cover max-h-[480px]"
              loading="lazy"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-[#707670] text-center font-mono-code">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'image_gallery':
      if (!block.images.length) return null;
      return (
        <div className={`space-y-3 my-6 ${className}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {block.images.map((img) => (
              <figure key={img.id} className="space-y-1.5">
                <div className="overflow-hidden rounded-lg border border-[#E8E4DC] bg-[#F4F0E8] aspect-4/3">
                  <img
                    src={img.url}
                    alt={img.altText}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {img.caption && (
                  <figcaption className="text-[11px] text-[#707670] font-mono-code">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
          {block.caption && (
            <p className="text-xs text-[#707670] text-center">{block.caption}</p>
          )}
        </div>
      );

    case 'document_preview':
      return (
        <div
          className={`p-5 sm:p-6 rounded-xl border border-[#E0DCD3] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 my-6 ${className}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFECE5]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#EBF0EA] text-[#4D5E4B] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-[#181A18]">
                  {block.documentTitle}
                </h4>
                <p className="text-xs text-[#707670] mt-0.5">
                  Document Type: <span className="uppercase font-mono-code">{block.documentType}</span>
                  {block.fileName && `  ${block.fileName}`}
                </p>
              </div>
            </div>


          </div>

          <DocumentPreview block={block} />

          {/* Specimen / Detail Overview */}
          {block.specimenData && (
            <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#EAE6DD] text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {block.specimenData.recipientName && (
                  <div>
                    <span className="text-[#757C75] block">Certified Professional</span>
                    <span className="font-semibold text-[#181A18]">
                      {block.specimenData.recipientName}
                    </span>
                  </div>
                )}
                {block.specimenData.issuerName && (
                  <div>
                    <span className="text-[#757C75] block">Issuing Authority</span>
                    <span className="font-semibold text-[#181A18]">
                      {block.specimenData.issuerName}
                    </span>
                  </div>
                )}
                {block.specimenData.issueDate && (
                  <div>
                    <span className="text-[#757C75] block">Date of Issue</span>
                    <span className="font-mono-code text-[#181A18]">
                      {block.specimenData.issueDate}
                    </span>
                  </div>
                )}
              </div>

              {block.specimenData.topics && block.specimenData.topics.length > 0 && (
                <div className="pt-2 border-t border-[#EAE6DD]">
                  <span className="text-[#757C75] block mb-1.5">Evaluated Competencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {block.specimenData.topics.map((t, idx) => (
                      <Badge key={idx} variant="sage" size="sm">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {block.privacyNotice && (
            <p className="text-[11px] text-[#787E78] leading-relaxed">
              {block.privacyNotice}
            </p>
          )}
        </div>
      );

    case 'external_link':
      return (
        <div className={`my-3 ${className}`}>
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4D5E4B] hover:text-[#384637] transition-colors group underline underline-offset-4"
          >
            <span>{block.title}</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
          {block.description && (
            <p className="text-xs text-[#6F756F] mt-0.5">{block.description}</p>
          )}
        </div>
      );

    case 'embedded_video':
      return (
        <div className={`my-6 space-y-2 ${className}`}>
          <div className="aspect-16/9 rounded-xl overflow-hidden border border-[#E8E4DC] bg-black">
            <iframe
              src={block.videoUrl}
              title={block.title || 'Embedded Video'}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
          {block.caption && (
            <p className="text-xs text-[#707670] text-center">{block.caption}</p>
          )}
        </div>
      );

    case 'tech_tags':
      return (
        <div className={`flex flex-wrap gap-1.5 my-4 ${className}`}>
          {block.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-xs font-mono-code px-2.5 py-1 rounded bg-[#F4F0E8] text-[#333833] border border-[#E4DFD5]"
            >
              <span>{tag.name}</span>
              {tag.note && <span className="text-[10px] text-[#7A8079]">({tag.note})</span>}
            </span>
          ))}
        </div>
      );

    case 'project_highlights':
      return (
        <div className={`space-y-3 my-6 ${className}`}>
          {block.title && (
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#181A18]">
              {block.title}
            </h4>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {block.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#E8E4DC] bg-white space-y-1"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4D5E4B] shrink-0" />
                  <h5 className="text-xs sm:text-sm font-semibold text-[#181A18]">
                    {item.title}
                  </h5>
                </div>
                <p className="text-xs text-[#595F59] pl-6 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};
