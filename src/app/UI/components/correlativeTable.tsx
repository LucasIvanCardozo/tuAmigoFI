import { fetchCorrelatives, fetchEnabler } from '@/app/lib/data';
import { CgArrowRightO } from 'react-icons/cg';
import CorrelativeList from './correlativeList';

export default async function CorrelativeTable({
  id_materias,
  id_carreras,
  type,
  title,
}: {
  id_materias: number;
  id_carreras: string;
  type: 'correlative' | 'enabler';
  title: string;
}) {
  let data: {
    id_materias: number;
    name: string;
    name_normalized: string;
  }[] = [];
  if (type == 'correlative') {
    data = await fetchCorrelatives({ id_materias, id_carreras });
  } else if ('enabler') {
    data = await fetchEnabler({ id_materias, id_carreras });
  }
  return (
    <div className="flex gap-1 text-sm text-[--black-olive] pl-2 my-1">
      <div className="flex justify-between gap-1 self-start w-19">
        <p>{title}</p>
        <CgArrowRightO className="self-center text-[--midnight-green]" />
      </div>
      <div className="flex flex-wrap">
        {data.length != 0 ? (
          data.map(({ id_materias, name, name_normalized }, index) => (
            <CorrelativeList
              key={id_materias}
              index={index}
              name={name}
              name_normalized={name_normalized}
            />
          ))
        ) : (
          <p className="opacity-75">No se encuentran datos</p>
        )}
      </div>
    </div>
  );
}
