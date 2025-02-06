import { FaStar } from 'react-icons/fa';

export default async function ContributorsSkeleton() {
  return (
    <ul className="flex flex-col gap-1 w-full items-center opacity-65 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] transform-gpu">
      {['', '', ''].map((value, index) => (
        <li
          className={
            (index == 0
              ? 'text-2xl w-72'
              : index == 1
              ? 'text-xl w-56'
              : index == 2
              ? 'text-lg w-36'
              : 'text-base') + ` flex items-center bg-[--white] rounded-md`
          }
          key={index}
        >
          {index == 0 ? (
            <FaStar className="text-amber-400" />
          ) : index == 1 ? (
            <FaStar className="text-slate-300" />
          ) : index == 2 ? (
            <FaStar className="text-amber-600" />
          ) : null}
          <span className="select-none opacity-0">.</span>
        </li>
      ))}
    </ul>
  );
}
