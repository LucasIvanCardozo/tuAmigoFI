'use client';

import { useEffect } from 'react';
import { Loading } from './others/loading';
import { handleLoader } from '../utils/handleLoader';
import { usePathname } from 'next/navigation';

export const Loader = () => {
  const pathname = usePathname();

  useEffect(() => {
    handleLoader(false);
  }, [pathname]);

  return (
    <div id="loader" className="hidden fixed bottom-0 right-0 m-4">
      <Loading mode={0} size={6} />
    </div>
  );
};
