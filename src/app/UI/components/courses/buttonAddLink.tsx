'use client';
import { courses } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import ModalAddLink from './modals/modalAddLink';

export default function ButtonAddLink({ course }: { course: courses }) {
  const [modalAddLink, setModalAddLink] = useState<courses | undefined>();
  const { data: session } = useSession();

  const handleModalAddLink = (courses: courses | undefined) =>
    setModalAddLink(courses);

  return (
    session &&
    session?.user.tier > 0 && (
      <>
        <div className="text-[--black]">
          <button onClick={() => handleModalAddLink(course)}>
            Añadir Link
          </button>
        </div>
        {modalAddLink && (
          <ModalAddLink course={modalAddLink} callback={handleModalAddLink} />
        )}
      </>
    )
  );
}
