import { CgArrowRightO } from 'react-icons/cg';

export default async function CorrelativeTableSkeleton(title: string) {
  return (
    <div className="flex gap-1 text-sm text-[--black-olive]">
      <div className="flex justify-between gap-1 self-start w-19">
        <p>{title}</p>
        <CgArrowRightO className="self-center text-[--midnight-green]" />
      </div>
      <div className="flex flex-wrap">
        <p className="opacity-75">Cargando...</p>
      </div>
    </div>
  );
}
