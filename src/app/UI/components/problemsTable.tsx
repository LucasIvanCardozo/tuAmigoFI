'use client';
import { v4 } from 'uuid';
import Tps from './tps';
import { useEffect, useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { fetchUser } from '@/app/lib/data';
import { tps } from '@prisma/client';
import ModalImporImage from './modalImporImage';

export default function ProblemsTable({
  tps,
  text,
}: {
  tps: tps[];
  text?: string;
}) {
  const [modal, setModal] = useState<number | undefined>();
  const [uuid, setUuid] = useState<string>('');

  useEffect(() => {
    const validationUser = async () => {
      const uuidCurrent = localStorage.getItem('uuid');
      if (uuidCurrent == null) {
        const newUuid: string = v4();
        localStorage.setItem('uuid', newUuid);
        await createUser(newUuid);
        setUuid(newUuid);
      } else {
        const validate = await fetchUser(uuidCurrent);
        if (validate == null) {
          throw new Error('No deberías estar haciendo esto...');
        } else {
          setUuid(uuidCurrent);
        }
      }
    };
    validationUser();
  }, []);

  const handleModal = (problemId: number | undefined) => setModal(problemId);

  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
        {tps.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay datos :,c</p>
          </li>
        ) : (
          tps.map((tp, index) => (
            <Tps
              key={index}
              uuid={uuid}
              tp={tp}
              text={text}
              callback={handleModal}
            />
          ))
        )}
      </ul>
      {modal && <ModalImporImage problemId={modal} callback={handleModal} />}
    </>
  );
}
