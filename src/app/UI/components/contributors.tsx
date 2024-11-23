import { Suspense } from 'react';
import ButtonInfoScore from './buttonInfoScore';
import ContributorsList from './contrubutorsList';
import ContributorsListSkeleton from './skeletons/contributorsListSkeleton.tsx';

export default async function Contributors() {
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
      <ContributorsList />
    </section>
  );
}
