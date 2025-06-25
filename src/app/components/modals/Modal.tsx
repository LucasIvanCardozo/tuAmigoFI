'use client';

import React, { ComponentProps, JSX } from 'react';
import { CgClose } from 'react-icons/cg';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

const customStyles: Props['style'] = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    padding: '0.5rem',
    height: 'min-content',
    maxWidth: '450px',
    position: 'relative',
    borderRadius: '1rem',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export const Modal = ({ opener, ...rest }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {React.cloneElement(opener, { onClick: () => setIsOpen(true) })}
      <ReactModal
        isOpen={isOpen}
        {...rest}
        className="fixed inset-0 z-50 bg-slate-800 bg-opacity-30 text-white flex justify-center items-center"
      >
        <div className="relative flex flex-col  max-w-lg w-11/12 max-h-screen overflow-y-auto bg-slate-800 p-5 rounded-lg justify-center items-center">
          <button
            className="absolute top-0 right-0 p-2 h-10 w-10 z-50"
            onClick={() => setIsOpen(false)}
          >
            <CgClose className="h-full w-full " />
          </button>
          {rest.children}
        </div>
      </ReactModal>
    </>
  );
};

type Props = Omit<ComponentProps<typeof ReactModal>, 'isOpen'> & {
  children: React.ReactNode;
  opener: JSX.Element;
};
