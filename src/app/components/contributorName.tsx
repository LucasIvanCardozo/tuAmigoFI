'use client';
import { ModalUserContributions } from '@/app/components/modalUserContributions';
import { useModal } from '@/app/contexts/ModalContext';

export const ContributorName = ({ idUser, name }: { idUser: string; name: string }) => {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      onClick={() => openModal(<ModalUserContributions idUser={idUser} name={name} />)}
      className="max-w-full truncate text-left hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dark-cyan)"
      title={`Ver los aportes de ${name}`}
    >
      {name}
    </button>
  );
};
