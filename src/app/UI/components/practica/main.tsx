'use client';
import { courses } from '@prisma/client';
import { ProblemsTable } from './problemsTable';
import { useSession } from 'next-auth/react';
import { MainContext } from '@/app/lib/context';
import { useState } from 'react';
import { DataModule, TypeModal } from '@/app/types';
import { MainModal } from './modal';
import { AsideModules } from './asideModules';

interface Params {
  modules: DataModule[];
  course: courses;
  typeModule: 'TP' | 'Practica';
}

export const MainPractica = ({ modules, course, typeModule }: Params) => {
  const [modulesAux, setModulesAux] = useState(modules);
  const [viewModule, setViewModule] = useState<number | null>(null);
  const [dataModal, setDataModal] = useState<TypeModal>({
    dataForm: {
      children: <></>,
      title: '',
      onSubmit: async () => {},
    },
    viewModal: false,
  });
  const { data: session } = useSession();

  return (
    <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
      <MainContext.Provider
        value={{
          session,
          viewModule,
          setViewModule,
          dataModal,
          setDataModal,
          modules: modulesAux,
          setModules: setModulesAux,
          course,
          typeModule,
        }}
      >
        <MainModal />
        <AsideModules />
        <section className="text-[--black] flex flex-col grow relative h-full p-3 sm:p-0">
          <div>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl sm:text-3xl font-bold">
                <b>{course.name}</b>
              </h1>
            </div>
          </div>
          <ProblemsTable />
        </section>
      </MainContext.Provider>
    </main>
  );
};
