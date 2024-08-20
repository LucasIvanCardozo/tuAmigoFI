'use client';

import { useEffect, useState } from 'react';

export default function PlansDownload({
  degrees,
}: {
  degrees: ({
    degrees_plans: {
      plans: {
        id: number;
        year: number;
      };
    }[];
  } & {
    id: number;
    name: string;
  })[];
}) {
  const [degreeState, setDegreeState] = useState<number>();
  const [planState, setPlanState] = useState<number>();
  return (
    <div className="flex gap-1 w-full sm:gap-4">
      <select
        name="degree"
        id="degree"
        className="w-full grow shadow-sm sm:w-28"
        onChange={(e) => setDegreeState(Number(e.target.value))}
      >
        <option hidden>Elegir carrera</option>
        {degrees?.map((degree) => (
          <option key={degree.id} value={degree.id}>
            {degree.name}
          </option>
        ))}
      </select>
      {degreeState ? (
        <select
          name="plan"
          id="plan"
          className="w-24"
          onChange={(e) => setPlanState(Number(e.target.value))}
        >
          <option hidden>Plan</option>
          {degrees
            .find((degree) => degree.id == degreeState)
            ?.degrees_plans.map((plan, index) => (
              <option key={index} value={plan.plans.id}>
                {plan.plans.year}
              </option>
            ))}
        </select>
      ) : null}

      <a
        className="w-24 text-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white]"
        onClick={(e) => {
          if (!degreeState) {
            e.preventDefault(), window.alert('Debes elegir tu carrera.');
          } else {
            if (!planState) {
              e.preventDefault(),
                window.alert('Debes elegir un plan de estudio.');
            }
          }
        }}
        href={
          degreeState
            ? `/planes-de-estudio/${degreeState}-${planState}.pdf`
            : ''
        }
        target="_blank"
      >
        Ver PDF
      </a>
      <a
        className="w-24 text-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white]"
        onClick={(e) => {
          if (!degreeState) {
            e.preventDefault(), window.alert('Debes elegir tu carrera.');
          } else {
            if (!planState) {
              e.preventDefault(),
                window.alert('Debes elegir un plan de estudio.');
            }
          }
        }}
        href={degreeState ? `/planes-de-estudio/${degreeState}.pdf` : ''}
        target="_blank"
        download="Plan-estudio-Informática-2024"
      >
        Descargar
      </a>
    </div>
  );
}
