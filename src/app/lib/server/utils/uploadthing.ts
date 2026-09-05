import db from '@/app/lib/server/db/db';
import type { UploadMeta } from '@/app/lib/server/uploadthing/meta';
import { utapi } from '@/app/lib/server/uploadthing/utapi';
import { MAX_UPLOAD_SIZE } from '@/app/lib/shared/constants/upload';

export type UploadFileResult =
  | { success: true; url: string; fileKey: string }
  | { success: false; error: string };

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`;
};

const RETRYABLE_HTTP_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

const isTransientError = (err: unknown): boolean => {
  if (err instanceof Error) {
    const name = err.name.toLowerCase();
    if (
      name === 'aborterror' ||
      name === 'timeouterror' ||
      name === 'connectionerror' ||
      name === 'networkerror' ||
      name === 'fetcherror'
    ) {
      return true;
    }
    if ('status' in err && typeof (err as { status: unknown }).status === 'number') {
      return RETRYABLE_HTTP_STATUSES.has((err as { status: number }).status);
    }
    if ('code' in err && typeof (err as { code: unknown }).code === 'string') {
      const code = (err as { code: string }).code.toUpperCase();
      if (
        code === 'INTERNAL_SERVER_ERROR' ||
        code === 'SERVICE_UNAVAILABLE' ||
        code === 'ETIMEDOUT' ||
        code === 'ECONNRESET' ||
        code === 'EAI_AGAIN'
      ) {
        return true;
      }
    }
  }
  if (
    err &&
    typeof err === 'object' &&
    'status' in err &&
    typeof (err as { status: unknown }).status === 'number'
  ) {
    return RETRYABLE_HTTP_STATUSES.has((err as { status: number }).status);
  }
  return false;
};

async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    isRetryable?: (err: unknown) => boolean;
    attempts?: number;
    baseDelayMs?: number;
  } = {},
): Promise<T> {
  const { isRetryable = isTransientError, attempts = 3, baseDelayMs = 500 } = options;
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === attempts - 1 || !isRetryable(err)) {
        throw err;
      }
      const delay = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export async function uploadFile(file: File, meta?: UploadMeta): Promise<UploadFileResult> {
  if (!file) {
    return { success: false, error: 'No se recibió ningún archivo' };
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return {
      success: false,
      error: `La imagen no puede pesar más de ${formatBytes(MAX_UPLOAD_SIZE)}.`,
    };
  }
  try {
    if (meta) {
      console.info('UploadThing: upload metadata', {
        entityType: meta.entityType,
        entityId: meta.entityId,
        courseId: meta.courseId,
      });
    }
    const result = await withRetry(() => utapi.uploadFiles([file]), {
      attempts: 3,
      baseDelayMs: 500,
    });
    const first = result[0];
    if (first?.data) {
      return {
        success: true,
        url: first.data.ufsUrl,
        fileKey: first.data.key,
      };
    }
    if (first && 'error' in first && first.error) {
      const message =
        typeof first.error === 'object' && 'message' in first.error
          ? String(first.error.message)
          : 'Error al subir la imagen';
      return { success: false, error: message };
    }
    return { success: false, error: 'Error al subir la imagen' };
  } catch (error) {
    console.error('UploadThing: Error uploading file after retries:', error);
    return { success: false, error: 'Error al subir la imagen' };
  }
}

export async function deleteUploadThingFile(fileKey: string): Promise<void> {
  if (!fileKey) return;
  try {
    await utapi.deleteFiles([fileKey]);
    console.info('UploadThing: File cleanup success', { fileKey });
  } catch (error) {
    console.error('UploadThing: Error deleting file:', { fileKey, error });
  }
}

export async function cleanupCourseAssets(
  courseId: string,
): Promise<{ deleted: number; failed: number }> {
  const [tps, midterms] = await Promise.all([
    db.tp.findMany({
      where: { idCourse: courseId },
      select: { fileKey: true, id: true },
    }),
    db.midterm.findMany({
      where: { idCourse: courseId },
      select: { fileKey: true, id: true },
    }),
  ]);
  const tpIds = tps.map((t) => t.id);
  const midtermIds = midterms.map((m) => m.id);
  const responses = await db.response.findMany({
    where: { OR: [{ idTp: { in: tpIds } }, { idMidterm: { in: midtermIds } }] },
    select: { fileKey: true },
  });
  const keys = [
    ...tps.map((t) => t.fileKey),
    ...midterms.map((m) => m.fileKey),
    ...responses.map((r) => r.fileKey),
  ].filter((k): k is string => Boolean(k));
  if (keys.length === 0) return { deleted: 0, failed: 0 };
  try {
    await utapi.deleteFiles(keys);
    return { deleted: keys.length, failed: 0 };
  } catch (error) {
    console.error('UploadThing: cleanupCourseAssets failed', {
      courseId,
      error,
    });
    return { deleted: 0, failed: keys.length };
  }
}

export async function withUploadRollback<T>(
  file: File,
  meta: UploadMeta,
  save: (url: string, fileKey: string) => Promise<T>,
): Promise<T> {
  let uploadedFileKey: string | undefined;
  try {
    const upload = await uploadFile(file, meta);
    if (!upload.success) throw new Error(upload.error);
    uploadedFileKey = upload.fileKey;
    return await save(upload.url, upload.fileKey);
  } catch (error) {
    if (uploadedFileKey) await deleteUploadThingFile(uploadedFileKey);
    throw error;
  }
}
