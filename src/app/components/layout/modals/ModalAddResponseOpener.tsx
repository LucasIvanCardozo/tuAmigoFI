'use client';

import type { Session } from 'next-auth';
import type { ButtonHTMLAttributes } from 'react';
import { CgMathPlus } from 'react-icons/cg';
import { useModal } from '@/app/contexts/ModalContext';
import type { Module } from '@/app/types';
import { ModalAddResponseContent } from './ModalAddResponseContent';

type ModalAddResponseOpenerProps = {
  module: Module;
  session: Session | null;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ModalAddResponseOpener = ({
  module,
  session,
  children = (
    <>
      <CgMathPlus />
      <span>Respuesta</span>
    </>
  ),
  className,
  onClick,
  'aria-label': ariaLabel = 'Añadir una respuesta',
  title = 'Añadir una respuesta',
  ...props
}: ModalAddResponseOpenerProps) => {
  const { openModal } = useModal();

  return (
    <button
      {...props}
      type="button"
      aria-label={ariaLabel}
      title={title}
      className={
        className
          ? `flex text-base h-6 pr-1 items-center border-2 border-gray-600 rounded-md hover:bg-[#92C1C9] transition-colors hover:border-[#92C1C9] ${className}`
          : 'flex text-base h-6 pr-1 items-center border-2 border-gray-600 rounded-md hover:bg-[#92C1C9] transition-colors hover:border-[#92C1C9]'
      }
      onClick={(event) => {
        openModal(<ModalAddResponseContent module={module} session={session} />);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
};
