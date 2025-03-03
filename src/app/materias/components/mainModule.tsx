'use client';
import { courses } from '@prisma/client';
import { ProblemsTable } from './problemsTable';
import { useSession } from 'next-auth/react';
import { MainContext } from '@/app/lib/contexts';
import { useState } from 'react';
import {
  DataForm,
  DataModule,
  TypeModal,
  TypeValues,
} from '@/app/assets/types';
import { MainModal } from '@/app/components/modals/mainModal';
import { AsideModules } from './aside/asideModules';
import { Form } from '@/app/components/form/form';

interface Params {
  modules: DataModule[];
  course: courses;
  typeModule: 'TP' | 'Practica';
}

export const MainModule = ({ modules, course, typeModule }: Params) => {
  const [modulesAux, setModulesAux] = useState(modules);
  const [viewModule, setViewModule] = useState<number | null>(null);
  const [dataForm, setDataForm] = useState<DataForm>({
    children: <></>,
    onSubmit: async () => {},
  });
  const [dataModal, setDataModal] = useState<TypeModal>({
    title: '',
    viewModal: false,
  });
  const { data: session } = useSession();

  const closeModal = () => {
    setDataModal({
      ...dataModal,
      viewModal: false,
    });
  };

  return (
    <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
      <MainContext.Provider
        value={{
          session,
          stateViewModule: {
            viewModule,
            setViewModule,
          },
          stateModal: {
            dataModal,
            setDataModal,
          },
          stateModules: {
            modules: modulesAux,
            setModules: setModulesAux,
          },
          stateForm: {
            dataForm,
            setDataForm,
          },
          course,
          typeModule,
        }}
      >
        {dataModal.viewModal && (
          <MainModal
            closeModal={() => {
              setDataModal({
                ...dataModal,
                viewModal: false,
              });
            }}
          >
            <h2 className="text-lg">{dataModal.title}</h2>
            <Form
              children={dataForm.children}
              onSubmit={(e: TypeValues[]) => dataForm.onSubmit(e)}
              onEnd={closeModal}
            />
          </MainModal>
        )}
        <AsideModules />
        <section className="text-[--black] flex flex-col grow relative h-full p-3 overflow-hidden sm:p-0 ">
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
