'use client';

import type { ButtonHTMLAttributes } from 'react';
import { useModal } from '@/app/contexts/ModalContext';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { ModalCreateCorrelativeContent } from './ModalCreateCorrelativeContent';

type ModalCreateCorrelativeOpenerProps = {
  course: Course;
  callback: Promise<Pick<Course, 'id' | 'name'>[]>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ModalCreateCorrelativeOpener = ({
  course,
  callback,
  children = 'Añadir correlativa',
  className,
  onClick,
  'aria-label': ariaLabel = 'Añadir correlativa',
  title = 'Añadir correlativa',
  ...props
}: ModalCreateCorrelativeOpenerProps) => {
  const { openModal } = useModal();

  return (
    <button
      {...props}
      type="button"
      aria-label={ariaLabel}
      title={title}
      className={className ? `text-(--black-olive) p-1 ${className}` : 'text-(--black-olive) p-1'}
      onClick={(event) => {
        openModal(<ModalCreateCorrelativeContent course={course} callback={callback} />);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
};
