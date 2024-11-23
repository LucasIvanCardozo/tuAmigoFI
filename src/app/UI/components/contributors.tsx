import ButtonInfoScore from './buttonInfoScore';
import { fetchContributors } from '@/app/lib/data';
import ContributorsListSkeleton from './skeletons/contributorsListSkeleton.tsx';
import { FaStar } from 'react-icons/fa';

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
      {
        <ul className="flex flex-col gap-1 w-full items-center">
          {contributors ? (
            contributors.map(({ name, score }, index) => (
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
                <div className="flex gap-1 max-w-56 items-center bg-[--white] rounded-md px-1 text-nowrap overflow-hidden text-ellipsis">
                  {index == 0 ? (
                    <FaStar className="text-amber-400" />
                  ) : index == 1 ? (
                    <FaStar className="text-slate-300" />
                  ) : index == 2 ? (
                    <FaStar className="text-amber-600" />
                  ) : null}
                  <span className="truncate">{name}</span>
                </div>
                <span className="text-nowrap">{`con ${score}Pts.`}</span>
              </li>
            ))
          ) : (
            <ContributorsListSkeleton />
          )}
        </ul>
      }
    </section>
  );
}
