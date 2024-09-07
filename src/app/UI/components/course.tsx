import { fetchLinks } from '@/app/lib/data';
import CorrelativeTable from './correlativeTable';
import Link from 'next/link';
import CourseLinks from './courseLinks';

export default async function Course({
  id_materia,
  id_carrera,
  name,
  cg,
  hs,
  optional,
}: {
  id_materia: number;
  id_carrera?: number;
  name: string;
  cg: number | null;
  hs: number | null;
  optional: boolean;
}) {
  const officialLinks = await fetchLinks({ official: true, id_materia });
  const unofficialLinks = await fetchLinks({ official: false, id_materia });
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
        <CorrelativeTable
          id={id_materia}
          id_carreras={id_carrera}
          type="correlative"
          title="Necesitas"
        />
        <CorrelativeTable
          id={id_materia}
          id_carreras={id_carrera}
          type="enabler"
          title="Habilita"
        />
      </div>
      {officialLinks.length >= 0 ? (
        <CourseLinks official={true} links={officialLinks} />
      ) : null}
      {unofficialLinks.length >= 0 ? (
        <CourseLinks official={false} links={unofficialLinks} />
      ) : null}
      <div className="flex justify-end gap-1 pt-1 text-[--white] text-sm sm:text-base">
        <Link
          href={`./materias/parciales/${id_materia}`}
          className="w-max self-end py-1 px-2 rounded-sm bg-[--midnight-green]"
        >
          Ver parciales
        </Link>
        <Link
          href={`./materias/practica/${id_materia}`}
          className="w-max self-end py-1 px-2 rounded-sm bg-[--midnight-green]"
        >
          Ir a la práctica
        </Link>
      </div>
    </li>
  );
}
