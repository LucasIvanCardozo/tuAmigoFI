'use client';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import { createUser } from '@/app/lib/actions';
import { fetchUser } from '@/app/lib/data';
import Midterm from './midterm';
export default function ProblemsTableMidterms({
  midterms,
  text,
}: {
  midterms: {
    id: number;
    name: string;
    date: Date;
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
      {midterms.map((midterm, index) => (
        <Midterm uuid={uuid} midterm={midterm} text={text} key={index} />
      ))}
    </ul>
  );
}
