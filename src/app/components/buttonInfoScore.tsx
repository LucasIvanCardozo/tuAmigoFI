'use client';
import { useState } from 'react';
import ModalInfoScore from './modalInfoScore';
import { IoIosInformationCircle } from 'react-icons/io';

export default function ButtonInfoScore() {
  const [modalInfoScore, setModalInfoScore] = useState<boolean | undefined>();

  const handleModalInfoScore = (display: boolean | undefined) =>
    setModalInfoScore(display);

  return (
    <>
      <button
        title="Como obtener puntos?"
        aria-label="Info sobre como obtener puntos"
        onClick={() => handleModalInfoScore(true)}
      >
        <IoIosInformationCircle className="text-2xl opacity-75" />
      </button>
      {modalInfoScore && <ModalInfoScore callback={handleModalInfoScore} />}
    </>
  );
}
