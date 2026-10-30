'use client';
import { TbAlertHexagon } from 'react-icons/tb';
import { useModal } from '@/app/contexts/ModalContext';
import type { Reaction } from '@/app/lib/server/db/prisma/prismaClient/client';
import { ModalReportModuleContent } from '../../layout/modals/ModalReportModuleContent';
import { useReactions } from './useReactions';

export default function ButtonReport({
  idTarget,
  typeTarget,
  reactions,
  title,
  author,
}: {
  idTarget: string;
  typeTarget: 'TP' | 'MIDTERM';
  reactions: Reaction[];
  title: string;
  author: string;
}) {
  const { openModal } = useModal();
  const { state, amount, pending, react, requireSession } = useReactions({
    idTarget,
    typeTarget,
    reactions,
    unauthorizedMessage: 'Debes iniciar sesion para reportar.',
  });

  async function handleReport() {
    if (!requireSession()) return;
    if (state === false) {
      await react(false, 'unset');
      return;
    }
    openModal(
      <ModalReportModuleContent
        idTarget={idTarget}
        typeTarget={typeTarget}
        title={title}
        author={author}
      />,
    );
  }

  return (
    <button
      type="button"
      className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Reportar"
      title="Reportar"
      onClick={handleReport}
      disabled={pending}
    >
      <TbAlertHexagon className={`${state === false ? 'text-red-500' : ''} text-xl`} />
      <span className="text-xs tabular-nums">{amount.dislikes}</span>
    </button>
  );
}
