import { CgArrowRightO } from 'react-icons/cg';

export default async function CorrelativeTableSkeleton() {
  return (
    <div className="pl-2 my-1">
      <div className="flex min-h-6 gap-1 text-sm text-[--black-olive] sm:h-auto">
        <div className="flex items-center h-full justify-between gap-1 self-start w-19">
          <p>Necesitas</p>
          <CgArrowRightO className="self-center text-[--midnight-green]" />
        </div>
        <div className="flex items-center overflow-x-auto overflow-y-hidden sm:overflow-hidden sm:flex-wrap bg-[--platinum] rounded-md opacity-65 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] transform-gpu grow"></div>
      </div>
      <div className="flex h-6 gap-1 text-sm text-[--black-olive] sm:h-auto">
        <div className="flex items-center h-full justify-between gap-1 self-start w-19">
          <p>Habilita</p>
          <CgArrowRightO className="self-center text-[--midnight-green]" />
        </div>
        <div className="flex items-center overflow-x-auto overflow-y-hidden sm:overflow-hidden sm:flex-wrap bg-[--platinum] rounded-md opacity-65 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] transform-gpu grow"></div>
      </div>
    </div>
  );
}
