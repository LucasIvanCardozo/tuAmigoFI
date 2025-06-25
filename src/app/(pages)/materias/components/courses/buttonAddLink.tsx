'use client';
import { courses } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import ModalAddLink from './modals/modalAddLink';
import ReactDOM from 'react-dom';

export default function ButtonAddLink({ course }: { course: courses }) {
  const [modalAddLink, setModalAddLink] = useState<courses | undefined>();
  const { data: session } = useSession();

  const handleModalAddLink = (courses: courses | undefined) => {
    session
      ? setModalAddLink(courses)
      : window.alert('Necesitas iniciar sesion para subir un link.');
  };

  return (
    <>
      <div className="text-[--black] border-2 rounded-md border-[--black-olive] px-1">
        <button
          aria-label="Añadir link"
          title="Añadir link"
          onClick={() => handleModalAddLink(course)}
        >
          Añadir Link
        </button>
      </div>
      {modalAddLink &&
        ReactDOM.createPortal(
          <ModalAddLink course={modalAddLink} callback={handleModalAddLink} />,
          document.body
        )}
    </>
  );
}
