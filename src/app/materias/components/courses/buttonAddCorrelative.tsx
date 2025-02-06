'use client';
import { courses } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import ModalCreateCorrelative from './modals/modalCreateCorrelative';

export default function ButtonAddCorrelative({ course }: { course: courses }) {
  const [modalAddCorrelative, setModalAddCorrelative] = useState<
    courses | undefined
  >();
  const { data: session } = useSession();

  const handleModalAddCorrelative = (courses: courses | undefined) =>
    setModalAddCorrelative(courses);

  return (
    session &&
    session?.user.tier > 0 && (
      <>
        <div className="text-[--black] border-2 rounded-md border-[--black-olive] px-1">
          <button
            aria-label="Añadir correlativa"
            title="Añadir correlativa"
            onClick={() => handleModalAddCorrelative(course)}
          >
            Añadir correlativa
          </button>
        </div>
        {modalAddCorrelative && (
          <ModalCreateCorrelative
            course={modalAddCorrelative}
            callback={handleModalAddCorrelative}
          />
        )}
      </>
    )
  );
}
