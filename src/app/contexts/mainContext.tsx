import { DataForm, DataModule, TypeModal } from '@/app/types'
import { createContext, useContext } from 'react'
import { Course } from '../lib/server/db/prisma/prismaClient/client'

interface TypeMainContext {
  course: Course
  typeModule: 'TP' | 'Practica'
  stateViewModule: {
    viewModule: string | null
    setViewModule: (number: string | null) => void
  }
  stateModules: {
    modules: DataModule[]
    setModules: (dataModules: DataModule[]) => void
  }
  stateForm: {
    dataForm: DataForm
    setDataForm: (data: DataForm) => void
  }
}

export const MainContext = createContext<TypeMainContext>({
  course: {
    id: '0',
    name: 'Default',
    nameNormalized: 'default',
    cg: 0,
    hs: 0,
    optional: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  typeModule: 'TP',
  stateViewModule: {
    viewModule: null,
    setViewModule: () => {},
  },
  stateModules: {
    modules: [],
    setModules: () => {},
  },
  stateForm: {
    dataForm: { children: <></>, onSubmit: async () => {} },
    setDataForm: () => {},
  },
})

export const useMainContext = () => useContext(MainContext)
