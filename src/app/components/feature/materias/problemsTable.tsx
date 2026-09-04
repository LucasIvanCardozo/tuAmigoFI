import type { DataModule } from '@/app/types';
import { ModuleContainer } from './moduleContainer';

export const ProblemsTable = ({
  modules,
  idModule,
  typeModule,
}: {
  modules: DataModule[];
  idModule?: string;
  typeModule: 'TP' | 'Practica';
}) => {
  return (
    <>
      <ul className="flex flex-col gap-1 grow relative overflow-y-auto overflow-x-hidden">
        {modules.length == 0 ? (
          <li className="w-full h-full flex justify-center items-center text-3xl">
            <p>No hay datos :,c</p>
          </li>
        ) : (
          modules.map((module) => (
            <ModuleContainer
              key={module.module.id}
              module={module}
              idModule={idModule}
              typeModule={typeModule}
            />
          ))
        )}
      </ul>
    </>
  );
};
