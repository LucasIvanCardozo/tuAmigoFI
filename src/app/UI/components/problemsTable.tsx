'use client';
import { v4 } from 'uuid';
import Tps from './tps';
import { useEffect, useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { fetchUser } from '@/app/lib/data';
import { tps } from '@prisma/client';
import ModalImporImage from './modalImporImage';
import TpsSkeleton from './skeletons/tpsSkeleton';
import ModalDeleteTp from './modalDeleteTP';

export default function ProblemsTable({
  tpList,
  text,
}: {
  tpList: tps[];
  text?: string;
}) {
  const searchParams = useSearchParams();
  const [modalImage, setModalImage] = useState<number | undefined>();
  const [modalDeleteTp, setModalDeleteTp] = useState<tps | undefined>();
  const [tps, setTps] = useState<tps[]>();

  useEffect(() => {
    const tpsAux = Number(searchParams.get('tps')) || undefined;
    if (tpsAux) {
      setTps(tpList.filter((tp) => tp.id == tpsAux));
    } else {
      setTps(tpList);
    }
  }, [searchParams]);

  const handleModalImage = (problemId: number | undefined) =>
    setModalImage(problemId);

  const handleModalDeleteTp = (tp: tps | undefined) => setModalDeleteTp(tp);

  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
        {tps == undefined ? (
          <TpsSkeleton />
        ) : tps.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay datos :,c</p>
          </li>
        ) : (
          tps.map((tp, index) => (
            <Tps
              key={index}
              tp={tp}
              text={text}
              callbackImage={handleModalImage}
              callbackDeleteTp={handleModalDeleteTp}
            />
          ))
        )}
      </ul>
      {modalImage && (
        <ModalImporImage problemId={modalImage} callback={handleModalImage} />
      )}
      {modalDeleteTp && (
        <ModalDeleteTp tp={modalDeleteTp} callback={handleModalDeleteTp} />
      )}
    </>
  );
}
