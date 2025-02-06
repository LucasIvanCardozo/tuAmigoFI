import { fetchContributors } from '@/app/lib/data';
import { FaStar } from 'react-icons/fa';

export default async function Contributors() {
  const contributors = await fetchContributors();

  return (
    <ul className="flex flex-col gap-1 w-full items-center">
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
      ))}
    </ul>
  );
}
