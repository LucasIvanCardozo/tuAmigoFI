'use client';

import { useState } from 'react';

export default function PlansDownload({
  courses,
}: {
  courses: {
    id: number;
    name: string;
  }[];
}) {
  const [planState, setPlanState] = useState<number>();
  return (
    <div className="flex gap-1 w-full sm:gap-4">
      <select
        name="plan"
        id="plan"
        className="w-full grow shadow-sm sm:w-28"
        onChange={(e) => setPlanState(Number(e.target.value))}
      >
        <option hidden>Elegir carrera</option>
        {courses?.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>
      <a
        className="w-24 text-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white]"
        onClick={(e) => {
          if (!planState) {
            e.preventDefault(),
              window.alert('Debes elegir un plan de estudio.');
          }
        }}
        href={planState ? `/planes-de-estudio/${planState}.pdf` : ''}
        target="_blank"
      >
        Ver PDF
      </a>
      <a
        className="w-24 text-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white]"
        onClick={(e) => {
          if (!planState) {
            e.preventDefault(),
              window.alert('Debes elegir un plan de estudio.');
          }
        }}
        href={planState ? `/planes-de-estudio/${planState}.pdf` : ''}
        target="_blank"
        download="Plan-estudio-Informática-2024"
      >
        Descargar
      </a>
    </div>
  );
}
