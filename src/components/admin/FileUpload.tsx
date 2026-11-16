import { useEffect, useId, useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadStorageFile, validateUploadFile } from '../../lib/storage';

export interface UploadedAsset {
  name: string;
  path: string;
  url?: string;
  size: number;
  kind: 'image' | 'document';
}

interface Props {
  onUploaded: (assets: UploadedAsset[]) => void;
  kind?: 'image' | 'document' | 'any';
  multiple?: boolean;
  folder?: string;
}

export function FileUpload({ onUploaded, kind = 'any', multiple = true, folder = 'attachments' }: Props) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const onUploadedRef = useRef(onUploaded);
  useEffect(() => { onUploadedRef.current = onUploaded; }, [onUploaded]);
  const busy = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [complete, setComplete] = useState(0);
  const [retryFiles, setRetryFiles] = useState<File[]>([]);

  const upload = async (selected: File[]) => {
    if (busy.current || !selected.length) return;
    busy.current = true;
    setUploading(true);
    setIssues([]);
    setComplete(0);
    const failures: string[] = [];
    const failedFiles: File[] = [];
    const assets: UploadedAsset[] = [];
    const files = (multiple ? selected : selected.slice(0, 1)).slice(0, 12);
    if (selected.length > 12) failures.push('Upload up to 12 files at a time. Select the remaining files afterwards.');
    const seen = new Set<string>();
    try {
      for (const [index, file] of files.entries()) {
        const key = `${file.name}:${file.size}:${file.lastModified}`;
        if (seen.has(key)) continue;
        seen.add(key);
        setProgress(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
        const assetKind = file.type === 'application/pdf' ? 'document' : 'image';
        const validation = validateUploadFile(file, assetKind);
        if ((kind !== 'any' && kind !== assetKind) || !validation.valid) {
          failures.push(`${file.name}: ${validation.error || `Choose a ${kind} file.`}`);
          continue;
        }
        const result = await uploadStorageFile(file,
          assetKind === 'document' ? 'portfolio-documents' : 'portfolio-media', folder);
        if (!result.success || !result.path) {
          failures.push(`${file.name}: ${result.error || 'Upload failed.'}`);
          failedFiles.push(file);
        } else {
          assets.push({ name: file.name, size: file.size, path: result.path, url: result.publicUrl, kind: assetKind });
        }
      }
      if (assets.length) onUploadedRef.current(assets);
      setComplete(assets.length);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : 'Upload interrupted. Please try again.');
    } finally {
      setIssues(failures);
      setRetryFiles(failedFiles);
      setProgress('');
      setUploading(false);
      busy.current = false;
      if (input.current) input.current.value = '';
    }
  };

  const accept = kind === 'image' ? 'image/jpeg,image/png,image/webp,image/svg+xml'
    : kind === 'document' ? 'application/pdf' : 'image/jpeg,image/png,image/webp,image/svg+xml,application/pdf';

  return (
    <div className="space-y-2">
      <div onDragOver={(event) => { event.preventDefault(); if (!uploading) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void upload(Array.from(event.dataTransfer.files)); }}
        className={`rounded-xl border-2 border-dashed p-5 transition-colors ${dragging ? 'border-[#4D5E4B] bg-[#EBF0EA]' : 'border-[#DCD6C9] bg-[#FAF8F5]'}`}>
        <div className="flex flex-wrap items-center gap-3">
          <Upload className="h-5 w-5 text-[#4D5E4B]" aria-hidden="true" />
          <div className="flex-1 min-w-40">
            <p className="text-sm font-semibold">{uploading ? 'Uploading files…' : 'Drop files here or browse'}</p>
            <p className="text-xs text-[#6E756E] mt-1">
              {kind !== 'document' && 'JPG, PNG, WebP, SVG · up to 5 MB each'}
              {kind === 'any' && ' | '}{kind !== 'image' && 'PDF · up to 10 MB each'}
            </p>
          </div>
          <input ref={input} id={inputId} type="file" accept={accept} multiple={multiple} disabled={uploading}
            className="sr-only" aria-label="Choose files to upload" onChange={(event) => void upload(Array.from(event.target.files ?? []))} />
          <button type="button" disabled={uploading} onClick={() => input.current?.click()}
            className="rounded-lg bg-[#4D5E4B] px-4 py-2 text-xs font-medium text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D5E4B]">
            Choose {multiple ? 'files' : 'file'}
          </button>
        </div>
      </div>
      <div role="status" aria-live="polite" className="text-xs text-[#4D5E4B]">
        {progress && <p className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" />{progress}</p>}
        {!uploading && complete > 0 && <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" />{complete} file{complete === 1 ? '' : 's'} attached. Save this entry to keep the attachments.</p>}
      </div>
      {issues.length > 0 && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 space-y-1">
        <p className="flex items-center gap-1 font-medium"><AlertCircle className="h-3.5 w-3.5" />Some files could not be uploaded</p>
        {issues.map((issue, index) => <p key={index}>{issue}</p>)}
        {retryFiles.length > 0 && <button type="button" disabled={uploading} className="underline py-1" onClick={() => void upload(retryFiles)}>Retry failed uploads</button>}
      </div>}
    </div>
  );
}
