'use client';
import { MdDelete } from 'react-icons/md';
import { useModal } from '@/app/contexts/ModalContext';
import type { Link } from '@/app/lib/server/db/prisma/prismaClient/client';
import { ModalDeleteLinkContent } from './ModalDeleteLinkContent';

type ModalDeleteLinkOpenerProps = {
  link: Link;
};

export const ModalDeleteLinkOpener = ({ link }: ModalDeleteLinkOpenerProps) => {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      className="h-full"
      aria-label="Eliminar link"
      title="Eliminar link"
      onClick={() => openModal(<ModalDeleteLinkContent link={link} />)}
    >
      <MdDelete className="h-full" />
    </button>
  );
};
