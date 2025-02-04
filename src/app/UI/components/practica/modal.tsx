'use client';

import { useMainContext } from '@/app/lib/context';
import { ReactNode, useEffect } from 'react';
import { Form } from './form';

export const MainModal = () => {
  const { dataModal } = useMainContext();

  useEffect(() => {
    if (dataModal.viewModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [dataModal]);

  return (
    dataModal.viewModal && (
      <div className="fixed inset-0 z-50 bg-slate-800 bg-opacity-30 text-white flex justify-center items-center">
        <Form />
      </div>
    )
  );
};
