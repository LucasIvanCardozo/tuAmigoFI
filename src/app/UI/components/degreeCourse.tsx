'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function DegreeCourse({
  degrees,
}: {
  degrees: {
    id: number;
    name: string;
  }[];
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
      className="w-full sm:w-28"
      value={degree}
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
