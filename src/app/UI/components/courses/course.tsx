import { fetchDegreesWithCourse, fetchLinks } from '@/app/lib/data';
import CorrelativeTable from './correlativeTable';
import Link from 'next/link';
import CourseLinks from './courseLinks';
import { courses } from '@prisma/client';
import { Suspense } from 'react';
import CorrelativeTableSkeleton from '../skeletons/correlativeTableSkeleton';
import ButtonAddLink from './buttonAddLink';
import ButtonAddCorrelative from './buttonAddCorrelative';

export default async function Course({
  course,
  id_carrera,
}: {
  course: courses;
  id_carrera?: number;
}) {
  const { id, name, cg, hs, optional } = course;
  const officialLinks = await fetchLinks({ official: true, id_materia: id });
  const unofficialLinks = await fetchLinks({ official: false, id_materia: id });
  const degrees = await fetchDegreesWithCourse({ id_course: id });

  return (
    <li className="relative flex flex-col w-full h-min bg-[--white] shadow-md p-2 transform-gpu transition-transform sm:hover:scale-105 sm:w-11/12">
      <div className="absolute top-0 right-0 flex flex-col text-center py-1 px-2">
        <span>{`${cg}CG / ${hs}Hs`}</span>
      </div>
      <div className="flex relative w-3/4">
        <h2 className="w-fit leading-6 text-lg text-balance text-[--white] bg-[--dark-cyan]">
          {name}
        </h2>
        {optional ? (
          <span className="absolute left-full text-sm">{`(Opcional)`}</span>
        ) : (
          ''
        )}
      </div>
      <div className="pl-2 my-1">
        <Suspense fallback={CorrelativeTableSkeleton('Necesitas')}>
          <CorrelativeTable
            id={id}
            id_carreras={id_carrera}
            type="correlative"
            title="Necesitas"
          />
        </Suspense>
        <Suspense fallback={CorrelativeTableSkeleton('Habilita')}>
          <CorrelativeTable
            id={id}
            id_carreras={id_carrera}
            type="enabler"
            title="Habilita"
          />
        </Suspense>
      </div>
      {officialLinks.length >= 0 && (
        <CourseLinks official={true} links={officialLinks} />
      )}
      {unofficialLinks.length >= 0 && (
        <CourseLinks official={false} links={unofficialLinks} />
      )}
      <div className="text-sm h-8 items-center w-full flex overflow-y-hidden overflow-x-scroll gap-x-1 opacity-75 leading-4 sm:pt-2 sm:flex-wrap sm:overflow-visible sm:h-auto">
        <b className="text-nowrap">Está en:</b>
        {degrees.map(({ name, id }, index) => (
          <span key={index} className="text-nowrap">
            {`${name}`}
            {index !== degrees.length - 1 && ' -'}
          </span>
        ))}
      </div>
      <div className="flex justify-end gap-1 pt-1 text-[--white] items-center text-sm sm:text-base">
        <ButtonAddCorrelative course={course} />
        <ButtonAddLink course={course} />
        <Link
          href={`./materias/parciales/${id}`}
          className="w-max self-end py-1 px-2 rounded-sm bg-[--midnight-green]"
        >
          Ver parciales
        </Link>
        <Link
          href={`./materias/practica/${id}`}
          className="w-max self-end py-1 px-2 rounded-sm bg-[--midnight-green]"
        >
          Ir a la práctica
        </Link>
      </div>
    </li>
  );
}
