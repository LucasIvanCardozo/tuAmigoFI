'use client';
import Midterm from './midterm';
import { useEffect, useState } from 'react';
import { midterms } from '@prisma/client';
import ModalImporImage from './modalImporImage';
import { useSearchParams } from 'next/navigation';
import TpsSkeleton from './skeletons/tpsSkeleton';
import ModalDeleteMidterm from './modalDeleteMidterm';

export default function ProblemsTableMidterms({
  midtermsList,
}: {
  midtermsList: midterms[];
}) {
  const searchParams = useSearchParams();
  const [modalDeleteMidterm, setModalDeleteMidterm] = useState<
    midterms | undefined
  >();
  const [midterms, setMidterms] = useState<midterms[]>();

  useEffect(() => {
    setMidterms(undefined);
    setTimeout(() => {
      const midtermsAux = Number(searchParams.get('midterms')) || undefined;
      if (midtermsAux) {
        setMidterms(
          midtermsList.filter((midterm) => midterm.id == midtermsAux)
        );
      } else {
        setMidterms(midtermsList);
      }
    }, 50);
  }, [searchParams]);

  const handleModalDeleteMidterm = (midterm: midterms | undefined) =>
    setModalDeleteMidterm(midterm);

  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
        {midterms == undefined ? (
          <TpsSkeleton />
        ) : midterms.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay parciales :,c</p>
          </li>
        ) : (
          midterms.map((midterm, index) => (
            <Midterm
              key={index}
              midterm={midterm}
              callbackDeleteMidterm={handleModalDeleteMidterm}
            />
          ))
        )}
      </ul>
      {modalDeleteMidterm && (
        <ModalDeleteMidterm
          midterm={modalDeleteMidterm}
          callback={handleModalDeleteMidterm}
        />
      )}
    </>
  );
}
