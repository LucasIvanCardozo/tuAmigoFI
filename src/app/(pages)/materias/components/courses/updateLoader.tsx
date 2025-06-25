'use client';

import { handleLoader } from '@/app/utils/handleLoader';
import { courses } from '@prisma/client';
import { useEffect } from 'react';

interface Params {
  query: courses[];
}
export const UpdateLoader = ({ query }: Params) => {
  useEffect(() => {
    handleLoader(false);
  }, [query]);
  return <></>;
};
