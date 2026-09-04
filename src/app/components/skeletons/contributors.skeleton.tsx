import { FaStar } from 'react-icons/fa';

export default async function ContributorsSkeleton() {
  return (
    <ul className="flex flex-col gap-1 w-full items-center opacity-65 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] transform-gpu">
      <li className={`text-2xl w-72 flex items-center bg-(--white) rounded-md`} key="skeleton-0">
        <FaStar className="text-amber-400" />
        <span className="select-none opacity-0">.</span>
      </li>
      <li className={`text-xl w-56 flex items-center bg-(--white) rounded-md`} key="skeleton-1">
        <FaStar className="text-slate-300" />
        <span className="select-none opacity-0">.</span>
      </li>
      <li className={`text-lg w-36 flex items-center bg-(--white) rounded-md`} key="skeleton-2">
        <FaStar className="text-amber-600" />
        <span className="select-none opacity-0">.</span>
      </li>
    </ul>
  );
}
