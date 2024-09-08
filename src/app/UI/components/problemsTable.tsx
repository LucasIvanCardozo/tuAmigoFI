'use client';
import Tps from './tps';
import { v4 } from 'uuid';
import { Suspense, useEffect, useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { fetchUser } from '@/app/lib/data';
import ModalImporImage from './modalImporImage';
import { tps } from '@prisma/client';

export default function ProblemsTable({
  tps,
  text,
}: {
  tps: tps[];
  text?: string;
}) {
  const [modal, setModal] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    setModal(searchParams.get('importImage')?.toString() || '');
  }, [searchParams]);

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

  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
        {tps.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay datos :,c</p>
          </li>
        ) : (
          tps.map((tp, index) => (
            <Tps uuid={uuid} tp={tp} text={text} key={index} />
          ))
        )}
      </ul>
      {modal != '' && <ModalImporImage imageId={modal} />}
    </>
  );
}
