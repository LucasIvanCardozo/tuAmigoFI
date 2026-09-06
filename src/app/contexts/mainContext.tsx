'use client';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { DataModule } from '@/app/types';
import type { Course } from '../lib/server/db/prisma/prismaClient/client';

interface TypeMainContext {
  course: Course;
  setCourse: (course: Course) => void;
  typeModule: 'TP' | 'Practica';
  setTypeModule: (typeModule: 'TP' | 'Practica') => void;
  viewModule: string | null;
  setViewModule: (number: string | null) => void;
  modules: DataModule[];
  setModules: (dataModules: DataModule[]) => void;
}

export const MainContext = createContext<TypeMainContext | null>(null);

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [modules, setModules] = useState<DataModule[]>([]);
  const [viewModule, setViewModule] = useState<string | null>(null);
  const [course, setCourse] = useState<Course>({} as Course);
  const [typeModule, setTypeModule] = useState<'TP' | 'Practica'>('TP');

  const handleSetViewModule = useCallback((id: string | null) => setViewModule(id), []);
  const handleSetModules = useCallback((dataModules: DataModule[]) => setModules(dataModules), []);
  const handleSetCourse = useCallback((course: Course) => setCourse(course), []);
  const handleSetTypeModule = useCallback(
    (typeModule: 'TP' | 'Practica') => setTypeModule(typeModule),
    [],
  );

  const value = useMemo(
    () => ({
      viewModule,
      setViewModule: handleSetViewModule,
      modules,
      setModules: handleSetModules,
      course,
      setCourse: handleSetCourse,
      typeModule,
      setTypeModule: handleSetTypeModule,
    }),
    [
      viewModule,
      handleSetViewModule,
      modules,
      handleSetModules,
      course,
      handleSetCourse,
      typeModule,
      handleSetTypeModule,
    ],
  );

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) throw new Error('useMainContext must be used within a MainProvider');
  return context;
};
