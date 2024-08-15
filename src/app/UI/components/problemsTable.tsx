'use client';
import Tps from './tps';
import { v4 } from 'uuid';
import { Suspense, useEffect, useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { fetchUser } from '@/app/lib/data';
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
  const [uuid, setUuid] = useState<string>(localStorage.getItem('uuid') ?? '');

  useEffect(() => {
    const validationUser = async () => {
      if (uuid == '') {
        const newUuid: string = v4();
        localStorage.setItem('uuid', newUuid);
        await createUser(newUuid);
        setUuid(newUuid);
      } else {
        const validate = await fetchUser(uuid);
        if (validate == null) {
          throw new Error('No deberías estar haciendo esto...');
        }
      }
    };
    validationUser();
  }, []);

  useEffect(() => {
    console.log('tu usuario es: ' + uuid);
  }, [uuid]);

  return (
    <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
      <Suspense>
        {tps.map((tp, index) => (
          <Tps uuid={uuid} tp={tp} text={text} key={index} />
        ))}
      </Suspense>
    </ul>
  );
}
