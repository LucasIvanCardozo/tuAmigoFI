import { fetchCorrelatives, fetchEnabler } from '@/app/lib/data';
import { CgArrowRightO } from 'react-icons/cg';
import CorrelativeList from './correlativeList';

export default async function CorrelativeTable({
  id,
  id_carreras,
  type,
  title,
}: {
  id: number;
  id_carreras?: number;
  type: 'correlative' | 'enabler';
  title: string;
}) {
  let data: {
    id: number;
    name: string;
  }[] = [];

  if (type == 'correlative') {
    data = await fetchCorrelatives({ id, id_carreras });
  } else if (type == 'enabler') {
    data = await fetchEnabler({ id, id_carreras });
  }

  return (
    <div className="flex gap-1 text-sm text-[--black-olive]">
      <div className="flex justify-between gap-1 self-start w-19">
        <p>{title}</p>
        <CgArrowRightO className="self-center text-[--midnight-green]" />
      </div>
      <div className="flex flex-wrap">
        {data.length != 0 ? (
          data.map(({ id, name }, index) => (
            <CorrelativeList
              key={id}
              index={index}
              name={name}
            />
          ))
        ) : (
          <p className="opacity-75">No se encuentran datos</p>
        )}
      </div>
    </div>
  );
}
