import { DataForm, DataModule, TypeModal } from '@/app/types'
import { Session } from 'next-auth'
import { createContext, useContext } from 'react'
import { Course } from '../lib/server/db/prisma/prismaClient/client'

interface TypeMainContext {
  session: Session | null
  course: Course
  typeModule: 'TP' | 'Practica'
  stateViewModule: {
    viewModule: number | null
    setViewModule: (number: number | null) => void
  }
  stateModal: {
    dataModal: TypeModal
    setDataModal: (dataModal: TypeModal) => void
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
  session: null,
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
})

export const useMainContext = () => useContext(MainContext)
