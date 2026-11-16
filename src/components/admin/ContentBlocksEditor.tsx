import React, { useState } from 'react';
import type { ContentBlock, ContentBlockType } from '../../types/contentBlocks';
import {
  FileText,
  Image,
  Images,
  FileCheck,
  Link,
  Video,
  Tag,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '../common/Button';
import { FileUpload, type UploadedAsset } from './FileUpload';
import { ContentBlockRenderer } from '../blocks/ContentBlockRenderer';
import { MediaManager } from './MediaManager';

interface ContentBlocksEditorProps {
  blocks: ContentBlock[];
  onChange: (updatedBlocks: ContentBlock[]) => void;
}

export const ContentBlocksEditor: React.FC<ContentBlocksEditorProps> = ({ blocks, onChange }) => {
  const [selectedTypeToAdd, setSelectedTypeToAdd] = useState<ContentBlockType>('rich_text');
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(blocks[0]?.id || null);
  const [showPreview, setShowPreview] = useState(false);
  const [library, setLibrary] = useState<'portfolio-media' | 'portfolio-documents' | null>(null);
  const attachFiles = (assets: UploadedAsset[]) => {
    const added: ContentBlock[] = assets.map((asset) => asset.kind === 'image' ? {
      id: crypto.randomUUID(), type: 'single_image', url: asset.url || '',
      altText: asset.name.replace(/\.[^.]+$/, ''), caption: '', aspectRatio: 'auto',
    } : {
      id: crypto.randomUUID(), type: 'document_preview', documentTitle: asset.name.replace(/\.pdf$/i, ''),
      documentType: 'pdf', documentUrl: asset.path, fileName: asset.name,
      fileSizeBytes: asset.size, allowDownload: false,
    });
    onChange([...blocks, ...added]);
    setExpandedBlockId(added[0]?.id || null);
  };

  const blockTypeLabels: Record<ContentBlockType, { label: string; icon: React.ReactNode }> = {
    rich_text: { label: 'Rich Text Paragraph', icon: <FileText className="w-4 h-4 text-[#4D5E4B]" /> },
    single_image: { label: 'Single Image', icon: <Image className="w-4 h-4 text-[#4D5E4B]" /> },
    image_gallery: { label: 'Image Gallery', icon: <Images className="w-4 h-4 text-[#4D5E4B]" /> },
    document_preview: { label: 'PDF / Document Preview', icon: <FileCheck className="w-4 h-4 text-[#4D5E4B]" /> },
    external_link: { label: 'External Resource Link', icon: <Link className="w-4 h-4 text-[#4D5E4B]" /> },
    embedded_video: { label: 'Embedded Video', icon: <Video className="w-4 h-4 text-[#4D5E4B]" /> },
    tech_tags: { label: 'Technology Tags Row', icon: <Tag className="w-4 h-4 text-[#4D5E4B]" /> },
    project_highlights: { label: 'Highlights Grid', icon: <Sparkles className="w-4 h-4 text-[#4D5E4B]" /> },
  };

  const handleAddBlock = () => {
    const id = `block-${Date.now()}`;
    let newBlock: ContentBlock;

    switch (selectedTypeToAdd) {
      case 'rich_text':
        newBlock = {
          id,
          type: 'rich_text',
          heading: '',
          content: '',
          lead: false,
          caption: '',
        };
        break;
      case 'single_image':
        newBlock = {
          id,
          type: 'single_image',
          url: '',
          altText: 'Project screenshot or diagram',
          caption: '',
          aspectRatio: '16/9',
        };
        break;
      case 'image_gallery':
        newBlock = {
          id,
          type: 'image_gallery',
          images: [],
          caption: '',
        };
        break;
      case 'document_preview':
        newBlock = {
          id,
          type: 'document_preview',
          documentTitle: 'Document Title',
          documentType: 'pdf',
          allowDownload: false,
          privacyNotice: 'Protected preview derivative',
        };
        break;
      case 'external_link':
        newBlock = {
          id,
          type: 'external_link',
          title: 'External Resource',
          url: 'https://',
          description: '',
        };
        break;
      case 'embedded_video':
        newBlock = {
          id,
          type: 'embedded_video',
          videoUrl: '',
          caption: '',
        };
        break;
      case 'tech_tags':
        newBlock = {
          id,
          type: 'tech_tags',
          tags: [{ name: 'React', note: 'Frontend' }],
        };
        break;
      case 'project_highlights':
        newBlock = {
          id,
          type: 'project_highlights',
          title: 'Key Innovations',
          highlights: [{ title: 'Highlight Title', detail: 'Description of key milestone or capability' }],
        };
        break;
    }

    const updated = [...blocks, newBlock];
    onChange(updated);
    setExpandedBlockId(id);
  };

  const handleRemoveBlock = (id: string) => {
    if (window.confirm('Remove this content block?')) {
      onChange(blocks.filter((b) => b.id !== id));
      if (expandedBlockId === id) setExpandedBlockId(null);
    }
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onChange(copy);
  };

  const handleUpdateBlock = (id: string, updatedFields: Partial<ContentBlock>) => {
    const updated = blocks.map((b) => (b.id === id ? ({ ...b, ...updatedFields } as ContentBlock) : b));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E8E4DC] bg-white p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><h4 className="text-sm font-semibold">Attachments <span className="text-xs font-normal text-[#6E756E]">· Optional</span></h4>
            <p className="text-xs text-[#6E756E] mt-1">Add screenshots, certificates or supporting PDFs. Skip this section when no files are needed.</p></div>
          <button type="button" onClick={() => setShowPreview(!showPreview)} aria-pressed={showPreview}
            className="rounded-lg border border-[#DCD6C9] px-3 py-2 text-xs">{showPreview ? 'Back to editing' : 'Preview content'}</button>
        </div>
        <FileUpload onUploaded={attachFiles} />
        <div className="flex flex-wrap gap-3 text-xs text-[#4D5E4B]">
          <button type="button" className="underline" onClick={() => setLibrary(library === 'portfolio-media' ? null : 'portfolio-media')}>Choose existing image</button>
          <button type="button" className="underline" onClick={() => setLibrary(library === 'portfolio-documents' ? null : 'portfolio-documents')}>Choose existing PDF</button>
        </div>
        {library && <MediaManager key={library} filterBucket={library} selectionMode onSelectFile={(urlOrPath, item) => {
          attachFiles([{ name: item?.name || urlOrPath.split('/').pop() || 'Attachment', path: item?.path || urlOrPath,
            url: item?.publicUrl || (urlOrPath.startsWith('https://') ? urlOrPath : undefined), size: item?.metadata?.size || 0,
            kind: (item?.bucket || library) === 'portfolio-media' ? 'image' : 'document' }]); setLibrary(null);
        }} />}
        <p className="text-[11px] text-[#6E756E]">Images use public media storage. PDF attachments stay private and can be previewed by the admin. Save the entry to keep attachments linked. Removing an attachment here unlinks it; the file stays in your Media Library.</p>
      </div>
      {showPreview && <div className="rounded-xl border border-[#D5DDD2] bg-[#FAF8F5] p-5" aria-label="Content preview">
        {blocks.length ? blocks.map((block) => <ContentBlockRenderer key={block.id} block={block} />) : <p className="text-xs text-[#6E756E]">No attachments or content yet.</p>}
      </div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE6DE]">
        <div>
          <h4 className="text-sm font-semibold text-[#181A18]">Modular Content Blocks</h4>
          <p className="text-xs text-[#6E756E]">
            Add rich text, media attachments, and structured elements. Reorder or remove as needed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTypeToAdd}
            onChange={(e) => setSelectedTypeToAdd(e.target.value as ContentBlockType)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-[#DCD6C9] bg-white text-[#181A18] focus:outline-none focus:ring-1 focus:ring-[#4D5E4B]"
          >
            {Object.entries(blockTypeLabels).map(([type, { label }]) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddBlock}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Block
          </Button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-[#DDD7CC] bg-[#FAF8F5] text-xs text-[#6B726B]">
          No modular content blocks attached yet. Select a block type above to enrich this item.
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => {
            const isExpanded = expandedBlockId === block.id;
            const typeInfo = blockTypeLabels[block.type];

            return (
              <div
                key={block.id}
                className="rounded-xl border border-[#E8E4DC] bg-white shadow-xs overflow-hidden"
              >
                {/* Block Accordion Header */}
                <div className="p-3.5 bg-[#FAF8F5] flex items-center justify-between gap-2 border-b border-[#EAE6DD]">
                  <div
                    className="flex items-center gap-2.5 cursor-pointer flex-1"
                    onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                  >
                    {typeInfo.icon}
                    <span className="text-xs font-semibold text-[#181A18]">
                      {index + 1}. {typeInfo.label}
                    </span>
                    {block.type === 'rich_text' && block.heading && (
                      <span className="text-xs text-[#6B726B] truncate max-w-xs">
                        — {block.heading}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button type="button" title="Duplicate block" className="px-2 py-1 text-[11px] text-[#4D5E4B]"
                      onClick={() => { const copy = { ...structuredClone(block), id: crypto.randomUUID() }; const next = [...blocks]; next.splice(index + 1, 0, copy); onChange(next); setExpandedBlockId(copy.id); }}>Duplicate</button>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveBlock(index, 'up')}
                      className="p-1 rounded text-[#6E756E] hover:text-[#181A18] disabled:opacity-30 disabled:pointer-events-none"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === blocks.length - 1}
                      onClick={() => handleMoveBlock(index, 'down')}
                      className="p-1 rounded text-[#6E756E] hover:text-[#181A18] disabled:opacity-30 disabled:pointer-events-none"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(block.id)}
                      className="p-1 rounded text-[#A33B3B] hover:bg-[#FEEFEF]"
                      title="Delete block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                      className="p-1 rounded text-[#6E756E]"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Block Fields Editor */}
                {isExpanded && (
                  <div className="p-4 space-y-3.5 text-xs">
                    {/* Rich Text Fields */}
                    {block.type === 'rich_text' && (
                      <>
                        <div>
                          <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                            Heading (Optional)
                          </label>
                          <input
                            type="text"
                            value={block.heading || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { heading: e.target.value })}
                            placeholder="Section Title"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                            Paragraph Content
                          </label>
                          <textarea
                            rows={4}
                            value={block.content || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                            placeholder="Write formatted markdown or text..."
                            className="w-full px-3 py-2 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18] focus:bg-white resize-y"
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={block.lead || false}
                              onChange={(e) => handleUpdateBlock(block.id, { lead: e.target.checked })}
                              className="rounded border-[#DCD6C9] text-[#4D5E4B] focus:ring-[#4D5E4B]"
                            />
                            <span>Format as Lead Paragraph (Enlarged editorial style)</span>
                          </label>
                        </div>
                      </>
                    )}

                    {/* Single Image Fields */}
                    {block.type === 'single_image' && (
                      <>
                        <FileUpload kind="image" multiple={false} onUploaded={([asset]) => handleUpdateBlock(block.id, { url: asset.url || '', altText: block.altText || asset.name })} />
                        {block.url && <img src={block.url} alt={block.altText} className="max-h-40 rounded-lg object-contain" />}
                        <div>
                          <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                            Image URL or Storage Path
                          </label>
                          <input
                            type="text"
                            value={block.url || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { url: e.target.value })}
                            placeholder="https://... or upload in Media Library"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18] focus:bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                              Alt Description
                            </label>
                            <input
                              type="text"
                              value={block.altText || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { altText: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                            />
                          </div>

                          <div>
                            <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                              Caption
                            </label>
                            <input
                              type="text"
                              value={block.caption || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { caption: e.target.value })}
                              placeholder="Photo / diagram caption"
                              className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {block.type === 'image_gallery' && <div className="space-y-3">
                      <FileUpload kind="image" onUploaded={(assets) => handleUpdateBlock(block.id, { images: [...block.images, ...assets.map((asset) => ({ id: crypto.randomUUID(), url: asset.url || '', altText: asset.name, caption: '' }))] })} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {block.images.map((image, imageIndex) => <div key={image.id} className="rounded-lg border border-[#E8E4DC] p-3 space-y-2">
                          <img src={image.url} alt={image.altText} className="h-28 w-full rounded object-contain" />
                          <input aria-label={`Image ${imageIndex + 1} description`} value={image.altText} className="w-full rounded border border-[#DCD6C9] p-2 text-xs" placeholder="Image description"
                            onChange={(event) => handleUpdateBlock(block.id, { images: block.images.map((item) => item.id === image.id ? { ...item, altText: event.target.value } : item) })} />
                          <input aria-label={`Image ${imageIndex + 1} caption`} value={image.caption || ''} className="w-full rounded border border-[#DCD6C9] p-2 text-xs" placeholder="Optional caption"
                            onChange={(event) => handleUpdateBlock(block.id, { images: block.images.map((item) => item.id === image.id ? { ...item, caption: event.target.value } : item) })} />
                          <div className="flex gap-3 text-xs">
                            <button type="button" disabled={imageIndex === 0} className="disabled:opacity-30" onClick={() => { const images = [...block.images]; [images[imageIndex - 1], images[imageIndex]] = [images[imageIndex], images[imageIndex - 1]]; handleUpdateBlock(block.id, { images }); }}>Move earlier</button>
                            <button type="button" className="text-red-700" onClick={() => handleUpdateBlock(block.id, { images: block.images.filter((item) => item.id !== image.id) })}>Remove image</button>
                          </div>
                        </div>)}
                      </div>
                    </div>}

                    {/* Document Preview Fields */}
                    {block.type === 'document_preview' && (
                      <>
                        <FileUpload kind="document" multiple={false} onUploaded={([asset]) => handleUpdateBlock(block.id, { documentUrl: asset.path, fileName: asset.name, fileSizeBytes: asset.size, documentTitle: asset.name.replace(/\.pdf$/i, '') })} />
                        {block.fileName && <p className="text-xs text-[#4D5E4B]">Attached: {block.fileName}{block.fileSizeBytes ? ` · ${(block.fileSizeBytes / 1024).toFixed(0)} KB` : ''}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                              Document Title
                            </label>
                            <input
                              type="text"
                              value={block.documentTitle || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { documentTitle: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                            />
                          </div>

                          <div>
                            <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                              Document Type
                            </label>
                            <select
                              value={block.documentType || 'pdf'}
                              onChange={(e) =>
                                handleUpdateBlock(block.id, {
                                  documentType: e.target.value as 'pdf' | 'certificate' | 'resume',
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                            >
                              <option value="pdf">Standard PDF</option>
                              <option value="certificate">Certification (Preview-Only)</option>
                              <option value="resume">Resume / CV (Downloadable)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                            Document URL or Storage Path
                          </label>
                          <input
                            type="text"
                            value={block.documentUrl || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { documentUrl: e.target.value })}
                            placeholder="resumes/resume.pdf"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                          />
                        </div>

                        <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE6DD] flex items-center justify-between">
                          <span className="text-xs font-medium text-[#181A18]">
                            Show download action when this document is accessible
                          </span>
                          <input
                            type="checkbox"
                            checked={block.allowDownload || false}
                            onChange={(e) => handleUpdateBlock(block.id, { allowDownload: e.target.checked })}
                            className="rounded border-[#DCD6C9] text-[#4D5E4B] focus:ring-[#4D5E4B]"
                          />
                        </div>
                      </>
                    )}

                    {/* External Link Fields */}
                    {block.type === 'external_link' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                            Link Title
                          </label>
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                          />
                        </div>

                        <div>
                          <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                            Destination URL
                          </label>
                          <input
                            type="url"
                            value={block.url || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { url: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Embedded Video Fields */}
                    {block.type === 'embedded_video' && (
                      <div>
                        <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                          Video Embed URL (YouTube or Vimeo embed URL)
                        </label>
                        <input
                          type="url"
                          value={block.videoUrl || ''}
                          onChange={(e) => handleUpdateBlock(block.id, { videoUrl: e.target.value })}
                          placeholder="https://www.youtube.com/embed/..."
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                        />
                      </div>
                    )}

                    {/* Technology Tags Fields */}
                    {block.type === 'tech_tags' && (
                      <div className="space-y-2">
                        <label className="block font-mono-code text-[11px] font-semibold text-[#414741]">
                          Tag Items (comma separated)
                        </label>
                        <input
                          type="text"
                          value={block.tags.map((t) => t.name).join(', ')}
                          onChange={(e) => {
                            const names = e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            handleUpdateBlock(block.id, { tags: names.map((name) => ({ name })) });
                          }}
                          placeholder="React, TypeScript, Supabase"
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                        />
                      </div>
                    )}

                    {/* Project Highlights Fields */}
                    {block.type === 'project_highlights' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block font-mono-code text-[11px] font-semibold text-[#414741] mb-1">
                            Highlights Group Title
                          </label>
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            placeholder="Key Innovations"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-xs text-[#181A18]"
                          />
                        </div>

                        {block.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="p-3 rounded-lg border border-[#E8E4DC] bg-[#FAF8F5] space-y-2">
                            <input
                              type="text"
                              value={h.title}
                              onChange={(e) => {
                                const copy = [...block.highlights];
                                copy[hIdx] = { ...copy[hIdx], title: e.target.value };
                                handleUpdateBlock(block.id, { highlights: copy });
                              }}
                              placeholder="Highlight Point Title"
                              className="w-full px-2.5 py-1 text-xs font-semibold rounded border border-[#DCD6C9] bg-white text-[#181A18]"
                            />
                            <textarea
                              rows={2}
                              value={h.detail}
                              onChange={(e) => {
                                const copy = [...block.highlights];
                                copy[hIdx] = { ...copy[hIdx], detail: e.target.value };
                                handleUpdateBlock(block.id, { highlights: copy });
                              }}
                              placeholder="Detail of capability or implementation"
                              className="w-full px-2.5 py-1 text-xs rounded border border-[#DCD6C9] bg-white text-[#181A18] resize-y"
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateBlock(block.id, {
                              highlights: [
                                ...block.highlights,
                                { title: 'New Highlight', detail: 'Description of capability' },
                              ],
                            });
                          }}
                          className="text-xs text-[#4D5E4B] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add highlight item</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
