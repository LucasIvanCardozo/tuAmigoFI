'use client';
import { degrees } from '@prisma/client';
import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export default function QuestionsStructure({
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
  const [degreeState, setDegreeState] = useState<number>();
  const [planState, setPlanState] = useState<number>();

  return (
    <>
      <div className="flex flex-col gap-2 w-full sm:flex-row">
        <div className="flex gap-2 grow">
          <select
            name="degree"
            id="degree"
            aria-label="Elegir carrera"
            className="w-full grow shadow-sm p-1"
            onChange={(e) => setDegreeState(Number(e.target.value))}
          >
            <option hidden>Elegir carrera</option>
            {degrees?.map((degree) => (
              <option key={degree.id} value={degree.id}>
                {degree.name}
              </option>
            ))}
          </select>
          {degreeState && (
            <select
              name="plan"
              id="plan"
              className="w-24"
              aria-label="Elegir plan"
              onChange={(e) => setPlanState(Number(e.target.value))}
            >
              <option hidden>Plan</option>
              {degrees
                .find((degree) => degree.id == degreeState)
                ?.degrees_plans.map((plan, index) => (
                  <option key={index} value={plan.plans.year}>
                    {plan.plans.year}
                  </option>
                ))}
            </select>
          )}
        </div>
        <div className="flex gap-2">
          <a
            className="whitespace-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white] grow"
            onClick={(e) => {
              (!degreeState || !planState) &&
                (e.preventDefault(),
                window.alert('Debes elegir la carrera y el año del plan.'));
            }}
            href={
              degreeState
                ? `/planes-de-estudio/${degreeState}-${planState}.pdf`
                : ''
            }
            target="_blank"
          >
            Plan de estudio 👀
          </a>
          <a
            className="whitespace-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white] grow"
            onClick={(e) => {
              !degreeState &&
                (e.preventDefault(), window.alert('Debes elegir tu carrera.'));
            }}
            href={degreeState ? `/horarios-de-cursada/${degreeState}.pdf` : ''}
            target="_blank"
          >
            Horarios de cursada 👀
          </a>
        </div>
      </div>
    </>
  );
}
