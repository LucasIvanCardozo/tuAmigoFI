export function shouldCleanupUploadThingFile(
  oldFileKey: string | null | undefined,
  newFileKey: string | null | undefined,
): boolean {
  if (!oldFileKey) return false;
  if (newFileKey === undefined) return false;
  if (newFileKey === null || newFileKey === '') return true;
  return oldFileKey !== newFileKey;
}
