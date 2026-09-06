'use client';
import { memo } from 'react';
import type { DataModule } from '@/app/types';
import { ModuleContainer } from './moduleContainer';

const ProblemsTableImpl = ({
  modules,
  typeModule,
}: {
  modules: DataModule[];
  typeModule: 'TP' | 'Practica';
}) => {
  return (
    <ul className="flex flex-col gap-1 grow relative overflow-y-auto overflow-x-hidden">
      {modules.length === 0 ? (
        <li className="w-full h-full flex justify-center items-center text-3xl">
          <p>No hay datos :,c</p>
        </li>
      ) : (
        modules.map((module) => (
          <ModuleContainer key={module.module.id} module={module} typeModule={typeModule} />
        ))
      )}
    </ul>
  );
};

export const ProblemsTable = memo(ProblemsTableImpl);
