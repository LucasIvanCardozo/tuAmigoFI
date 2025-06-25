'use client';

import { useMainContext } from '@/app/lib/contexts';
import { ReactNode, useEffect } from 'react';
import { CgClose } from 'react-icons/cg';

interface Params {
  children: ReactNode;
  closeModal: () => void;
}

export const MainModal = ({ children, closeModal }: Params) => {
  const { stateModal } = useMainContext();

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  return (
    <>
      <div
        id="mainModial"
        className="fixed inset-0 z-50 bg-slate-800 bg-opacity-30 text-white flex justify-center items-center"
      >
        <div className="relative flex flex-col  max-w-lg w-11/12 max-h-screen overflow-y-auto bg-slate-800 p-5 rounded-lg justify-center items-center">
          <button
            className="absolute top-0 right-0 p-2 h-10 w-10 z-50"
            onClick={closeModal}
          >
            <CgClose className="h-full w-full " />
          </button>
          {children}
        </div>
      </div>
    </>
  );
};
