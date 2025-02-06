import { fetchLinks } from '@/app/lib/data';
import CorrelativeTable from './correlativeTable';
import Link from 'next/link';
import CourseLinks from './courseLinks';
import { courses } from '@prisma/client';
import { Suspense } from 'react';
import CorrelativeTableSkeleton from '@/app/components/skeletons/correlativeTableSkeleton';
import ButtonAddLink from './buttonAddLink';
import DegreesList from './modals/degreesList';
import DegreesListSkeleton from '@/app/components/skeletons/degreesListSkeleton';
import CourseLinksSkeleton from '@/app/components/skeletons/courseLinksSkeleton';
import ButtonAddCorrelative from './buttonAddCorrelative';

export default async function Course({
  course,
  id_carrera,
}: {
  course: courses;
  id_carrera?: number;
}) {
  const { id, name, cg, hs, optional } = course;

  return (
    <li className="relative select-none flex flex-col w-full h-min bg-[--white] shadow-md p-2 transform-gpu transition-transform sm:w-11/12 sm:will-change-transform">
      <div className="relative flex gap-1 justify-between w-full">
        <h2 className="font-bold text-nowrap overflow-x-auto text-lg text-[--white] bg-[--dark-cyan] sm:font-normal sm:text-wrap sm:leading-6">
          {name}
        </h2>
        {optional ? (
          <span className="absolute left-full text-sm">{`(Opcional)`}</span>
        ) : (
          ''
        )}
        <div className="flex items-center text-center text-nowrap px-1">
          <span>{`${cg}CG / ${hs}Hs`}</span>
        </div>
      </div>

      <Suspense fallback={CorrelativeTableSkeleton()}>
        <CorrelativeTable id={id} id_carreras={id_carrera} />
      </Suspense>
      <Suspense fallback={<CourseLinksSkeleton />}>
        <CourseLinks id={id} />
      </Suspense>
      <div className="text-sm h-8 items-center w-full flex overflow-y-hidden overflow-x-auto gap-x-1 opacity-75 leading-4 sm:pt-2 sm:flex-wrap sm:overflow-visible sm:h-auto">
        <b className="text-nowrap">Está en:</b>
        <Suspense fallback={<DegreesListSkeleton />}>
          <DegreesList idCourse={id} />
        </Suspense>
      </div>
      <div className="flex justify-end gap-1 pt-1 text-[--white] items-center text-sm sm:text-base">
        <ButtonAddCorrelative course={course} />
        <ButtonAddLink course={course} />
        <Link
          href={`./materias/parciales/${id}`}
          className="font-bold w-max self-end py-1 px-2 rounded-sm bg-[--midnight-green] sm:font-normal"
        >
          Ver parciales
        </Link>
        <Link
          href={`./materias/practica/${id}`}
          className="font-bold w-max self-end py-1 px-2 rounded-sm bg-[--midnight-green] sm:font-normal"
        >
          Ir a la práctica
        </Link>
      </div>
    </li>
  );
}
