import { Session } from 'next-auth';
import { createContext, useContext } from 'react';
import { DataModule, TypeModal, TypeModule, TypeValues } from '../types';
import { courses } from '@prisma/client';

interface TypeMainContext {
  session: Session | null;
  viewModule: number | null;
  setViewModule: (number: number | null) => void;
  dataModal: TypeModal;
  setDataModal: (dataModal: TypeModal) => void;
  modules: DataModule[];
  setModules: (dataModules: DataModule[]) => void;
  course: courses;
  typeModule: 'TP' | 'Practica';
}

export const MainContext = createContext<TypeMainContext>({
  session: null,
  viewModule: null,
  setViewModule: () => {},
  dataModal: {
    dataForm: { title: '', children: <></>, onSubmit: async () => {} },
    viewModal: false,
  },
  setDataModal: () => {},
  modules: [],
  setModules: () => {},
  course: {
    id: 0,
    name: 'Default',
    name_normalized: 'default',
    cg: 0,
    hs: 0,
    optional: false,
  },
  typeModule: 'TP',
});

interface TypeFromContext {
  values: TypeValues[];
  setValues: React.Dispatch<React.SetStateAction<TypeValues[]>>;
}

export const FormContext = createContext<TypeFromContext>({
  values: [],
  setValues: () => {},
});

export const useFormContext = () => useContext(FormContext);
export const useMainContext = () => useContext(MainContext);
