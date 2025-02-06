import { useMainContext } from '@/app/lib/contexts';
import { ModuleContainer } from './module/moduleContainer';

export const ProblemsTable = () => {
  const { stateModules } = useMainContext();
  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto">
        {stateModules.modules.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay datos :,c</p>
          </li>
        ) : (
          stateModules.modules.map((module) => (
            <ModuleContainer key={module.module.id} module={module} />
          ))
        )}
      </ul>
    </>
  );
};
