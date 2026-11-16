import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  FileText,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  Eye,
  FileCheck,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  listStorageFiles,
  uploadStorageFile,
  deleteStorageFile,
  validateUploadFile,
  type StorageFileItem,
} from '../../lib/storage';
import { isSupabaseConfigured } from '../../lib/supabase';

interface MediaManagerProps {
  onSelectFile?: (urlOrPath: string, fileItem?: StorageFileItem) => void;
  selectionMode?: boolean;
  filterBucket?: 'portfolio-media' | 'portfolio-documents';
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  onSelectFile,
  selectionMode = false,
  filterBucket = 'portfolio-media',
}) => {
  const [currentBucket, setCurrentBucket] = useState<'portfolio-media' | 'portfolio-documents'>(filterBucket);
  const [files, setFiles] = useState<StorageFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<StorageFileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await listStorageFiles(currentBucket, '');
    if (res.success) {
      setFiles(res.files);
    } else {
      setErrorMessage(res.error || 'Failed to list bucket files.');
    }
    setLoading(false);
  }, [currentBucket]);

  useEffect(() => {
    let ignore = false;
    void Promise.resolve().then(() => {
      if (!ignore) {
        loadFiles();
      }
    });
    return () => {
      ignore = true;
    };
  }, [loadFiles]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    const isDoc = currentBucket === 'portfolio-documents' || file.type === 'application/pdf';
    const validation = validateUploadFile(file, isDoc ? 'document' : 'image');

    if (!validation.valid) {
      setErrorMessage(validation.error || 'File validation failed.');
      return;
    }

    setUploading(true);
    setErrorMessage(null);

    const folder = currentBucket === 'portfolio-documents' ? 'resumes' : 'projects';
    const result = await uploadStorageFile(file, currentBucket, folder);

    if (result.success) {
      await loadFiles();
      if (onSelectFile && result.path) {
        onSelectFile(result.publicUrl || result.path);
      }
    } else {
      setErrorMessage(result.error || 'Upload failed.');
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (fileItem: StorageFileItem) => {
    if (!window.confirm(`Permanently remove file "${fileItem.name}" from ${fileItem.bucket}?`)) {
      return;
    }

    const res = await deleteStorageFile(currentBucket, fileItem.path);
    if (res.success) {
      setFiles((prev) => prev.filter((f) => f.path !== fileItem.path));
      if (previewItem?.path === fileItem.path) setPreviewItem(null);
    } else {
      setErrorMessage(res.error || 'Failed to delete file.');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Bucket Selector & Upload Actions Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Bucket Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-lg border border-[#EAE6DE]">
          <button
            type="button"
            onClick={() => setCurrentBucket('portfolio-media')}
            disabled={selectionMode && filterBucket !== 'portfolio-media'}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              currentBucket === 'portfolio-media'
                ? 'bg-white text-[#181A18] shadow-xs font-semibold'
                : 'text-[#6E756E] hover:text-[#181A18]'
            }`}
          >
            Media Library (Images)
          </button>
          <button
            type="button"
            onClick={() => setCurrentBucket('portfolio-documents')}
            disabled={selectionMode && filterBucket !== 'portfolio-documents'}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              currentBucket === 'portfolio-documents'
                ? 'bg-white text-[#181A18] shadow-xs font-semibold'
                : 'text-[#6E756E] hover:text-[#181A18]'
            }`}
          >
            Documents (PDFs &amp; Resumes)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadFiles}
            disabled={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={currentBucket === 'portfolio-media' ? 'image/jpeg,image/png,image/webp,image/svg+xml' : 'application/pdf'}
            className="hidden"
          />

          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !isSupabaseConfigured}
            icon={<Upload className="w-3.5 h-3.5" />}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      {/* Cloud Configuration Warning */}
      {!isSupabaseConfigured && (
        <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3 text-xs text-[#92400E]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Supabase Storage Configuration Required</span>
            <p>
              Supabase project credentials have not been configured in your environment variables. Media uploads require a connected Supabase project with active Storage buckets.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Files Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#6E756E]">
          <div className="w-5 h-5 border-2 border-[#4D5E4B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading storage files...
        </div>
      ) : files.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[#DDD7CC] bg-[#FAF8F5] space-y-2">
          <FolderOpen className="w-8 h-8 text-[#9A9E99] mx-auto" />
          <h4 className="text-sm font-semibold text-[#181A18]">No files in this bucket yet</h4>
          <p className="text-xs text-[#6E756E] max-w-sm mx-auto">
            Upload images (JPG, PNG, WebP) or PDF documents to store and attach them to portfolio entries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => {
            const isImage = file.bucket === 'portfolio-media' && Boolean(file.publicUrl);

            return (
              <div
                key={file.path}
                className="group relative rounded-xl border border-[#E8E4DC] bg-white overflow-hidden shadow-xs hover:border-[#CAD4CA] transition-all flex flex-col justify-between"
              >
                {/* Thumbnail / Icon area */}
                <div className="aspect-4/3 bg-[#F4F0E8] overflow-hidden flex items-center justify-center relative">
                  {isImage ? (
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 p-3 text-center">
                      <FileText className="w-8 h-8 text-[#4D5E4B]" />
                      <span className="text-[10px] font-mono-code text-[#6E756E] uppercase">
                        {file.name.split('.').pop()}
                      </span>
                    </div>
                  )}

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-[#181A18]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {(selectionMode || onSelectFile) && (
                      <button
                        type="button"
                        onClick={() => onSelectFile(file.publicUrl || file.path, file)}
                        className="p-1.5 rounded-lg bg-white text-[#181A18] hover:bg-[#FAF8F5] text-xs font-semibold"
                        title="Select file"
                      >
                        <FileCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setPreviewItem(file)}
                      className="p-1.5 rounded-lg bg-white text-[#181A18] hover:bg-[#FAF8F5]"
                      title="Preview details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(file)}
                      className="p-1.5 rounded-lg bg-white text-[#B91C1C] hover:bg-[#FEEFEF]"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-3 border-t border-[#EFECE5] text-xs space-y-1">
                  <p className="font-medium text-[#181A18] truncate text-[11px]" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#787E78]">
                    <span>
                      {file.metadata?.size ? `${(file.metadata.size / 1024).toFixed(0)} KB` : 'File'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(file.publicUrl || file.path)}
                      className="hover:text-[#181A18] inline-flex items-center gap-0.5"
                      title="Copy path"
                    >
                      {copiedPath === (file.publicUrl || file.path) ? (
                        <Check className="w-3 h-3 text-[#38593E]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Detail Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181A18]/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-semibold text-[#181A18]">
                  {previewItem.name}
                </h4>
                <p className="text-xs text-[#707670] font-mono-code">{previewItem.path}</p>
              </div>
              <Badge variant="sage" size="sm">
                {previewItem.bucket}
              </Badge>
            </div>

            {previewItem.publicUrl && (
              <div className="max-h-64 overflow-hidden rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] flex items-center justify-center">
                <img
                  src={previewItem.publicUrl}
                  alt={previewItem.name}
                  className="max-h-64 object-contain"
                />
              </div>
            )}

            <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#EAE6DE] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6E756E]">Storage Bucket:</span>
                <span className="font-mono-code text-[#181A18]">{previewItem.bucket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E756E]">Public Access:</span>
                <span className="font-semibold text-[#181A18]">
                  {previewItem.bucket === 'portfolio-media' ? 'Public (Images)' : 'Restricted (Documents)'}
                </span>
              </div>
              {previewItem.publicUrl && (
                <div className="pt-2 border-t border-[#EAE6DE]">
                  <span className="text-[#6E756E] block mb-1">Public URL:</span>
                  <div className="p-2 rounded bg-white border border-[#E0DCD3] font-mono-code text-[11px] truncate">
                    {previewItem.publicUrl}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(previewItem.publicUrl || previewItem.path)}
                icon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy Link
              </Button>

              <div className="flex items-center gap-2">
                {onSelectFile && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onSelectFile(previewItem.publicUrl || previewItem.path, previewItem);
                      setPreviewItem(null);
                    }}
                  >
                    Select File
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => setPreviewItem(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
