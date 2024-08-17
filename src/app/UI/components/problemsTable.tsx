'use client';
import Tps from './tps';
import { v4 } from 'uuid';
import { Suspense, useEffect, useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { fetchUser } from '@/app/lib/data';
import TpsSkeleton from './skeletons/tpsSkeleton';
export default function ProblemsTable({
  tps,
  text,
}: {
  tps: {
    id: number;
    name: string;
    number: number | null;
    year: number;
  }[];
  text?: string;
}) {
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

  return (
    <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
      {tps.map((tp, index) => (
        <Tps uuid={uuid} tp={tp} text={text} key={index} />
      ))}
    </ul>
  );
}
