'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { TbAlertHexagon } from 'react-icons/tb';
import { sileo } from 'sileo';
import { useModal } from '@/app/contexts/ModalContext';
import { upsertReaction } from '@/app/lib/server/actions/reactions/upsert.action';
import type { Reaction } from '@/app/lib/server/db/prisma/prismaClient/client';
import { ModalReportModuleContent } from '../../layout/modals/ModalReportModuleContent';

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
  const { data: session } = useSession();
  const { openModal } = useModal();
  const [reported, setReported] = useState(false);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  const reports = reactions.filter((reaction) => !reaction.reaction).length;

  useEffect(() => {
    setReported(
      reactions.some((reaction) => reaction.idUser === session?.user.id && !reaction.reaction),
    );
  }, [reactions, session]);

  async function handleUndoReport() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setReported(false);
    const { error } = await upsertReaction({ idTarget, typeTarget, reaction: false });
    if (error) {
      setReported(true);
      sileo.error({ title: error });
    }
    inFlight.current = false;
    setPending(false);
  }

  function handleReport() {
    if (!session?.user.id) {
      sileo.error({
        title: 'Debes iniciar sesion para reportar.',
      });
      return;
    }
    if (reported) {
      handleUndoReport();
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
      <TbAlertHexagon className={`${reported ? 'text-red-500' : ''} text-xl`} />
      <span className="text-xs tabular-nums">{reports}</span>
    </button>
  );
}
