'use client';
import { years } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function YearCourse({ years }: { years: years[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [year, setYear] = useState<string>(
    searchParams.get('year')?.toString() ?? ''
  );

  const handleYears = (year: string) => {
    const params = new URLSearchParams(searchParams);
    if (year && year != '0') {
      params.set('year', year);
    } else {
      params.delete('year');
    }
    setYear(year);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <select
      name="years"
      id="years"
      className="w-full sm:w-28"
      value={year}
      onChange={(e) => handleYears(e.target.value)}
    >
      <option hidden>Año</option>
      <option value="0">Todos</option>
      {years?.map((year) => (
        <option key={year.id} value={year.id}>
          {year.name}
        </option>
      ))}
    </select>
  );
}
