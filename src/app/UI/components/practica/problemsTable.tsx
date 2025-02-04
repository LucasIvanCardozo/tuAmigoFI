import { useMainContext } from '@/app/lib/context';
import { ModuleProblems } from './moduleProblems';

export const ProblemsTable = () => {
  const { modules } = useMainContext();
  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
        {modules.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay datos :,c</p>
          </li>
        ) : (
          modules.map((module, index) => (
            <ModuleProblems key={index} module={module} />
          ))
        )}
      </ul>
    </>
  );
};
