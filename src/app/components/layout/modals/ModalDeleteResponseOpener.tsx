'use client';
import { MdDelete } from 'react-icons/md';
import { useModal } from '@/app/contexts/ModalContext';
import type { Response, User } from '@/app/lib/server/db/prisma/prismaClient/client';
import { ModalDeleteResponseContent } from './ModalDeleteResponseContent';

type ModalDeleteResponseOpenerProps = {
  response: Response;
  user: User;
};

export const ModalDeleteResponseOpener = ({ response, user }: ModalDeleteResponseOpenerProps) => {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      aria-label="Eliminar respuesta"
      title="Eliminar respuesta"
      onClick={() => openModal(<ModalDeleteResponseContent response={response} user={user} />)}
    >
      <MdDelete className="h-full w-full" />
    </button>
  );
};
