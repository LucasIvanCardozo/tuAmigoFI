import { Suspense } from 'react';
import ButtonInfoScore from './buttonInfoScore';
import ContributorsList from './contrubutorsList';
import { fetchContributors } from '@/app/lib/data';

export const revalidate = 10;

export default async function Contributors() {
  const contributors = await fetchContributors();

  return (
    <section className="text-[--black] relative max-w-screen-md m-auto w-11/12">
      <h2 className="font-bold text-3xl my-2 flex gap-1 items-center justify-center">
        Colaboradores
        <ButtonInfoScore />
      </h2>
      <p className="text-balance pb-2 text-center">
        Gracias a quienes suman su esfuerzo compartiendo recursos y soluciones,
        ayudando a construir una comunidad más fuerte para todos los
        estudiantes. ¡Tu aporte marca la diferencia! 💖
      </p>
      {contributors.map(({ name, score }, index) => (
        <li
          className={
            (index == 0
              ? 'text-2xl'
              : index == 1
              ? 'text-xl'
              : index == 2
              ? 'text-lg'
              : 'text-base') + ` flex gap-1`
          }
          key={index}
        >
          <div className="flex gap-1 items-center bg-[--white] rounded-md px-1">
            {name}
          </div>
          {`con ${score}Pts.`}
        </li>
      ))}
      <Suspense fallback={<ContributorsList></ContributorsList>}>
        <ContributorsList />
      </Suspense>
    </section>
  );
}
