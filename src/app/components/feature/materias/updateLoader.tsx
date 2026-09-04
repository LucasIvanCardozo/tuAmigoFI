'use client';

import { useEffect } from 'react';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { handleLoader } from '@/app/utils/handleLoader';

interface Params {
  courses: Course[];
}
export const UpdateLoader = ({ courses: _courses }: Params) => {
  useEffect(() => {
    handleLoader(false);
  }, []);
  return null;
};
