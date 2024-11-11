'use client';
import { v4 } from 'uuid';
import Tps from './tps';
import { useEffect, useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { fetchUser } from '@/app/lib/data';
import { tps } from '@prisma/client';
import ModalImporImage from './modalImporImage';
import { useSession } from 'next-auth/react';
import TpsSkeleton from './skeletons/tpsSkeleton';

export default function ProblemsTable({
  tpList,
  text,
}: {
  tpList: tps[];
  text?: string;
}) {
  const searchParams = useSearchParams();
  const [modal, setModal] = useState<number | undefined>();
  const [tps, setTps] = useState<tps[]>();
  const [searchTps, setSearchTps] = useState<number | undefined>();
  useEffect(() => {
    setSearchTps(Number(searchParams.get('tps')) || undefined);
  }, [searchParams]);

  useEffect(() => {
    if (searchTps) {
      setTps(tpList.filter((tp) => tp.id == searchTps));
    } else {
      setTps(tpList);
    }
  }, [searchTps]);

  const handleModal = (problemId: number | undefined) => setModal(problemId);

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
            <Tps key={index} tp={tp} text={text} callback={handleModal} />
          ))
        )}
      </ul>
      {modal && <ModalImporImage problemId={modal} callback={handleModal} />}
    </>
  );
}
