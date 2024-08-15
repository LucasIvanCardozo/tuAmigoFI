'use client';
import Tps from './tps';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { fetchUser } from '@/app/lib/data';
export default function ProblemsTable({
  tps,
}: {
  tps: ({
    tps_problems: {
      problems: {
        number: number | null;
        id: number;
        text: string;
        text_normalized: string;
        response: string | null;
        type: string | null;
        response_plus: string | null;
        type_plus: string | null;
        user_reactions: {
          id: number;
          id_problem: number;
          reaction: number;
          id_user: string;
          created_at: Date | null;
        }[];
      };
    }[];
  } & {
    id: number;
    name: string;
    number: number | null;
    year: number;
  })[];
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

  useEffect(() => {
    console.log('tu usuario es: ' + uuid);
  }, [uuid]);
  return (
    <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
      {tps.map((tp, index) => (
        <Tps uuid={uuid} tp={tp} key={index} />
      ))}
    </ul>
  );
}
