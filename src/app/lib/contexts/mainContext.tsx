import { DataForm, DataModule, TypeModal } from '@/app/types';
import { courses } from '@prisma/client';
import { Session } from 'next-auth';
import { createContext, useContext } from 'react';

interface TypeMainContext {
  session: Session | null;
  course: courses;
  typeModule: 'TP' | 'Practica';
  stateViewModule: {
    viewModule: number | null;
    setViewModule: (number: number | null) => void;
  };
  stateModal: {
    dataModal: TypeModal;
    setDataModal: (dataModal: TypeModal) => void;
  };
  stateModules: {
    modules: DataModule[];
    setModules: (dataModules: DataModule[]) => void;
  };
  stateForm: {
    dataForm: DataForm;
    setDataForm: (data: DataForm) => void;
  };
}

export const MainContext = createContext<TypeMainContext>({
  session: null,
  course: {
    id: 0,
    name: 'Default',
    name_normalized: 'default',
    cg: 0,
    hs: 0,
    optional: false,
  },
  typeModule: 'TP',
  stateViewModule: {
    viewModule: null,
    setViewModule: () => {},
  },
  stateModal: {
    dataModal: {
      title: '',
      viewModal: false,
    },
    setDataModal: () => {},
  },
  stateModules: {
    modules: [],
    setModules: () => {},
  },
  stateForm: {
    dataForm: { children: <></>, onSubmit: async () => {} },
    setDataForm: () => {},
  },
});

export const useMainContext = () => useContext(MainContext);
