'use client';
import Tps from './tps';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { tps, tps_responses } from '@prisma/client';
import TpsSkeleton from './skeletons/tpsSkeleton';
import ModalDeleteTp from './modalDeleteTP';
import ModalAddTpResponse from './modalAddTpResponse';
import ModalDeleteTpResponse from './modalDeleteTpResponse';

export default function ProblemsTable({ tpList }: { tpList: tps[] }) {
  const searchParams = useSearchParams();
  const [modalDeleteTp, setModalDeleteTp] = useState<tps | undefined>();
  const [modalAddResponse, setModalAddResponse] = useState<tps | undefined>();
  const [modalDeleteResponse, setModalDeleteResponse] = useState<
    tps_responses | undefined
  >();
  const [showTp, setShowTp] = useState<number | undefined>(
    Number(searchParams.get('tps')) || undefined
  );

  useEffect(() => {
    setShowTp(Number(searchParams.get('tps')) || undefined);
  }, [searchParams]);

  const handleModalDeleteTp = (tp: tps | undefined) => setModalDeleteTp(tp);

  const handleModalAddResponse = (tp: tps | undefined) =>
    setModalAddResponse(tp);

  const handleModalDeleteResponse = (response: tps_responses | undefined) =>
    setModalDeleteResponse(response);

  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
        {tpList == undefined ? (
          <TpsSkeleton />
        ) : tpList.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay datos :,c</p>
          </li>
        ) : (
          tpList.map((tp) => (
            <Tps
              key={tp.id}
              tp={tp}
              display={showTp}
              callbackDeleteTp={handleModalDeleteTp}
              callbackAddResponse={handleModalAddResponse}
              callbackDeleteResponse={handleModalDeleteResponse}
            />
          ))
        )}
      </ul>
      {modalDeleteTp && (
        <ModalDeleteTp tp={modalDeleteTp} callback={handleModalDeleteTp} />
      )}
      {modalAddResponse && (
        <ModalAddTpResponse
          tp={modalAddResponse}
          callback={handleModalAddResponse}
        />
      )}
      {modalDeleteResponse && (
        <ModalDeleteTpResponse
          response={modalDeleteResponse}
          callback={handleModalDeleteResponse}
        />
      )}
    </>
  );
}
