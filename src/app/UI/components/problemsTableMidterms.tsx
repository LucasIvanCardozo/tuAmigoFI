'use client';
import Midterm from './midterm';
import { useEffect, useState } from 'react';
import { midterms, midterms_responses } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import TpsSkeleton from './skeletons/tpsSkeleton';
import ModalDeleteMidterm from './modalDeleteMidterm';
import ModalAddMidtermResponse from './modalAddMidtermResponse';
import ModalDeleteMidtermResponse from './modalDeleteMidtermResponse';

export default function ProblemsTableMidterms({
  midtermsList,
}: {
  midtermsList: midterms[];
}) {
  const searchParams = useSearchParams();
  const [modalDeleteMidterm, setModalDeleteMidterm] = useState<
    midterms | undefined
  >();
  const [modalDeleteResponse, setModalDeleteResponse] = useState<
    midterms_responses | undefined
  >();
  const [modalAddResponse, setModalAddResponse] = useState<
    midterms | undefined
  >();
  const [showTp, setShowTp] = useState<number | undefined>(
    Number(searchParams.get('midterms')) || undefined
  );

  useEffect(() => {
    setShowTp(Number(searchParams.get('midterms')) || undefined);
  }, [searchParams]);

  const handleModalDeleteMidterm = (midterm: midterms | undefined) =>
    setModalDeleteMidterm(midterm);

  const handleModalAddResponse = (midterm: midterms | undefined) =>
    setModalAddResponse(midterm);

  const handleModalDeleteResponse = (
    response: midterms_responses | undefined
  ) => setModalDeleteResponse(response);

  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
        {midtermsList == undefined ? (
          <TpsSkeleton />
        ) : midtermsList.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay parciales :,c</p>
          </li>
        ) : (
          midtermsList.map((midterm) => (
            <Midterm
              key={midterm.id}
              midterm={midterm}
              display={showTp}
              callbackDeleteMidterm={handleModalDeleteMidterm}
              callbackAddResponse={handleModalAddResponse}
              callbackDeleteResponse={handleModalDeleteResponse}
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
      {modalDeleteResponse && (
        <ModalDeleteMidtermResponse
          response={modalDeleteResponse}
          callback={handleModalDeleteResponse}
        />
      )}
      {modalAddResponse && (
        <ModalAddMidtermResponse
          midterm={modalAddResponse}
          callback={handleModalAddResponse}
        />
      )}
    </>
  );
}
