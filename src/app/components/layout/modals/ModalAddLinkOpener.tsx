'use client';

import type { ButtonHTMLAttributes } from 'react';
import { useModal } from '@/app/contexts/ModalContext';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import { ModalAddLinkContent } from './ModalAddLinkContent';

type ModalAddLinkOpenerProps = {
  course: Course;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ModalAddLinkOpener = ({
  course,
  children = 'Añadir Link',
  className,
  onClick,
  'aria-label': ariaLabel = 'Añadir link',
  title = 'Añadir link',
  ...props
}: ModalAddLinkOpenerProps) => {
  const { openModal } = useModal();

  return (
    <button
      {...props}
      type="button"
      aria-label={ariaLabel}
      title={title}
      className={className ? `text-(--black-olive) p-1 ${className}` : 'text-(--black-olive) p-1'}
      onClick={(event) => {
        openModal(<ModalAddLinkContent course={course} />);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
};
