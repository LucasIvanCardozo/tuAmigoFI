'use client';
import { degrees } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function DegreeStructure({
  degrees,
}: {
  degrees: ({
    degrees_plans: {
      plans: {
        id: number;
        year: number;
      };
    }[];
  } & degrees)[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
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

  return (
    <select
      name="carreras"
      id="carreras"
      className="w-full sm:w-40"
      value={degree}
      aria-label="Elegir carrera de la materia"
      onChange={(e) => handleDegree(e.target.value)}
    >
      <option hidden>Carrera</option>
      <option value="0">Todas</option>

      {degrees?.map((degree) => (
        <option key={degree.id} value={degree.id}>
          {degree.name}
        </option>
      ))}
    </select>
  );
}
