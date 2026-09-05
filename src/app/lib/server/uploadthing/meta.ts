export type EntityType = 'tp' | 'midterm' | 'response';

export type UploadMeta = {
  courseId: string;
  entityType: EntityType;
  entityId: string;
};

export function buildUploadMeta(input: {
  courseId: string;
  entityType: EntityType;
  entityId: string;
}): UploadMeta {
  return input;
}
