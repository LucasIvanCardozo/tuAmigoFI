'use client';

import { fetchDegrees } from '@/app/lib/data';
import { degrees } from '@prisma/client';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export default function QuestionsSection() {
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
  const [degreeState, setDegreeState] = useState<number>();
  const [planState, setPlanState] = useState<number>();

  useEffect(() => {
    const dataFetch = async () => {
      const degreesData = await fetchDegrees();
      setDegrees(degreesData);
    };
    dataFetch();
  }, []);

  return (
    <section className="text-[--black] relative max-w-screen-md m-auto w-11/12">
      <h2 className="w-full text-center font-bold -z-10 text-3xl mb-2 sm:text-4xl">
        Consultas
      </h2>
      <div className="flex flex-col gap-2 w-full sm:flex-row">
        <div className="flex gap-2 grow">
          <select
            name="degree"
            id="degree"
            className="w-full grow shadow-sm p-1"
            onChange={(e) => setDegreeState(Number(e.target.value))}
          >
            {degrees ? (
              <>
                <option hidden>Elegir carrera</option>
                {degrees?.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name}
                  </option>
                ))}
              </>
            ) : (
              <option hidden>Cargando...</option>
            )}
          </select>
          {degreeState ? (
            <select
              name="plan"
              id="plan"
              className="w-24"
              onChange={(e) => setPlanState(Number(e.target.value))}
            >
              {degrees ? (
                <>
                  <option hidden>Plan</option>
                  {degrees
                    .find((degree) => degree.id == degreeState)
                    ?.degrees_plans.map((plan, index) => (
                      <option key={index} value={plan.plans.year}>
                        {plan.plans.year}
                      </option>
                    ))}
                </>
              ) : (
                <option hidden>Cargando...</option>
              )}
            </select>
          ) : null}
        </div>
        <div className="flex gap-2">
          <a
            className="text-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white] grow"
            onClick={(e) => {
              if (!degreeState)
                e.preventDefault(), window.alert('Debes elegir tu carrera.');
              else if (!planState)
                e.preventDefault(),
                  window.alert('Debes elegir el año de tu plan.');
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
            className="text-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white] grow"
            onClick={(e) => {
              if (!degreeState)
                e.preventDefault(), window.alert('Debes elegir tu carrera.');
            }}
            href={degreeState ? `/horarios-de-cursada/${degreeState}.pdf` : ''}
            target="_blank"
          >
            Horarios de cursada 👀
          </a>
        </div>
      </div>
      <ul className="w-full overflow-hidden my-2 flex flex-col gap-1">
        {[
          {
            question: '¿En que aula curso hoy?',
            link: 'https://www3.fi.mdp.edu.ar/salas2022/day.php?area=2&room=1',
            value: 'fi.mdp.edu.ar',
          },
          {
            question: '¿Dónde me inscribo a las matrerias?',
            link: 'https://portalsiu.mdp.edu.ar/autogestion/cursada',
            value: 'portalsiu.mdp.edu.ar',
          },
          {
            question: '¿Novedades?',
            link: 'https://www.instagram.com/cei_unmdp/',
            value: 'instagram.com/cei',
          },
        ].map(({ question, link, value }, index) => (
          <li
            key={index}
            className="flex flex-nowrap gap-1 items-center text-nowrap "
          >
            <span className="w-max">
              <b>{question}</b>
            </span>
            <FaArrowRight />
            <a className="underline" target="_blank" href={link}>
              {value}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
