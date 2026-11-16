import { supabase, isSupabaseConfigured } from './supabase';

export interface StorageFileItem {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
  publicUrl?: string;
  bucket: string;
  path: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const ALLOWED_DOC_TYPES = ['application/pdf'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DOC_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateUploadFile(
  file: File,
  targetType: 'image' | 'document'
): { valid: boolean; error?: string } {
  if (targetType === 'image') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid image format (${file.type}). Allowed: JPG, PNG, WebP, SVG.`,
      };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Image size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      };
    }
  } else if (targetType === 'document') {
    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid document format (${file.type}). Only PDF files are permitted.`,
      };
    }
    if (file.size > MAX_DOC_SIZE_BYTES) {
      return {
        valid: false,
        error: `Document size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      };
    }
  }

  return { valid: true };
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_');
}

/**
 * Upload a media file or document to Supabase Storage
 */
export async function uploadStorageFile(
  file: File,
  bucket: 'portfolio-media' | 'portfolio-documents',
  folder = 'uploads'
): Promise<{ success: boolean; path?: string; publicUrl?: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'Supabase credentials are not configured. Cannot perform cloud upload.',
    };
  }

  const isDoc = bucket === 'portfolio-documents';
  const validation = validateUploadFile(file, isDoc ? 'document' : 'image');
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const timestamp = crypto.randomUUID();
    const cleanName = sanitizeFileName(file.name);
    const storagePath = `${folder}/${timestamp}_${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    let publicUrl: string | undefined;
    if (bucket === 'portfolio-media') {
      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      publicUrl = data.publicUrl;
    }

    return {
      success: true,
      path: storagePath,
      publicUrl,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}

/**
 * List files within a storage bucket and folder
 */
export async function listStorageFiles(
  bucket: 'portfolio-media' | 'portfolio-documents',
  folder = ''
): Promise<{ success: boolean; files: StorageFileItem[]; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      files: [],
      error: 'Supabase credentials are not configured.',
    };
  }

  try {
    const client = supabase;
    const collect = async (prefix: string): Promise<StorageFileItem[]> => {
      const result: StorageFileItem[] = [];
      for (let offset = 0; ; offset += 100) {
        const { data, error } = await client.storage.from(bucket).list(prefix, {
          limit: 100, offset, sortBy: { column: 'name', order: 'asc' },
        });
        if (error) throw error;
        for (const item of data ?? []) {
          const path = prefix ? `${prefix}/${item.name}` : item.name;
          if (!item.id) result.push(...await collect(path));
          else result.push({ ...item, bucket, path });
        }
        if (!data || data.length < 100) break;
      }
      return result;
    };
    const data = await collect(folder);

    const items: StorageFileItem[] = (data || []).map((f) => {
      const fullPath = f.path;
      let publicUrl: string | undefined;
      if (bucket === 'portfolio-media') {
        publicUrl = supabase.storage.from(bucket).getPublicUrl(fullPath).data.publicUrl;
      }

      return {
        ...f,
        bucket,
        path: fullPath,
        publicUrl,
      };
    });

    return { success: true, files: items };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, files: [], error: errorMsg };
  }
}

/**
 * Delete a file from a storage bucket
 */
export async function deleteStorageFile(
  bucket: 'portfolio-media' | 'portfolio-documents',
  path: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase credentials are not configured.' };
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}

/**
 * Generate a short-lived signed URL for previewing private certificate documents.
 * Adheres to rule: No public persistent download links for sensitive certificates.
 * Requires an authenticated admin session and generates short expiration (60s).
 */
export async function getProtectedCertificatePreviewUrl(
  path: string,
  expiresInSeconds = 60
): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase credentials are not configured.' };
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        error: 'Authentication required. Certificate previews are restricted to authorized administrators.',
      };
    }

    const { data, error } = await supabase.storage
      .from('portfolio-documents')
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}
