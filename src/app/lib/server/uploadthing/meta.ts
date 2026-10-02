export type EntityType = 'tp' | 'midterm' | 'response';

export type UploadMeta = {
  courseSlug: string;
  entityType: EntityType;
};

export function buildUploadMeta(input: { courseSlug: string; entityType: EntityType }): UploadMeta {
  return input;
}
