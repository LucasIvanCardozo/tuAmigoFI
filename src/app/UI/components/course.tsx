import { fetchCorrelatives, fetchEnabler } from '@/app/lib/data';
import { CgArrowRightO } from 'react-icons/cg';
import CorrelativeTable from './correlativeTable';
import Link from 'next/link';

export default async function Course({
  id_materia,
  id_carrera,
  name,
  cg,
  hs,
  plan,
  optional,
}: {
  id_materia: number;
  id_carrera?: number;
  name: string;
  cg: number | null;
  hs: number | null;
  plan: number;
  optional: boolean;
}) {
  return (
    <li className="relative flex flex-col w-full h-min bg-[--white] shadow-md p-2 transform-gpu transition-transform sm:hover:scale-105 sm:w-11/12">
      <div className="absolute top-0 right-0 flex flex-col text-center py-1 px-2">
        <span>{`Plan ${plan}`}</span>
        <span className="text-xs -m-2">{`${cg}CG / ${hs}Hs`}</span>
      </div>
      <div className="flex relative w-min bg-[--dark-cyan]">
        <h2 className="w-max text-nowrap text-[--white] ">{name}</h2>
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
      <Link
        href={`./materias/${id_materia}`}
        className="w-max self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white]"
      >
        Ir a la práctica
      </Link>
    </li>
  );
}
