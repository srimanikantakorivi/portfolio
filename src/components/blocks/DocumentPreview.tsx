import { useState } from 'react';
import type { DocumentPreviewBlock } from '../../types/contentBlocks';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function DocumentPreview({ block }: { block: DocumentPreviewBlock }) {
  const { isAdmin } = useAuth();
  const [source, setSource] = useState<string>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const path = block.documentUrl || block.previewUrl;
  const storedDocument = Boolean(path && !/^https:\/\//i.test(path) && !path.startsWith('/'));
  const resolve = async () => {
    if (open) { setOpen(false); return; }
    if (!path) return;
    setLoading(true);
    setError('');
    try {
      if (/^https:\/\//i.test(path) || path.startsWith('/')) setSource(path);
      else {
        if (!supabase) throw new Error('Document preview is unavailable.');
        const { data, error: signingError } = await supabase.storage.from('portfolio-documents').createSignedUrl(path, 300);
        if (signingError) throw signingError;
        setSource(data.signedUrl);
      }
      setOpen(true);
    } catch {
      setError('This document is unavailable or has not been published. Please try again later.');
    } finally { setLoading(false); }
  };
  if (!block.documentUrl && !block.previewUrl) return null;
  if (storedDocument && !isAdmin) return null;
  return <div className="space-y-3">
    <button type="button" onClick={() => void resolve()} disabled={loading} aria-expanded={open}
      className="rounded-lg border border-[#D5DDD2] bg-[#EBF0EA] px-4 py-2 text-xs font-medium text-[#334233] disabled:opacity-50">
      {loading ? 'Opening document.' : open ? 'Close preview' : 'Preview document'}
    </button>
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    {open && source && <>
      <iframe src={`${source}#toolbar=0`} title={block.documentTitle} className="h-[65vh] min-h-80 w-full rounded-lg border border-[#E8E4DC]" />
      <a href={source} target="_blank" rel="noopener noreferrer" className="text-xs underline text-[#4D5E4B]">{block.allowDownload ? 'Open or download PDF' : 'Open preview in a new tab'}</a>
      <p className="text-[11px] text-[#6E756E]">If the preview expires, close it and open it again.</p>
    </>}
  </div>;
}
