import imageCompression from 'browser-image-compression';

export const DEFAULT_COMPRESS_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  initialQuality: 0.85,
} as const;

const COMPRESSION_LIB_URL = '/browser-image-compression.js';
const SKIP_THRESHOLD_BYTES = 500 * 1024;

export async function compressImageForUpload(file: File): Promise<File> {
  if (file.size <= SKIP_THRESHOLD_BYTES) {
    return file;
  }

  const result = (await imageCompression(file, {
    ...DEFAULT_COMPRESS_OPTIONS,
    useWebWorker: true,
    preserveExif: false,
    fileType: file.type,
    libURL: new URL(COMPRESSION_LIB_URL, window.location.origin).href,
  })) as Blob;

  if (result instanceof File) {
    return result;
  }

  return new File([result], file.name, { type: result.type || file.type });
}
