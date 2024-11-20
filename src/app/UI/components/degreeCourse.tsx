'use client';
import { fetchDegrees } from '@/app/lib/data';
import { degrees } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DegreeCourse() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [degrees, setDegrees] = useState<
    ({
      degrees_plans: {
        plans: {
          id: number;
          year: number;
        };
      }[];
    } & degrees)[]
  >();
  const [degree, setDegree] = useState<string>(
    searchParams.get('degree')?.toString() ?? ''
  );

  const handleDegree = (degree: string) => {
    const params = new URLSearchParams(searchParams);
    if (degree && degree != '0') {
      params.set('degree', degree);
    } else {
      params.delete('degree');
    }
    setDegree(degree);
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const dataFetch = async () => {
      const degreesData = await fetchDegrees();
      setDegrees(degreesData);
    };
    dataFetch();
  }, []);

  return (
    <select
      name="carreras"
      id="carreras"
      className="w-full sm:w-40"
      value={degree}
      onChange={(e) => handleDegree(e.target.value)}
    >
      {degrees ? (
        <>
          <option hidden>Carrera</option>
          <option value="0">Todas</option>

          {degrees?.map((degree) => (
            <option key={degree.id} value={degree.id}>
              {degree.name}
            </option>
          ))}
        </>
      ) : (
        <option hidden>-</option>
      )}
    </select>
  );
}
